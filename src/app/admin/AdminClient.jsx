'use client'

import { useState } from 'react'
import { createWork, updateWork, deleteWork, getCloudinarySignature } from '@/app/actions/workActions'
import { logoutAction } from '@/app/actions/authActions'

import { deleteEnquiry } from '@/app/actions/enquiryActions'

export default function AdminClient({ initialWorks, initialEnquiries = [] }) {
  const [works, setWorks] = useState(initialWorks)
  const [enquiries, setEnquiries] = useState(initialEnquiries)
  const [activeTab, setActiveTab] = useState('works')
  const [editingWork, setEditingWork] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ active: false, percent: 0, loadedMB: 0, totalMB: 0 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)
    const form = e.target
    const formData = new FormData(form)
    
    try {
      const imageFile = formData.get('imageUrl')
      let secureUrl = formData.get('existingImageUrl') || ''
      let mediaType = formData.get('existingMediaType') || 'image'

      if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 100 * 1024 * 1024) {
          alert('File size exceeds the strict limit of 100MB. Please select a smaller file.')
          setIsPending(false)
          return
        }
        
        // 1. Get signature
        const sigData = await getCloudinarySignature()
        
        // 2. Upload directly to Cloudinary with XHR for progress
        const uploadData = new FormData()
        uploadData.append('file', imageFile)
        uploadData.append('api_key', sigData.apiKey)
        uploadData.append('timestamp', sigData.timestamp)
        uploadData.append('signature', sigData.signature)
        uploadData.append('folder', 'portfolio')

        const json = await new Promise(async (resolve, reject) => {
          const chunkSize = 20 * 1024 * 1024 // 20 MB chunks
          const totalSize = imageFile.size
          const uploadId = "upl_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9)
          
          let currentChunk = 0
          let finalResponse = null

          while (currentChunk * chunkSize < totalSize) {
            const start = currentChunk * chunkSize
            const end = Math.min(start + chunkSize, totalSize)
            const chunk = imageFile.slice(start, end)
            
            const chunkData = new FormData()
            // Cloudinary requires the original filename to stitch correctly sometimes, but passing the chunk works.
            chunkData.append('file', chunk, imageFile.name)
            chunkData.append('api_key', sigData.apiKey)
            chunkData.append('timestamp', sigData.timestamp)
            chunkData.append('signature', sigData.signature)
            chunkData.append('folder', 'portfolio')

            try {
              finalResponse = await new Promise((resResolve, resReject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`)
                xhr.setRequestHeader('X-Unique-Upload-Id', uploadId)
                xhr.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${totalSize}`)
                
                xhr.upload.onprogress = (event) => {
                  if (event.lengthComputable) {
                    const loadedTotal = start + event.loaded
                    const percent = Math.round((loadedTotal / totalSize) * 100)
                    const loadedMB = (loadedTotal / (1024 * 1024)).toFixed(2)
                    const totalMB = (totalSize / (1024 * 1024)).toFixed(2)
                    setUploadProgress({ active: true, percent, loadedMB, totalMB })
                  }
                }
                
                xhr.onload = () => {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resResolve(JSON.parse(xhr.responseText))
                  } else {
                    resReject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`))
                  }
                }
                
                xhr.onerror = () => resReject(new Error('Network error occurred during chunk upload. The file might be too large or your connection dropped.'))
                xhr.send(chunkData)
              })
              currentChunk++
            } catch (err) {
              reject(err)
              return
            }
          }
          
          resolve(finalResponse)
        })
        
        secureUrl = json.secure_url
        mediaType = imageFile.type.startsWith('video/') ? 'video' : 'image'
        setUploadProgress({ active: false, percent: 0, loadedMB: 0, totalMB: 0 })
      }

      // Overwrite the file with the string URL so Server Action doesn't crash
      formData.set('imageUrl', secureUrl)
      formData.set('mediaType', mediaType)

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

  return (
    <div className="min-h-screen bg-surface-container-low p-4 md:p-8">
      <header className="flex justify-between items-center mb-8 border-b-4 border-on-background pb-4">
        <h1 className="font-display-lg text-headline-lg uppercase">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('works')}
            className={`px-4 py-2 font-label-md uppercase border-4 border-on-background transition-all ${activeTab === 'works' ? 'bg-primary text-on-primary shadow-[4px_4px_0_0_#000] -translate-y-1' : 'bg-surface-variant text-on-background hover:bg-primary hover:text-on-primary'}`}
          >
            Works
          </button>
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 font-label-md uppercase border-4 border-on-background transition-all ${activeTab === 'enquiries' ? 'bg-primary text-on-primary shadow-[4px_4px_0_0_#000] -translate-y-1' : 'bg-surface-variant text-on-background hover:bg-primary hover:text-on-primary'}`}
          >
            Enquiries
          </button>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-error text-on-error border-4 border-on-background px-4 py-2 font-label-md uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all"
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
              {editingWork && (
                <button 
                  type="button" 
                  onClick={() => setEditingWork(null)}
                  className="text-sm font-label-sm bg-surface-variant px-2 py-1 border-2 border-on-background hover:bg-on-background hover:text-background"
                >
                  Cancel Edit
                </button>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-sm uppercase mb-1">Title</label>
                <input 
                  type="text" name="title" defaultValue={editingWork?.title} required
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
              </div>
              <div>
                <label className="block font-label-sm uppercase mb-1">Description</label>
                <textarea 
                  name="description" defaultValue={editingWork?.description} required rows={3}
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
              </div>
              <div>
                <label className="block font-label-sm uppercase mb-1">Media (Image/Video, Max 100MB)</label>
                {editingWork && editingWork.imageUrl && (
                  <div className="mb-2">
                    <p className="text-sm mb-1 text-on-surface-variant">Current Media:</p>
                    {editingWork.mediaType === 'video' ? (
                       <video src={editingWork.imageUrl} className="w-32 h-20 object-cover border-2 border-on-background" controls />
                    ) : (
                       <img src={editingWork.imageUrl} alt="Current" className="w-32 h-20 object-cover border-2 border-on-background" />
                    )}
                  </div>
                )}
                <input 
                  type="file" name="imageUrl" accept="image/*,video/*"
                  required={!editingWork}
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt file:mr-4 file:py-2 file:px-4 file:border-2 file:border-on-background file:bg-primary-container file:text-on-background file:uppercase file:font-label-sm hover:file:bg-cobalt hover:file:text-white transition-all"
                />
                {/* Hidden fields to preserve existing URLs if no new file is selected */}
                {editingWork && <input type="hidden" name="existingImageUrl" value={editingWork.imageUrl || ''} />}
                {editingWork && <input type="hidden" name="existingMediaType" value={editingWork.mediaType || 'image'} />}
              </div>
              <div>
                <label className="block font-label-sm uppercase mb-1">Tags (Comma separated)</label>
                <input 
                  type="text" name="tags" defaultValue={editingWork?.tags} required
                  placeholder="React, Next.js, Tailwind"
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
              </div>
              <div>
                <label className="block font-label-sm uppercase mb-1">Tools/Tech (Comma separated)</label>
                <input 
                  type="text" name="tools" defaultValue={editingWork?.tools} required
                  placeholder="React, Tailwind"
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
              </div>
              <div>
                <label className="block font-label-sm uppercase mb-1">Project URL (Optional)</label>
                <input 
                  type="url" name="projectUrl" defaultValue={editingWork?.projectUrl || ''}
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
              </div>
              <div>
                <label className="block font-label-sm uppercase mb-1">Live URL (Optional)</label>
                <input 
                  type="url" name="liveUrl" defaultValue={editingWork?.liveUrl || ''}
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
              </div>

              <button 
                type="submit" disabled={isPending}
                className="w-full bg-cobalt text-on-primary font-label-md uppercase border-4 border-on-background p-3 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Saving...' : (editingWork ? 'Update Work' : 'Save Work')}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'works' ? (
            <>
              <h2 className="font-headline-md uppercase mb-6">Current Works ({works.length})</h2>
              {works.length === 0 ? (
                <p className="bg-surface-variant p-4 border-4 border-on-background font-body-md text-on-surface-variant">
                  No works added yet. Use the form to add your first portfolio item.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {works.map(work => (
                    <div key={work.id} className="bg-background border-4 border-on-background p-4 flex flex-col h-full neo-shadow-sm hover:neo-shadow-blue transition-all">
                      <div className="aspect-video border-2 border-on-background mb-4 bg-surface-variant overflow-hidden relative">
                        {work.mediaType === 'video' ? (
                          <video src={work.imageUrl} className="w-full h-full object-cover transition-all" muted loop autoPlay playsInline />
                        ) : (
                          <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover transition-all" />
                        )}
                      </div>
                      <h3 className="font-headline-sm uppercase line-clamp-1">{work.title}</h3>
                      <p className="font-body-sm text-on-surface-variant line-clamp-2 mt-2 flex-grow">{work.description}</p>
                      
                      <div className="flex gap-2 mt-4 pt-4 border-t-2 border-dashed border-on-background">
                        <button 
                          onClick={() => setEditingWork(work)}
                          className="flex-1 bg-secondary-container text-on-secondary border-2 border-on-background py-1 font-label-sm uppercase hover:bg-secondary hover:text-on-secondary transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(work.id)}
                          className="flex-1 bg-error-container text-on-error-container border-2 border-on-background py-1 font-label-sm uppercase hover:bg-error hover:text-on-error transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-headline-md uppercase mb-6">Enquiries ({enquiries.length})</h2>
              {enquiries.length === 0 ? (
                <p className="bg-surface-variant p-4 border-4 border-on-background font-body-md text-on-surface-variant">
                  No enquiries yet. Check back later!
                </p>
              ) : (
                <div className="space-y-4">
                  {enquiries.map(enq => (
                    <div key={enq.id} className="bg-background border-4 border-on-background p-4 flex flex-col gap-2 neo-shadow-sm">
                      <div className="flex justify-between items-start border-b-2 border-on-background pb-2">
                        <div>
                          <h3 className="font-headline-sm uppercase">{enq.name}</h3>
                          <a href={`mailto:${enq.email}`} className="text-cobalt hover:underline font-label-sm">{enq.email}</a>
                          {enq.phone && (
                            <div className="font-label-sm text-on-surface-variant mt-1">
                              Phone: <a href={`tel:${enq.phone}`} className="text-cobalt hover:underline">{enq.phone}</a>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-on-surface-variant">{new Date(enq.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex gap-4 font-label-sm uppercase mt-2">
                        <span className="bg-primary-container text-on-primary-container px-2 py-1 border-2 border-on-background">{enq.projectType}</span>
                        <span className="bg-tertiary-container text-on-tertiary-container px-2 py-1 border-2 border-on-background">{enq.budget}</span>
                      </div>
                      
                      <p className="font-body-md mt-2 whitespace-pre-wrap text-on-surface">{enq.description}</p>
                      
                      <div className="flex justify-end mt-2 pt-2 border-t-2 border-dashed border-on-background">
                        <button 
                          onClick={() => handleDeleteEnquiry(enq.id)}
                          className="bg-error-container text-on-error-container border-2 border-on-background px-4 py-1 font-label-sm uppercase hover:bg-error hover:text-on-error transition-colors"
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

      {/* Popup Loader Bar */}
      {uploadProgress.active && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-variant border-4 border-on-background p-6 neo-shadow flex flex-col gap-4">
            <h3 className="font-headline-sm uppercase text-center">Uploading Media...</h3>
            
            <div className="flex justify-between font-label-sm uppercase">
              <span>Progress</span>
              <span>{uploadProgress.percent}%</span>
            </div>
            
            <div className="w-full h-6 bg-background border-4 border-on-background overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[#00FF00] transition-all duration-300" 
                style={{ width: `${uploadProgress.percent}%` }}
              ></div>
            </div>
            
            <div className="text-sm font-label-sm text-center">
              {uploadProgress.loadedMB} MB / {uploadProgress.totalMB} MB
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
