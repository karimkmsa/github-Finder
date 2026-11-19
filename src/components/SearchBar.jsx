export default function SearchBar({ value, onChange, onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 p-2 shadow-lg shadow-black/30 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/20">
        <svg
          className="ml-2 h-5 w-5 shrink-0 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by GitHub username…"
          aria-label="GitHub username"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base text-slate-100 placeholder-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  )
}
