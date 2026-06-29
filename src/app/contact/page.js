"use client";

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useState } from 'react'
import { createEnquiry } from '@/app/actions/enquiryActions'

export default function ContactPage() {
  const [formState, setFormState] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const formData = new FormData(e.target);
    // Map contact form fields to enquiry format
    formData.set('projectType', 'General Enquiry');
    formData.set('budget', 'To be discussed');
    // The textarea is named 'message' in this form but 'description' in the action
    const message = formData.get('message');
    formData.set('description', message);

    const result = await createEnquiry(formData);

    if (result.error) {
      setFormState('error');
      setErrorMessage(result.error);
    } else {
      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        e.target.reset();
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background overflow-x-hidden selection:bg-cobalt selection:text-white">
        
        {/* 1. Hero Header */}
      <section className="px-margin-mobile md:px-margin-desktop pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden border-b-8 border-on-background bg-cobalt text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-8">
          <div>
            <div className="inline-block bg-background text-on-background border-4 border-on-background px-4 py-1 font-label-mono text-label-mono uppercase -rotate-2 mb-6 neo-shadow">
              SYSTEM ONLINE //
            </div>
            <h1 className="font-display-xl text-5xl md:text-8xl uppercase leading-none tracking-tighter text-white drop-shadow-[4px_4px_0_var(--color-on-background)] md:drop-shadow-[6px_6px_0_var(--color-on-background)]">
              LET&apos;S BUILD <br className="hidden md:block" />
              SOMETHING <span className="text-primary-container">LOUD.</span>
            </h1>
          </div>
          <div className="hidden md:block w-32 h-32 bg-primary-container border-8 border-on-background rounded-full animate-spin-slow flex items-center justify-center neo-shadow text-on-background">
            <span className="material-symbols-outlined text-6xl">asterisk</span>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-24 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
          
          {/* Left Column: The Terminal Form */}
          <div className="lg:col-span-3">
            <div className="bg-on-background text-background border-8 border-on-background p-1 md:p-2 neo-shadow">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b-4 border-background pb-2 mb-6 px-4 pt-2">
                <div className="font-label-mono text-sm uppercase flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-container rounded-full animate-pulse"></div>
                  INITIATE_CONTACT.EXE
                </div>
                <div className="flex gap-2">
                  {['_','□','✕'].map((btn, i) => (
                    <div key={i} className={`w-6 h-6 border-2 border-background flex items-center justify-center font-bold text-xs ${i === 2 ? 'bg-secondary text-on-secondary' : ''}`}>
                      {btn}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="px-4 md:px-8 pb-8 space-y-8">
                {/* Honeypot anti-spam field — invisible to humans */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} />

                {/* Error display */}
                {formState === 'error' && (
                  <div className="bg-secondary text-on-secondary border-4 border-background p-4 font-body-md flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-2 relative group">
                  <label htmlFor="name" className="font-headline-md text-xl uppercase tracking-wide">YOUR_NAME</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    required
                    className="bg-background text-on-background border-4 border-transparent p-4 font-body-lg outline-none transition-all duration-200 focus:border-primary-container focus:bg-primary-container/10 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_var(--color-primary-container)]"
                    placeholder="John Doe"
                  />
                  <div className="absolute right-4 top-12 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-primary-container">done</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2 relative group">
                  <label htmlFor="email" className="font-headline-md text-xl uppercase tracking-wide">EMAIL_ADDRESS</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    className="bg-background text-on-background border-4 border-transparent p-4 font-body-lg outline-none transition-all duration-200 focus:border-cobalt focus:bg-cobalt/10 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_var(--color-cobalt)]"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2 relative group">
                  <label htmlFor="message" className="font-headline-md text-xl uppercase tracking-wide">THE_PITCH</label>
                  <textarea 
                    id="message" 
                    name="message"
                    required
                    rows={5}
                    className="bg-background text-on-background border-4 border-transparent p-4 font-body-lg outline-none transition-all duration-200 focus:border-secondary-container focus:bg-secondary-container/10 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_var(--color-secondary-container)] resize-y"
                    placeholder="Tell me about the project..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={formState !== 'idle'}
                    className={`w-full font-display-xl text-3xl md:text-5xl uppercase p-6 border-4 border-background transition-all duration-200 flex items-center justify-center gap-4 ${
                      formState === 'idle' ? 'bg-primary-container text-on-background hover:bg-background hover:text-on-background hover:-translate-y-2 hover:shadow-[8px_8px_0_0_var(--color-background)] cursor-pointer' : 
                      formState === 'loading' ? 'bg-cobalt text-white animate-pulse cursor-wait' : 
                      formState === 'error' ? 'bg-secondary text-on-secondary cursor-pointer' :
                      'bg-secondary text-on-secondary cursor-not-allowed'
                    }`}
                  >
                    {formState === 'idle' && 'SEND_TRANSMISSION'}
                    {formState === 'loading' && 'UPLOADING...'}
                    {formState === 'success' && 'RECEIVED!'}
                    {formState === 'error' && 'RETRY'}
                    
                    {formState === 'idle' && <span className="material-symbols-outlined text-4xl hidden md:block">send</span>}
                    {formState === 'success' && <span className="material-symbols-outlined text-4xl">check_circle</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Switchboard / Alternative Channels */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <h2 className="font-display-xl text-4xl md:text-5xl uppercase border-b-8 border-on-background pb-4">
              DIRECT LINES
            </h2>
            
            <a href="mailto:naman.innovates@gmail.com" target="_blank" rel="noopener noreferrer" className="group bg-background border-8 border-on-background p-6 flex flex-col items-start gap-4 hover:bg-primary-container transition-colors duration-300 neo-shadow neo-shadow-hover">
              <div className="w-16 h-16 bg-on-background text-background flex items-center justify-center rounded-full group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <div>
                <h3 className="font-headline-md text-2xl uppercase">EMAIL</h3>
                <p className="font-label-mono text-sm mt-1 opacity-70">naman.innovates@gmail.com</p>
              </div>
            </a>

            <a href="https://www.instagram.com/iamnamang/" target="_blank" rel="noopener noreferrer" className="group bg-background border-8 border-on-background p-6 flex flex-col items-start gap-4 hover:bg-cobalt hover:text-white transition-colors duration-300 neo-shadow neo-shadow-hover">
              <div className="w-16 h-16 bg-on-background text-background flex items-center justify-center rounded-full group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl">photo_camera</span>
              </div>
              <div>
                <h3 className="font-headline-md text-2xl uppercase">INSTAGRAM</h3>
                <p className="font-label-mono text-sm mt-1 opacity-70">@iamnamang</p>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/namangupta30/" target="_blank" rel="noopener noreferrer" className="group bg-background border-8 border-on-background p-6 flex flex-col items-start gap-4 hover:bg-secondary-container transition-colors duration-300 neo-shadow neo-shadow-hover">
              <div className="w-16 h-16 bg-on-background text-background flex items-center justify-center rounded-full group-hover:-rotate-12 transition-transform">
                <span className="material-symbols-outlined text-3xl">work</span>
              </div>
              <div>
                <h3 className="font-headline-md text-2xl uppercase">LINKEDIN</h3>
                <p className="font-label-mono text-sm mt-1 opacity-70">in/namangupta30</p>
              </div>
            </a>
            
            {/* Warning Label */}
            <div className="mt-auto bg-surface-variant border-4 border-on-background p-4 flex items-start gap-4 rotate-2">
              <span className="material-symbols-outlined text-secondary text-3xl flex-shrink-0">warning</span>
              <p className="font-label-mono text-xs leading-relaxed uppercase">
                WARNING: High volume of transmissions. If you require immediate assistance, please utilize the email channel. No cold outreach templates accepted.
              </p>
            </div>
          </div>

        </div>
      </section>

        <Footer />
      </main>
    </>
  )
}
