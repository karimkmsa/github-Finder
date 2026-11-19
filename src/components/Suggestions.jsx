export default function Suggestions({ users, onPick, disabled }) {
  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-medium text-slate-400">Try one of these</p>

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