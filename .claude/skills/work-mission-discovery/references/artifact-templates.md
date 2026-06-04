# Artifact Templates

Use these templates when creating work discovery artifacts. Keep them concise and current-state oriented.

## environment-state.md

```md
# Environment State

## Work Root

- Path:
- Reason:
- Folder rule:

## Current Repo

| Field | Value |
| --- | --- |
| Local path | |
| GitHub remote | |
| Current branch | |
| Default branch | |
| Repo purpose | |

## Tool Access

| Tool | Status | Evidence |
| --- | --- | --- |
| AI CLI | Todo | |
| git | Todo | |
| gh | Todo | |
| GitHub account | Todo | |
| GitHub auth | Todo | |

## Local And Remote Model

- Local repo:
- GitHub remote:
- Commit:
- Push:
- Pull:

## Git Loop Practice

| Step | Status | Evidence |
| --- | --- | --- |
| Check current folder | Todo | |
| Check status | Todo | |
| Edit safe file | Todo | |
| Stage change | Todo | |
| Commit change | Todo | |
| Push change | Todo | |
| Explain pull | Todo | |

## HTML Visualizations

| File | Purpose | Status |
| --- | --- | --- |
| workspace-map.html | Local work root and repo layout | Optional |
| git-local-remote.html | Local repo and GitHub remote relationship | Optional |
| git-cycle.html | Git edit/status/add/commit/push/pull loop | Optional |
| repo-dashboard.html | Current repo state snapshot | Optional |

## Exceptions

## Next Environment Action
```

## workspace-map.html

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Workspace Map</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 32px; color: #202124; }
    main { max-width: 900px; margin: 0 auto; }
    .tree { border: 1px solid #d9dee3; border-radius: 8px; padding: 20px; background: #f8fafb; }
    .folder { margin: 10px 0 10px 24px; }
    .root { margin-left: 0; font-weight: 700; }
    code { background: #eef2f6; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>Workspace Map</h1>
    <p>AI work happens under one predictable local root.</p>
    <section class="tree" aria-label="Workspace folder tree">
      <div class="folder root"><code>~/Documents/AI-Work/</code></div>
      <div class="folder"><code>&lt;github-org-or-user&gt;/</code></div>
      <div class="folder"><code>&lt;repo-name&gt;/</code></div>
      <div class="folder"><code>personal/</code></div>
      <div class="folder"><code>inbox/</code></div>
      <div class="folder"><code>archive/</code></div>
    </section>
  </main>
</body>
</html>
```

## git-local-remote.html

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Local And Remote</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 32px; color: #202124; }
    main { max-width: 900px; margin: 0 auto; }
    .flow { display: grid; grid-template-columns: 1fr 160px 1fr; gap: 16px; align-items: center; }
    .box { border: 1px solid #d9dee3; border-radius: 8px; padding: 20px; background: #f8fafb; }
    .arrow { text-align: center; font-family: ui-monospace, monospace; }
  </style>
</head>
<body>
  <main>
    <h1>Local And Remote</h1>
    <section class="flow" aria-label="Local remote Git relationship">
      <div class="box"><h2>Local repo</h2><p>The folder on your computer.</p></div>
      <div class="arrow">push -&gt;<br>&lt;- pull</div>
      <div class="box"><h2>GitHub remote</h2><p>The repo on GitHub.</p></div>
    </section>
  </main>
</body>
</html>
```

## git-cycle.html

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Git Cycle</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 32px; color: #202124; }
    main { max-width: 920px; margin: 0 auto; }
    ol { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; padding: 0; list-style: none; }
    li { border: 1px solid #d9dee3; border-radius: 8px; padding: 16px; background: #f8fafb; }
    strong { display: block; margin-bottom: 6px; }
  </style>
</head>
<body>
  <main>
    <h1>Git Cycle</h1>
    <ol>
      <li><strong>edit</strong>Change files locally.</li>
      <li><strong>status</strong>See what changed.</li>
      <li><strong>add</strong>Choose changes for commit.</li>
      <li><strong>commit</strong>Save a local checkpoint.</li>
      <li><strong>push</strong>Send commits to GitHub.</li>
      <li><strong>pull</strong>Bring GitHub changes back.</li>
    </ol>
  </main>
</body>
</html>
```

## repo-dashboard.html

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Repo Dashboard</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 32px; color: #202124; }
    main { max-width: 860px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #d9dee3; padding: 12px; text-align: left; }
    th { width: 180px; background: #f8fafb; }
  </style>
</head>
<body>
  <main>
    <h1>Repo Dashboard</h1>
    <table>
      <tr><th>Local path</th><td></td></tr>
      <tr><th>Remote</th><td></td></tr>
      <tr><th>Branch</th><td></td></tr>
      <tr><th>Status</th><td></td></tr>
      <tr><th>Next action</th><td></td></tr>
    </table>
  </main>
</body>
</html>
```

## interview-state.md

```md
# Interview State

## Current Phase

## Last Confirmed Summary

## Decisions

## Open Questions

## Next Question

## Completion Checklist

| Condition | Status | Evidence |
| --- | --- | --- |
| Role and responsibility summarized | Todo | |
| Outcomes defined | Todo | |
| Work areas mapped | Todo | |
| One work area decomposed | Todo | |
| Candidate tasks classified | Todo | |
| Candidates scored | Todo | |
| First mission accepted | Todo | |
| Scope recorded | Todo | |
| Verification method defined | Todo | |
```

## automation-brief.md

```md
# Automation Brief

## Role

## Outcomes

## Stakeholders

## Work Areas

| Area | Outcome Link | Frequency | Current Pain |
| --- | --- | --- | --- |

## Candidate Tasks

| Candidate | Type | Inputs | Output | Verification | Risk | Priority |
| --- | --- | --- | --- | --- | --- | --- |

## Recommended First Mission

## Open Questions
```

## work-map.md

```md
# Work Map

## Role And Responsibility

## Outcomes

## Work Areas

| Area | Outcome Link | Frequency | Current Pain | Status |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Workflow Decomposition

Stop decomposing a task when trigger, inputs, steps, output, decision point, completion evidence, automation type, and risk are all known. Keep decomposing broad verbs such as "관리", "처리", "검토", "운영", "분석", or "정리" until that evidence exists.

| Area | Task | Trigger | Inputs | Steps | Output | Human Decision | Evidence | Automation Type | Risk | Candidate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |

## CLI Summary View

```text
역할 → 성과 → 업무 영역 → 실행 작업 → 자동화 후보
```

## Board View

- `내 업무 현황`: role, outcomes, work areas.
- `생성되는 작업 지도`: workflow decomposition table rendered as trigger → inputs → steps → output → evidence.
- `작업 현황 보드`: mission-backlog candidates grouped by status.
```

## ontology-seeds.md

```md
# Ontology Seeds

## Entities

| Entity | Description | Examples |
| --- | --- | --- |

## Relations

| Source | Relation | Target | Notes |
| --- | --- | --- | --- |

## States

| Entity | State | Meaning |
| --- | --- | --- |

## Rules

| Rule | Authority | Verification |
| --- | --- | --- |

## Inputs And Outputs

| Work Item | Inputs | Outputs |
| --- | --- | --- |
```

## mission-backlog.md

```md
# Mission Backlog

| ID | Mission | Type | Value | Risk | Verification | Status | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Recommended Order

1. M001 ...

## Deferred

## Not In Scope
```

## missions/M001-<slug>.md

```md
# M001: <Mission Name>

## Goal

## Current Workflow

## Automate This

## Inputs

## Output

## Included

## Excluded

## Assumptions

| Assumption | Status | Fallback |
| --- | --- | --- |

## Verification

## First Implementation Step
```

## logs/<date>-mission-discovery.md

```md
# Mission Discovery Log

## Session Goal

## User Answers

## Decisions

## Alternatives Considered

## Open Questions

## Next Step
```
