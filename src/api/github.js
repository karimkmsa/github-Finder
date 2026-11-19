const BASE_URL = 'https://api.github.com'
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN

// Simple in-memory cache so repeated searches don't burn the (small)
// unauthenticated rate limit of 60 requests per hour.
const cache = new Map()

export class GitHubError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'GitHubError'
    this.status = status
  }
}

async function request(path, signal) {
  if (cache.has(path)) return cache.get(path)

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new GitHubError('Network error. Check your connection and try again.')
  }

  if (!res.ok) {
    const rateLimited =
      (res.status === 403 || res.status === 429) &&
      res.headers.get('x-ratelimit-remaining') === '0'

    if (rateLimited) {
      const reset = Number(res.headers.get('x-ratelimit-reset'))
      const time = reset
        ? new Date(reset * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'a little while'
      throw new GitHubError(
        `GitHub API rate limit reached. Try again after ${time}.`,
        429,
      )
    }
    if (res.status === 404) throw new GitHubError('User not found.', 404)
    throw new GitHubError(`GitHub request failed (${res.status}).`, res.status)
  }

  const data = await res.json()
  cache.set(path, data)
  return data
}

// GitHub usernames: alphanumeric or single hyphens, can't start/end with a
// hyphen, max 39 characters.
const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export function isValidUsername(username) {
  return USERNAME_RE.test(username)
}

export function getUser(username, signal) {
  return request(`/users/${encodeURIComponent(username)}`, signal)
}

// Most recently pushed-to repositories first.
export function getLatestRepos(username, count = 6, signal) {
  return request(
    `/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=${count}`,
    signal,
  )
}

// Returns the top languages of a repo as [{ name, percent }], biggest first.
export async function getRepoLanguages(owner, repo, limit = 4, signal) {
  const bytes = await request(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    signal,
  )
  const total = Object.values(bytes).reduce((sum, n) => sum + n, 0)
  if (!total) return []

  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, size]) => ({ name, percent: (size / total) * 100 }))
}
