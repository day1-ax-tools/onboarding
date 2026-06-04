# Execution Playbook

Use this when the user needs an end-to-end, interruption-resistant onboarding experience.

## Installation Flow

Default to project-level installation. Avoid global installation during onboarding unless the user explicitly wants the behavior across all repositories.

Web entry uses two static pages:

```text
index.html
web/index.html
web/brief-board.html
bootstrap/start.sh
bootstrap/start.ps1
```

For first-time users, start from the hosted web entry rather than asking them to clone the repo. The user selects OS and AI CLI, then installs the selected CLI, refreshes PATH, and verifies the command first. CLI installation is itself part of the learning experience and must not appear to require the onboarding kit. After command verification, the user runs the bootstrap command in the same terminal to obtain the onboarding repo locally, then launches and authenticates the selected CLI.

Use `web/index.html` for CLI installation, PATH refresh, verification, post-verify bootstrap, login, and the first handoff prompt. Do not send the user to the onboarding board until the user's working folder has `.onboarding/state.json`, `.onboarding/update-state.mjs`, `.onboarding/update-board.mjs`, and `.onboarding/brief-board.html`. After project installation, use `.onboarding/brief-board.html` inside the user's working folder as the state-backed board. The board does not create repositories, change files, or call GitHub directly; the AI CLI does that after the user hands off the summary.

The first handoff prompt should be trigger-only. Do not ask the user to paste extra instructions such as "check the current folder" or "guide me one step at a time"; the skill owns those behaviors.

Post-verification bootstrap commands:

```bash
# macOS / Linux / WSL
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/day1-ax-tools/onboarding/main/bootstrap/start.sh)" -- --tool claude --os mac --shell zsh
```

```powershell
# Windows PowerShell
$script = irm https://raw.githubusercontent.com/day1-ax-tools/onboarding/main/bootstrap/start.ps1
& ([scriptblock]::Create($script)) -Tool claude
```

The board must not depend on user-managed checkboxes or user-entered board forms. During CLI onboarding, write progress to `.onboarding/state.json` through `.onboarding/update-state.mjs`. Keep work understanding and mission content in markdown source artifacts, then run `.onboarding/update-board.mjs` to regenerate `.onboarding/board-data.json` as display summary data. The board reads state plus board-data and updates the graph, work map, resumable mission status board, and artifact matrix. If the state file is missing, the board must show hook-not-installed rather than hook-active. If board-data is missing, the board must show artifact-waiting rather than invented work content. When all required steps are done, the updater disposes the hooks by setting `hooks.enabled=false`.

Use the brief board's concept board as the companion visual surface for Git and workspace explanations. Map current folder/work root explanations to "작업 위치", local/remote explanations to "Local / Remote", commit practice to "Commit", and upload/download sync explanations to "Push / Pull".

When the explanation depends on the user's current repo, current branch, exact remote, workflow decomposition, or mission decision, write `.onboarding/concepts/current-concept.json` instead of relying only on the built-in concept tabs. Keep it as structured display data with `title`, `description`, `sourceRefs`, `nodes`, `edges`, `rows`, `note`, and `updatedAt`. Do not store hidden reasoning, secrets, credentials, or private chat traces. The brief board polls this file directly, so `.onboarding/update-board.mjs` is not required unless markdown source artifacts also changed.

Shell policy:

- macOS, Linux, and WSL show bash/zsh choices because PATH refresh differs by shell.
- Windows shows PowerShell only. Do not ask beginners to choose between PowerShell, cmd, bash, and zsh unless they explicitly need a different shell.
- Project instruction and skill installation is a normal shell copy operation. Prefer the CLI to inspect paths and perform it; use the board's alternate command only when manual installation is needed.

## CLI Runtime Loop

Once the user hands the web prompt to the CLI, repeat this loop:

1. Confirm the current folder, selected tool, installation state, Git/GitHub state, and available onboarding files.
2. Ask only the next 1-3 useful questions.
3. Use commands to verify facts instead of guessing.
4. Write confirmed information into source artifacts such as `environment-state.md`, `interview-state.md`, `work-map.md`, `ontology-seeds.md`, `mission-backlog.md`, `automation-brief.md`, `missions/*.md`, and `logs/*.md`.
5. Run `.onboarding/update-board.mjs` after work or mission artifacts change.
6. Run `.onboarding/update-state.mjs` only after a step's completion condition is verified.
7. Tell the user what changed, what evidence was checked, and the next small action.

The CLI should run safe inspection commands itself when tool access is available. Do not ask a beginner to run `pwd`, `git status`, `git remote -v`, or `gh auth status` just so the model can read the output. Ask the user to act only for interactive login, account choice, repository creation approval, permission prompts, external side effects, or when the CLI truly cannot access the environment.

Keep the onboarding kit folder separate from the user's selected work repo. If `.onboarding/state.json` exists in the onboarding kit checkout, ignore it as active project state unless the user explicitly chose the onboarding kit itself as the work repo. The active brief board state is installed into the selected work repo.

Do not claim that a state, blocker, or decision was recorded unless a source artifact was written and verified. If the hook or artifact is not installed yet, say the item is "noted in this conversation" and record it only after installation.

After the user confirms the selected work repo, verify whether project-local onboarding files exist:

```bash
test -f CLAUDE.md
test -d .claude/skills/work-mission-discovery
test -f .onboarding/update-state.mjs
test -f .onboarding/update-board.mjs
test -f .onboarding/brief-board.html
```

If they are missing, install them before moving from environment setup to work grounding, or clearly say that the brief board is not active yet and that the current notes are ordinary markdown. Do not imply board-backed progress before the hooks exist.

When updating `environment-state.md`, record durable evidence. Avoid making the document chase momentary Git states such as "currently staged" unless the user is explicitly learning that state in the current step. If a state will change in the next command, explain it in chat and record the durable outcome after the command instead.

The brief board is a dashboard, not the place where the user enters work data.

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

3. Install onboarding state hook:

   ```bash
   mkdir -p .onboarding
   cp -R /path/to/onboarding/templates/onboarding/. .onboarding/
   cp /path/to/onboarding/web/brief-board.html .onboarding/brief-board.html
   node .onboarding/update-state.mjs kit-install done --tool codex --evidence "AGENTS.md and work-mission-discovery copied"
   ```

   If Node is unavailable, copy the files and update `.onboarding/state.json` directly with valid JSON.

4. Verify:

   ```text
   $work-mission-discovery 로 AI CLI 온보딩을 시작해줘.
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

4. Install onboarding state hook:

   ```bash
   mkdir -p .onboarding
   cp -R /path/to/onboarding/templates/onboarding/. .onboarding/
   cp /path/to/onboarding/web/brief-board.html .onboarding/brief-board.html
   node .onboarding/update-state.mjs kit-install done --tool claude --evidence "CLAUDE.md and work-mission-discovery copied"
   ```

   Windows PowerShell uses the same updater:

   ```powershell
   New-Item -ItemType Directory -Force ".onboarding" | Out-Null
   Copy-Item "C:\path\to\onboarding\templates\onboarding\*" ".onboarding" -Recurse -Force
   Copy-Item "C:\path\to\onboarding\web\brief-board.html" ".onboarding\brief-board.html" -Force
   node .onboarding\update-state.mjs kit-install done --tool claude --os windows --shell powershell --evidence "CLAUDE.md and work-mission-discovery copied"
   ```

   If Node is unavailable, copy the files and update `.onboarding/state.json` directly with valid JSON.

5. Verify:

   ```text
   work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요.
   ```

Expected: Claude Code selects the skill from `.claude/skills`. Skills are model-invoked, not slash commands.

After the first setup pass, explain the permission prompts the user just saw. Keep the explanation experiential: reads inspect files, bash commands verify or copy setup assets, edits write onboarding artifacts. Then explain the permission modes briefly:

| Mode | Explain after setup |
| --- | --- |
| `default` | Asks before most changes and commands; safest starting point. |
| `acceptEdits` | Auto-accepts edits and common filesystem actions while still keeping more command prompts visible. |
| `plan` | Read/planning mode for exploring before changing files. |
| `auto` | Reduces prompt fatigue when account, authentication provider, and settings allow it; available modes can be reached with `Shift+Tab` when enabled. |
| `bypassPermissions` | Skips permission checks and should be reserved for isolated containers or VMs. |

Tell the user that `Shift+Tab` cycles the available in-session modes. Do not recommend `bypassPermissions` for a normal local onboarding folder.

## Onboarding State Hook Contract

Use the state hook after a step's completion condition is verified. This is a project-local onboarding contract, not an OS-level hook and not a long-lived background monitor.

```bash
node .onboarding/update-state.mjs <step-id> <status> --evidence "<short evidence>"
```

On Windows:

```powershell
node .onboarding\update-state.mjs <step-id> <status> --evidence "<short evidence>"
```

When `role-map`, `task-split`, or `mission-select` changes markdown artifacts, update the brief board display data before or immediately after the state update:

```bash
node .onboarding/update-board.mjs
node .onboarding/update-state.mjs role-map done --evidence "work-map.md updated"
```

Do not treat `.onboarding/board-data.json` as the source of truth. It is a view generated from `environment-state.md`, `work-map.md`, `ontology-seeds.md`, `mission-backlog.md`, `automation-brief.md`, and `missions/*.md`.

Statuses:

| Status | Meaning |
| --- | --- |
| `pending` | Not started |
| `active` | Current step |
| `done` | Completion condition was verified |
| `blocked` | Cannot continue without install, auth, path, permission, or user decision |
| `skipped` | User explicitly skipped the step |

Step ids:

| Step id | Verify before marking done |
| --- | --- |
| `cli-install` | Selected AI CLI command runs |
| `auth` | AI CLI authentication is complete |
| `cli-handoff` | User pasted the web handoff prompt into the CLI |
| `kit-install` | Project instructions and skill are installed |
| `work-root` | Work root and repo placement are recorded |
| `github-auth` | `gh auth status`, remote URL, and branch are checked |
| `git-loop` | status/add/commit/push/pull completed or observed |
| `role-map` | Role and responsible outcomes are recorded |
| `task-split` | One recurring work area is decomposed into executable tasks |
| `mission-select` | First automation mission candidate is selected |

When all required steps are `done`, the updater sets `hooks.enabled=false`. After that, do not keep writing onboarding hook updates unless the user explicitly restarts onboarding.

For a live project-local board, serve the user's working folder over local HTTP and open `.onboarding/brief-board.html`. The board reads `.onboarding/state.json` and `.onboarding/board-data.json` from the same folder.

## Work Environment Setup Flow

Use this before Work Grounding when the user is new to AI CLI work, has not chosen a local workspace, or cannot explain how the local repo relates to GitHub.

Goal: the user knows where AI work happens on their computer, whether a GitHub account is ready, how that folder connects to GitHub, and how to repeat the first Git loop without losing context.

### 1. Confirm Terminal Context

Check the current folder and installed tools:

```bash
pwd
git --version
gh --version
gh auth status
```

Run these checks yourself when tool access is available. Also verify the selected AI CLI with the product's normal version or doctor command. Do not move on silently if `git`, `gh`, or authentication is missing. Explain the missing piece in plain outcome terms.

For GitHub CLI, first run `command -v gh` or `gh --version`. If `gh` exists, run `gh auth status` yourself and summarize the result. Do not ask "GitHub 계정이 있으신가요?" before checking the local auth state. Ask the user only when login is needed, when the user may need to create an account, or when account/organization choice affects repository creation.

If `gh auth status` shows no logged-in account, explain that GitHub needs a user-owned account before remote repo work can continue. If the user has no account, guide them to create one in the browser at `https://github.com/signup`, then return to the CLI and run `gh auth login`. Do not create the account for the user, do not collect passwords or recovery codes, and record GitHub account creation or login as an interactive user action.

If `gh` is missing, do not assume one package manager unless the OS and shell are known from the web entry or from detection. Explain that GitHub work can be blocked while local repo learning can continue. Record `github-auth` or remote setup as blocked only after an artifact or state hook exists.

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

Creating a GitHub repo, adding a remote, pushing commits, or opening a PR changes external state. Never make that the automatic next action. Present 2-3 options first:

| Option | When to use |
| --- | --- |
| Connect an existing GitHub repo | The user already has a repository for this work |
| Create a new private repo | The user explicitly wants GitHub backup/collaboration now |
| Continue local-only for now | The user is practicing or GitHub setup is blocked |

Proceed only after the user chooses the external-state option.

### 5. Practice The Git Loop

Use a harmless file such as `README.md` or `onboarding-notes.md`.

```text
edit -> status -> add -> commit -> push -> pull
```

Prefer `onboarding-notes.md` for practice so existing files are not overwritten. If editing an existing file, inspect it first and avoid `>` redirection unless replacement is explicitly intended. Use append or a normal file edit with a clear explanation.

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
| `web/brief-board.html` | User-facing onboarding board with git branch graph, source-backed work map, candidate mission view, artifact matrix, and CLI summary |
| `workspace-map.html` | Show the user's local work root and repo folders |
| `git-local-remote.html` | Explain local repo vs GitHub remote |
| `git-cycle.html` | Explain edit, status, add, commit, push, pull |
| `repo-dashboard.html` | Summarize current path, remote, branch, and dirty state |

Work Environment Setup is done when the user has a work root, known GitHub account readiness, verified GitHub auth or a recorded blocker, a repo in a known location, a connected remote or recorded local-only exception, one demonstrated Git loop, and a saved `environment-state.md`.

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
