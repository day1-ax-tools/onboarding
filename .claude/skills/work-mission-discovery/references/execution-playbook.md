# Execution Playbook

Use this when the user needs an end-to-end, interruption-resistant onboarding experience.

## Installation Flow

Default to project-level installation. Avoid global installation during onboarding unless the user explicitly wants the behavior across all repositories.

### Codex

1. Install project instructions:

   ```bash
   cp templates/AGENTS.md AGENTS.md
   ```

2. Install project skill:

   ```bash
   mkdir -p .agents/skills
   cp -R /path/to/onboarding/.agents/skills/work-mission-discovery .agents/skills/
   ```

3. Verify:

   ```text
   $work-mission-discovery 를 사용해서 현재 적용된 지침과 다음 질문을 요약해주세요.
   ```

Expected: Codex uses AGENTS.md guidance and the skill's Work Grounding flow.

### Claude Code

1. Install project memory:

   ```bash
   cp templates/CLAUDE.md CLAUDE.md
   ```

2. If both Codex and Claude Code are used, install `AGENTS.md` too. `CLAUDE.md` imports it with `@AGENTS.md`.

3. Install project skill:

   ```bash
   mkdir -p .claude/skills
   cp -R /path/to/onboarding/.claude/skills/work-mission-discovery .claude/skills/
   ```

4. Verify:

   ```text
   work-mission-discovery skill을 사용해서 현재 인터뷰 상태를 확인해주세요.
   ```

Expected: Claude Code selects the skill from `.claude/skills`. Skills are model-invoked, not slash commands.

## Work Environment Setup Flow

Use this before Work Grounding when the user is new to AI CLI work, has not chosen a local workspace, or cannot explain how the local repo relates to GitHub.

Goal: the user knows where AI work happens on their computer, how that folder connects to GitHub, and how to repeat the first Git loop without losing context.

### 1. Confirm Terminal Context

Check the current folder and installed tools:

```bash
pwd
git --version
gh --version
gh auth status
```

Also verify the selected AI CLI with the product's normal version or doctor command. Do not move on silently if `git`, `gh`, or authentication is missing. Explain the missing piece in plain outcome terms.

### 2. Choose Local Work Root

Default recommendation:

```text
~/Documents/AI-Work/
```

Windows equivalent:

```text
C:\Users\<user>\Documents\AI-Work\
```

Recommended layout:

```text
AI-Work/
  <github-org-or-user>/
    <repo-name>/
  personal/
  inbox/
  archive/
```

Explain the rule:

```text
One GitHub repo gets one local folder.
Temporary files go to inbox.
Old experiments go to archive.
```

### 3. Teach Local And Remote

Use this model:

```text
Local repo on my computer  <-- pull --  GitHub remote repo
          |
        commit
          |
        push ---------------------> GitHub remote repo
```

Say it in plain language:

```text
The local repo is the folder you and the AI edit.
The remote repo is the GitHub copy used for backup, collaboration, issues, and PRs.
They are connected, but they do not sync automatically.
```

If the user is confused, create `git-local-remote.html` and open it in the browser.

### 4. Place The First Repo

Use one of these paths:

| Situation | Action |
| --- | --- |
| Repo already exists on GitHub | Clone it under the work root |
| Files exist locally but no remote exists | Create a GitHub repo, connect it as `origin`, then push |
| Repo exists locally outside the work root | Either move it under the work root or record the exception in `environment-state.md` |
| User is only practicing | Create a small private practice repo |

Before editing, check:

```bash
git status
git remote -v
git branch --show-current
```

### 5. Practice The Git Loop

Use a harmless file such as `README.md` or `onboarding-notes.md`.

```text
edit -> status -> add -> commit -> push -> pull
```

The user should see:

- what changed;
- what got staged;
- what the commit message means;
- where the pushed commit appears on GitHub;
- why pull brings remote changes back.

### 6. Save Environment State

Create or update:

```text
environment-state.md
```

Record the work root, current repo path, remote URL, current branch, GitHub auth state, folder rules, Git loop evidence, and any exceptions.

### 7. Optional HTML Visualizations

Create these only when they help the user's understanding:

| File | Purpose |
| --- | --- |
| `workspace-map.html` | Show the user's local work root and repo folders |
| `git-local-remote.html` | Explain local repo vs GitHub remote |
| `git-cycle.html` | Explain edit, status, add, commit, push, pull |
| `repo-dashboard.html` | Summarize current path, remote, branch, and dirty state |

Work Environment Setup is done when the user has a work root, verified GitHub auth, a repo in a known location, a connected remote, one demonstrated Git loop, and a saved `environment-state.md`.

## Continuity Flow

Use files as the source of continuity, not chat memory alone.

At the end of each phase, after 3-5 Q&A rounds, or before stopping, update:

```text
environment-state.md
interview-state.md
logs/<YYYY-MM-DD>-mission-discovery.md
automation-brief.md
mission-backlog.md
```

On resume:

1. Read `environment-state.md` if it exists.
2. Read `interview-state.md` if it exists.
3. Read `automation-brief.md` if it exists.
4. Read `mission-backlog.md` if it exists.
5. Read the latest `logs/*.md`.
6. Summarize current phase, confirmed facts, open questions, and next question.
7. Ask exactly the next smallest useful question.

Do not restart from role definition if `interview-state.md` shows a later phase.

## Meta Monitoring Flow

Use this optional flow only after the user explicitly asks for a meta monitor, Briefing Board, second CLI oversight, or monitor Q&A. Do not activate it automatically.

Default implementation choice:

```text
v1: onboarding skill + separate day1-ax-tools/meta-monitor runtime
v2: plugin for bundled install and shared assets
v3: MCP for live session bridge, settings persistence, and context telemetry
```

Start with the separate runtime repo path unless the user explicitly asks to design or install plugin/MCP infrastructure. Do not generate Meta Monitor runtime files from scratch inside onboarding; install or copy them from `https://github.com/day1-ax-tools/meta-monitor`.

### 1. Prepare Shared State

The repo must be onboarded before the monitor can operate. Check:

```text
AGENTS.md or CLAUDE.md
.agents/skills/work-mission-discovery/ or .claude/skills/work-mission-discovery/
environment-state.md if Work Environment Setup has started
```

If onboarding is missing, install or repair onboarding first.

The main session should expose enough work content before the monitor starts. The monitor should be able to observe all user-visible work content available to the same local user: chat transcript, session log, commands, tool outputs, file changes, generated artifacts, and Git state. Hidden model reasoning is intentionally excluded so the monitor remains an independent observer.

If visible work content is not accessible directly, the main session must save enough context in files:

```text
meta-monitor/main-session-events.jsonl
environment-state.md
interview-state.md
automation-brief.md
mission-backlog.md
logs/<YYYY-MM-DD>-mission-discovery.md
```

If neither visible work content nor these files exist yet, the monitor should ask the main session to create the missing state instead of inventing it.

### 2. Create Monitor Settings

Install the runtime from `https://github.com/day1-ax-tools/meta-monitor`, then create `meta-monitor/settings.json` before starting the monitor:

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
  "answerWorker": {
    "type": "codex-exec-read-only",
    "script": "meta-monitor/monitor-worker.mjs",
    "output": "meta-monitor/meta-advice.md",
    "state": "meta-monitor/monitor-state.json",
    "runtimeModel": "codex-cli-default"
  },
  "monitorInput": {
    "schema": "meta-monitor/monitor-input.schema.json",
    "prompt": "meta-monitor/monitor-prompt.md",
    "events": "meta-monitor/main-session-events.jsonl",
    "latest": "meta-monitor/monitor-input.latest.json",
    "mode": "observe-main-session-first"
  },
  "mainSession": {
    "provider": "openai",
    "model": "codex-cli-default",
    "sessionId": "main-session",
    "description": "Visible main AI CLI onboarding session"
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

The Briefing Board may expose settings controls, but static HTML may not be able to write files directly. In that case it should generate a copyable settings update prompt for the monitor CLI to apply to `meta-monitor/settings.json`.

### 3. Start The Monitor Session

Open a second terminal in the same repo and start the chosen AI CLI. Codex is the default monitor because it can stay focused on files and Git state, but the concept is not Codex-specific.

```bash
pwd
git status --short
codex
```

Paste this prompt:

```text
당신은 메타 모니터 세션입니다.

먼저 이 repo에 메타 모니터 온보딩이 되어 있는지 확인해주세요. meta-monitor/settings.json을 읽고 provider, model, effort, language, context, fast mode, write scope 설정을 확인한 뒤 시작해주세요. language fallback은 en으로 두되, 현재 언어는 메인 세션 터미널 입력 언어를 우선해주세요. 현재 입력이 한국어이면 language.current는 ko로 설정해주세요.

메인 작업 세션의 사용자에게 보이는 작업 내용을 최대한 읽어주세요. 핵심 입력은 meta-monitor/main-session-events.jsonl입니다. 이 파일에는 메인 세션의 보이는 질문, 답변 요약, 실행 명령, 도구 출력 요약, 파일 변경, 생성 산출물, 결정, 검증 결과가 들어갑니다. 단, 모델 내부 추론 과정은 읽거나 추적하지 마세요. 추론 과정까지 읽으면 메타 모니터가 메인 세션과 동기화되어 독립적인 관찰자 역할을 잃을 수 있습니다. meta-monitor/AGENTS.md, meta-monitor/CLAUDE.md, meta-monitor/monitor-input.schema.json, meta-monitor/monitor-prompt.md, 현재 repo의 environment-state.md, interview-state.md, automation-brief.md, mission-backlog.md, logs/ 및 git status/diff도 함께 근거로 사용해주세요.

필요하면 meta-monitor/monitor-input.latest.json, meta-monitor/briefing-board.html, meta-monitor/monitor-state.json, meta-monitor/meta-advice.md, meta-monitor/session-data.jsonl을 업데이트하고, 복잡한 관계는 meta-monitor/visualizations/ 아래 HTML로 시각화해주세요.

메인 세션을 방해하지 말고 조언은 meta-monitor/meta-advice.md에 남겨주세요. 읽기는 repo 전체에서 가능하지만, 쓰기는 meta-monitor/ 폴더 안으로만 제한해주세요. 제품 코드, 미션 산출물, environment-state.md, interview-state.md, mission-backlog.md는 수정하지 마세요.

context 사용량이 70% 또는 settings.json의 contextSoftLimitRatio를 넘으면, meta-monitor/session-handoff.md 최신 파일 하나만 참조 중심으로 갱신하고 context clear를 준비해주세요. 오래된 handoff 파일은 만들지 마세요.
```

### 4. Monitor Read Scope

The monitor may read:

```bash
git status --short
git diff --stat
```

And these sources when present and user-approved:

```text
visible local session history or exported chat transcript
meta-monitor/main-session-events.jsonl
meta-monitor/monitor-input.schema.json
meta-monitor/monitor-prompt.md
executed commands and tool outputs when available
file changes and generated artifacts
environment-state.md
interview-state.md
automation-brief.md
work-map.md
ontology-seeds.md
mission-backlog.md
missions/*.md
logs/*.md
```

The monitor may read all visible work content of the main session when it is locally accessible for the same user. It must exclude hidden model reasoning on purpose, because reading the main session's reasoning path can make the monitor synchronize with the main session and weaken independent oversight.

### 5. Monitor Write Scope

The monitor may write by default:

```text
meta-monitor/briefing-board.html
meta-monitor/settings.json
meta-monitor/main-session-events.jsonl
meta-monitor/monitor-input.schema.json
meta-monitor/monitor-prompt.md
meta-monitor/monitor-input.latest.json
meta-monitor/monitor-state.json
meta-monitor/meta-advice.md
meta-monitor/questions.jsonl
meta-monitor/session-data.jsonl
meta-monitor/session-handoff.md
meta-monitor/visualizations/work-map-dashboard.html
meta-monitor/visualizations/mission-dashboard.html
meta-monitor/visualizations/decision-map.html
```

It must not write outside `meta-monitor/**`. It must not edit `environment-state.md`, `interview-state.md`, `automation-brief.md`, `mission-backlog.md`, `missions/*.md`, product code, or Git history unless the user explicitly changes the monitor write boundary.

### 6. Briefing Board TUI, Settings, And Input

`meta-monitor/briefing-board.html` should include:

- top status badges for the active repo, local folder, branch, main session, monitor session, language, write scope, and context soft limit;
- a top tab bar with Korean labels when the main session input language is Korean: `메타 모니터 콘솔`, `현황`, `업무 지도`, `미션 백로그`, `의사결정 지도`;
- a terminal-like monitor console that combines latest main-session events, optional follow-up question input, submit status, live connection status, queued questions, and latest monitor answers;
- a submit button that sends optional follow-up questions to the local bridge endpoint and appends them to `meta-monitor/questions.jsonl` as a secondary queue;
- an output check path that streams the latest main-session event from `meta-monitor/main-session-events.jsonl`, the latest optional question from `meta-monitor/questions.jsonl`, and the latest monitor answer from `meta-monitor/meta-advice.md` through `/api/events`, with `/api/monitor-output` as the manual refresh fallback;
- a top-right settings button that opens a dialog for provider, model, effort, language, context window, context soft limit, fast mode, and main-session-provider design;
- a generated settings JSON preview and copyable apply prompt;
- visualization tabs for diagrams, maps, or links to `meta-monitor/visualizations/*.html`;
- a visible write-scope badge showing `meta-monitor/** only`.

Keep all user-facing labels, buttons, status messages, and panel copy in the current user language. Keep machine-readable settings keys and CLI/file paths in their required literal form.

The HTML settings area is a handoff surface. The monitor console input is an optional follow-up submit surface only when the local bridge is running. The main flow is `meta-monitor/main-session-events.jsonl` -> `meta-monitor/monitor-input.latest.json` -> `meta-monitor/monitor-prompt.md` -> `meta-monitor/meta-advice.md`. On submit, the bridge appends the optional question to `meta-monitor/questions.jsonl`; `meta-monitor/monitor-worker.mjs` or an equivalent monitor CLI reads main-session events first, then that queue, answers in a read-only model session, and writes results back into `meta-monitor/meta-advice.md`, `meta-monitor/monitor-state.json`, and `meta-monitor/session-data.jsonl`. The Briefing Board should stream output from `/api/events`, which emits the latest main-session event, latest queued question, and the current contents of `meta-monitor/meta-advice.md`. Keep `/api/monitor-output` as the manual refresh fallback.

### 7. Session Data

Append one JSON object to `meta-monitor/session-data.jsonl` whenever the monitor observes, answers, updates the Briefing Board, changes settings, writes advice, creates a visualization, or performs handoff.

Append one JSON object to `meta-monitor/main-session-events.jsonl` whenever the main session has a visible user request, assistant response summary, tool/action summary, artifact change, decision, verification result, or handoff that the monitor should observe. Keep the event compact and reference-heavy.

Use this event shape:

```json
{
  "timestamp": "",
  "sessionRole": "meta-monitor",
  "eventType": "observe|question|answer|settings_update|briefing_board_update|visualization|handoff",
  "contextUsageRatio": 0,
  "sourcesRead": [],
  "artifactsWritten": [],
  "questionRef": "",
  "answerRef": "",
  "valueSignals": [],
  "featureCandidates": []
}
```

Keep event contents compact and reference-heavy. This data will later feed `learn` workflows together with the main session's session data.

### 8. Context Handoff

When context usage reaches the configured soft limit:

```text
context usage >= settings.contextSoftLimitRatio
→ update meta-monitor/session-handoff.md
→ keep only this latest handoff file
→ use references to files and event ids instead of copying long content
→ remove stale references when source files disappear or no longer support the claim
→ clear context or start a fresh monitor session
```

Do not create timestamped handoff files. Accumulated handoff files create context rot.

### 9. Briefing Board Cadence

Refresh the Briefing Board:

- after Work Environment Setup completes;
- at phase transitions;
- after 3-5 Q&A rounds;
- before long implementation work;
- when the user feels lost;
- before commit, push, or PR;
- after mission completion.
- after settings changes;
- after context handoff;
- after monitor Q&A.

Open the Briefing Board:

```bash
open meta-monitor/briefing-board.html
```

On Windows:

```powershell
start meta-monitor/briefing-board.html
```

### 10. Linking Back To Main Work

The main session can read the monitor output when the user asks:

```text
meta-monitor/monitor-input.latest.json, meta-monitor/monitor-state.json, meta-monitor/meta-advice.md를 읽고, 지금 다음 행동을 제안해주세요.
```

Advice is valid only when it points to visible work content, saved files, Briefing Board state, or Git signals.

## Interview State Contract

`interview-state.md` must answer:

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
```

## Completion Conditions

Work Environment Setup is complete only when all conditions have evidence:

- Local work root is chosen.
- Current repo path is known.
- GitHub authentication is verified or the blocking action is recorded.
- Local repo and GitHub remote relationship is explained.
- Remote URL is recorded when a repo exists.
- Current branch is recorded when a repo exists.
- The user has completed or observed one status/add/commit/push loop.
- Pull is explained as bringing remote changes back to local.
- `environment-state.md` is updated.

The interview is complete only when all conditions have evidence:

- Role and responsibility are summarized.
- 1-3 outcomes are defined.
- Major work areas are mapped.
- At least one work area is decomposed into executable steps.
- Candidate tasks are classified by automation type.
- Candidate tasks are scored by repetition, clarity, input availability, verification, risk, and time saved.
- One first mission is recommended and accepted.
- Included, excluded, deferred, and unverified items are recorded.
- The first mission has inputs, expected output, verification method, and next action.

If any item is missing, continue the interview.

If Meta Monitoring Flow is active, it is current only when:

- `meta-monitor/settings.json` records provider, model, effort, language, context size, context soft limit, fast mode, and write scope.
- `meta-monitor/briefing-board.html` shows repo/session status tags, tabs for monitor console/status/work map/mission backlog/decision map, the current phase, goal, risks, open questions, next action, a terminal-like monitor console backed by `/api/events`, top-right settings button/dialog, and visualization tabs. User-facing UI copy follows the current user language.
- `meta-monitor/main-session-events.jsonl` records the visible main-session questions, response summaries, decisions, artifact changes, and verification events the monitor should observe.
- `meta-monitor/monitor-input.schema.json`, `meta-monitor/monitor-prompt.md`, and `meta-monitor/monitor-input.latest.json` exist and align with the monitor worker.
- `meta-monitor/monitor-state.json` records processed observations, questions, runtime model, and latest answer state.
- `meta-monitor/meta-advice.md` separates advice, questions, risks, and evidence.
- `meta-monitor/session-data.jsonl` has an event for every monitor observation, answer, update, settings change, visualization, and handoff.
- `meta-monitor/session-handoff.md` is the only monitor handoff file when context reaches the soft limit.
- No monitor-written file exists outside `meta-monitor/**`.
- Monitor advice cites visible work content, saved files, Briefing Board state, or Git signals. It must not depend on hidden model reasoning.

## Storage And Use

Use each artifact as an authority for a different layer:

| Artifact | Use |
| --- | --- |
| `environment-state.md` | Work root, repo location, remote, branch, auth, and Git loop evidence |
| `workspace-map.html` | Visual explanation of local folder and repo layout |
| `git-local-remote.html` | Visual explanation of local/remote Git relationship |
| `git-cycle.html` | Visual explanation of status, add, commit, push, and pull |
| `repo-dashboard.html` | Visual summary of the current repo state |
| `interview-state.md` | Current progress and next question |
| `meta-monitor/briefing-board.html` | HTML Briefing Board with repo/session status tags, tabs, monitor console, settings, current phase, risks, and next action |
| `meta-monitor/settings.json` | Monitor provider, model, effort, language, context, fast mode, and write scope |
| `meta-monitor/main-session-events.jsonl` | Visible main-session events that the monitor observes first |
| `meta-monitor/monitor-input.schema.json` | Canonical shape for monitor input |
| `meta-monitor/monitor-prompt.md` | Prompt contract for turning monitor input into meta advice |
| `meta-monitor/monitor-input.latest.json` | Latest schema-shaped monitor input generated by the worker |
| `meta-monitor/monitor-state.json` | Processed observations, questions, runtime model, and latest answer state |
| `meta-monitor/meta-advice.md` | Monitor advice for the main session |
| `meta-monitor/questions.jsonl` | Optional follow-up question queue submitted from the Briefing Board |
| `meta-monitor/session-data.jsonl` | Monitor session event stream for future learn workflows |
| `meta-monitor/session-handoff.md` | Latest reference-heavy monitor context handoff |
| `meta-monitor/visualizations/*.html` | Monitor-owned visual explanations |
| `logs/*.md` | Conversation evidence and decision rationale |
| `automation-brief.md` | Compact summary for the chosen automation track |
| `work-map.md` | Role, outcomes, work areas, and workflows |
| `ontology-seeds.md` | Entities, relations, states, rules, inputs, and outputs |
| `mission-backlog.md` | Prioritized automation candidates |
| `missions/*.md` | Executable mission specs |

## Link To Next Work

After M001 is accepted:

1. Confirm scope from `missions/M001-<slug>.md`.
2. Collect one safe sample input.
3. Write one expected output example.
4. Confirm verification.
5. Implement the smallest useful automation.
6. Run it on the sample.
7. Record result and update `mission-backlog.md`.

Do not start with production side effects, destructive actions, or broad credentials.
