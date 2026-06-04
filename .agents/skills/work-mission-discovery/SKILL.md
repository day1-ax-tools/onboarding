---
name: work-mission-discovery
description: Guide a user from AI CLI work environment setup to role and work understanding, then to an automation-ready mission backlog. Use when the user needs local workspace/GitHub setup, wants to understand local/remote Git concepts, describe their job, map their responsibilities, break work down top-down, classify tasks by AI automation type, identify ontology seeds, choose a first low-risk automation mission, or create environment-state.md, work-map.md, ontology-seeds.md, mission-backlog.md, automation-brief.md, or missions/*.md.
---

# Work Mission Discovery

Use this skill to run a model-neutral onboarding flow that first stabilizes the user's CLI work environment, then turns their real work into automation-ready missions. Keep the focus on common AI CLI concepts: current folder, work root, local repo, remote repo, change, commit, push, pull, main session, role, outcome, workflow, task, input, output, evidence, risk, and verification.

## Operating Rules

- Use concise polite Korean by default.
- Ask 1-3 questions at a time.
- Treat a trigger-only handoff as sufficient. If the user says `$work-mission-discovery`, asks to start AI CLI onboarding, or mentions `work-mission-discovery`, start the onboarding flow without requiring extra prompt text about current-folder checks or step-by-step pacing; those are this skill's responsibility.
- If the user lacks a stable local workspace, GitHub authentication, or local/remote repo understanding, run Work Environment Setup before Work Grounding.
- Start from the user's role and outcomes unless a specific automation candidate is already selected.
- Treat user-proposed automations as hypotheses, not conclusions.
- Prefer low-risk, high-repetition, easy-to-verify work for the first mission.
- Keep `mission-backlog.md` usable as a resumable work board: each candidate should have an ID, mission, type, value, risk, verification, status, and next action whenever enough information is known.
- Keep product-specific concepts out of the main explanation unless the user asks.
- When writing artifacts, keep them current-state focused and avoid historical narration.
- Record durable setup facts in `environment-state.md`; avoid chasing transient Git states such as "currently staged" unless the step is explicitly teaching that state. Prefer evidence lines such as "local commit `<hash>` recorded environment state" over state lines that become stale after the next Git command.
- When creating HTML views, use the clearest visual structure for the concept instead of repeating text cards. Prefer git branch graphs for onboarding state, flow diagrams for local/remote movement, folder trees for workspace layout, tables for artifact state, and risk/value matrices for automation candidates.
- When teaching current folder, work root, local repo, GitHub remote, commit, push, or pull, connect the explanation to the brief board's concept board so the user sees the same idea visually.
- When the concept explanation should reflect the user's current repo, branch, remote, workflow, or mission decision, write `.onboarding/concepts/current-concept.json` with structured nodes, edges, rows, sourceRefs, and updatedAt. Treat it as display data, not source of truth.
- When `.onboarding/update-state.mjs` exists, treat onboarding progress as CLI-owned state. After each verified step completion, call the updater with the matching step id and evidence. Do not ask the user to update progress in the browser.
- When `.onboarding/update-board.mjs` exists and work or mission artifacts change, run it so `.onboarding/board-data.json` refreshes the brief board. Treat `board-data.json` as display summary data, not the source of truth.
- Keep the onboarding kit folder and the user's work repo distinct. Do not treat `.onboarding/state.json` in the onboarding kit folder as the user's active project state. The active state belongs inside the selected work repo only.
- A user-level preinstalled skill may be invoked from any folder. Treat that as a first-run router: inspect the current folder and candidate repo, ask or confirm the selected work repo when it is missing or unsafe, and install project-local instructions, skill, `.onboarding` hooks, and brief board only after the selected work repo is confirmed.
- After the user confirms the selected work repo, install or verify project-local instructions, skill, `.onboarding` hooks, and brief board before relying on board-backed progress. If they are not installed yet, say the brief board is not active and keep any notes as ordinary markdown until installation.
- After project-local hooks are installed, run `.onboarding/install-artifact-placeholders.mjs` when available to create missing placeholder artifacts. Never overwrite existing user artifacts. Treat placeholder artifacts with `artifact_state: placeholder` as draft scaffolds, not completed onboarding evidence.
- Run safe inspection commands yourself when the CLI has tool access: `pwd`, `ls`, `git status`, `git remote -v`, `git branch --show-current`, `gh auth status`, and file existence checks. Ask the user to run commands only when the command is interactive, requires credentials, changes external state, or the CLI cannot access the required environment.
- Do not say that state was recorded unless an artifact was actually written and verified. If writing is not possible, say what would be recorded and mark it as pending or blocked.
- Never create a GitHub repo, push to GitHub, open a PR, or change a remote as the default next action. Present the choice, explain the side effect, and wait for explicit user approval.
- Avoid destructive shell snippets in teaching steps. Do not overwrite existing user files with `>` unless the user explicitly asked for replacement and the current file was inspected. Prefer creating `onboarding-notes.md` or appending with a clearly explained command.
- In Claude Code, early onboarding may trigger repeated permission prompts for reading files, running shell commands, and writing setup files. Let the user experience this friction first; after initial setup is complete, explain what the prompts meant and summarize `default`, `acceptEdits`, `plan`, `auto`, and `bypassPermissions` modes.
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

When the user asks to start AI CLI onboarding, start with Work Environment Setup Env-0 unless `environment-state.md` or `.onboarding/state.json` in the selected work repo proves setup is already complete. If the skill is available but the current folder lacks project-local onboarding files, do not treat that as a missing installation; treat it as first run, inspect the current folder, selected work repo candidate, Git status, remote, branch, and GitHub auth before asking role/work questions.

### 2. Work Environment Setup

Goal: make the user's computer, GitHub account, and first repo ready for repeated AI CLI work.

```text
Env-0: CLI and auth check
— Can the selected AI CLI, git, and gh run from the user's terminal?

Env-0.5: GitHub account readiness
— Does the user have a GitHub account, and can `gh auth login/status` connect it?

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

Work Environment Setup is complete when the user has a chosen work root, GitHub account readiness is known, GitHub authentication is verified or the blocker is recorded, the current repo is under the work root or explicitly accepted as an exception, local/remote are connected, and the user has completed or watched one small commit/push loop.

When an environment step is complete, update onboarding state if the hook exists:

| Step id | Completion condition |
| --- | --- |
| `cli-install` | The selected AI CLI command runs from the user's terminal |
| `auth` | The selected AI CLI authentication is complete |
| `cli-handoff` | The user has handed the web prompt to the AI CLI |
| `kit-install` | Project instructions and `work-mission-discovery` skill are installed |
| `work-root` | Work root and current repo placement are recorded |
| `github-auth` | `gh auth status`, remote URL, and current branch are checked |
| `git-loop` | status/add/commit/push/pull is completed or observed |

Use `done` only after verification, `blocked` when the next step cannot proceed, and `skipped` only when the user explicitly chooses to skip.

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

Do not advance only because the user answered once. Use the grounding gates in `references/interview-protocol.md`: role/outcome/work areas must be summarized, at least one valuable work area must be decomposed to leaf tasks, and each leaf task must have trigger, inputs, steps, output, decision point, completion evidence, automation type, and risk before it can be treated as a mission candidate.

Show the decomposition twice: first in the CLI as a compact table or tree, then in the brief board by writing `work-map.md` and running `.onboarding/update-board.mjs` when available. If the board is not installed, tell the user that the same structure is saved in markdown and will appear after board installation.

When grounding milestones are verified, update onboarding state if the hook exists:

| Step id | Completion condition |
| --- | --- |
| `role-map` | Role and responsible outcomes are recorded |
| `task-split` | At least one recurring work area is decomposed to leaf tasks with trigger, inputs, steps, output, decision point, and completion evidence |
| `mission-select` | A first automation mission candidate is selected with rationale |

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

After changing `work-map.md`, `ontology-seeds.md`, `mission-backlog.md`, `automation-brief.md`, or `missions/*.md`, run:

```bash
node .onboarding/update-board.mjs
```

Then update the matching onboarding state step if the completion condition is verified.

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
