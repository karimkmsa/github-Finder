# GitFinder

A GitHub profile finder built with **React + Vite + Tailwind CSS v4**, powered by the public GitHub REST API.

## Features

- Search any GitHub user by username
- 3 random suggested users (with a Shuffle button)
- Profile view: avatar, name, username, bio, total repositories / followers / following
- Cards for the 6 most recently pushed repositories: name, description, stars and main languages (with a percentage bar)
- Loading skeletons, friendly error states (user not found, invalid username, rate limit)

## Run it

```bash
npm install
npm run dev
```

## Rate limits

Unauthenticated GitHub API calls are limited to 60/hour. Each search uses about 8 calls
(1 profile + 1 repo list + 1 per repo for languages). Responses are cached in memory.

To raise the limit to 5,000/hour, copy `.env.example` to `.env` and add a
token with no scopes. Note that `VITE_` variables are bundled into the browser build, so only
use this locally.

## Structure

```
src/
  api/github.js          API calls, cache, error handling
  components/            SearchBar, Suggestions, ProfileCard, RepoCard, LoadingSkeleton
  utils/                 formatting + language colors
  App.jsx                state and layout
```
