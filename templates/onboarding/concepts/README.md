# Dynamic Concept Board

`brief-board.html` can render a current, user-specific concept explanation from this file:

```text
.onboarding/concepts/current-concept.json
```

The concept file is display data only. The source of truth remains the real repo state and markdown artifacts such as `environment-state.md`, `work-map.md`, `mission-backlog.md`, and `automation-brief.md`.

Use this when the CLI is explaining a concept that depends on the user's current situation: current folder, local repo, GitHub remote, commit/push/pull, workflow decomposition, mission scope, or a decision map.

Rules:

- Do not store hidden reasoning.
- Do not store secrets, tokens, private chat traces, or credentials.
- Include `sourceRefs` so stale explanations can be detected.
- Refresh `updatedAt` whenever the explanation changes.
- Prefer structured `nodes`, `edges`, and `rows` over raw HTML.

Minimal shape:

```json
{
  "version": 1,
  "id": "git-local-remote-current",
  "label": "현재 설명",
  "type": "step-flow",
  "title": "local에서 만든 commit은 push 후 GitHub remote에도 존재합니다",
  "description": "현재 repo 기준으로 local에서 commit을 만들고, push 후 remote history에도 같은 commit이 반영되는 순서를 보여줍니다.",
  "updatedAt": "2026-06-04T00:00:00.000Z",
  "sourceRefs": ["environment-state.md", "git status", "git remote -v"],
  "nodes": [
    { "id": "edit", "label": "1. Edit", "detail": "파일 수정", "lane": "local", "status": "done" },
    { "id": "commit", "label": "3. Commit", "detail": "history 기록", "lane": "local", "status": "current" },
    { "id": "remote", "label": "GitHub", "detail": "remote repo", "lane": "remote" }
  ],
  "edges": [
    { "from": "edit", "to": "commit", "label": "status/add" },
    { "from": "commit", "to": "remote", "label": "push" }
  ],
  "rows": [
    ["local repo", "내 컴퓨터에 있는 작업 폴더"],
    ["remote repo", "GitHub에 있는 연결 저장소"]
  ],
  "note": "commit은 repo history의 기록 단위입니다. local에서 만들 수도 있고, push 후 remote에도 같은 commit이 존재할 수 있습니다."
}
```
