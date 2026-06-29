'use client'

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="bg-background border-4 border-on-background neo-shadow max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-error text-on-error rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-on-background">
          <span className="text-4xl font-bold">!</span>
        </div>
        <h1 className="font-headline-md text-headline-md uppercase mb-4">Something Broke</h1>
        <p className="font-body-md text-body-md mb-8 text-on-surface-variant">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-on-background text-background font-label-mono text-label-mono uppercase border-4 border-transparent px-8 py-3 hover:bg-cobalt hover:text-on-primary hover:border-on-background transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
