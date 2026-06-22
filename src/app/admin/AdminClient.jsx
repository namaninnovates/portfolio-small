'use client'

import { useState } from 'react'
import { createWork, updateWork, deleteWork } from '@/app/actions/workActions'
import { logoutAction } from '@/app/actions/authActions'

export default function AdminClient({ initialWorks }) {
  const [works, setWorks] = useState(initialWorks)
  const [editingWork, setEditingWork] = useState(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.target)
    
    if (editingWork) {
      await updateWork(editingWork.id, formData)
    } else {
      await createWork(formData)
    }
    
    // Quick reload since Server Actions will revalidate the path
    window.location.reload() 
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this work?')) {
      await deleteWork(id)
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
                <label className="block font-label-sm uppercase mb-1">Image URL</label>
                <input 
                  type="url" name="imageUrl" defaultValue={editingWork?.imageUrl} required
                  className="w-full bg-surface-variant border-4 border-on-background p-2 font-body-sm focus:outline-none focus:border-cobalt"
                />
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
                className="w-full bg-cobalt text-on-primary font-label-md uppercase border-4 border-on-background p-3 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all disabled:opacity-50"
              >
                {isPending ? 'Saving...' : (editingWork ? 'Update Work' : 'Save Work')}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-headline-md uppercase mb-6">Current Works ({works.length})</h2>
          {works.length === 0 ? (
            <p className="bg-surface-variant p-4 border-4 border-on-background font-body-md text-on-surface-variant">
              No works added yet. Use the form to add your first portfolio item.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {works.map(work => (
                <div key={work.id} className="bg-background border-4 border-on-background p-4 flex flex-col h-full neo-shadow-sm hover:neo-shadow-blue transition-all">
                  <div className="aspect-video border-2 border-on-background mb-4 bg-surface-variant overflow-hidden">
                    <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
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
        </div>
      </div>
    </div>
  )
}
