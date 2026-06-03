# Board Contract

Use this contract for `.concept-board/concept-state.json`. Keep the file small enough to load repeatedly.

## Minimal Shape

```json
{
  "version": 1,
  "updatedAt": "2026-06-03T00:00:00.000Z",
  "language": "ko",
  "repo": {
    "root": "/absolute/repo/path",
    "name": "repo-name",
    "branch": "main",
    "remote": "https://github.com/org/repo.git",
    "commit": "optional-short-hash"
  },
  "session": {
    "label": "current work session",
    "tool": "codex|claude|unknown",
    "source": "user-visible transcript, repo docs, or local artifacts"
  },
  "activeLens": "git-sync",
  "concepts": [],
  "sourceRefs": []
}
```

## Concept Shape

```json
{
  "id": "git-sync",
  "title": "Local repo and GitHub remote",
  "summary": "Short user-facing explanation.",
  "visual": "flow",
  "status": "current|stale|blocked|draft",
  "nodes": [
    {
      "id": "local",
      "label": "Local repo",
      "kind": "repo",
      "status": "current",
      "sourceRefs": ["git-status"]
    }
  ],
  "edges": [
    {
      "from": "local",
      "to": "remote",
      "label": "push",
      "direction": "one-way"
    }
  ],
  "table": [
    {
      "term": "commit",
      "meaning": "A local saved change point."
    }
  ],
  "notes": ["Use pull before comparing with remote if remote state is unknown."]
}
```

## Source References

```json
{
  "id": "git-status",
  "path": ".",
  "kind": "command|file|user-summary",
  "label": "git status --short",
  "observedAt": "2026-06-03T00:00:00.000Z",
  "exists": true,
  "staleWhenMissing": true
}
```

Rules:

- Use stable ids such as `git-status`, `readme`, `work-map`, or `mission-backlog`.
- Prefer file paths and command labels over copying long content into the board state.
- Mark a concept `stale` when a required source reference no longer exists.
- Do not store secrets, access tokens, private browser contents, or hidden reasoning traces.
