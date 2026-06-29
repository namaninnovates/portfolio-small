'use client'

export default function AdminError({ error, reset }) {
  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="bg-background border-4 border-on-background neo-shadow max-w-md w-full p-8">
        <div className="absolute top-0 right-0 bg-error border-b-4 border-l-4 border-on-background text-on-error font-label-mono px-3 py-1">ERROR</div>
        <h1 className="font-headline-md text-headline-md uppercase mb-4 mt-4">Admin Error</h1>
        <p className="font-body-md text-body-md mb-6 text-on-surface-variant">
          {error?.message || 'Failed to load admin panel. The database may be unreachable.'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-on-background text-background font-label-mono text-label-mono uppercase border-4 border-transparent px-6 py-3 hover:bg-cobalt transition-all"
          >
            Retry
          </button>
          <a
            href="/"
            className="flex-1 bg-surface-variant text-on-background font-label-mono text-label-mono uppercase border-4 border-on-background px-6 py-3 text-center hover:bg-primary-container transition-all"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  )
}
