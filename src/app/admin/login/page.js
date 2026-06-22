'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/authActions'

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="bg-background border-4 border-on-background neo-shadow max-w-md w-full p-8 relative">
        <div className="absolute top-0 right-0 bg-primary border-b-4 border-l-4 border-on-background text-on-primary font-label-mono px-3 py-1">SECURE</div>
        
        <h1 className="font-headline-md text-headline-md uppercase mb-8 mt-4">Admin Login</h1>
        
        <form action={formAction} className="space-y-6" noValidate>
          <div>
            <label className="block font-label-mono text-label-mono uppercase mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full bg-surface-variant border-4 border-on-background p-3 font-body-md focus:outline-none focus:bg-background focus:border-cobalt transition-colors"
              placeholder="Enter admin password..."
              required
            />
            {state?.error && (
              <p className="text-error font-label-mono text-label-mono mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {state.error}
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-on-background text-background font-label-mono text-label-mono uppercase border-4 border-transparent p-3 hover:bg-cobalt hover:text-on-primary hover:border-on-background transition-all active:translate-y-1 disabled:opacity-50"
          >
            {isPending ? 'Authenticating...' : 'Access Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
