# CLI Conversation Flow

이 문서는 사용자가 웹 진입점에서 AI CLI로 넘어간 뒤, 실제 CLI 안에서 어떤 대화가 이어져야 하는지 보여주기 위한 튜닝 기준이다.

목표는 사용자가 모든 과정을 미리 읽는 것이 아니라, CLI와 한 단계씩 대화하면서 환경 설정, Git/GitHub 이해, 업무 정의, 자동화 미션 생성을 경험하는 것이다.

## 현재 결정

초기 Claude Code CLI 확인에서는 짧은 시작 문장만으로는 충분하지 않아 보였다. 이후 튜닝 결과, 문제는 문장 길이가 아니라 CLI가 skill을 읽을 수 있는 위치, skill 설치 상태, 그리고 skill 내부 규칙이었다.

현재 기준은 사용자-level skill 선설치 후 trigger-only handoff다. 사용자는 skill 호출 의도만 입력하고, 현재 폴더 확인, 작업 repo 후보 확인, Git/GitHub CLI 상태 확인, 한 단계씩 진행은 `work-mission-discovery` skill이 맡는다.

Codex:

```text
$work-mission-discovery 로 AI CLI 온보딩을 시작해줘.
```

Claude Code:

```text
work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요.
```

## 실제 확인에서 얻은 결론

Claude Code CLI로 확인한 결과, skill 지침을 읽을 수 없는 위치에서는 짧은 시작 문장만으로 충분하지 않았다. 이제 bootstrap 단계에서 선택한 도구의 사용자-level skill을 먼저 설치해 이 문제를 줄인다.

| 시작 위치 | 관찰된 동작 | 튜닝 결론 |
| --- | --- | --- |
| 사용자 skill 없음 | `work-mission-discovery`를 일반 문구처럼 해석하고, 설치/업무/자동화 중 무엇을 할지 묻는 일반 안내가 나옴 | bootstrap에서 사용자-level skill을 먼저 설치한다 |
| 사용자 skill 있음, project-local 설치 전 | skill이 현재 폴더와 작업 repo 후보를 확인해야 함 | 첫 실행 라우터로 처리하고, 업무 repo 확정 뒤 project-local 설치를 진행한다 |
| project-local 설치 후 | repo 안의 지침, skill, 상태 hook으로 이어감 | 이후 resume은 repo-local 상태를 기준으로 한다 |

따라서 웹에서 CLI로 넘기는 단계는 단순히 선택한 CLI를 실행하는 형태가 된다. 실제 업무 repo가 애매하면 skill이 확인 질문을 한다.

그 다음 CLI 입력창에는 trigger-only 시작 문장만 붙여넣는다.

```text
work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요.
```

## Claude CLI E2E Run

2026-06-03에 Claude Code CLI를 실제로 호출해 작은 E2E를 진행했다. 테스트는 실제 repo를 건드리지 않도록 `.tmp/e2e/claude-dialogue-clean/` 아래에서 실행했다.

테스트 구성:

```text
.tmp/e2e/claude-dialogue-clean/
  onboarding-kit/   # 온보딩 repo 복사본
  user-work/        # 초보자의 작업 repo 역할을 하는 테스트 Git repo
  turn-01.txt
  turn-02.txt
  ...
```

당시 사용한 시작 프롬프트:

```text
work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요.
[당시에는 환경 확인과 단계 진행 지시를 시작 문장에 포함했다. 현재 기준에서는 이 내용을 skill 내부 규칙으로 이동했다.]

E2E 테스트 상황입니다.
- 사용자는 AI CLI 초보자입니다.
- 실제 작업 repo 후보는 <user-work> 입니다.
- 현재 응답에서는 전체 과정을 길게 설명하지 말고, 첫 단계 대화만 진행해주세요.
- 파일 쓰기나 명령 실행이 필요하면 <user-work> 또는 현재 온보딩 키트 복사본 안에서만 진행하세요.
```

### E2E 관찰 0: 온보딩 키트와 작업 repo 상태 혼동

첫 번째 테스트에서는 온보딩 키트 복사본에 `.onboarding/state.json`이 함께 들어가 있었다. Claude는 이를 사용자 작업 repo의 상태로 오해하고 아래처럼 응답했다.

```text
현재 온보딩 상태를 확인했습니다.
cli-install, auth, cli-handoff, kit-install은 완료됐고,
다음 단계는 work-root입니다.
```

튜닝:

- `.onboarding/`은 온보딩 키트 repo에 커밋하지 않는다.
- CLI는 온보딩 키트 폴더의 `.onboarding/state.json`을 active project state로 보지 않는다.
- active state는 사용자가 선택한 work repo 안에 설치된 `.onboarding/state.json`이다.

### E2E 관찰 1: CLI가 검증 명령을 사용자에게 대신 시킴

clean run의 첫 응답:

```text
지금 터미널에서 어느 폴더에 계신지 확인해볼까요?

터미널에 아래 명령어를 입력해주세요:

pwd

결과를 알려주시면 다음 단계를 안내해드리겠습니다.
```

두 번째 응답도 같은 패턴이었다.

```text
아래 명령어를 실행해주세요:

git -C <user-work> status

결과를 알려주시면 다음 단계를 안내해드리겠습니다.
```

문제:

- CLI가 할 수 있는 read-only 검증을 초보자에게 넘겼다.
- 사용자는 명령 실행과 결과 해석을 동시에 해야 해서 부담이 커진다.

튜닝:

- CLI는 `pwd`, `ls`, `git status`, `git remote -v`, `git branch --show-current`, `gh auth status`를 가능하면 직접 실행한다.
- 사용자는 인증, 권한 승인, repo 생성 승인, 작업 루트 선택 같은 결정에 집중한다.

### E2E 관찰 1-1: 튜닝 후에는 환경 확인을 건너뛰는 문제가 생김

skill에 "안전한 확인 명령은 직접 실행" 규칙을 넣은 뒤 다시 돌렸을 때, Claude는 이번에는 환경 확인을 하지 않고 바로 업무 질문으로 넘어갔다.

```text
첫 번째 질문입니다:

지금 컴퓨터에서 어떤 작업을 주로 하시나요?
```

문제:

- 온보딩 시작점이 Work Environment Setup이 아니라 Work Grounding으로 튀었다.
- 사용자에게 작업 repo 후보가 있어도 Git 상태, remote, hook 설치 여부를 먼저 확인하지 않았다.

튜닝:

- 시작 문장을 길게 만들지 않고, skill의 entry point 규칙을 "AI CLI 온보딩 시작 요청은 Env-0부터"로 강화한다.
- 현재 폴더, 작업 repo, Git/GitHub CLI 상태 확인과 한 단계씩 진행은 시작 문장이 아니라 skill의 기본 책임으로 둔다.

### E2E 관찰 1-2: 작업 repo 접근 권한이 없으면 다시 사용자 실행으로 돌아감

작업 repo가 온보딩 키트 폴더 밖에 있을 때, Claude는 해당 repo를 "접근 제한"으로 보고 다시 사용자에게 명령 실행을 요청했다.

```text
작업 repo 후보: <user-work> — 아직 내용 미확인 (접근 제한)

터미널에서 아래 두 명령을 실행해서 결과를 알려주세요:
git --version
gh auth status
```

튜닝:

- 실제 대화에서는 작업 repo를 선택한 직후 Claude Code가 접근 권한을 요청할 수 있음을 안내한다.
- E2E 테스트에서는 `--add-dir <user-work>`를 사용해 작업 repo 접근을 허용한 상태도 별도로 검증한다.
- 사용자 skill에서 시작하더라도, 실제 설치 이후에는 작업 repo 안의 `.onboarding/brief-board.html`과 project-local 지침으로 이어져야 한다.

### E2E 관찰 1-3: 권한을 허용하면 Git 상태는 직접 확인했지만 gh 확인은 약했음

`--add-dir`와 제한된 Bash 권한을 준 뒤에는 Claude가 Git 상태와 remote 여부를 직접 확인했다.

```text
현재 확인한 내용:
- 작업 폴더 후보: <user-work>
- Git 브랜치: main
- 변경사항: 없음
- GitHub 원격 연결: 없음
```

하지만 `gh auth status`는 여전히 사용자에게 실행을 요청했다.

튜닝:

- 시작 문장을 길게 만들지 않고, Git/GitHub CLI 상태 확인을 skill/playbook의 기본 실행 규칙으로 둔다.
- playbook에 `command -v gh` 또는 `gh --version` 후 `gh auth status`를 직접 실행하라고 명시한다.
- 사용자에게 묻는 것은 로그인 필요 여부, 계정/조직 선택, repo 생성 동의처럼 사람이 결정해야 하는 지점으로 제한한다.

## Codex CLI E2E Run

Codex CLI도 별도 E2E를 실행했다. 전체 transcript와 사용자 관점 리뷰는 `docs/codex-cli-e2e-review.md`에 기록했다.

핵심 결론:

- Codex는 수정된 handoff 문장으로 시작했을 때 현재 폴더, 작업 repo, Git/GitHub CLI 상태를 직접 확인했다.
- `local repo`, `remote`, `add`, `commit`, `push`를 초보자에게 비교적 잘 설명했다.
- GitHub repo 생성과 push는 실행하지 않고 선택지로만 제시했다.
- 실제 파일을 쓴 뒤 `git diff --check`로 검증했다.
- 다만 `.onboarding` hook과 brief board 설치 전부터 업무 산출물을 만들기 시작했으므로, 선택된 work repo 확정 직후 project-local onboarding 설치를 더 강하게 유도해야 한다.
- `environment-state.md`가 일시적인 Git 상태를 계속 따라가며 수정되는 경향이 있어, durable evidence 중심으로 기록하도록 튜닝해야 한다.

### E2E 관찰 2: local/remote 설명은 좋았음

세 번째 응답:

```text
user-work는 로컬 Git 저장소입니다.
그런데 GitHub 원격(remote)이 연결되어 있지 않습니다.

내 컴퓨터 (local)          GitHub (remote)
─────────────────          ───────────────
user-work/         ←→      github.com/내계정/저장소
  (내가 편집)               (웹에서 보이는 사본)

둘은 자동으로 동기화되지 않습니다.
push로 보내고, pull로 가져와야 합니다.
```

유지할 점:

- local과 remote를 사용자의 눈에 보이는 위치로 설명했다.
- push/pull을 동기화가 아니라 이동 방향으로 설명했다.

보완할 점:

- `gh auth status`는 직접 실행해야 한다.

### E2E 관찰 3: OS와 package manager를 단정함

`gh`가 없다고 했을 때의 응답:

```text
macOS 기준 설치 명령어:

brew install gh

Homebrew가 없다면 먼저:
...
```

문제:

- OS와 shell 정보가 없거나 불확실할 때도 macOS/Homebrew를 단정했다.
- GitHub CLI 설치가 막히면 무엇을 계속할 수 있는지 알려주지 않았다.

튜닝:

- OS와 shell은 웹에서 선택한 값을 이어받거나 CLI가 확인한다.
- `gh`가 없으면 `github-auth`는 blocked로 둘 수 있지만, local Git 학습과 업무 인터뷰는 계속할 수 있다고 안내한다.

### E2E 관찰 4: 실제 GitHub repo 생성 명령을 너무 빨리 제안함

GitHub 인증이 됐다고 가정하자 Claude가 바로 아래 명령을 제안했다.

```bash
gh repo create user-work --private --source=<user-work> --remote=origin --push
```

문제:

- 실제 GitHub에 repo를 만들고 push하는 external side effect다.
- 초보자에게는 실행 전 선택지와 명시적 동의가 필요하다.
- E2E 테스트 상황에서는 실제 외부 상태를 바꾸면 안 된다.

튜닝:

```text
다음 선택지가 있습니다.

1. 기존 GitHub repo에 연결
2. 새 private repo 생성
3. 지금은 local-only로 계속 진행

GitHub에 새 repo를 만들면 실제 계정에 저장소가 생기고,
현재 commit이 GitHub로 올라갑니다.
어떤 방식으로 진행할까요?
```

### E2E 관찰 5: "기록했다"고 말했지만 실제 파일은 없었음

사용자가 remote 연결을 미루겠다고 하자 Claude가 이렇게 응답했다.

```text
상태를 기록했습니다. (github-auth: blocked ...)
```

하지만 테스트 폴더에는 `environment-state.md`, `.onboarding/state.json` 같은 기록 파일이 없었다.

문제:

- 실제 기록 없이 "기록했다"고 말했다.
- 사용자는 무엇이 어디에 저장되었는지 알 수 없다.

튜닝:

- 파일을 쓰기 전에는 "이 결정은 아직 대화에만 남아 있습니다"라고 말한다.
- hook이나 artifact 설치 후에만 "기록했습니다"라고 말한다.
- 기록했다면 파일 경로와 확인 증거를 함께 말한다.

### E2E 관찰 6: Git loop 연습 명령이 기존 파일을 덮어쓸 수 있었음

Claude가 제안한 명령:

```bash
echo "# 내 작업 메모" > <user-work>/README.md
git -C <user-work> add README.md
git -C <user-work> commit -m "첫 번째 커밋: README 추가"
```

문제:

- `>`는 기존 README를 덮어쓴다.
- 초보자 교육용 Git loop에서 기존 파일 삭제 위험을 만들 필요가 없다.

튜닝:

- 연습 파일은 `onboarding-notes.md`처럼 새 파일을 사용한다.
- 기존 파일을 수정해야 하면 먼저 읽고, 변경 의도를 설명한다.

좋은 예:

```bash
printf "첫 Git 연습 메모\n" >> <user-work>/onboarding-notes.md
git -C <user-work> status --short
git -C <user-work> add onboarding-notes.md
git -C <user-work> commit -m "Add onboarding practice notes"
```

## 대화 운영 원칙

CLI 응답은 항상 아래 순서로 짧게 움직인다.

```text
현재 상태 확인
→ 확인한 사실 요약
→ 다음 1-3개 질문
→ 필요한 명령 실행 또는 파일 작성
→ 완료 증거 확인
→ brief board 갱신
→ 다음 작은 행동 안내
```

한 번의 응답에서 사용자가 앞으로 배울 내용을 모두 공개하지 않는다. 사용자가 지금 해야 할 행동과 그 행동의 이유만 보여준다.

## 전체 대화 흐름

```mermaid
flowchart TD
  A["웹: CLI 설치/검증"] --> B["웹: 온보딩 키트 받기"]
  B --> C["Bootstrap: 사용자 skill 선설치"]
  C --> D["CLI: 짧은 시작 문장 입력"]
  D --> E["환경 확인"]
  E --> F["작업 루트 선택"]
  F --> G["GitHub와 local/remote 이해"]
  G --> H["작업 repo에 지침/skill/hook 설치"]
  H --> I["brief board 열기"]
  I --> J["역할과 성과 정의"]
  J --> K["업무 영역과 작업 분해"]
  K --> L["자동화 후보 분류"]
  L --> M["첫 미션 선택"]
  M --> N["mission backlog와 automation brief 생성"]
```

## 실제 대화 예시

아래는 사용자가 Claude Code에서 온보딩을 시작했을 때 기대하는 대화다. Codex도 구조는 동일하되, CLI 이름과 지침 파일 경로만 달라진다.

### 0. 웹에서 CLI로 넘기는 순간

웹은 긴 프롬프트를 보여주지 않는다. 사용자는 CLI를 실행한 뒤 짧은 시작 문장만 입력한다.

```text
사용자:
work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요.
```

```text
Claude Code:
좋습니다. 먼저 현재 터미널이 어디를 기준으로 실행되고 있는지 확인하겠습니다.

제가 확인할 것은 세 가지입니다.
1. 지금 폴더가 실제 작업 repo인지, 아니면 작업 repo를 따로 골라야 하는지
2. 앞으로 실제 작업을 둘 로컬 작업 루트가 있는지
3. 이 repo에 온보딩 지침과 skill을 설치할 수 있는지

먼저 현재 위치를 확인하겠습니다.
```

예상 명령:

```bash
pwd
ls
```

튜닝 포인트:

- "온보딩 전체를 설명하겠습니다"로 시작하지 않는다.
- 사용자가 지금 보는 터미널 위치부터 확인한다.
- 명령을 실행하기 전에 왜 필요한지 한 문장으로 설명한다.

### 1. 권한 요청을 처음 경험하는 구간

Claude Code는 파일 읽기, shell 명령, 파일 쓰기 요청을 여러 번 물어볼 수 있다. 이 마찰은 처음에는 그대로 경험하게 둔다.

```text
Claude Code:
지금은 온보딩 키트 안에 필요한 파일이 있는지 확인하는 단계입니다.
파일 목록을 읽고, 이후 실제 작업 폴더로 복사할 지침 파일을 확인하겠습니다.

권한 요청이 나오면 이번 온보딩에서는 `1. Yes`를 선택해 주세요.
작업이 끝난 뒤 각 요청이 왜 나왔는지 정리해서 설명하겠습니다.
```

예상 사용자 경험:

```text
Claude Code asks permission to read files
사용자: 1. Yes

Claude Code asks permission to run bash command
사용자: 1. Yes

Claude Code asks permission to write setup files
사용자: 1. Yes
```

튜닝 포인트:

- 권한 모드 설명을 처음부터 길게 하지 않는다.
- 먼저 실패/반복 요청을 경험하게 한 뒤, setup 완료 후 `default`, `acceptEdits`, `plan`, `auto`, `bypassPermissions`를 설명한다.
- `bypassPermissions`는 일반 로컬 온보딩에서는 권장하지 않는다.

### 2. 작업 루트 선택

```text
Claude Code:
현재 온보딩 키트는 준비되어 있습니다.
이제 AI와 함께 작업할 로컬 기준 폴더를 정하겠습니다.

추천 위치는 아래입니다.

~/Documents/AI-Work/

이 폴더를 기준으로 GitHub repo를 아래처럼 정리합니다.

AI-Work/
  <github-org-or-user>/
    <repo-name>/
  personal/
  inbox/
  archive/

질문은 하나만 드리겠습니다.
앞으로 AI와 함께 작업할 repo들을 `~/Documents/AI-Work/` 아래에 두어도 괜찮을까요?
```

사용자 답변 예:

```text
네, 그렇게 할게요.
```

```text
Claude Code:
좋습니다. 그럼 이 폴더를 작업 루트로 기록하겠습니다.

이제 실제 작업 repo를 어디에 둘지 확인하겠습니다.
이미 GitHub에 있는 repo를 가져올까요, 아니면 연습용 private repo를 새로 만들까요?
```

튜닝 포인트:

- "work root"라는 말만 던지지 않는다.
- "AI와 함께 작업할 repo들을 모아두는 기준 폴더"라고 설명한다.
- 선택지는 2-3개만 준다.

### 3. local repo와 GitHub remote 설명

```text
Claude Code:
여기서 중요한 개념이 하나 있습니다.

내 컴퓨터의 폴더가 local repo이고,
GitHub 웹에 있는 저장소가 remote repo입니다.

둘은 연결되어 있지만 자동으로 동기화되지는 않습니다.

local에서 작업한 변경은 commit으로 저장하고,
push로 GitHub에 보냅니다.
GitHub 쪽 변경은 pull로 다시 가져옵니다.
```

시각화가 필요하면 CLI가 HTML을 만들거나 brief board의 Git branch graph를 사용한다.

```text
local repo
  edit
  status
  add
  commit
     |
     | push
     v
GitHub remote
     |
     | pull
     v
local repo
```

튜닝 포인트:

- `git status`, `git add`, `git commit`을 명령어 암기처럼 가르치지 않는다.
- 각 명령을 "무슨 상태 변화가 일어나는가"로 설명한다.

### 4. 작업 repo에 온보딩 설치

온보딩 키트 자체는 설치 후 받은 교육 자료다. 실제 업무 repo에는 프로젝트 지침, skill, 상태 hook, brief board가 별도로 설치되어야 한다.

```text
Claude Code:
이제 실제 작업 repo 안에 온보딩을 이어갈 파일을 설치하겠습니다.

설치되는 것은 네 가지입니다.
1. CLI가 읽을 지침 파일
2. 업무 인터뷰를 진행할 skill
3. 온보딩 진행 상태를 기록하는 `.onboarding` 파일
4. 진행 상황을 보여주는 brief board

설치 후에는 이 repo 안에서 대화를 이어갈 수 있습니다.
```

Claude Code 설치 예:

```bash
cp templates/CLAUDE.md CLAUDE.md
mkdir -p .claude/skills
cp -R .claude/skills/work-mission-discovery <target-repo>/.claude/skills/
mkdir -p <target-repo>/.onboarding
cp -R templates/onboarding/. <target-repo>/.onboarding/
cp web/brief-board.html <target-repo>/.onboarding/brief-board.html
```

Codex 설치 예:

```bash
cp templates/AGENTS.md AGENTS.md
mkdir -p .agents/skills
cp -R .agents/skills/work-mission-discovery <target-repo>/.agents/skills/
mkdir -p <target-repo>/.onboarding
cp -R templates/onboarding/. <target-repo>/.onboarding/
cp web/brief-board.html <target-repo>/.onboarding/brief-board.html
```

설치 완료 후:

```bash
node .onboarding/update-state.mjs kit-install done --evidence "project instructions, skill, state hook, and brief board installed"
```

튜닝 포인트:

- "fallback command" 같은 표현을 쓰지 않는다.
- "자동 설치가 어려울 때 직접 실행할 명령"처럼 사용자의 행동 기준으로 말한다.
- hook은 전역 기능이 아니라 repo 안의 온보딩 상태 기록 장치라고 설명한다.

### 5. brief board를 여는 시점

brief board는 CLI 첫 실행 직후가 아니라, 실제 작업 repo에 `.onboarding` 파일들이 설치된 뒤 열린다.

```text
Claude Code:
작업 repo에 온보딩 상태 파일을 설치했습니다.
이제 현재 진행 상황을 볼 수 있는 brief board를 열겠습니다.

이 보드는 입력창이 아니라 현황판입니다.
앞으로 제가 CLI에서 확인한 내용과 생성한 문서를 바탕으로 자동 갱신됩니다.
```

예상 명령:

```bash
python3 -m http.server 8790
```

열리는 화면:

```text
http://127.0.0.1:8790/.onboarding/brief-board.html
```

튜닝 포인트:

- board가 업무 내용을 직접 입력받지 않는다.
- board는 `.onboarding/state.json`과 `.onboarding/board-data.json`을 읽어 보여준다.
- source of truth는 markdown 산출물이다.

### 6. GitHub 인증과 Git loop

```text
Claude Code:
이제 GitHub와 연결 상태를 확인하겠습니다.
GitHub는 내 컴퓨터 밖에 있는 remote repo입니다.
CLI가 push, pull, PR을 하려면 GitHub 인증이 필요합니다.
```

예상 명령:

```bash
gh auth status
git remote -v
git branch --show-current
git status
```

인증이 안 된 경우:

```text
Claude Code:
아직 GitHub 인증이 되어 있지 않습니다.
이 상태에서는 local repo에서 작업은 가능하지만, GitHub로 push하거나 PR을 만들 수 없습니다.

다음 단계는 GitHub CLI 로그인을 진행하는 것입니다.
```

인증된 경우:

```text
Claude Code:
GitHub 인증과 remote 연결이 확인되었습니다.
이제 작은 파일 하나로 Git loop를 경험하겠습니다.

목표는 명령어를 외우는 것이 아니라,
변경이 local에서 GitHub로 이동하는 흐름을 눈으로 확인하는 것입니다.
```

튜닝 포인트:

- 인증 실패를 "오류"로만 말하지 않는다.
- 사용자가 지금 무엇을 할 수 있고 무엇을 할 수 없는지 구분한다.

### 7. 업무 정의 시작

환경 설정이 안정되면 업무 인터뷰로 넘어간다.

```text
Claude Code:
환경 설정은 여기까지 충분합니다.
이제 자동화할 일을 찾기 위해 당신의 업무를 이해하겠습니다.

먼저 세 가지만 여쭙겠습니다.

1. 어떤 역할을 맡고 계신가요?
2. 그 역할에서 최종적으로 책임지는 결과는 무엇인가요?
3. 최근 1-2주 동안 실제로 시간을 많이 쓴 일은 무엇인가요?
```

사용자 답변 예:

```text
저는 교육 프로그램을 설계하고 운영합니다.
수강생이 실제 업무에 AI를 적용하도록 만드는 게 목표입니다.
최근에는 온보딩 자료를 만들고, 실습 흐름을 정리하고, 레포를 구성하는 데 시간을 많이 썼습니다.
```

```text
Claude Code:
제가 이해한 내용은 이렇습니다.

역할: AI 활용 교육 프로그램 설계/운영
책임지는 결과: 수강생이 자기 업무에 AI를 실제로 적용하게 만드는 것
최근 반복 업무: 온보딩 자료 작성, 실습 흐름 설계, repo 구성

다음 질문은 하나입니다.
이 중 가장 자주 반복되거나, 매번 다시 정리하느라 시간이 많이 드는 일은 무엇인가요?
```

튜닝 포인트:

- 사용자의 답을 곧바로 자동화 후보로 확정하지 않는다.
- 먼저 역할, 결과, 반복 업무로 재정리한다.

### 8. 업무를 top-down으로 쪼개기

```text
Claude Code:
말씀하신 업무를 위에서부터 나누면 이렇게 보입니다.

목적:
수강생이 AI CLI를 자기 업무에 적용하게 만든다.

성과:
설치 완료, GitHub 연결, 첫 업무 미션 정의, 첫 자동화 실행

업무 영역:
1. 설치와 환경 설정
2. Git/GitHub 개념 학습
3. 업무 인터뷰
4. 자동화 후보 정리
5. 첫 미션 실행

이 중 하나를 더 잘게 쪼개보겠습니다.
먼저 가장 병목이 큰 영역은 어디인가요?
```

튜닝 포인트:

- 업무 구조를 "역할 → 성과 → 업무 영역 → 작업 → 단계"로 내린다.
- 사용자가 말한 단어를 유지한다.
- 새로운 용어를 만들 때는 기존 개념에 붙여 설명한다.

### 9. 자동화 후보 분류

```text
Claude Code:
지금까지 나온 작업을 자동화 관점에서 분류하면 이렇습니다.

| 작업 | 자동화 유형 | 첫 미션 적합도 | 이유 |
| --- | --- | --- | --- |
| 설치 상태 확인 | 검토 | 높음 | 입력과 성공 기준이 명확함 |
| GitHub 연결 안내 | 판단 보조/실행 | 중간 | 사용자 인증이 필요함 |
| 업무 인터뷰 요약 | 정리/작성 | 높음 | 텍스트 기반이고 검증 가능함 |
| 미션 백로그 생성 | 정리/작성 | 높음 | 반복 가치가 큼 |
| PR 자동 생성 | 실행 | 낮음 | 권한과 side effect가 큼 |

추천 첫 미션은 `업무 인터뷰 요약과 미션 백로그 생성`입니다.
반복적이고, 위험이 낮고, 결과를 사람이 쉽게 검토할 수 있기 때문입니다.

이 방향으로 첫 미션을 잡아도 괜찮을까요?
```

튜닝 포인트:

- 자동화 후보는 `수집`, `정리`, `작성`, `변환`, `검토`, `판단 보조`, `실행`, `모니터링`으로 분류한다.
- 첫 미션은 반복성, 명확성, 입력 가용성, 검증 가능성, 위험, 시간 절약으로 고른다.

### 10. 첫 미션 확정과 산출물 생성

```text
Claude Code:
좋습니다. 첫 미션을 아래 범위로 잡겠습니다.

[포함]
- 사용자의 역할과 성과 요약
- 반복 업무 영역 정리
- 자동화 후보 3-5개 생성
- 첫 미션 추천과 이유 작성

[제외]
- GitHub PR 자동 생성
- 외부 서비스에 데이터 전송
- 실제 업무 시스템 변경

[확인 필요]
- 사용자가 제공할 샘플 입력
- 결과물을 어떤 형식으로 검토할지
```

생성/갱신할 파일:

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

보드 갱신:

```bash
node .onboarding/update-board.mjs
node .onboarding/update-state.mjs mission-select done --evidence "first mission accepted and mission backlog updated"
```

튜닝 포인트:

- "자동화하겠습니다"로 바로 넘어가지 않는다.
- 포함, 제외, 나중에, 미확인 가정을 분리한다.
- 산출물 파일이 다음 세션의 기억이 되도록 한다.

## Claude Code 전용 튜닝

Claude Code에서는 permission prompt가 초반 학습의 일부가 된다.

처음에는 이렇게 안내한다.

```text
권한 요청이 여러 번 나올 수 있습니다.
이번 단계에서는 온보딩 파일을 읽고, 필요한 설정 파일을 복사하고, 상태 파일을 작성하기 때문입니다.
작업이 끝날 때까지 `1. Yes`를 선택해 주세요.
끝난 뒤 어떤 요청이 왜 나왔는지 설명드리겠습니다.
```

설치가 끝난 뒤에는 이렇게 설명한다.

```text
방금 나온 권한 요청은 크게 세 종류였습니다.

읽기: 현재 폴더와 지침 파일을 확인하기 위해 필요했습니다.
명령 실행: git 상태, 설치 여부, 파일 복사를 확인하기 위해 필요했습니다.
쓰기: CLAUDE.md, skill, .onboarding 파일을 설치하기 위해 필요했습니다.

앞으로는 `Shift+Tab`으로 가능한 모드를 전환할 수 있습니다.
기본 모드는 안전하지만 질문이 많고, auto 계열은 질문을 줄이지만 더 신중하게 써야 합니다.
```

권한 모드 설명은 setup 후에만 짧게 한다.

| Mode | 사용자에게 설명할 말 |
| --- | --- |
| `default` | 가장 안전한 시작점입니다. 파일 변경과 명령 실행 전에 자주 확인합니다. |
| `acceptEdits` | 파일 편집 승인 피로를 줄입니다. 그래도 위험한 명령은 확인할 수 있습니다. |
| `plan` | 읽고 계획하는 데 적합합니다. 변경을 시작하기 전 검토에 좋습니다. |
| `auto` | 반복 요청을 줄입니다. 계정/설정에 따라 가능한 경우 `Shift+Tab`으로 접근합니다. |
| `bypassPermissions` | 격리된 컨테이너나 VM에서만 고려합니다. 일반 로컬 온보딩에는 권장하지 않습니다. |

## Codex 전용 튜닝

Codex에서는 `$work-mission-discovery`처럼 skill 호출 의도를 더 직접적으로 표현할 수 있다.

```text
$work-mission-discovery 로 AI CLI 온보딩을 시작해줘.
```

다만 대화 구조는 Claude Code와 동일해야 한다.

```text
현재 위치 확인
→ 작업 루트 선택
→ GitHub/local remote 이해
→ 지침/skill/hook 설치
→ brief board 열기
→ 업무 인터뷰
→ 자동화 후보
→ 첫 미션
```

제품별 기능 설명은 뒤로 미룬다. 초반에는 현재 폴더, 파일 변경, Git 상태, 인증, 권한, 검증, 산출물 같은 공통 개념을 먼저 다룬다.

## 대화 튜닝 체크리스트

| 확인 항목 | 좋은 상태 | 나쁜 신호 |
| --- | --- | --- |
| 첫 응답 길이 | 다음 행동 하나와 이유만 안내 | 전체 커리큘럼을 길게 설명 |
| 질문 수 | 1-3개 | 한 번에 5개 이상 |
| 개념 설명 | 사용자의 행동과 결과로 설명 | 도구 이름과 명령어만 나열 |
| 권한 안내 | 먼저 경험, setup 후 설명 | 시작부터 권한 모드를 길게 강의 |
| board 역할 | CLI 결과를 보여주는 현황판 | 사용자가 board에서 진행률을 직접 조작 |
| 산출물 | markdown 원본이 source of truth | `board-data.json`에 업무 내용만 저장 |
| 완료 처리 | 검증 후 hook 업데이트 | 명령 시도만으로 done 처리 |
| 자동화 후보 | 위험/검증/반복성을 비교 | 사용자가 말한 해결책을 바로 구현 |

## 바꿔야 할 말투 예시

| 피해야 할 말 | 바꿀 말 |
| --- | --- |
| fallback 명령 | 자동 설치가 어려울 때 직접 실행할 명령 |
| 현재 업무 repo 루트 | 지금 AI와 함께 작업할 폴더 |
| hook 활성 | CLI가 완료 상태를 기록할 준비가 됨 |
| board-data가 source | 화면 표시용 요약 데이터 |
| remote에 push합니다 | GitHub에 저장된 복사본으로 보냅니다 |
| permission mode를 설정하세요 | 질문이 너무 자주 나오면 작업 후 모드를 바꿀 수 있습니다 |

## 완료 기준

이 대화 흐름은 아래 조건이 충족되면 잘 작동한 것으로 본다.

- bootstrap이 선택한 CLI의 사용자-level skill을 설치한다.
- 첫 프롬프트는 짧고, 이후 세부 지시는 skill이 담당한다.
- 실제 작업 repo에 지침, skill, `.onboarding`, brief board가 설치된다.
- brief board는 설치 후 현황판으로 열리고, 입력 장소가 되지 않는다.
- 사용자가 local repo와 GitHub remote의 차이를 설명할 수 있다.
- 사용자가 status/add/commit/push/pull 흐름을 한 번 관찰하거나 실행한다.
- 역할, 성과, 업무 영역, 작업 단계가 문서화된다.
- 자동화 후보가 분류되고, 첫 미션이 위험/검증 기준으로 선택된다.
