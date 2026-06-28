# github-profile-viewer

Search any GitHub user and browse their profile and repositories.

Uses the public GitHub REST API (no auth required, 60 req/h unauthenticated).

## Features

- User profile: avatar, bio, stats, location
- Repository list with stars, forks, language
- Sort repos by stars, forks, or last updated
- Language filter
- Click through to the repo on GitHub

## Run

```bash
npm install && npm run dev
```

Rate-limited to 60 requests/hour without a token. Add a personal access token in the settings to raise it to 5000/hour.
