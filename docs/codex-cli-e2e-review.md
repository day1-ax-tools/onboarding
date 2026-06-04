# Codex CLI E2E Review

Date: 2026-06-03

This document records a Codex CLI onboarding E2E run from the user's point of view. The goal was to see how the CLI conversation actually unfolds, then identify tuning points for the onboarding prompt, skill, and user journey.

Raw run artifacts are stored under:

```text
.tmp/e2e/codex-dialogue/
  prompts/
  outputs/
  user-work/
```

Sensitive local identifiers are sanitized in this document:

- GitHub account: `<github-account>`
- Long local path prefix: `<repo-root>`

## Test Setup

```text
<repo-root>/.tmp/e2e/codex-dialogue/
  onboarding-kit/   # copied onboarding kit
  user-work/        # practice local Git repo
```

Codex command shape:

```bash
codex exec \
  -C <repo-root>/.tmp/e2e/codex-dialogue/onboarding-kit \
  --add-dir <repo-root>/.tmp/e2e/codex-dialogue/user-work \
  -s workspace-write \
  --output-last-message <turn-output-file> \
  - < <turn-prompt-file>
```

Resume command shape:

```bash
codex exec resume --last \
  --output-last-message <turn-output-file> \
  - < <turn-prompt-file>
```

Important E2E caveat: the first `codex exec` turn used `workspace-write`, but `codex exec resume --last` reported `danger-full-access`. This should be treated as a test harness risk. A real beginner-facing E2E should either use the interactive TUI, or verify how to preserve permission settings across resumed non-interactive turns.

## Executive Review

Overall, Codex performed better than the earlier Claude Code non-interactive E2E on the initial environment checks.

Strengths:

- It loaded the `work-mission-discovery` skill and explicitly said it would use it.
- It directly ran safe inspection commands instead of asking the beginner to run `pwd`, `git status`, or `gh auth status`.
- It avoided GitHub repo creation and push.
- It explained local/remote, `git add`, `git commit`, and push in beginner-friendly language.
- It wrote real artifacts and verified them with `git diff --check`.
- It asked short next-step questions.

Tuning points:

- Raw non-interactive stdout is noisy because Codex emits skill loader warnings and command logs. User-facing docs should use the final assistant message, not raw stdout.
- Resume mode changed to `danger-full-access` in this E2E harness.
- The onboarding-kit copy lived under the current repo's `.tmp`, so `git status` in `onboarding-kit` saw the parent repo's dirty state. Future E2E runs should be outside the source repo, or should isolate the copied kit with its own Git boundary.
- Codex wrote `environment-state.md` before installing `.onboarding` hooks and brief board files into `user-work`. That is acceptable for a local-only E2E, but the intended user journey should install project instructions, skill, hooks, and brief board before relying on board updates.
- Codex repeatedly updated `environment-state.md` to describe the current Git state. This was accurate, but it can create extra local changes immediately after a commit.
- The transition to work grounding was good, but it left uncommitted environment updates. It did disclose that state, which is good.

## Transcript

### Turn 01

User:

```text
$work-mission-discovery 로 AI CLI 온보딩을 시작해줘.
[당시에는 환경 확인과 단계 진행 지시를 시작 문장에 포함했다. 현재 기준에서는 이 내용을 skill 내부 규칙으로 이동했다.]

E2E 테스트 상황이야.
- 사용자는 AI CLI 초보자야.
- 실제 작업 repo 후보는 <repo-root>/.tmp/e2e/codex-dialogue/user-work 이야.
- 현재 turn에서는 외부 상태를 바꾸지 마. GitHub repo 생성, push, PR 생성은 금지야.
- 확인 명령은 직접 실행해도 돼: pwd, ls, git status, git remote -v, git branch --show-current, command -v gh, gh auth status.
- 파일 쓰기나 명령 실행이 필요하면 <repo-root>/.tmp/e2e/codex-dialogue/user-work 또는 현재 온보딩 키트 복사본 안에서만 진행해.
```

Codex:

```text
확인했습니다. 외부 상태 변경은 하지 않았습니다.

- 현재 폴더: `onboarding-kit`
- 실제 작업 repo 후보: `user-work`
- `user-work` Git 상태: `main` 브랜치, 변경 없음
- `user-work` 원격: 아직 없음
- GitHub CLI: 설치됨, `<github-account>` 계정으로 로그인됨

다음 한 단계만 하겠습니다:
`<repo-root>/.tmp/e2e/codex-dialogue/user-work`를 이번 온보딩의 작업 repo로 확정해도 될까요?
```

Review:

- Good: Codex directly checked current folder, work repo, Git status, remote, branch, and GitHub CLI auth.
- Good: It did not create a repo or push.
- Good: It asked exactly one decision question.
- Needs tuning: Account identity should be masked or summarized in user-facing board/logs unless needed.

### Turn 02

User:

```text
네, 그 폴더를 이번 온보딩의 작업 repo로 확정해도 됩니다.
다음 한 단계만 진행해 주세요.
```

Codex:

```text
작업 repo 확정을 기록했습니다: [environment-state.md](<repo-root>/.tmp/e2e/codex-dialogue/user-work/environment-state.md)

확인한 증거:
- `user-work`는 `main` 브랜치의 로컬 Git repo입니다.
- GitHub remote는 아직 없습니다.
- GitHub CLI 로그인은 `<github-account>`로 확인되어 있습니다.
- `git diff --check` 통과했습니다.
- 외부 상태 변경, push, PR 생성은 하지 않았습니다.

다음 한 단계는 이 repo를 기준으로 “내 컴퓨터의 로컬 repo”와 “GitHub remote” 차이를 짧게 설명하는 것입니다.
```

Review:

- Good: It actually wrote `environment-state.md`, then verified it.
- Good: It did not claim recording without a file.
- Needs tuning: In the intended user journey, project instructions, skill, `.onboarding` hooks, and brief board should be installed before board-backed state is expected.

### Turn 03

User:

```text
좋아요. local repo와 GitHub remote 차이를 설명해 주세요.
초보자 입장에서 헷갈리지 않게, 다음 한 단계만 진행해 주세요.
```

Codex:

```text
좋습니다. 이 repo 기준으로만 보면 이렇게 이해하시면 됩니다.

`local repo`는 지금 내 컴퓨터에 있는 폴더입니다.
이번에는 여기입니다:

`<repo-root>/.tmp/e2e/codex-dialogue/user-work`

`GitHub remote`는 GitHub 웹사이트에 있는 연결 상대입니다.
그런데 이 repo는 아직 GitHub remote가 없습니다. 즉, 지금은 “내 컴퓨터 안의 Git repo”만 있고, GitHub 쪽 짝은 아직 연결되지 않은 상태입니다.

핵심은 이것입니다:

- `commit`: 내 컴퓨터 repo에 저장
- `push`: 내 컴퓨터의 commit을 GitHub로 보냄
- `pull`: GitHub의 변경을 내 컴퓨터로 가져옴

자동으로 동기화되지 않습니다. `commit`, `push`, `pull`을 해야 이동합니다.

다음 한 단계 확인 질문입니다:
지금 `user-work` repo는 “local repo만 있고 GitHub remote는 아직 없다”라고 이해하시면 맞을까요?
```

Review:

- Good: The explanation is concrete and tied to the user's actual repo.
- Good: It avoids jargon-first teaching.
- Good: It checks understanding before moving on.

### Turn 04

User:

```text
네, 이해했습니다. user-work는 local repo만 있고 GitHub remote는 아직 없다는 뜻으로 이해했어요.
다음 한 단계만 진행해 주세요.
```

Codex:

```text
이번 단계는 완료했습니다. 이해 확인을 [environment-state.md](<repo-root>/.tmp/e2e/codex-dialogue/user-work/environment-state.md)에 기록했습니다.

확인 결과:
- `git diff --check` 통과
- 현재 Git 상태: `?? environment-state.md`

여기서 `??`는 “Git이 새 파일을 발견했지만 아직 commit할 대상으로 올리지는 않았다”는 뜻입니다. 즉, 파일은 폴더에 있지만 아직 Git 저장 기록에는 들어가지 않았습니다.

다음 한 단계는 `git add`로 이 파일을 commit 후보에 올리는 것입니다.
```

Review:

- Good: It used the actual `git status` symbol as a teachable moment.
- Good: It did not skip straight to commit.
- Needs tuning: This is useful, but it may pull the user into Git mechanics before project hook/board installation.

### Turn 05

User:

```text
좋아요. git add 단계로 진행해 주세요.
초보자가 이해할 수 있게 지금 무엇이 바뀌는지만 짧게 설명해 주세요.
```

Codex:

```text
`git add environment-state.md`까지 진행했습니다.

지금 바뀐 것은 파일 내용이 아니라 Git 안의 상태입니다.
`environment-state.md`가 “다음 commit에 포함될 후보”로 올라갔습니다.

확인 결과:
- `git status`: `A  environment-state.md`
- 뜻: 새 파일이 commit 대기 목록에 올라감
- `git diff --check --cached` 통과

다음 한 단계는 `git commit`으로 이 대기 목록을 로컬 repo 기록에 저장하는 것입니다.
```

Review:

- Good: The explanation of `git add` is excellent for beginners.
- Good: It stages only the intended file.
- Good: It verifies the staged diff.

### Turn 06

User:

```text
좋아요. git commit 단계로 진행해 주세요.
이 단계도 초보자가 이해할 수 있게 짧게 설명해 주세요.
```

Codex:

```text
`git commit` 완료했습니다.

지금 바뀐 것은 `environment-state.md`가 로컬 repo의 저장 기록에 들어갔다는 점입니다.
아직 GitHub로 보낸 것은 아닙니다.

확인 결과:
- 새 commit: `77f3fa1 Record onboarding environment state`
- 현재 Git 상태: 깨끗함
- GitHub remote: 아직 없음

다음 한 단계는 “push는 무엇이고, 왜 지금은 아직 할 수 없는지”를 확인하는 것입니다.
```

Review:

- Good: It clearly distinguishes commit from push.
- Good: It verifies the local commit and working tree.
- Needs tuning: The commit message is serviceable, but for onboarding a Korean beginner-facing commit message could be more explanatory.

### Turn 07

User:

```text
좋아요. push가 무엇이고 왜 지금은 아직 할 수 없는지 설명해 주세요.
GitHub repo 생성이나 push는 실행하지 말고, 선택지만 보여주세요.
```

Codex:

```text
`push`는 내 컴퓨터의 commit을 GitHub remote로 보내는 단계입니다.

지금은 아직 할 수 없습니다. 이유는 간단합니다:
`user-work`에는 GitHub remote가 연결되어 있지 않아서, Git이 “어느 GitHub repo로 보낼지” 모릅니다.

선택지는 3가지입니다.

1. **로컬 repo만 계속 사용하기**
   지금처럼 `status → add → commit` 연습을 계속합니다. 외부 변경이 없어서 가장 안전합니다. 추천 기본값입니다.

2. **이미 있는 GitHub repo에 나중에 연결하기**
   GitHub에 이미 만들어진 repo 주소를 받아서 이 local repo와 연결합니다. 연결 후에야 push할 수 있습니다.

3. **새 GitHub repo를 나중에 만들고 연결하기**
   GitHub에 새 repo를 만든 뒤 이 local repo를 push합니다. 외부 상태가 생기므로 명시적 승인 후에만 진행해야 합니다.

이번 E2E에서는 1번, 로컬 repo만 계속 사용하는 흐름이 가장 안전합니다.
```

Review:

- Good: It does not run `gh repo create` or `git push`.
- Good: It frames options by consequence.
- Good: The recommended default is safe.

### Turn 08

User:

```text
좋아요. 이번 E2E에서는 로컬 repo만 계속 사용하는 흐름으로 하겠습니다.
이제 다음 단계로 넘어가 주세요.
```

Codex:

```text
로컬 repo만 계속 쓰는 결정은 [environment-state.md](<repo-root>/.tmp/e2e/codex-dialogue/user-work/environment-state.md)에 기록했습니다.

확인 결과:
- `git diff --check` 통과
- 현재 상태: `M environment-state.md`
- 뜻: 방금 기록한 내용이 아직 commit되지는 않은 로컬 수정입니다.
- GitHub repo 생성이나 push는 하지 않았습니다.

이제 작업 이해 단계로 넘어가겠습니다. 아래 3가지만 답해 주세요.

1. 어떤 역할을 맡고 계신가요?
2. 그 역할에서 가장 중요하게 책임지는 결과는 무엇인가요?
3. 최근 1-2주 동안 실제로 시간을 많이 쓴 반복 업무는 무엇인가요?
```

Review:

- Good: It discloses the uncommitted local modification.
- Good: It transitions to work grounding with exactly three questions.
- Needs tuning: It may be better to either commit the environment update or explicitly say "이 변경은 다음 commit에서 함께 저장하겠습니다" before moving on.

### Turn 09

User:

```text
저는 AI CLI 온보딩 프로그램을 설계하고 운영하는 사람입니다.
가장 중요한 결과는 초보자가 설치, Git/GitHub 이해, 업무 정의, 첫 자동화 미션 선택까지 실제로 도달하는 것입니다.
최근 1-2주 동안은 설치 안내 화면 만들기, Codex/Claude CLI 첫 실행 흐름 확인, GitHub repo와 brief board 흐름 정리에 시간을 많이 썼습니다.
```

Codex:

```text
역할/결과/최근 업무를 기록했습니다.

변경한 파일:
- [interview-state.md](<repo-root>/.tmp/e2e/codex-dialogue/user-work/interview-state.md)
- [work-map.md](<repo-root>/.tmp/e2e/codex-dialogue/user-work/work-map.md)
- [logs/2026-06-03-work-grounding.md](<repo-root>/.tmp/e2e/codex-dialogue/user-work/logs/2026-06-03-work-grounding.md)

확인 결과 `git diff --check` 통과했습니다. 현재는 로컬 수정/새 파일만 있고 외부 변경은 없습니다.

다음 한 단계는 “업무 하나를 실행 가능한 단계로 쪼개기”입니다.
추천은 **GitHub repo 흐름 정리**입니다. 초보자가 가장 자주 헷갈리고, 문서/보드 흐름으로 검증하기 쉬워서 첫 분해 대상으로 좋습니다.

어느 것을 먼저 쪼갤까요?

1. GitHub repo 흐름 정리 - 추천
2. brief board 흐름 정리
3. Codex/Claude CLI 첫 실행 흐름 확인
4. 설치 안내 화면 만들기
```

Review:

- Good: It records role, outcome, recent work, and artifacts.
- Good: It recommends one decomposition target and explains why.
- Good: It keeps options bounded.
- Needs tuning: If brief board is part of the intended experience, `.onboarding` and board-data generation should happen before this point or be clearly marked as not installed yet.

## User-Experience Findings

| Area | Finding | Tuning |
| --- | --- | --- |
| First handoff | The revised handoff prompt worked for Codex because it caused direct environment checks. | Current decision: keep the visible handoff trigger-only and move those checks into the skill rules. |
| Beginner burden | Codex did not ask the user to run basic inspection commands. | Keep this as the desired default. |
| Git teaching | `??`, `A`, commit, and push were explained in plain language. | Good pattern to preserve. |
| Side effects | Codex avoided GitHub repo creation and push. | Keep explicit side-effect approval rule. |
| Artifact truth | Codex wrote files before claiming they were recorded. | Good pattern to preserve. |
| Board timing | `.onboarding` hooks and brief board were not installed in this E2E. | Intended flow should install hooks/board before claiming board-backed progress. |
| Resume safety | `codex exec resume --last` showed `danger-full-access`. | Non-interactive E2E harness needs a safer resume strategy or clear isolation. |
| Output noise | Raw stdout includes warnings and diffs. | User-facing transcript should capture final messages, not raw stdout. |
| State churn | Codex updated `environment-state.md` repeatedly to match transient Git states. | Prefer durable facts over transient "currently staged" lines unless teaching Git state is the goal. |

## Recommended Tuning

1. Use a trigger-only Codex handoff prompt:

   ```text
   $work-mission-discovery 로 AI CLI 온보딩을 시작해줘.
   ```

2. Add a stronger rule to onboarding artifacts: record durable state, not every transient Git state.

   Better:

   ```text
   Git loop evidence: environment-state.md was added and committed locally.
   ```

   Avoid:

   ```text
   Git staging area: environment-state.md is staged for the next commit.
   ```

3. Before work grounding, decide whether the local environment changes should be committed or intentionally left pending.

4. In the intended user journey, install project-local instructions, skill, `.onboarding` hooks, and brief board before claiming the board can track progress.

5. For E2E harnesses, place temporary onboarding kits outside the source repo so `git status` does not accidentally resolve to the parent repo.

6. For non-interactive Codex E2E, avoid relying on `resume --last` until permission preservation is confirmed.
