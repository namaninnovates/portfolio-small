'use client'

import { useState } from 'react'
import { createEnquiry } from '@/app/actions/enquiryActions'

export default function HireMeModal({ isOpen, onClose }) {
  const [isPending, setIsPending] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [message, setMessage] = useState('')
  const [selectedType, setSelectedType] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)
    setStatus(null)
    
    const formData = new FormData(e.target)
    const result = await createEnquiry(formData)
    
    setIsPending(false)
    if (result.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage("Thanks for reaching out! I'll get back to you soon.")
      // Reset form after a delay, or just keep the success message
      setTimeout(() => {
        onClose()
        setStatus(null)
        setSelectedType('')
      }, 3000)
    }
  }

  const budgetOptions = {
    'Web Dev': ['$100 - $150', '$151 - $250', '$251 - $400', 'More than $401'],
    'Video Editing': ['$5 - $10', '$11 - $25', '$25 - $75', '$76 - $150'],
    'Graphic Designing': ['$2 - $5', '$6 - $15', '$16 - $30', '$31+'],
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#fef08a] bg-grid-pattern text-black border-4 border-black neo-shadow relative flex flex-col max-h-[90vh] rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]">
        {/* Header - Sticky note tape effect */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/50 border-2 border-black rotate-[-2deg] z-10"></div>
        
        <div className="flex justify-between items-center p-4 md:p-6 border-b-4 border-black bg-[#fef08a]/90">
          <h2 className="font-headline-md text-headline-md uppercase text-black">Start a Project</h2>
          <button 
            onClick={onClose}
            className="text-black hover:text-error transition-colors font-headline-md text-headline-md leading-none bg-transparent border-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto">
          {status === 'success' ? (
            <div className="bg-[#00FF00] border-4 border-black p-6 text-center rotate-[-1deg]">
              <h3 className="font-headline-md text-headline-md uppercase mb-2">Success!</h3>
              <p className="font-body-md text-body-md text-black">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="bg-error text-on-error border-4 border-black p-4 font-body-md text-body-md">
                  {message}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-mono text-label-mono uppercase mb-1 text-black">Name</label>
                  <input 
                    type="text" name="name" required
                    className="w-full bg-white border-4 border-black p-2 font-body-md text-body-md text-black focus:outline-none focus:bg-[#fff9c4] transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-label-mono uppercase mb-1 text-black">Email</label>
                  <input 
                    type="email" name="email" required
                    className="w-full bg-white border-4 border-black p-2 font-body-md text-body-md text-black focus:outline-none focus:bg-[#fff9c4] transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-mono text-label-mono uppercase mb-1 text-black">Phone (Optional)</label>
                <input 
                  type="tel" name="phone"
                  className="w-full bg-white border-4 border-black p-2 font-body-md text-body-md text-black focus:outline-none focus:bg-[#fff9c4] transition-colors"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block font-label-mono text-label-mono uppercase mb-1 text-black">Project Type</label>
                <select 
                  name="projectType" required
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-white border-4 border-black p-2 font-body-md text-body-md text-black focus:outline-none focus:bg-[#fff9c4] transition-colors"
                >
                  <option value="" disabled>Select a service...</option>
                  <option value="Web Dev">Web Development</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Graphic Designing">Graphic Designing</option>
                </select>
              </div>

              {selectedType && (
                <div>
                  <label className="block font-label-mono text-label-mono uppercase mb-1 text-black">Estimated Budget (USD)</label>
                  <select 
                    name="budget" required defaultValue=""
                    className="w-full bg-white border-4 border-black p-2 font-body-md text-body-md text-black focus:outline-none focus:bg-[#fff9c4] transition-colors"
                  >
                    <option value="" disabled>Select your budget...</option>
                    {budgetOptions[selectedType].map((budget, index) => (
                      <option key={index} value={budget}>{budget}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-label-mono text-label-mono uppercase mb-1 text-black">Project Details</label>
                <textarea 
                  name="description" required rows={4}
                  className="w-full bg-white border-4 border-black p-2 font-body-md text-body-md text-black focus:outline-none focus:bg-[#fff9c4] transition-colors"
                  placeholder="Tell me about your project goals, timeline, and any specific requirements..."
                />
              </div>

              <button 
                type="submit" disabled={isPending}
                className="w-full bg-black text-white font-label-mono text-label-mono uppercase border-4 border-black p-4 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Sending...' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
