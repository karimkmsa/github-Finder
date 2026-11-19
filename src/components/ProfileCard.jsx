import { formatNumber } from '../utils/format'

export default function ProfileCard({ user }) {
  const stats = [
    { label: 'Repositories', value: user.public_repos },
    { label: 'Followers', value: user.followers },
    { label: 'Following', value: user.following },
  ]

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/30 sm:p-8">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="h-28 w-28 shrink-0 rounded-full border-4 border-slate-800 bg-slate-800 sm:h-32 sm:w-32"
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-bold text-white">
            {user.name || user.login}
          </h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline"
          >
            @{user.login}
          </a>

          <p className="mt-3 text-slate-300">
            {user.bio || (
              <span className="italic text-slate-500">
                This user has no bio.
              </span>
            )}
          </p>

          {(user.location || user.company) && (
            <p className="mt-2 text-sm text-slate-500">
              {[user.company, user.location].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-4 text-center"
          >
            <dd className="text-2xl font-bold text-white">
              {formatNumber(value)}
            </dd>
            <dt className="mt-1 text-xs uppercase tracking-wide text-slate-400">
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
