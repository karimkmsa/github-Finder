import { useRef, useState } from 'react'
import {
  getLatestRepos,
  getUser,
  isValidUsername,
} from './api/github'
import SearchBar from './components/SearchBar'
import Suggestions from './components/Suggestions'
import ProfileCard from './components/ProfileCard'
import RepoCard from './components/RepoCard'
import LoadingSkeleton from './components/LoadingSkeleton'

const SUGGESTION_POOL = [
  'torvalds',
  'gaearon',
  'sindresorhus',
  'tj',
  'addyosmani',
  'yyx990803',
  'kentcdodds',
  'antfu',
  'mojombo',
  'defunkt',
  'fabpot',
  'taylorotwell',
  'jessfraz',
  'ThePrimeagen',
  'bradtraversy',
  'shadcn',
]

function pickRandom(count) {
  const pool = [...SUGGESTION_POOL]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export default function App() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState(() => pickRandom(3))
  const [status, setStatus] = useState('idle') 
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [error, setError] = useState('')
  const controllerRef = useRef(null)

  async function search(rawName) {
    const username = rawName.trim().replace(/^@/, '')
    if (!username) return

    setQuery(username)

    if (!isValidUsername(username)) {
      controllerRef.current?.abort()
      setStatus('error')
      setError('That doesn’t look like a valid GitHub username.')
      return
    }

    // Cancel any in-flight search so older responses can't overwrite newer ones.
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')
    setError('')

    try {
      const [userData, repoData] = await Promise.all([
        getUser(username, controller.signal),
        getLatestRepos(username, 6, controller.signal),
      ])
      setUser(userData)
      setRepos(repoData)
      setStatus('success')
    } catch (err) {
      if (err.name === 'AbortError') return
      setStatus('error')
      setError(err.message || 'Something went wrong.')
    }
  }

  const loading = status === 'loading'

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_60%)]">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Git<span className="text-emerald-400">Finder</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Look up any GitHub profile and explore their latest work.
          </p>
        </header>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={search}
          loading={loading}
        />
        <Suggestions
          users={suggestions}
          onPick={search}
          onShuffle={() => setSuggestions(pickRandom(3))}
          disabled={loading}
        />

        <div className="mt-10" aria-live="polite">
          {loading && <LoadingSkeleton />}

          {status === 'error' && (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300"
            >
              {error}
            </div>
          )}

          {status === 'success' && user && (
            <div className="space-y-10">
              <ProfileCard user={user} />

              <section>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Latest repositories
                  </h2>
                  <a
                    href={`${user.html_url}?tab=repositories`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-400 hover:text-emerald-400"
                  >
                    View all →
                  </a>
                </div>

                {repos.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {repos.map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
                    This user has no public repositories yet.
                  </p>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
