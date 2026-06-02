---
name: work-mission-discovery
description: Guide a user from AI CLI work environment setup to role and work understanding, then to an automation-ready mission backlog. Use when the user needs local workspace/GitHub setup, wants to understand local/remote Git concepts, describe their job, map their responsibilities, break work down top-down, classify tasks by AI automation type, identify ontology seeds, choose a first low-risk automation mission, explicitly activate a meta monitor, create a Briefing Board, or create environment-state.md, work-map.md, ontology-seeds.md, mission-backlog.md, automation-brief.md, meta-monitor/briefing-board.html, meta-monitor/settings.json, meta-monitor/session-data.jsonl, or missions/*.md.
---

# Work Mission Discovery

Use this skill to run a model-neutral onboarding flow that first stabilizes the user's CLI work environment, then turns their real work into automation-ready missions. Keep the focus on common AI CLI concepts: current folder, work root, local repo, remote repo, change, commit, push, pull, main session, monitor session, Briefing Board, role, outcome, workflow, task, input, output, evidence, risk, and verification.

## Operating Rules

- Use concise polite Korean by default.
- Ask 1-3 questions at a time.
- If the user lacks a stable local workspace, GitHub authentication, or local/remote repo understanding, run Work Environment Setup before Work Grounding.
- Start from the user's role and outcomes unless a specific automation candidate is already selected.
- Treat user-proposed automations as hypotheses, not conclusions.
- Prefer low-risk, high-repetition, easy-to-verify work for the first mission.
- Keep product-specific concepts out of the main explanation unless the user asks.
- When writing artifacts, keep them current-state focused and avoid historical narration.
- If the user explicitly wants meta monitoring or a Briefing Board, use a work-content-aware monitor loop. The monitor should see all visible work content available to the same local user: chat transcript, commands, file changes, logs, artifacts, and Git state. Exclude hidden model reasoning on purpose so the monitor stays independent from the main session's reasoning path.
- Do not activate meta monitoring automatically. Only onboard and start it when the user explicitly asks.
- Restrict monitor-session writes to `meta-monitor/**`. The monitor may read the repo, but must not write product code, mission specs, main state files, or Git history unless the user explicitly changes the write boundary.
- Require `meta-monitor/settings.json` before running a monitor session. Use it for provider, model, effort, language, context size, context soft limit, fast mode, and write scope. The language fallback is `en`, but the current language follows the terminal language used by the user in the main session.
- When monitor context usage reaches 70% or the configured soft limit, write one latest `meta-monitor/session-handoff.md` and prepare context clear. Keep only the latest handoff and make it reference-heavy.
- Record monitor events to `meta-monitor/session-data.jsonl` every time the monitor observes, answers, updates the Briefing Board, changes settings, or writes advice.
- After file edits, verify with the closest available check, at minimum `git diff --check`.

## Workflow

### 1. Choose Entry Point

Select one path:

| User state | Start here |
| --- | --- |
| User has not installed or verified the AI CLI | Installation Flow in `references/execution-playbook.md` |
| User has CLI but no stable work root, GitHub auth, or repo workflow | Work Environment Setup Env-0 |
| User only knows their job broadly | Work Grounding Pre-0 |
| User has a work area but no automation candidate | Work Grounding Pre-2 |
| User already chose a task to automate | Automation Exploration Phase 1 |
| User already has a mission brief | Mission Execution shaping |

If uncertain, first check whether the current folder is a Git repo with a connected remote. If not, start with Work Environment Setup.

### 2. Work Environment Setup

Goal: make the user's computer, GitHub account, and first repo ready for repeated AI CLI work.

```text
Env-0: CLI and auth check
— Can the selected AI CLI, git, and gh run from the user's terminal?

Env-1: Work root selection
— Where will AI work repos live on the local computer?

Env-2: Local/remote model
— What is the difference between a local repo and GitHub remote?

Env-3: First repo placement
— Should the user create, clone, or move the first repo under the work root?

Env-4: Git loop practice
— Can the user experience status -> add -> commit -> push -> pull?

Env-5: Visual explanation
— Which concept needs an HTML visualization for recall?
```

Default local work root:

```text
~/Documents/AI-Work/
```

Recommended folder model:

```text
~/Documents/AI-Work/
  <github-org-or-user>/
    <repo-name>/
  personal/
  inbox/
  archive/
```

Teach this model before asking the user to commit:

```text
GitHub remote is the repo on the web.
Your local repo is the folder on your computer.
They do not sync automatically.
Use commit to save local work, push to send it to GitHub, and pull to bring GitHub changes back.
```

Create or update `environment-state.md` during this setup. When a visual explanation helps, create one or more of:

```text
workspace-map.html
git-local-remote.html
git-cycle.html
repo-dashboard.html
```

Work Environment Setup is complete when the user has a chosen work root, GitHub authentication is verified, the current repo is under the work root or explicitly accepted as an exception, local/remote are connected, and the user has completed or watched one small commit/push loop.

### 3. Work Grounding

Goal: produce enough work context to select a first automation candidate.

```text
Pre-0: Role definition
— What responsibility does the user hold?

Pre-1: Outcome definition
— What results must improve for that role to be successful?

Pre-2: Work area map
— What recurring work areas support those outcomes?

Pre-3: Workflow decomposition
— What tasks and steps make up each work area?

Pre-4: Automation classification
— Which task type does each step belong to?

Pre-5: Candidate selection
— Which task should become the first automation mission?
```

Start with:

```text
먼저 당신의 일을 이해하겠습니다.

1. 어떤 역할을 맡고 계신가요?
2. 그 역할에서 가장 중요하게 책임지는 결과는 무엇인가요?
3. 최근 1-2주 동안 실제로 시간을 많이 쓴 일은 무엇인가요?
```

After each answer, summarize as role, outcome, work areas, tasks, missing context, then ask the next smallest useful question.

### 4. Automation Exploration

Goal: refine one selected candidate into an executable mission.

```text
Phase 1: Purpose refinement
— What outcome should this automation create?

Phase 2: Work area exploration
— Which people, documents, data, tools, rules, and decisions are involved?

Phase 3: Current-state sharing
— How does the work happen now, and where does it stall?

Phase 4: Execution scenario exploration
— What output does the user need, and which steps can AI support?

Phase 5: Assumption validation
— What must be true for the automation to work?

Phase 6: Mission scope agreement
— What is included, deferred, excluded, and still unverified?
```

Use `extract -> propose -> confirm`:

1. Extract the user's current intent and workflow before suggesting options.
2. Propose 1-2 alternatives only after summarizing the user's answer.
3. Confirm the selected direction, exclusions, and assumptions.

### 5. Classify Automation Type

Use these categories:

| Type | Meaning |
| --- | --- |
| 수집 | Gather scattered information |
| 정리 | Structure, summarize, label, or tabulate information |
| 작성 | Draft text or structured artifacts |
| 변환 | Convert one format into another |
| 검토 | Find gaps, errors, inconsistencies, or risks |
| 판단 보조 | Compare options and clarify decision criteria |
| 실행 | Apply changes to files, systems, tickets, or PRs |
| 모니터링 | Watch for changes and notify or queue work |

Prefer `정리`, `작성`, `변환`, or `검토` for the first mission unless the user has a strong reason.

### 6. Score Candidates

For each candidate, rate:

- Repetition: how often it happens.
- Clarity: whether rules can be written down.
- Input availability: whether needed inputs exist in files, tools, or stable text.
- Verification: whether the output can be checked easily.
- Risk: harm if the automation is wrong.
- Time saved: likely practical value.

Recommend the first mission when it has high repetition, low risk, clear inputs, and easy verification.

### 7. Create Artifacts

Create or update artifacts when the user asks for files or when the session goal includes a written backlog.

Default paths:

```text
environment-state.md
interview-state.md
work-map.md
ontology-seeds.md
mission-backlog.md
automation-brief.md
missions/M001-<slug>.md
logs/<YYYY-MM-DD>-mission-discovery.md
```

If Meta Monitoring Loop is active, also create or update:

```text
Install runtime from https://github.com/day1-ax-tools/meta-monitor first.
meta-monitor/briefing-board.html
meta-monitor/settings.json
meta-monitor/monitor-state.json
meta-monitor/meta-advice.md
meta-monitor/questions.jsonl
meta-monitor/session-data.jsonl
meta-monitor/session-handoff.md
meta-monitor/visualizations/*.html
```

Read `references/execution-playbook.md` when installing instructions/skills, setting up the work environment, resuming an interview, deciding completion, or linking discovery to implementation work. Read `references/artifact-templates.md` before creating files. Read `references/interview-protocol.md` when the interview needs more detailed prompts, phase transitions, or anti-pattern checks.

### 8. Meta Monitoring Loop

Use this optional loop only when the user explicitly asks to activate a meta monitor, Briefing Board, extra oversight, or advice from a second CLI session.

Meta Monitor is a separate runtime repo. Install or copy the runtime from:

```text
https://github.com/day1-ax-tools/meta-monitor
```

Do not generate the runtime files from scratch inside the onboarding repo unless the user explicitly asks for a local fallback.

Authority model:

```text
Main session: runs setup, interview, implementation, and verification.
Monitor session: observes visible work content, saved artifacts, and Git state, then writes only meta-monitor files.
```

Activation prerequisites:

```text
User explicitly requested meta monitoring.
Repo has onboarding instructions and the work-mission-discovery skill installed.
Runtime from day1-ax-tools/meta-monitor is installed or copied into meta-monitor/.
meta-monitor/settings.json exists.
Write scope is meta-monitor/**.
Briefing Board path is meta-monitor/briefing-board.html.
```

The monitor session may read:

```text
environment-state.md
interview-state.md
automation-brief.md
work-map.md
ontology-seeds.md
mission-backlog.md
missions/*.md
logs/*.md
visible local work content when accessible and user-approved
visible local session history or exported chat transcript
executed commands and tool outputs when available
git status --short
git diff --stat
```

The monitor session may write by default:

```text
meta-monitor/briefing-board.html
meta-monitor/settings.json
meta-monitor/monitor-state.json
meta-monitor/meta-advice.md
meta-monitor/questions.jsonl
meta-monitor/session-data.jsonl
meta-monitor/session-handoff.md
meta-monitor/visualizations/work-map-dashboard.html
meta-monitor/visualizations/mission-dashboard.html
meta-monitor/visualizations/decision-map.html
```

Do not let the monitor session write outside `meta-monitor/**` unless the user explicitly changes the write boundary. The monitor should cite the files or Git signals behind its advice.

Recommended monitor prompt:

```text
당신은 메타 모니터 세션입니다.

메인 작업 세션의 사용자에게 보이는 작업 내용을 최대한 읽어주세요. 여기에는 채팅 기록, 세션 로그, 실행 명령, 도구 출력, 파일 변경, 생성된 산출물이 포함됩니다. 단, 모델 내부 추론 과정은 읽거나 추적하지 마세요. 추론 과정까지 읽으면 메타 모니터가 메인 세션과 동기화되어 독립적인 관찰자 역할을 잃을 수 있습니다. 현재 repo의 environment-state.md, interview-state.md, automation-brief.md, mission-backlog.md, logs/ 및 git status/diff도 함께 근거로 사용해주세요.

먼저 day1-ax-tools/meta-monitor 레포에서 meta-monitor/ 런타임을 설치하거나 복사해주세요. 필요하면 meta-monitor/briefing-board.html, meta-monitor/monitor-state.json, meta-monitor/meta-advice.md, meta-monitor/session-data.jsonl을 업데이트하고, 복잡한 관계는 meta-monitor/visualizations/ 아래 HTML로 시각화해주세요.

메인 세션을 방해하지 말고 조언은 meta-monitor/meta-advice.md에 남겨주세요. 읽기는 repo 전체에서 가능하지만, 쓰기는 meta-monitor/ 폴더 안으로만 제한해주세요. 제품 코드, 미션 산출물, environment-state.md, interview-state.md, mission-backlog.md는 수정하지 마세요. meta-monitor/settings.json의 provider, model, effort, language, context, fast mode 설정을 따르고, language fallback은 en으로 두되 현재 언어는 메인 세션 터미널 입력 언어를 우선해주세요. 현재 입력이 한국어이면 language.current는 ko로 설정해주세요. context 사용량이 70%를 넘으면 참조 중심의 meta-monitor/session-handoff.md 최신 파일 하나만 갱신한 뒤 context clear를 준비해주세요.
```

Update the Briefing Board at phase transitions, before long implementation work, when the user feels lost, before a commit/PR, after completing a mission, after answering a monitor question, and after settings changes.

### 9. Maintain Continuity

Update `environment-state.md` whenever the work root, repo, remote, branch, or GitHub auth state changes. Update `interview-state.md` at phase transitions, after 3-5 question-answer rounds, before stopping, and before starting implementation. If meta monitoring is active, update or ask the monitor session to update only `meta-monitor/settings.json`, `meta-monitor/monitor-state.json`, `meta-monitor/meta-advice.md`, `meta-monitor/questions.jsonl`, `meta-monitor/session-data.jsonl`, `meta-monitor/session-handoff.md`, `meta-monitor/briefing-board.html`, and `meta-monitor/visualizations/*.html`. On resume, read `environment-state.md`, `interview-state.md`, `automation-brief.md`, `mission-backlog.md`, `meta-monitor/settings.json`, `meta-monitor/session-handoff.md`, `meta-monitor/monitor-state.json`, `meta-monitor/meta-advice.md`, and the latest `logs/*.md`, then continue from the recorded next question.

## Completion Criteria

Do not call Work Environment Setup complete until these exist in chat or files:

- Chosen local work root.
- Current repo path and remote URL.
- GitHub authentication status.
- Short explanation of local repo vs GitHub remote.
- Commit/push/pull practice evidence or an explicit reason it was deferred.

Do not call Work Mission Discovery complete until these exist in chat or files:

- Role and responsibility summary.
- Outcome summary.
- Work area map.
- Task decomposition for at least one work area.
- Automation classification for candidate tasks.
- First recommended mission with rationale.
- Included, excluded, deferred, and unverified items.
- Verification method for the first mission.

If Meta Monitoring Loop is active, also require:

- `meta-monitor/settings.json` exists and records provider, model, effort, language, context, fast mode, and write scope.
- `meta-monitor/briefing-board.html` shows repo/session status tags, tabs for monitor console/status/work map/mission backlog/decision map, the current phase, goal, risks, open questions, next action, a terminal-like monitor console backed by `/api/events`, top-right settings button/dialog, and visualization tabs. User-facing UI copy follows the current user language.
- `meta-monitor/monitor-state.json` records the visible work content, files, and Git signals the monitor read.
- `meta-monitor/meta-advice.md` contains advice grounded in visible work content, saved files, or Git state.
- `meta-monitor/session-data.jsonl` records monitor session events.
- `meta-monitor/session-handoff.md` is the only handoff file and is reference-heavy when context usage reaches the soft limit.
- Monitor writes are limited to `meta-monitor/**`.
