import { useEffect, useState } from 'react'
import { getRepoLanguages } from '../api/github'
import { languageColor } from '../utils/languageColors'
import { formatDate } from '../utils/format'

export default function RepoCard({ repo }) {
  // null = still loading, [] = none / failed
  const [languages, setLanguages] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    getRepoLanguages(repo.owner.login, repo.name, 4, controller.signal)
      .then(setLanguages)
      .catch((err) => {
        if (err.name !== 'AbortError') setLanguages([])
      })
    return () => controller.abort()
  }, [repo.owner.login, repo.name])

  const shown =
    languages && languages.length > 0
      ? languages
      : repo.language
        ? [{ name: repo.language, percent: 100 }]
        : []

  return (
    <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/50">
      <div className="flex items-start justify-between gap-3">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 truncate text-lg font-semibold text-emerald-400 hover:underline"
          title={repo.name}
        >
          {repo.name}
        </a>
        <span
          className="flex shrink-0 items-center gap-1 text-sm text-amber-300"
          title="Stars"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
          </svg>
          {repo.stargazers_count.toLocaleString()}
        </span>
      </div>

      {repo.fork && (
        <span className="mt-1 w-fit rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
          Fork
        </span>
      )}

      <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-300">
        {repo.description || (
          <span className="italic text-slate-500">No description provided.</span>
        )}
      </p>

      <div className="mt-4">
        {languages === null ? (
          <div className="h-2 w-full animate-pulse rounded-full bg-slate-800" />
        ) : shown.length > 0 ? (
          <>
            <div
              className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800"
              role="img"
              aria-label={`Languages: ${shown.map((l) => l.name).join(', ')}`}
            >
              {shown.map((l) => (
                <div
                  key={l.name}
                  style={{
                    width: `${l.percent}%`,
                    backgroundColor: languageColor(l.name),
                  }}
                />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
              {shown.map((l) => (
                <li key={l.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: languageColor(l.name) }}
                  />
                  {l.name}
                  {shown.length > 1 && (
                    <span className="text-slate-500">
                      {l.percent.toFixed(l.percent < 10 ? 1 : 0)}%
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-xs italic text-slate-500">No language detected</p>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Updated {formatDate(repo.pushed_at || repo.updated_at)}
      </p>
    </article>
  )
}
