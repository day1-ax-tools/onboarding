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

## meta-monitor/briefing-board.html

Meta Monitor runtime templates live in the separate repo:

```text
https://github.com/day1-ax-tools/meta-monitor
```

Use the upstream runtime by default. Keep this section only as a fallback reference when network access is unavailable or the user explicitly asks to generate a local placeholder.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Meta Monitor Briefing Board</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; color: #202124; background: #f5f7fa; }
    main { max-width: 1080px; margin: 0 auto; padding: 32px; }
    header { margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
    .panel { border: 1px solid #d9dee3; border-radius: 8px; padding: 16px; background: #fff; }
    .wide { grid-column: 1 / -1; }
    h1, h2 { margin: 0 0 10px; }
    h1 { font-size: 28px; }
    h2 { font-size: 16px; }
    p, li { line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #e6eaee; padding: 10px; text-align: left; vertical-align: top; }
    .badge { display: inline-block; border: 1px solid #cfd6dd; border-radius: 999px; padding: 4px 10px; background: #f8fafb; }
    .scope { border-color: #b7d7c6; background: #f0fbf5; color: #174d31; }
    .tui { border-radius: 8px; background: #111827; color: #e5e7eb; padding: 16px; font-family: ui-monospace, Menlo, Consolas, monospace; overflow-x: auto; }
    .tui .prompt { color: #6ee7b7; }
    .input, .settings { display: grid; gap: 10px; }
    textarea, select, input { width: 100%; border: 1px solid #d9dee3; border-radius: 8px; padding: 10px 12px; font: 14px/1.5 ui-monospace, Menlo, Consolas, monospace; }
    textarea { min-height: 120px; resize: vertical; }
    label { display: grid; gap: 4px; color: #525960; font-size: 13px; }
    button { width: fit-content; border: 1px solid #202124; border-radius: 6px; background: #202124; color: #fff; padding: 8px 12px; font: 600 13px/1 system-ui, sans-serif; }
    .viz-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .viz-card { border: 1px dashed #c9d1d9; border-radius: 8px; padding: 14px; background: #fbfcfd; }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="badge">Last updated: </p>
      <p class="badge scope">Write scope: meta-monitor/** only</p>
      <h1>Meta Monitor Briefing Board</h1>
      <p>Monitor TUI, settings, question handoff, current phase, evidence, risks, and visualizations.</p>
    </header>
    <section class="grid">
      <div class="panel wide">
        <h2>Monitor TUI</h2>
        <pre class="tui"><span class="prompt">meta-monitor@repo %</span> observing visible work content

Status:
- Phase:
- Last answer:
- Waiting for:

Write boundary:
- Allowed: meta-monitor/**
- Excluded: product code, mission specs, main state files, Git history, hidden model reasoning</pre>
      </div>
      <div class="panel wide input">
        <h2>Ask The Monitor</h2>
        <textarea id="monitor-question">현재 작업 현황과 다음 행동을 요약해주세요.</textarea>
        <button type="button" onclick="submitQuestion()">Submit</button>
        <p id="question-status" role="status" aria-live="polite"></p>
        <p>Submit sends the question to the local bridge endpoint <code>/api/questions</code>. The bridge writes it to <code>meta-monitor/questions.jsonl</code>, and the monitor CLI reads that queue before writing its answer back to <code>meta-monitor/meta-advice.md</code>, <code>meta-monitor/session-data.jsonl</code>, and this Briefing Board.</p>
      </div>
      <div class="panel wide settings">
        <h2>Monitor Settings</h2>
        <label>Provider
          <select id="provider"><option>openai</option><option>anthropic</option><option>local</option></select>
        </label>
        <label>Model
          <input id="model" value="gpt-5-codex">
        </label>
        <label>Effort
          <select id="effort"><option>medium</option><option>low</option><option>high</option></select>
        </label>
        <label>Language source
          <select id="language-source"><option value="main-session-input">main-session-input</option><option value="fixed">fixed</option></select>
        </label>
        <label>Current language
          <select id="language-current"><option value="ko">ko - Korean</option><option value="en">en - English</option></select>
        </label>
        <label>Fallback language
          <select id="language-fallback"><option value="en">en - English</option><option value="ko">ko - Korean</option></select>
        </label>
        <label>Context window tokens
          <input id="context-window" type="number" value="200000">
        </label>
        <label>Context soft limit ratio
          <input id="context-soft-limit" type="number" min="0.1" max="0.95" step="0.05" value="0.7">
        </label>
        <label>Fast mode
          <select id="fast-mode"><option value="false">false</option><option value="true">true</option></select>
        </label>
        <textarea id="settings-json">{
  "version": 1,
  "enabled": true,
  "activation": "explicit",
  "provider": "openai",
  "model": "gpt-5-codex",
  "effort": "medium",
  "language": {
    "source": "main-session-input",
    "current": "ko",
    "fallback": "en"
  },
  "contextWindowTokens": 200000,
  "contextSoftLimitRatio": 0.7,
  "fastMode": false,
  "questionTransport": {
    "type": "local-http-bridge",
    "endpoint": "/api/questions",
    "queue": "meta-monitor/questions.jsonl"
  },
  "design": {
    "source": "main-session-provider",
    "provider": "openai",
    "reference": "DESIGN.md"
  },
  "writeScope": ["meta-monitor/**"],
  "readScope": ["**"],
  "briefingBoard": "meta-monitor/briefing-board.html",
  "sessionData": "meta-monitor/session-data.jsonl",
  "handoff": "meta-monitor/session-handoff.md"
}</textarea>
        <button type="button" onclick="navigator.clipboard && navigator.clipboard.writeText('meta-monitor/settings.json을 아래 JSON으로 갱신해주세요.\n\n' + document.getElementById('settings-json').value)">Copy settings apply prompt</button>
      </div>
      <div class="panel">
        <h2>Current Phase</h2>
        <p></p>
      </div>
      <div class="panel">
        <h2>Current Goal</h2>
        <p></p>
      </div>
      <div class="panel">
        <h2>Next Action</h2>
        <p></p>
      </div>
      <div class="panel wide">
        <h2>Progress</h2>
        <table>
          <tr><th>Step</th><th>Status</th><th>Evidence</th></tr>
          <tr><td>Work Environment Setup</td><td></td><td></td></tr>
          <tr><td>Work Grounding</td><td></td><td></td></tr>
          <tr><td>Automation Exploration</td><td></td><td></td></tr>
          <tr><td>Mission Execution</td><td></td><td></td></tr>
        </table>
      </div>
      <div class="panel">
        <h2>Decisions</h2>
        <ul><li></li></ul>
      </div>
      <div class="panel">
        <h2>Open Questions</h2>
        <ul><li></li></ul>
      </div>
      <div class="panel">
        <h2>Risks</h2>
        <ul><li></li></ul>
      </div>
      <div class="panel wide">
        <h2>Artifact State</h2>
        <table>
          <tr><th>Artifact</th><th>Status</th><th>Signal</th></tr>
          <tr><td>environment-state.md</td><td></td><td></td></tr>
          <tr><td>interview-state.md</td><td></td><td></td></tr>
          <tr><td>automation-brief.md</td><td></td><td></td></tr>
          <tr><td>mission-backlog.md</td><td></td><td></td></tr>
          <tr><td>git status</td><td></td><td></td></tr>
        </table>
      </div>
      <div class="panel wide">
        <h2>Visualizations</h2>
        <div class="viz-grid">
          <div class="viz-card">
            <strong>Work Map</strong>
            <p>Write to <code>meta-monitor/visualizations/work-map-dashboard.html</code> when role, outcomes, or work areas need a visual map.</p>
          </div>
          <div class="viz-card">
            <strong>Mission Backlog</strong>
            <p>Write to <code>meta-monitor/visualizations/mission-dashboard.html</code> when mission priorities need comparison.</p>
          </div>
          <div class="viz-card">
            <strong>Decision Map</strong>
            <p>Write to <code>meta-monitor/visualizations/decision-map.html</code> when tradeoffs or dependencies are complex.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <script>
    function syncSettings() {
      const settings = {
        version: 1,
        enabled: true,
        activation: "explicit",
        provider: document.getElementById("provider").value,
        model: document.getElementById("model").value,
        effort: document.getElementById("effort").value,
        language: {
          source: document.getElementById("language-source").value,
          current: document.getElementById("language-current").value,
          fallback: document.getElementById("language-fallback").value
        },
        contextWindowTokens: Number(document.getElementById("context-window").value),
        contextSoftLimitRatio: Number(document.getElementById("context-soft-limit").value),
        fastMode: document.getElementById("fast-mode").value === "true",
        questionTransport: {
          type: "local-http-bridge",
          endpoint: "/api/questions",
          queue: "meta-monitor/questions.jsonl"
        },
        design: {
          source: "main-session-provider",
          provider: "openai",
          reference: "DESIGN.md"
        },
        writeScope: ["meta-monitor/**"],
        readScope: ["**"],
        briefingBoard: "meta-monitor/briefing-board.html",
        sessionData: "meta-monitor/session-data.jsonl",
        handoff: "meta-monitor/session-handoff.md"
      };
      document.getElementById("settings-json").value = JSON.stringify(settings, null, 2);
    }
    document.querySelectorAll("#provider,#model,#effort,#language-source,#language-current,#language-fallback,#context-window,#context-soft-limit,#fast-mode").forEach((node) => {
      node.addEventListener("input", syncSettings);
      node.addEventListener("change", syncSettings);
    });
    async function submitQuestion() {
      const status = document.getElementById("question-status");
      const question = document.getElementById("monitor-question").value.trim();
      if (!question) {
        status.textContent = "Question is empty";
        return;
      }
      if (window.location.protocol === "file:") {
        status.textContent = "Start bridge first";
        return;
      }
      try {
        const response = await fetch("/api/questions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question, source: "briefing-board", createdAt: new Date().toISOString() })
        });
        status.textContent = response.ok ? "Submitted" : "Bridge unavailable";
      } catch (_) {
        status.textContent = "Bridge unavailable";
      }
    }
  </script>
</body>
</html>
```

## meta-monitor/settings.json

```json
{
  "version": 1,
  "enabled": true,
  "activation": "explicit",
  "provider": "openai",
  "model": "gpt-5-codex",
  "effort": "medium",
  "language": {
    "source": "main-session-input",
    "current": "ko",
    "fallback": "en"
  },
  "contextWindowTokens": 200000,
  "contextSoftLimitRatio": 0.7,
  "fastMode": false,
  "questionTransport": {
    "type": "local-http-bridge",
    "endpoint": "/api/questions",
    "queue": "meta-monitor/questions.jsonl"
  },
  "design": {
    "source": "main-session-provider",
    "provider": "openai",
    "reference": "DESIGN.md"
  },
  "writeScope": ["meta-monitor/**"],
  "readScope": ["**"],
  "briefingBoard": "meta-monitor/briefing-board.html",
  "sessionData": "meta-monitor/session-data.jsonl",
  "handoff": "meta-monitor/session-handoff.md"
}
```

## meta-monitor/monitor-state.json

```md
# Monitor State

## Last Checked

- Time:
- Repo:
- Branch:

## Observed Sources

| Source | Status | Signal |
| --- | --- | --- |
| visible work content | Unavailable/Todo/Read | |
| visible session history or exported transcript | Unavailable/Todo/Read | |
| executed commands and tool outputs | Unavailable/Todo/Read | |
| file changes and generated artifacts | Unavailable/Todo/Read | |
| hidden model reasoning | Excluded | Excluded to preserve monitor independence |
| environment-state.md | Missing/Todo/Read | |
| interview-state.md | Missing/Todo/Read | |
| automation-brief.md | Missing/Todo/Read | |
| mission-backlog.md | Missing/Todo/Read | |
| logs/ | Missing/Todo/Read | |
| git status --short | Todo/Read | |
| git diff --stat | Todo/Read | |

## Current Read

- Current phase:
- Main goal:
- Latest confirmed facts:
- Next expected action:

## Progress

| Area | Status | Evidence |
| --- | --- | --- |

## Risks

## Stuck Points

## Dashboard Files

## Context

- Context window tokens:
- Current usage ratio:
- Soft limit ratio:
- Handoff required: No

## Write Scope

- Allowed:
  - meta-monitor/**
- Not allowed unless the user explicitly changes the boundary:
  - product code
  - mission specs
  - environment-state.md
  - interview-state.md
  - automation-brief.md
  - mission-backlog.md
  - Git history
  - files outside meta-monitor/
```

## meta-monitor/session-data.jsonl

```jsonl
{"timestamp":"","sessionRole":"meta-monitor","eventType":"observe","contextUsageRatio":0,"sourcesRead":[],"artifactsWritten":[],"questionRef":"","answerRef":"","valueSignals":[],"featureCandidates":[]}
```

## meta-monitor/session-handoff.md

```md
# Meta Monitor Session Handoff

## Freshness

- Updated at:
- Context usage ratio:
- Settings ref: meta-monitor/settings.json
- Monitor state ref: meta-monitor/monitor-state.json
- Advice ref: meta-monitor/meta-advice.md
- Session data ref: meta-monitor/session-data.jsonl

## Current State

- Current phase:
- Current question:
- Next monitor action:

## References To Re-read

| Purpose | Ref | Required |
| --- | --- | --- |
| Environment | environment-state.md | Yes |
| Interview | interview-state.md | If present |
| Mission backlog | mission-backlog.md | If present |
| Latest monitor state | meta-monitor/monitor-state.json | Yes |
| Latest advice | meta-monitor/meta-advice.md | Yes |

## Stale Reference Check

Remove any item whose source file no longer exists or no longer supports the claim.

## Do Not Carry Over

- Hidden model reasoning
- Long copied transcripts
- Old handoff files
```

## meta-monitor/questions.jsonl

```jsonl
{"id":"question-001","timestamp":"","source":"briefing-board","question":"현재 작업 현황과 다음 행동을 요약해주세요."}
```

## meta-monitor/meta-advice.md

```md
# Meta Advice

## Summary

## Advice For Main Session

## Questions To Ask User

## Risks To Check

## Visualizations Needed

## Evidence

| Claim | Source |
| --- | --- |
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

### <Work Area>

- Trigger:
- Inputs:
- Steps:
- Output:
- Tools:
- Decision points:
- Completion evidence:
- Pain points:
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

| ID | Mission | Type | Value | Risk | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |

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
