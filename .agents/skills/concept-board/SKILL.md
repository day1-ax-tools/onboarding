---
name: concept-board
description: Create or update a repo-aware visual concept board for a local work repository or CLI session. Use when the user wants to understand a repo, Git/local-remote flow, current branch/work state, workflow map, decision map, architecture/data flow, automation candidates, or session context through HTML/SVG/table visualizations stored under .concept-board/.
---

# Concept Board

Use this skill to turn a repo or session context into a lightweight visual board. Treat the board as an explanatory projection, not as the source of truth.

## Operating Rules

- Match the user's language unless they ask otherwise.
- Write only inside `.concept-board/` by default.
- Do not modify source code, project docs, Git remotes, branches, commits, or onboarding files unless the user explicitly asks.
- If an onboarding brief board exists, leave it in place. This skill is reusable outside onboarding and should not replace `.onboarding/brief-board.html`.
- Use current repo artifacts as authority: Git state, project docs, work-map files, mission files, architecture docs, and user-visible conversation summaries.
- Do not store hidden reasoning traces. Store user-visible decisions, summaries, evidence, and source references.
- Prefer diagrams, graphs, tables, lanes, matrices, and trees over text-only boxes.
- Refresh `updatedAt` whenever the board state or HTML is regenerated.
- Keep source references so stale board content can be detected later.

## Workflow

1. Confirm the board scope in plain terms: repo map, Git flow, decision map, work map, architecture, automation candidates, or session recap.
2. Inspect the current context with safe read-only commands when available:

```bash
pwd
git rev-parse --show-toplevel
git branch --show-current
git remote -v
git status --short
```

3. Read only relevant local files such as `AGENTS.md`, `CLAUDE.md`, `README.md`, `work-map.md`, `mission-backlog.md`, `automation-brief.md`, `missions/*.md`, architecture docs, or `.onboarding/board-data.json`.
4. Choose a visual lens using `references/visual-patterns.md`.
5. Create or update:

```text
.concept-board/
  concept-state.json
  index.html
  snapshots/        # optional exported screenshots or dated captures
```

6. Validate `concept-state.json` with a JSON parser.
7. Open or verify `index.html` when a browser is available; otherwise verify the HTML contains the expected sections and no obvious layout-breaking text.
8. Report the board path, the sources used, and any stale or missing source references.

## Output Contract

Read `references/board-contract.md` before writing `concept-state.json` or designing the HTML renderer.

Use `.concept-board/concept-state.json` as display data only. The source of truth remains the repo, Git state, project docs, and user-approved session artifacts.

## Good Requests

```text
$concept-board 현재 repo의 Git local/remote 흐름을 시각화해줘.
$concept-board 이번 작업의 decision map을 만들어줘.
$concept-board work-map.md와 mission-backlog.md를 기반으로 자동화 후보 보드를 만들어줘.
$concept-board 이 repo의 architecture/data flow를 HTML 보드로 보여줘.
```
