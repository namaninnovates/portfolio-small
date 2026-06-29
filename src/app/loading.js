export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-on-background border-t-primary-container animate-spin"></div>
        <p className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
          Loading...
        </p>
      </div>
    </div>
  )
}
