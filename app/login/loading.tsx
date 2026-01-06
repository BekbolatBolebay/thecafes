export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-accent" />
        <div className="h-4 w-40 rounded bg-muted" />
      </div>
    </div>
  )
}
