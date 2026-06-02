---
name: work-mission-discovery
description: Guide a user from AI CLI work environment setup to role and work understanding, then to an automation-ready mission backlog. Use when the user needs local workspace/GitHub setup, wants to understand local/remote Git concepts, describe their job, map responsibilities, break work down top-down, classify tasks by AI automation type, identify ontology seeds, choose a first low-risk automation mission, or create environment-state.md, work-map.md, ontology-seeds.md, mission-backlog.md, automation-brief.md, or missions/*.md.
---

# Work Mission Discovery

Run a model-neutral onboarding flow that first stabilizes the user's CLI work environment, then turns their real work into automation-ready missions. Keep the focus on common AI CLI concepts: current folder, work root, local repo, remote repo, change, commit, push, pull, main session, role, outcome, workflow, task, input, output, evidence, risk, and verification.

## Operating Rules

- Use concise polite Korean by default.
- Ask 1-3 questions at a time.
- If the user lacks a stable local workspace, GitHub authentication, or local/remote repo understanding, run Work Environment Setup before Work Grounding.
- Start from the user's role and outcomes unless a specific automation candidate is already selected.
- Treat user-proposed automations as hypotheses, not conclusions.
- Prefer low-risk, high-repetition, easy-to-verify work for the first mission.
- Keep product-specific concepts out of the main explanation unless the user asks.
- When writing artifacts, keep them current-state focused and avoid historical narration.
- When creating HTML views, use the clearest visual structure for the concept instead of repeating text cards. Prefer git branch graphs for onboarding state, flow diagrams for local/remote movement, folder trees for workspace layout, tables for artifact state, and risk/value matrices for automation candidates.
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

Read `references/execution-playbook.md` when installing instructions/skills, setting up the work environment, resuming an interview, deciding completion, or linking discovery to implementation work. Read `references/artifact-templates.md` before creating files. Read `references/interview-protocol.md` when the interview needs more detailed prompts, phase transitions, or anti-pattern checks.

### 8. Maintain Continuity

Update `environment-state.md` whenever the work root, repo, remote, branch, or GitHub auth state changes. Update `interview-state.md` at phase transitions, after 3-5 question-answer rounds, before stopping, and before starting implementation. On resume, read `environment-state.md`, `interview-state.md`, `automation-brief.md`, `mission-backlog.md`, and the latest `logs/*.md`, then continue from the recorded next question.

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
