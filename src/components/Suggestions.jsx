export default function Suggestions({ users, onPick, onShuffle, disabled }) {
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">Try one of these</p>
        <button
          type="button"
          onClick={onShuffle}
          disabled={disabled}
          className="flex items-center gap-1 text-sm text-slate-400 transition hover:text-emerald-400 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Shuffle
        </button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {users.map((username) => (
          <li key={username}>
            <button
              type="button"
              onClick={() => onPick(username)}
              disabled={disabled}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-emerald-400/60 hover:bg-slate-900 disabled:opacity-60"
            >
              <img
                src={`https://github.com/${username}.png?size=80`}
                alt=""
                loading="lazy"
                className="h-10 w-10 rounded-full bg-slate-800"
              />
              <span className="truncate text-sm font-medium text-slate-200">
                @{username}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
