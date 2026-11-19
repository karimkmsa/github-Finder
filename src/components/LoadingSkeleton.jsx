export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Loading">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
        <div className="flex items-center gap-6">
          <div className="h-28 w-28 rounded-full bg-slate-800" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-1/3 rounded bg-slate-800" />
            <div className="h-4 w-1/4 rounded bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-800" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-800" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-900/70" />
        ))}
      </div>
    </div>
  )
}
