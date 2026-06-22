'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { createWork, updateWork, deleteWork, getCloudinarySignature } from '@/app/actions/workActions'
import { logoutAction } from '@/app/actions/authActions'
import { deleteEnquiry } from '@/app/actions/enquiryActions'

export default function AdminClient({ initialWorks, initialEnquiries = [] }) {
  const [works, setWorks] = useState(initialWorks)
  const [enquiries, setEnquiries] = useState(initialEnquiries)
  const [activeTab, setActiveTab] = useState('works')
  const [editingWork, setEditingWork] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [isWidgetLoading, setIsWidgetLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ active: false, percent: 0, loadedMB: 0, totalMB: 0 })
  const [uploadedMedia, setUploadedMedia] = useState(null)
  const [videoTrim, setVideoTrim] = useState({ start: 0, end: 0 })

  const [formState, setFormState] = useState({
    title: '', description: '', tags: '', tools: '', projectUrl: '', liveUrl: ''
  })
  const [mediaPos, setMediaPos] = useState({ x: 50, y: 50, scale: 100 })

  useEffect(() => {
    if (editingWork) {
      setFormState({
        title: editingWork.title || '',
        description: editingWork.description || '',
        tags: editingWork.tags || '',
        tools: editingWork.tools || '',
        projectUrl: editingWork.projectUrl || '',
        liveUrl: editingWork.liveUrl || ''
      });
      if (editingWork.imageUrl && editingWork.imageUrl.includes('#pos=')) {
        const [x, y, scale] = editingWork.imageUrl.split('#pos=')[1].split(',');
        setMediaPos({ x: parseInt(x) || 50, y: parseInt(y) || 50, scale: parseInt(scale) || 100 });
      } else {
        setMediaPos({ x: 50, y: 50, scale: 100 });
      }
    } else {
      setFormState({ title: '', description: '', tags: '', tools: '', projectUrl: '', liveUrl: '' });
      setMediaPos({ x: 50, y: 50, scale: 100 });
      setUploadedMedia(null);
    }
  }, [editingWork])

  const handleOpenWidget = async () => {
    try {
      setIsWidgetLoading(true);
      if (typeof window === 'undefined' || !window.cloudinary) {
        alert("Cloudinary script is still loading. Please wait a few seconds and try again.");
        setIsWidgetLoading(false);
        return;
      }
      const sigData = await getCloudinarySignature();
      if (!sigData || !sigData.cloudName || !sigData.apiKey || !sigData.signature) {
        alert("Cloudinary configuration is missing. Ensure CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and CLOUDINARY_CLOUD_NAME are set in your Vercel deployment.");
        setIsWidgetLoading(false);
        return;
      }
      const widget = window.cloudinary.createUploadWidget({
        cloudName: sigData.cloudName,
        apiKey: sigData.apiKey,
        uploadSignatureTimestamp: sigData.timestamp,
        uploadSignature: sigData.signature,
        folder: 'portfolio',
        clientAllowedFormats: ['image', 'video'],
        maxFileSize: 100000000,
        sources: ['local', 'url']
      }, (error, result) => {
        if (!error && result && result.event === "success") {
          const isVideo = result.info.resource_type === 'video';
          setUploadedMedia({
            url: result.info.secure_url,
            type: isVideo ? 'video' : 'image',
            duration: result.info.duration || 0
          });
          if (isVideo) {
            setVideoTrim({ start: 0, end: result.info.duration || 0 });
          }
        }
      });
      widget.open();
      setIsWidgetLoading(false);
    } catch (err) {
      alert('Failed to initialize upload widget.');
      console.error(err);
      setIsWidgetLoading(false);
    }
  }

  const handleAddTag = (tag) => {
    const current = formState.tags;
    const tags = current.split(',').map(t => t.trim()).filter(Boolean);
    if (!tags.includes(tag)) {
      setFormState({ ...formState, tags: tags.length ? `${current}, ${tag}` : tag });
    }
  }

  const handleAddTool = (tool) => {
    const current = formState.tools;
    const tools = current.split(',').map(t => t.trim()).filter(Boolean);
    if (!tools.includes(tool)) {
      setFormState({ ...formState, tools: tools.length ? `${current}, ${tool}` : tool });
    }
  }

  const PRESET_TAGS = [
    { label: 'UI/UX', color: '#ff99cc', text: '#000' },
    { label: 'Web Design', color: '#99ccff', text: '#000' },
    { label: 'Branding', color: '#ffcc99', text: '#000' },
    { label: 'Development', color: '#ccff99', text: '#000' },
  ]

  const PRESET_TOOLS = [
    { label: 'React', color: '#61dafb', text: '#000' },
    { label: 'Next.js', color: '#000000', text: '#fff' },
    { label: 'Tailwind', color: '#38bdf8', text: '#000' },
    { label: 'Figma', color: '#f24e1e', text: '#fff' },
    { label: 'After Effects', color: '#9999ff', text: '#000' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)
    const form = e.target
    const formData = new FormData(form)
    
    try {
      let secureUrl = editingWork?.imageUrl?.split('#pos=')[0] || ''
      let mediaType = editingWork?.mediaType || 'image'

      if (uploadedMedia) {
        secureUrl = uploadedMedia.url;
        mediaType = uploadedMedia.type;

        if (mediaType === 'video') {
          const transforms = [];
          if (videoTrim.start > 0) transforms.push(`so_${videoTrim.start}`);
          if (videoTrim.end > 0 && videoTrim.end < uploadedMedia.duration) transforms.push(`eo_${videoTrim.end}`);
          
          // Always apply high quality and native frame rate to videos
          transforms.push('q_auto:best', 'fps_keep');
          
          if (secureUrl.includes('/upload/')) {
            secureUrl = secureUrl.replace('/upload/', `/upload/${transforms.join(',')}/`);
          }
        }
      }

      if (!secureUrl && !editingWork) {
         alert('Please upload media before saving.')
         setIsPending(false)
         return
      }

      // Append Position Hash
      const finalUrl = `${secureUrl}#pos=${mediaPos.x},${mediaPos.y},${mediaPos.scale}`

      // Overwrite the file with the string URL so Server Action doesn't crash
      formData.set('imageUrl', finalUrl)
      formData.set('mediaType', mediaType)
      
      // Update form values with current state to ensure accuracy
      formData.set('title', formState.title)
      formData.set('description', formState.description)
      formData.set('tags', formState.tags)
      formData.set('tools', formState.tools)
      formData.set('projectUrl', formState.projectUrl)
      formData.set('liveUrl', formState.liveUrl)

      let result;
      if (editingWork) {
        result = await updateWork(editingWork.id, formData)
      } else {
        result = await createWork(formData)
      }

      if (result?.error) {
        throw new Error(result.error)
      }
      
      window.location.reload() 
    } catch (error) {
      console.error(error)
      alert(error.message || 'Failed to upload file or save work.')
      setIsPending(false)
      setUploadProgress({ active: false, percent: 0, loadedMB: 0, totalMB: 0 })
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this work?')) {
      await deleteWork(id)
      window.location.reload()
    }
  }

  const handleDeleteEnquiry = async (id) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      await deleteEnquiry(id)
      window.location.reload()
    }
  }

  const handleLogout = async () => {
    await logoutAction()
  }

  const previewUrl = uploadedMedia?.url || editingWork?.imageUrl?.split('#pos=')[0] || '';
  const previewMediaType = uploadedMedia?.type || editingWork?.mediaType || 'image';
  
  let finalPreviewUrl = previewUrl;
  if (uploadedMedia && uploadedMedia.type === 'video' && videoTrim) {
    if (videoTrim.start > 0 || (videoTrim.end > 0 && videoTrim.end < uploadedMedia.duration)) {
      finalPreviewUrl = `${previewUrl}#t=${videoTrim.start},${videoTrim.end || uploadedMedia.duration}`;
    }
  }

  const showPreview = activeTab === 'works' && (editingWork || uploadedMedia || formState.title.length > 0);

  return (
    <div className="min-h-screen bg-surface-container-low p-4 md:p-8">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      <header className="flex justify-between items-center mb-8 border-b-4 border-on-background pb-4">
        <h1 className="font-headline-lg text-headline-lg uppercase">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('works')}
            className={`px-4 py-2 font-label-mono text-label-mono uppercase border-4 border-on-background transition-all ${activeTab === 'works' ? 'bg-primary text-on-primary shadow-[4px_4px_0_0_#000] -translate-y-1' : 'bg-surface-variant text-on-background hover:bg-primary hover:text-on-primary'}`}
          >
            Works
          </button>
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 font-label-mono text-label-mono uppercase border-4 border-on-background transition-all ${activeTab === 'enquiries' ? 'bg-primary text-on-primary shadow-[4px_4px_0_0_#000] -translate-y-1' : 'bg-surface-variant text-on-background hover:bg-primary hover:text-on-primary'}`}
          >
            Enquiries
          </button>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-error text-on-error border-4 border-on-background px-4 py-2 font-label-mono text-label-mono uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-background border-4 border-on-background neo-shadow p-6 sticky top-8">
            <h2 className="font-headline-md uppercase mb-6 flex justify-between items-center">
              {editingWork ? 'Edit Work' : 'Add New Work'}
              {(editingWork || uploadedMedia || formState.title || formState.description || formState.tags || formState.tools || formState.projectUrl || formState.liveUrl) && (
                <button 
                  type="button" 
                  onClick={() => { setEditingWork(null); setUploadedMedia(null); setFormState({ title: '', description: '', tags: '', tools: '', projectUrl: '', liveUrl: '' }); setMediaPos({ x: 50, y: 50, scale: 100 }); }}
                  className="text-sm font-label-mono text-label-mono bg-surface-variant px-2 py-1 border-2 border-on-background hover:bg-on-background hover:text-background"
                >
                  {editingWork ? 'Cancel Edit' : 'Clear Form'}
                </button>
              )}
            </h2>
            
            <form key={editingWork ? editingWork.id : 'new'} onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-label-mono text-label-mono uppercase mb-1">Title</label>
                  <input 
                    type="text" name="title" value={formState.title} onChange={(e) => setFormState({...formState, title: e.target.value})} required
                    className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-md text-body-md focus:outline-none focus:border-cobalt"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-mono text-label-mono uppercase mb-1">Description</label>
                  <textarea 
                    name="description" value={formState.description} onChange={(e) => setFormState({...formState, description: e.target.value})} required rows={2}
                    className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-md text-body-md focus:outline-none focus:border-cobalt"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-mono text-label-mono uppercase mb-1">Media (Image/Video, Max 100MB)</label>
                  
                  {editingWork && editingWork.imageUrl && !uploadedMedia && (
                    <div className="mb-2 flex gap-4 items-center p-2 border-2 border-on-background bg-surface-variant">
                      <div className="w-24 h-24 border-2 border-on-background overflow-hidden relative bg-background shrink-0">
                        {editingWork.mediaType === 'video' ? (
                           <video src={editingWork.imageUrl.split('#pos=')[0]} className="w-full h-full object-cover" controls />
                        ) : (
                           <img src={editingWork.imageUrl.split('#pos=')[0]} alt="Current" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant font-label-mono uppercase">Current Media</p>
                    </div>
                  )}

                  {uploadedMedia && (
                    <div className="mb-2 flex gap-4 items-center p-2 border-2 border-on-background bg-primary-container">
                      <div className="w-24 h-24 border-2 border-on-background overflow-hidden relative bg-background shrink-0">
                        {uploadedMedia.type === 'video' ? (
                           <video src={uploadedMedia.url} className="w-full h-full object-cover" controls />
                        ) : (
                           <img src={uploadedMedia.url} alt="New" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <p className="text-xs text-on-background font-label-mono uppercase">New Media Selected</p>
                    </div>
                  )}

                  {uploadedMedia && uploadedMedia.type === 'video' && (
                    <div className="bg-surface-variant border-2 border-on-background p-3 mb-2 space-y-3">
                      <h4 className="font-label-mono text-label-mono uppercase text-cobalt flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">cut</span> Video Trimming Options
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-label-mono text-xs uppercase block mb-1">Start Time (s)</label>
                          <input type="number" step="0.1" min="0" max={videoTrim.end || uploadedMedia.duration} value={videoTrim.start} onChange={(e) => setVideoTrim({...videoTrim, start: parseFloat(e.target.value) || 0})} className="w-full border-2 border-on-background p-1.5 text-sm bg-background font-label-mono focus:outline-none focus:border-cobalt" />
                        </div>
                        <div>
                          <label className="font-label-mono text-xs uppercase block mb-1">End Time (s)</label>
                          <input type="number" step="0.1" min={videoTrim.start} max={uploadedMedia.duration} value={videoTrim.end} onChange={(e) => setVideoTrim({...videoTrim, end: parseFloat(e.target.value) || 0})} className="w-full border-2 border-on-background p-1.5 text-sm bg-background font-label-mono focus:outline-none focus:border-cobalt" />
                        </div>
                      </div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-label-mono leading-tight">The video will be permanently trimmed and cropped based on these values when you click Save Work. Changes are processed safely by Cloudinary.</p>
                    </div>
                  )}

                  {(previewUrl) && (
                    <div className="bg-surface border-2 border-on-background p-3 mb-2 space-y-3">
                      <h4 className="font-label-mono text-label-mono uppercase text-cobalt flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">open_with</span> Custom Framing (X/Y/Scale)
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-label-mono text-xs uppercase block mb-1">X Position (%)</label>
                          <input type="range" min="0" max="100" value={mediaPos.x} onChange={(e) => setMediaPos({...mediaPos, x: parseInt(e.target.value)})} className="w-full" />
                          <div className="text-right text-xs font-label-mono">{mediaPos.x}%</div>
                        </div>
                        <div>
                          <label className="font-label-mono text-xs uppercase block mb-1">Y Position (%)</label>
                          <input type="range" min="0" max="100" value={mediaPos.y} onChange={(e) => setMediaPos({...mediaPos, y: parseInt(e.target.value)})} className="w-full" />
                          <div className="text-right text-xs font-label-mono">{mediaPos.y}%</div>
                        </div>
                        <div className="col-span-2">
                          <label className="font-label-mono text-xs uppercase block mb-1">Scale (%)</label>
                          <input type="range" min="50" max="300" value={mediaPos.scale} onChange={(e) => setMediaPos({...mediaPos, scale: parseInt(e.target.value)})} className="w-full" />
                          <div className="text-right text-xs font-label-mono">{mediaPos.scale}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="button" 
                    onClick={handleOpenWidget} 
                    disabled={isWidgetLoading}
                    className="w-full bg-surface-variant text-on-background border-4 border-on-background p-2 font-label-mono text-label-mono uppercase hover:bg-cobalt hover:text-white transition-all text-left flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isWidgetLoading ? 'Initializing Widget...' : (uploadedMedia || (editingWork && editingWork.imageUrl) ? 'Change Media (Trim/Crop)' : 'Upload Media (Trim/Crop)')}</span>
                    <span className="material-symbols-outlined">{isWidgetLoading ? 'hourglass_empty' : 'upload'}</span>
                  </button>

                </div>
                
                {/* TAGS */}
                <div className="md:col-span-2">
                  <label className="block font-label-mono text-label-mono uppercase mb-1 flex justify-between">
                    <span>Tags</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_TAGS.map(tag => (
                      <button 
                        key={tag.label} type="button" onClick={() => handleAddTag(tag.label)}
                        className="border-2 border-on-background px-2 py-0.5 font-label-mono text-xs hover:scale-105 transition-transform"
                        style={{ backgroundColor: tag.color, color: tag.text }}
                      >
                        + {tag.label}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" name="tags" value={formState.tags} onChange={(e) => setFormState({...formState, tags: e.target.value})} required
                    placeholder="React, Next.js, Tailwind"
                    className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-md text-body-md focus:outline-none focus:border-cobalt"
                  />
                </div>

                {/* TOOLS */}
                <div className="md:col-span-2">
                  <label className="block font-label-mono text-label-mono uppercase mb-1">Tools/Tech</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_TOOLS.map(tool => (
                      <button 
                        key={tool.label} type="button" onClick={() => handleAddTool(tool.label)}
                        className="border-2 border-on-background px-2 py-0.5 font-label-mono text-xs hover:scale-105 transition-transform"
                        style={{ backgroundColor: tool.color, color: tool.text }}
                      >
                        + {tool.label}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" name="tools" value={formState.tools} onChange={(e) => setFormState({...formState, tools: e.target.value})} required
                    placeholder="React, Tailwind"
                    className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-md text-body-md focus:outline-none focus:border-cobalt"
                  />
                </div>

                <div>
                  <label className="block font-label-mono text-label-mono uppercase mb-1">Project URL</label>
                  <input 
                    type="url" name="projectUrl" value={formState.projectUrl} onChange={(e) => setFormState({...formState, projectUrl: e.target.value})}
                    className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-md text-body-md focus:outline-none focus:border-cobalt"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-label-mono uppercase mb-1">Live URL</label>
                  <input 
                    type="url" name="liveUrl" value={formState.liveUrl} onChange={(e) => setFormState({...formState, liveUrl: e.target.value})}
                    className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-md text-body-md focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isPending}
                className="w-full mt-2 bg-cobalt text-on-primary font-label-mono text-label-mono uppercase border-4 border-on-background p-2 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Saving...' : (editingWork ? 'Update Work' : 'Save Work')}
              </button>
            </form>
          </div>
        </div>

        {/* List Section / Live Preview */}
        <div className="lg:col-span-2 space-y-4">
          {showPreview ? (
            <div className="sticky top-8">
              <h2 className="font-headline-md uppercase mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-cobalt">visibility</span> Live Preview</h2>
              <div className="max-w-md">
                <article className="bg-background border-4 border-on-background neo-shadow neo-shadow-blue flex flex-col h-full group relative z-10 transition-all duration-300">
                  <div className="aspect-square border-b-4 border-on-background overflow-hidden relative bg-surface-variant p-6">
                    {previewUrl ? (
                      (() => {
                        const S = mediaPos.scale / 100;
                        const maxShift = ((S - 1) / 2) * 100;
                        const shiftX = ((50 - mediaPos.x) / 50) * maxShift;
                        const shiftY = ((50 - mediaPos.y) / 50) * maxShift;
                        const transform = `scale(${S}) translate(${shiftX}%, ${shiftY}%)`;

                        return (
                          <div className="w-full h-full border-2 border-on-background overflow-hidden relative bg-background flex items-center justify-center">
                            {previewMediaType === 'video' ? (
                              <video 
                                className="w-full h-full object-contain transition-all duration-300" 
                                src={finalPreviewUrl} 
                                style={{ transform }}
                                autoPlay muted loop playsInline 
                                onTimeUpdate={(e) => {
                                  if (uploadedMedia && uploadedMedia.type === 'video' && videoTrim) {
                                    if (videoTrim.end > 0 && e.target.currentTime >= videoTrim.end) {
                                      e.target.currentTime = videoTrim.start || 0;
                                      e.target.play().catch(err => console.error(err));
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <img 
                                className="w-full h-full object-contain transition-all duration-300" 
                                alt={formState.title} 
                                src={finalPreviewUrl} 
                                style={{ transform }}
                              />
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="w-full h-full border-2 border-on-background bg-background flex items-center justify-center">
                        <span className="font-label-mono text-on-surface-variant uppercase">No Media Uploaded</span>
                      </div>
                    )}
                    {formState.liveUrl && (
                      <div className="absolute top-8 right-8 bg-primary-container border-2 border-on-background px-3 py-1 font-label-mono text-label-mono rotate-6 uppercase">
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow bg-grid-pattern">
                    <h3 className="font-headline-md text-headline-md uppercase mb-2 group-hover:text-cobalt transition-colors">{formState.title || 'Work Title'}</h3>
                    <p className="font-body-md text-body-md mb-8">{formState.description || 'Description will appear here...'}</p>
                    <div className="mt-auto flex justify-between items-center border-t-4 border-on-background pt-6 border-dashed">
                      <div className="flex gap-2 flex-wrap max-w-[70%]">
                        {formState.tools ? formState.tools.split(',').filter(Boolean).map((tool, i) => (
                          <span key={i} className="bg-cobalt text-on-primary border-2 border-on-background px-2 py-1 font-label-mono text-[10px] uppercase flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">code</span>{tool.trim()}
                          </span>
                        )) : (
                          <span className="bg-surface-variant text-on-surface-variant border-2 border-on-background px-2 py-1 font-label-mono text-[10px] uppercase">
                            Tools Output
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          ) : activeTab === 'works' ? (
            <>
              <h2 className="font-headline-md uppercase mb-6">Current Works ({works.length})</h2>
              {works.length === 0 ? (
                <p className="bg-surface-variant p-4 border-4 border-on-background font-body-md text-on-surface-variant">
                  No works added yet. Use the form to add your first portfolio item.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {works.map(work => {
                    const urlParts = work.imageUrl.split('#pos=');
                    const src = urlParts[0];
                    const [posX, posY, scale] = urlParts[1] ? urlParts[1].split(',') : ['50', '50', '100'];
                    const S = parseInt(scale) / 100;
                    const maxShift = ((S - 1) / 2) * 100;
                    const shiftX = ((50 - parseInt(posX)) / 50) * maxShift;
                    const shiftY = ((50 - parseInt(posY)) / 50) * maxShift;
                    const transform = `scale(${S}) translate(${shiftX}%, ${shiftY}%)`;

                    return (
                      <div key={work.id} className="bg-background border-4 border-on-background neo-shadow p-4 flex gap-4">
                        <div className="w-24 h-24 shrink-0 border-2 border-on-background bg-surface-variant overflow-hidden relative flex items-center justify-center">
                          {work.mediaType === 'video' ? (
                            <video src={src} className="w-full h-full object-contain" style={{ transform }} />
                          ) : (
                            <img src={src} alt={work.title} className="w-full h-full object-contain" style={{ transform }} />
                          )}
                        </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-headline-md text-sm uppercase mb-1">{work.title}</h3>
                          <p className="font-body-md text-xs line-clamp-2 mb-2">{work.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditingWork(work); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="bg-primary-container text-on-background border-2 border-on-background px-2 py-1 font-label-mono text-xs uppercase hover:bg-cobalt hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(work.id)}
                            className="bg-error text-white border-2 border-on-background px-2 py-1 font-label-mono text-xs uppercase hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-headline-md uppercase mb-6">Enquiries ({enquiries.length})</h2>
              {enquiries.length === 0 ? (
                <p className="bg-surface-variant p-4 border-4 border-on-background font-body-md text-on-surface-variant">
                  No enquiries received yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {enquiries.map(enquiry => (
                    <div key={enquiry.id} className="bg-background border-4 border-on-background neo-shadow p-4">
                      <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-on-background border-dashed">
                        <div>
                          <h3 className="font-headline-md text-lg uppercase">{enquiry.name}</h3>
                          <a href={`mailto:${enquiry.email}`} className="font-body-md text-cobalt hover:underline block">{enquiry.email}</a>
                          {enquiry.phone && <a href={`tel:${enquiry.phone}`} className="font-body-md text-on-surface-variant hover:underline block">{enquiry.phone}</a>}
                        </div>
                        <div className="text-right">
                          <span className="block font-label-mono text-xs uppercase bg-primary-container border-2 border-on-background px-2 py-1 mb-1">{enquiry.projectType}</span>
                          <span className="block font-label-mono text-xs uppercase bg-surface-variant border-2 border-on-background px-2 py-1">{enquiry.budget}</span>
                        </div>
                      </div>
                      <p className="font-body-md mb-4">{enquiry.description}</p>
                      <div className="flex justify-between items-center text-xs font-label-mono text-on-surface-variant">
                        <span>{new Date(enquiry.createdAt).toLocaleString()}</span>
                        <button 
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
                          className="text-error hover:text-red-700 uppercase underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
