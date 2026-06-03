# AI CLI Onboarding Program

이 프로그램은 처음 AI CLI를 접하는 사용자가 도구 사용법을 외우는 대신, 자기 업무에서 실제로 해결할 미션을 만들고 반복적으로 실행하도록 돕는다.

핵심은 특정 모델이나 제품 기능보다 공통 개념을 먼저 익히는 것이다. Codex, Claude Code 같은 도구별 기능은 같은 개념의 다른 조작법으로 나중에 연결한다.

## 목표

- GitHub, Git, CLI, 인증, PR 흐름을 통해 AI CLI가 일할 수 있는 기본 환경을 만든다.
- 사용자의 역할과 업무를 Top-down으로 분해해 자동화 후보를 찾는다.
- 자동화 후보를 실행 가능한 미션 백로그로 만든다.
- 각 미션을 진행하면서 AI CLI 사용 습관, 검증 습관, 프롬프트 작성 능력을 함께 익힌다.

## 전체 흐름

```text
-2. Web Entry
   브라우저에서 Codex 또는 Claude Code 설치까지만 안내한다

-1. CLI Handoff
   설치된 CLI에서 지침/skill/GitHub 연결/인터뷰를 이어간다

0. Work Environment Setup
   로컬 작업 루트, GitHub 연결, local/remote, commit/push/pull 루프를 익힌다

1. Work Grounding
   나의 역할, 목적, 성과, 업무 영역을 정의한다

2. Automation Exploration
   선택한 업무 후보를 자동화 미션으로 정밀화한다

3. Mission Execution
   첫 자동화 미션을 구현하거나 운영 가능한 작업 절차로 만든다

4. Mission Backlog Loop
   새 미션을 추가하고, 이전 결과를 검증하며, 업무 지도를 업데이트한다
```

## 공통 개념 우선 원칙

초반에는 제품별 명령 이름보다 아래 개념을 먼저 익힌다.

| 공통 개념 | 사용자가 이해해야 하는 것 |
| --- | --- |
| 현재 위치 | 명령은 어느 폴더에서 실행하느냐가 기준이다 |
| 파일 변경 | AI CLI도 파일을 읽고 수정하고 차이를 만든다 |
| 증거 기반 완료 | 성공 여부는 출력, diff, 테스트, PR URL 같은 증거로 확인한다 |
| Git 상태 | 작업 폴더 변경, stage, commit, push는 서로 다른 단계다 |
| 원격 저장소 | GitHub는 내 컴퓨터 밖에 있는 협업 저장소다 |
| 작업 루트 | AI와 함께 일할 로컬 기준 폴더를 정한다 |
| Local/Remote | 내 컴퓨터의 작업 폴더와 GitHub 저장소는 연결된 한 쌍이다 |
| 인증과 권한 | CLI가 외부 서비스에 접근하려면 로그인된 권한이 필요하다 |
| 지침 파일 | 반복해서 말할 작업 방식을 파일로 저장한다 |
| 안전한 권한 | 읽기, 수정, 실행, 외부 접근은 위험도가 다르다 |
| 작업 단위 | 좋은 요청은 목표, 현재 상태, 제약, 완료 기준을 포함한다 |
| 메인 세션 | 실제 설치, 인터뷰, 구현, 검증을 진행하는 CLI 대화다 |

## Stage -2: Web Entry

웹페이지는 진입점 역할만 한다. 초보자는 GitHub 저장소를 미리 내려받지 않는다. 먼저 hosted web entry를 열고, 자신의 환경을 고른 뒤 Codex 또는 Claude Code 설치, PATH 반영, 설치 확인을 진행한다. 설치 자체도 이후 다른 상황에서 반복할 학습 경험이므로 온보딩 키트 없이 먼저 진행한다. CLI 명령이 실행 가능한 것을 확인한 뒤 같은 터미널에서 bootstrap 명령으로 onboarding kit를 내 컴퓨터에 받고, 그 다음 CLI를 실행해 인증한 뒤 지침 파일, skill, 상태 hook, 온보딩 보드를 AI와 함께 작업하려는 폴더에 설치한다.

이미 Codex 또는 Claude Code가 설치된 사용자는 설치 명령을 다시 실행하지 않는다. 웹 entry의 “이미 설치한 사용자” 경로에서 설치 확인으로 이동해 `codex --version` 또는 `claude --version`으로 현재 터미널에서 실행 가능한지만 확인한다. 버전이 출력되면 온보딩 키트 받기 단계로 이동한다.

권장 hosted entry:

```text
https://day1-ax-tools.github.io/onboarding/
```

Pages는 repository settings에서 `main` branch root를 source로 지정하면 `index.html`이 `web/index.html`로 넘겨준다.


정적 페이지:

```text
index.html
web/index.html
web/brief-board.html
bootstrap/start.sh
bootstrap/start.ps1
```

CLI 설치 확인 뒤, 첫 실행과 로그인 전에 실행할 bootstrap 명령:

```bash
# macOS / Linux / WSL
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/day1-ax-tools/onboarding/main/bootstrap/start.sh)" -- --tool codex --os mac --shell zsh
```

```powershell
# Windows PowerShell
$script = irm https://raw.githubusercontent.com/day1-ax-tools/onboarding/main/bootstrap/start.ps1
& ([scriptblock]::Create($script)) -Tool codex
```

`web/index.html`이 담당하는 것:

- Codex 또는 Claude Code 선택
- 운영체제별 설치 명령 안내
- 설치 확인 명령 안내
- 설치 확인 뒤 실행할 bootstrap 명령 제공
- 로그인 시작 명령 안내
- CLI에 붙여넣을 짧은 시작 문장 제공

설치 처리 기준:

- CLI 설치, PATH 반영, 설치 확인은 bootstrap보다 먼저 진행한다.
- 이미 CLI가 설치되어 있으면 설치 명령은 건너뛰고 설치 확인부터 진행한다. 단, 확인 명령의 성공 출력이 있어야 다음 단계로 넘어간다.
- Codex installer가 `Start Codex now? [y/N]`를 물으면 `Enter` 또는 `n`을 선택한다. 첫 실행과 로그인은 설치 확인 뒤 별도 단계에서 진행한다.
- bootstrap을 실행한 뒤 CLI 첫 실행과 로그인을 진행한다.
- bootstrap은 `~/Documents/AI-Work/day1-ax-tools/onboarding` 또는 `Documents\AI-Work\day1-ax-tools\onboarding`을 기본 위치로 쓴다.
- Git이 있으면 `git clone` 또는 `git pull --ff-only`를 사용한다.
- Git이 없으면 GitHub zip을 다운로드해서 같은 위치에 둔다.
- macOS, Linux, WSL은 `bash`와 `zsh` 중 사용자가 쓰는 shell을 선택한다.
- 실제 CLI 설치 명령은 shell별로 거의 같고, 설치 직후 PATH 반영과 shell refresh만 다르게 제공한다.
- Windows는 PowerShell만 권장 경로로 둔다. Windows 화면에서는 bash/zsh 선택을 숨기고 PowerShell 명령만 보여준다.

### CLI Sandbox Testing

개발자의 로컬 컴퓨터에 Codex와 Claude Code가 이미 설치되어 있으면 초보자의 “설치 전” 상태를 확인하기 어렵다. 이때는 `.tmp/` 아래에 격리된 HOME/PATH를 만들고, 실제 로컬 설치를 숨긴 상태로 테스트한다. 기본 sandbox는 `codex`, `claude`, `claude-1`, `claude-2`뿐 아니라 `git`, `node`, `python`, `python3`도 숨긴다.

현재 sandbox 스크립트는 macOS/Linux/WSL용이다. Windows PowerShell 테스트는 같은 개념을 쓰되 별도 PowerShell sandbox 스크립트로 분리한다.

Codex 설치 과정만 테스트:

```bash
node scripts/cli-sandbox.mjs --mode missing --tool codex --support-tools real --system-tools all --name codex-install --reset
REPO_ROOT="$(pwd)"
source .tmp/cli-sandbox/codex-install/enter.sh
command -v codex || echo "codex hidden"
command -v git
command -v node
command -v python3
command -v tar
command -v ln
command -v shasum || command -v openssl
"$AI_CLI_SANDBOX_ROOT/install-codex.sh"
```

Codex installer가 `Start Codex now? [y/N]`를 물으면 설치만 확인할 때는 `Enter` 또는 `n`을 누른다. Codex 첫 실행 UI까지 바로 확인하려면 `y`를 누른다. 이 sandbox 명령은 `curl | sh`를 직접 쓰지 않고 installer를 파일로 내려받아 실행하므로, Codex가 터미널 입력을 읽을 수 있다.

설치 전 상태 테스트:

```bash
node scripts/cli-sandbox.mjs --mode missing --tool both --name missing-cli --reset
REPO_ROOT="$(pwd)"
source .tmp/cli-sandbox/missing-cli/enter.sh
command -v codex || echo "codex hidden"
command -v claude || echo "claude hidden"
command -v claude-1 || echo "claude-1 hidden"
command -v claude-2 || echo "claude-2 hidden"
command -v git || echo "git hidden"
command -v node || echo "node hidden"
command -v python3 || echo "python3 hidden"
```

Claude Code와 기본 도구가 모두 없는 상태 테스트:

```bash
node scripts/cli-sandbox.mjs --mode missing --tool both --support-tools hidden --system-tools all --name claude-bare --reset
REPO_ROOT="$(pwd)"
source .tmp/cli-sandbox/claude-bare/enter.sh
command -v claude || echo "claude hidden"
command -v claude-1 || echo "claude-1 hidden"
command -v claude-2 || echo "claude-2 hidden"
command -v git || echo "git hidden"
command -v gh || echo "gh hidden"
command -v node || echo "node hidden"
command -v python3 || echo "python3 hidden"
/bin/bash "$REPO_ROOT/bootstrap/start.sh" --tool claude --os mac --shell zsh --work-root "$AI_WORK_ROOT"
```

이 테스트는 로컬 checkout을 복사해서 온보딩 키트를 준비한다. 그래서 사용자가 아직 `git`, `node`, `python3`을 설치하지 않은 경우에도 시작 페이지 이후의 설치 안내 흐름을 확인할 수 있다.

설치 후 첫 실행 상태 테스트:

```bash
node scripts/cli-sandbox.mjs --mode fake --tool both --name fake-cli --reset
REPO_ROOT="$(pwd)"
source .tmp/cli-sandbox/fake-cli/enter.sh
codex --version
claude --version
claude-1 --version
claude-2 --version
```

각 sandbox 안에서는 `AI_WORK_ROOT`가 sandbox 내부로 잡히고, `ONBOARDING_REPO_URL`은 현재 checkout을 가리킨다. 따라서 bootstrap 테스트도 실제 사용자 폴더를 건드리지 않는다. Claude Code는 환경에 따라 `claude`, `claude-1`, `claude-2` 중 하나로 실행될 수 있으므로 sandbox가 세 명령을 모두 숨기거나 가짜 명령으로 대체한다.

```bash
/bin/bash "$REPO_ROOT/bootstrap/start.sh" --tool codex --os mac --shell zsh --work-root "$AI_WORK_ROOT"
```

`git`, `node`, `python3`가 설치된 상태에서의 후속 hook 테스트가 필요하면 support tools를 명시적으로 켠다.

```bash
node scripts/cli-sandbox.mjs --mode fake --tool both --support-tools real --name fake-with-tools --reset
```

`web/brief-board.html`이 담당하는 것:

- 온보딩 진행 단계를 git branch graph 형태로 보여준다.
- 개념 보드에서 현재 폴더, 작업 루트, local repo, GitHub remote, commit, push, pull을 시각화한다.
- 설치/인증, 환경 설정, 업무 지도, 미션 후보가 어떻게 분기되고 합쳐지는지 시각화한다.
- CLI가 갱신한 `.onboarding/state.json` 또는 `web/onboarding-state.json`을 읽어 그래프 node 상태를 바꾼다.
- 상태 파일을 읽지 못하면 `Hook 미설치`로 표시한다. hook 설치 전에는 보드를 활성 상태로 간주하지 않는다.
- `.onboarding/board-data.json`을 읽어 역할, 성과, 반복 업무, 작업 지도, 자동화 후보, 산출물을 현황판처럼 보여준다.
- `mission-backlog.md`와 `missions/*.md`를 읽어 자동화 과제를 `이어갈 작업`, `후보 목록`, `나중에 검토`, `완료/제외` 상태로 보여주는 작업 현황 보드를 제공한다.
- CLI가 Git이나 작업 폴더 개념을 설명할 때는 개념 보드를 함께 보며 같은 개념을 그림으로 확인하게 한다.
- `board-data.json`은 원본이 아니다. `environment-state.md`, `work-map.md`, `ontology-seeds.md`, `mission-backlog.md`, `automation-brief.md`, `missions/*.md`에서 다시 만들 수 있는 화면 표시용 요약 데이터다.
- CLI에 붙여넣을 업무 요약문과, 자동 설치가 안 될 때 대신 실행할 작업 폴더용 지침/skill 설치 명령을 제공한다.

### Onboarding State Hooks

진행률과 체크리스트는 사용자가 웹에서 직접 조작하지 않는다. 온보딩의 실제 권위는 CLI가 완료 조건을 검증한 뒤 갱신하는 상태 파일이다.

CLI에서 실제 작업은 아래 순서로 반복된다.

```text
1. 확인: 현재 작업 폴더, 설치 상태, GitHub 연결, 필요한 파일을 확인한다.
2. 질문: 사용자에게 다음 1-3개 질문만 묻는다.
3. 작성: 확인된 내용을 markdown 산출물에 저장한다.
4. 보드 갱신: node .onboarding/update-board.mjs로 board-data.json을 다시 만든다.
5. 상태 갱신: 완료 조건이 검증된 단계만 update-state.mjs로 갱신한다.
6. 안내: 무엇이 바뀌었고 다음 작은 행동이 무엇인지 알려준다.
```

```text
CLI 단계 완료
→ 완료 조건 검증
→ node .onboarding/update-state.mjs <step-id> <status> 실행
→ .onboarding/state.json 갱신
→ 필요하면 web/onboarding-state.json mirror 갱신
→ brief-board.html이 주기적으로 읽어 git branch graph 갱신
→ 모든 필수 단계 완료 시 hooks.enabled=false
```

상태 hook은 OS나 AI CLI 전역 hook이 아니다. 프로젝트 안의 `.onboarding/` 폴더에만 쓰는 **온보딩 세션 내부 완료 계약**이다. Codex와 Claude Code는 같은 step id와 같은 updater를 사용한다.

상태 파일 템플릿:

```text
templates/onboarding/state.json
templates/onboarding/update-state.mjs
templates/onboarding/update-board.mjs
web/brief-board.html
```

AI와 함께 작업하려는 폴더에 설치되는 위치:

```text
.onboarding/state.json
.onboarding/update-state.mjs
.onboarding/update-board.mjs
.onboarding/board-data.json
.onboarding/brief-board.html
```

`web/brief-board.html`은 AI와 함께 작업하려는 폴더에 복사될 보드 템플릿이다. 실제 진행 상태를 보려면 CLI가 상태 hook을 설치한 뒤 그 작업 폴더에 복사된 `.onboarding/brief-board.html`을 로컬 HTTP 서버로 연다. 이 보드는 같은 폴더의 `state.json`과 `board-data.json`을 읽는다. 상태 파일 없이 열리면 `Hook 미설치`로 표시하고, board-data 없이 열리면 `산출물 대기`로 표시한다.

공통 명령:

```bash
node .onboarding/update-state.mjs kit-install done --tool codex --os mac --shell zsh --evidence "AGENTS.md and skill copied"
```

Windows PowerShell에서도 같은 updater를 호출한다.

```powershell
node .onboarding\update-state.mjs kit-install done --tool claude --os windows --shell powershell --evidence "CLAUDE.md and skill copied"
```

### Board Display Data

brief board는 입력 폼이 아니라 현황판이다. 업무 내용의 원본은 markdown 산출물이고, board는 `.onboarding/update-board.mjs`가 만든 화면 표시용 요약 데이터만 읽는다.

```text
CLI 인터뷰 진행
→ environment-state.md, work-map.md, ontology-seeds.md, mission-backlog.md, automation-brief.md, missions/*.md 갱신
→ node .onboarding/update-board.mjs 실행
→ .onboarding/board-data.json 갱신
→ node .onboarding/update-state.mjs <step-id> done 실행
→ brief-board.html이 state + board-data를 읽어 갱신
```

권위 구분:

| 파일 | 권위 |
| --- | --- |
| `.onboarding/state.json` | 진행 상태, hook 활성 여부, 현재 단계 |
| `.onboarding/board-data.json` | 화면 표시용 요약 데이터 |
| `environment-state.md` 등 markdown 산출물 | 업무 정의와 미션의 source of truth |

상태 값:

| 값 | 의미 |
| --- | --- |
| `pending` | 아직 시작 전 |
| `active` | 현재 진행 중 |
| `done` | 완료 조건과 증거가 확인됨 |
| `blocked` | 사용자의 선택, 권한, 설치 실패 등으로 멈춤 |
| `skipped` | 명시적으로 건너뜀 |

필수 단계:

| Step id | 완료 조건 |
| --- | --- |
| `cli-install` | 선택한 Codex 또는 Claude Code 명령이 실행 가능함 |
| `auth` | 선택한 AI CLI 인증이 완료됨 |
| `cli-handoff` | 사용자가 웹에서 만든 첫 입력문을 CLI에 전달함 |
| `kit-install` | `AGENTS.md`/`CLAUDE.md`와 `work-mission-discovery` skill이 AI와 함께 작업하려는 폴더에 설치됨 |
| `work-root` | 작업 루트와 현재 작업 폴더 위치가 정리됨 |
| `github-auth` | `gh auth status`, remote, branch 상태가 확인됨 |
| `git-loop` | status/add/commit/push/pull 흐름을 완료하거나 관찰함 |
| `role-map` | 역할과 책임지는 결과가 기록됨 |
| `task-split` | 반복 업무가 실행 단위로 분해됨 |
| `mission-select` | 첫 자동화 미션 후보가 선택됨 |

`update-state.mjs`는 모든 필수 단계가 `done`이 되면 `hooks.enabled=false`와 `hooks.disposedAt`을 기록한다. 이후 보드는 완료 상태를 보여주지만, CLI는 더 이상 온보딩 hook을 강제로 이어가지 않는다.

### E2E Verification

전체 E2E는 실제 사용자 홈이나 설치된 AI CLI를 바꾸지 않도록 `.tmp/` 아래 sandbox와 임시 업무 repo만 사용한다. 검증 목표는 웹 진입점, bootstrap, CLI handoff, 상태 hook, brief board 표시가 끊기지 않고 이어지는지 확인하는 것이다.

정적 검증:

```bash
VALIDATE_SKILL="$HOME/.codex/skills/.system/skill-creator/scripts/quick_validate.py"

python3 "$VALIDATE_SKILL" .agents/skills/work-mission-discovery
python3 "$VALIDATE_SKILL" .claude/skills/work-mission-discovery
python3 "$VALIDATE_SKILL" .agents/skills/concept-board
python3 "$VALIDATE_SKILL" .claude/skills/concept-board

node --check templates/onboarding/update-board.mjs
node --check templates/onboarding/update-state.mjs
node --check scripts/cli-sandbox.mjs
git diff --check
```

웹 진입점과 보드 확인:

```bash
python3 -m http.server 8790 --bind 127.0.0.1 --directory web
```

확인 URL:

| 화면 | URL |
| --- | --- |
| Codex 설치 진입 | `http://127.0.0.1:8790/index.html?tool=codex&os=mac&shell=zsh` |
| Claude Code 설치 진입 | `http://127.0.0.1:8790/index.html?tool=claude&os=windows&shell=powershell` |
| Codex 온보딩 보드 | `http://127.0.0.1:8790/brief-board.html?tool=codex&os=mac&shell=zsh&view=onboarding` |
| Claude Code 개념 보드 | `http://127.0.0.1:8790/brief-board.html?tool=claude&os=windows&shell=powershell&view=concept` |

설치 전 bootstrap smoke test:

```bash
REPO_ROOT="$(pwd)"
node scripts/cli-sandbox.mjs --mode missing --tool codex --support-tools hidden --system-tools all --name e2e-codex --reset
source .tmp/cli-sandbox/e2e-codex/enter.sh
export ONBOARDING_REPO_URL="file://$REPO_ROOT"
export ONBOARDING_NO_OPEN=1
/bin/bash "$REPO_ROOT/bootstrap/start.sh" --tool codex --os mac --shell zsh --work-root "$AI_WORK_ROOT"
```

Claude Code도 같은 방식으로 `--tool claude`와 다른 sandbox 이름을 사용해 반복한다.

설치 후 CLI handoff smoke test:

```bash
node scripts/cli-sandbox.mjs --mode fake --tool both --support-tools real --system-tools all --name e2e-fake-cli --reset
source .tmp/cli-sandbox/e2e-fake-cli/enter.sh

codex --version
claude --version
claude-1 --version
claude-2 --version

printf '%s\n' '$work-mission-discovery 로 AI CLI 온보딩을 시작해줘.' | codex
printf '%s\n' 'work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요.' | claude
```

온보딩 hook과 board-data smoke test는 임시 업무 repo에 `.onboarding/` 템플릿, 지침 파일, skill, markdown 산출물을 넣은 뒤 진행한다. 모든 필수 step을 `done`으로 갱신했을 때 `hooks.enabled=false`가 되고, `mission-backlog.md`와 `missions/*.md`에서 만든 작업이 `board-data.json`과 brief board의 작업 현황 보드에 표시되면 통과다.

통과 기준:

| 범위 | 통과 기준 |
| --- | --- |
| Web entry | 선택한 tool/os/shell에 맞는 설치, PATH, bootstrap, 첫 실행 화면이 보인다 |
| CLI handoff | 긴 내부 지시문이 아니라 짧은 skill 시작 문장만 CLI에 전달된다 |
| Sandbox | 실제 로컬 설치와 별개로 missing/fake CLI 상태를 재현한다 |
| State hook | 완료 조건이 확인된 step만 `done`이 되고, 모든 필수 step 완료 후 hook이 폐기된다 |
| Brief board | 개념 보드와 온보딩 보드가 분리되고, repo/session/tool 상태와 마지막 업데이트가 보인다 |
| 작업 현황 보드 | `mission-backlog.md`와 `missions/*.md`의 자동화 과제가 상태별로 이어갈 수 있게 표시된다 |

웹페이지가 직접 하지 않는 것:

- GitHub repo 생성
- `AGENTS.md` / `CLAUDE.md` 설치
- skill 설치
- 업무 인터뷰 진행
- 미션 백로그 작성

위 작업들은 CLI가 설치된 뒤 터미널 안에서 이어간다.

### HTML UI 표현 원칙

온보딩 UI는 박스와 텍스트만 반복하지 않는다. 사용자가 흐름, 상태, 차이, 우선순위, 의존성을 한눈에 이해해야 할 때는 아래 표현을 우선 사용한다.

| 상황 | 우선 표현 |
| --- | --- |
| 온보딩 단계와 작업 흐름 | git branch graph, timeline, flow diagram |
| local/remote, push/pull, 작업 루트 | 양방향 flow, folder tree, repo map |
| 자동화 후보 비교 | score table, risk/value matrix |
| 업무 분해 | hierarchy tree, swimlane, dependency map |
| 산출물 상태 | checklist table, artifact matrix |

기본 화면은 조작 가능한 실제 경험이어야 한다. 설명용 문장만 있는 화면은 피하고, 입력, 선택, 그래프, 표, 복사 가능한 CLI handoff가 함께 동작하게 만든다. CLI handoff는 긴 내부 지시문이 아니라 사용자가 이해할 수 있는 짧은 시작 문장이어야 하며, 세부 절차는 지침 파일과 skill이 담당한다.

## Stage -1: CLI Handoff And Onboarding Kit Installation

이 단계의 목적은 설치된 CLI가 사용자의 실제 업무 저장소에서 온보딩을 이어받게 만드는 것이다.

기본값은 **프로젝트 단위 설치**다. 전역 설치는 모든 저장소에 영향을 주므로 초보자 온보딩에서는 나중 선택지로 둔다.

### 설치 대상

| 항목 | Codex | Claude Code | 목적 |
| --- | --- | --- | --- |
| 지속 지침 | `AGENTS.md` | `CLAUDE.md` | 매 세션 반복할 작업 방식 저장 |
| Skill | `.agents/skills/work-mission-discovery/` | `.claude/skills/work-mission-discovery/` | 업무 인터뷰와 미션 백로그 생성 |
| 온보딩 상태 hook | `.onboarding/state.json`, `.onboarding/update-state.mjs` | 동일 | CLI 완료 상태를 brief board 그래프로 전달 |
| 환경 상태 | `environment-state.md` | `environment-state.md` | 작업 루트, repo, remote, branch, GitHub auth 상태 저장 |
| 인터뷰 상태 | `interview-state.md` | `interview-state.md` | 끊긴 대화를 이어갈 위치 저장 |
| 산출물 | `work-map.md`, `ontology-seeds.md`, `mission-backlog.md`, `missions/`, `logs/` | 동일 | 다음 작업의 맥락 자산 |

### AGENTS.md / CLAUDE.md 설치

사용자의 실제 업무 저장소 루트에서 아래 중 필요한 파일을 설치한다.

```bash
# Codex용
cp templates/AGENTS.md AGENTS.md

# Claude Code용
cp templates/CLAUDE.md CLAUDE.md
```

둘 다 쓰는 사용자는 두 파일을 모두 둔다. `CLAUDE.md`는 `@AGENTS.md`를 import해서 공통 운영 원칙을 재사용한다.

설치 후 확인:

```text
Codex: "현재 적용된 지침 파일을 요약해주세요."
Claude Code: "현재 로드된 memory와 프로젝트 지침을 요약해주세요."
```

성공 기준은 AI가 `Work Environment Setup`, `Work Grounding`, `Mission Discovery`, `environment-state.md`, `interview-state.md`, `미션 백로그` 같은 핵심 지침을 요약하는 것이다.

### Skill 설치

이 저장소를 기준으로 대상 업무 저장소에 복사한다.

```bash
# Codex project skill
mkdir -p .agents/skills
cp -R /path/to/onboarding/.agents/skills/work-mission-discovery .agents/skills/
mkdir -p .onboarding
cp -R /path/to/onboarding/templates/onboarding/. .onboarding/
cp /path/to/onboarding/web/brief-board.html .onboarding/brief-board.html

# Claude Code project skill
mkdir -p .claude/skills
cp -R /path/to/onboarding/.claude/skills/work-mission-discovery .claude/skills/
mkdir -p .onboarding
cp -R /path/to/onboarding/templates/onboarding/. .onboarding/
cp /path/to/onboarding/web/brief-board.html .onboarding/brief-board.html
```

이 온보딩 저장소 자체에서는 이미 두 위치에 skill이 들어 있다.

`concept-board` skill도 이 저장소에 별도 재사용 자산으로 들어 있지만, 기본 온보딩 설치 명령에는 포함하지 않는다. 온보딩 중에는 `web/brief-board.html`의 내장 개념 보드를 사용하고, 다른 작업 repo에서 별도 시각화 보드가 필요할 때만 `concept-board`를 복사해 쓴다.

사용 확인:

```text
Codex: "$work-mission-discovery 로 AI CLI 온보딩을 시작해줘."
Claude Code: "work-mission-discovery skill로 AI CLI 온보딩을 시작해주세요."
```

Claude Code의 skill은 slash command가 아니라 설명을 보고 자동 선택되는 기능이다. 명시하고 싶을 때는 위처럼 skill 이름을 문장에 넣는다.

## Stage 0: Work Environment Setup

이 단계의 목적은 "AI CLI가 내 로컬 작업공간과 GitHub를 오가며 일할 수 있는 상태"를 만드는 것이다. 설치와 로그인만으로는 충분하지 않다. 사용자가 앞으로 어디에서 작업할지, repo를 어떤 폴더에 둘지, GitHub와 내 컴퓨터의 관계가 무엇인지까지 이해해야 한다.

### 핵심 개념

| 개념 | 설명 |
| --- | --- |
| 작업 루트 | AI와 함께 작업할 모든 repo를 모아둘 로컬 기준 폴더 |
| Repo 폴더 | 하나의 GitHub repo와 연결된 하나의 local folder |
| Local | 내 컴퓨터에 있는 실제 파일과 Git 기록 |
| Remote | GitHub에 있는 원격 저장소 |
| Clone | remote repo를 local folder로 가져오는 일 |
| Commit | local repo에 의미 있는 변경 단위를 저장하는 일 |
| Push | local commit을 GitHub remote로 올리는 일 |
| Pull | GitHub remote의 최신 변경을 local로 가져오는 일 |
| Branch | 한 repo 안에서 독립적으로 작업하는 흐름 |
| PR | branch 변경을 검토하고 합치기 위한 GitHub 대화 공간 |

### 로컬 작업 폴더 기본값

초보자에게는 "아무 데나 clone하지 않기"가 중요하다. 기본 추천은 아래 구조다.

```text
~/Documents/AI-Work/
  day1-ax-tools/
    onboarding/
    sprint-kit/
  personal/
    side-project-a/
  inbox/
  archive/
```

규칙:

- `~/Documents/AI-Work`를 AI 작업 루트로 쓴다.
- GitHub 조직이나 개인 범위별로 하위 폴더를 둔다.
- 하나의 repo는 하나의 폴더로 둔다.
- 실험용 임시 파일은 `inbox/`에 두고, repo 안에 섞지 않는다.
- 끝난 실험이나 더 이상 쓰지 않는 repo는 `archive/`로 옮긴다.

### Local / Remote 설명

HTML 시각화가 필요한 경우 `git-local-remote.html`을 만든다.

```text
내 컴퓨터 Local Repo  <-- pull --  GitHub Remote Repo
        |
      commit
        |
      push -----------------------> GitHub Remote Repo
```

설명 문장:

```text
GitHub repo는 웹에 있는 remote입니다.
내 컴퓨터의 폴더는 local입니다.
둘은 자동으로 동기화되지 않고, commit/push/pull로 맞춥니다.
```

### 사용자가 직접 경험할 미션

```text
작업 루트 폴더 선택 또는 생성
→ GitHub 로그인 확인
→ 비공개 GitHub 저장소 생성
→ 작업 루트 아래에 clone
→ README 수정
→ git status로 변경 확인
→ commit
→ push
→ pull 의미 설명
→ PR 생성
→ AI CLI에게 diff 설명 요청
```

### HTML 시각화 산출물

HTML은 개념 설명용 도구로 계속 사용할 수 있다. CLI가 필요할 때 아래 파일을 생성해 브라우저로 열어준다.

| 파일 | 목적 |
| --- | --- |
| `workspace-map.html` | 사용자의 로컬 작업 루트와 repo 배치 시각화 |
| `git-local-remote.html` | local repo와 GitHub remote 관계 설명 |
| `git-cycle.html` | edit → status → add → commit → push → pull 루프 설명 |
| `repo-dashboard.html` | 현재 repo의 path, remote, branch, dirty state 요약 |

### AI CLI가 매번 확인할 것

작업 전에는 아래를 짧게 확인한다.

```text
1. 지금 어느 폴더에서 작업 중인가?
2. 이 폴더는 Git repo인가?
3. GitHub remote가 연결되어 있는가?
4. 현재 branch는 무엇인가?
5. 이미 변경된 파일이 있는가?
6. 그 변경은 사용자 작업인가, AI가 방금 만든 작업인가?
```

### 완료 기준

- `gh auth status`에서 GitHub 로그인 상태를 확인한다.
- AI 작업 루트 폴더가 정해져 있다.
- repo가 작업 루트 아래의 예측 가능한 위치에 있다.
- 로컬 저장소와 GitHub 원격 저장소가 연결되어 있다.
- 사용자가 local repo와 remote repo의 차이를 설명할 수 있다.
- 사용자가 `clone`, `commit`, `push`, `pull`이 언제 쓰이는지 대략 설명할 수 있다.
- `git status`로 현재 변경 상태를 확인할 수 있다.
- 적어도 한 번 의미 있는 commit과 push를 수행했다.
- PR URL이 생성되어 브라우저 또는 `gh pr view`로 확인할 수 있다.
- 사용자가 다음 작업을 어디에 만들고, 어떤 repo에서 이어갈지 알고 있다.

## Stage 1: Work Grounding

`Work Grounding`은 자동화 후보를 정하기 전에 사용자의 업무 맥락을 만드는 사전 단계다.

여기서는 "무엇을 자동화하고 싶나요?"부터 묻지 않는다. 먼저 사용자가 어떤 역할을 맡고 있고, 어떤 결과를 책임지며, 실제로 어떤 일을 반복하는지 이해한다.

### 목표

- 사용자의 역할과 책임지는 결과를 정의한다.
- 그 결과에 align된 주요 업무 영역을 찾는다.
- 각 업무 영역을 작업과 세부 단계로 쪼갠다.
- 작업을 자동화 관점에서 분류한다.
- 첫 자동화 후보를 선택한다.

### 단계

```text
Pre-0: 역할 정의
— 나는 어떤 책임을 가진 사람인가?

Pre-1: 목적/성과 정의
— 내 역할에서 좋아져야 하는 결과는 무엇인가?

Pre-2: 업무 영역 지도
— 그 결과를 위해 내가 실제로 반복하는 업무 영역은 무엇인가?

Pre-3: 업무 흐름 분해
— 각 업무는 어떤 작업과 세부 단계로 쪼개지는가?

Pre-4: 자동화 관점 분류
— 각 작업은 AI가 도울 수 있는 어떤 유형인가?

Pre-5: 후보 선택
— 지금 가장 먼저 자동화해볼 작업은 무엇인가?
```

### 인터뷰 시작 질문

```text
먼저 당신의 일을 이해하겠습니다.

1. 당신은 어떤 역할을 맡고 있나요?
2. 그 역할에서 가장 중요하게 책임지는 결과는 무엇인가요?
3. 최근 1-2주 동안 실제로 시간을 많이 쓴 일은 무엇인가요?
```

### 인터뷰 운영 규칙

- 한 번에 1-3개만 묻는다.
- 사용자의 답변을 AI가 먼저 구조화하고, 사용자는 수정한다.
- 기술 용어보다 역할, 결과, 업무, 작업, 입력, 출력, 판단 기준으로 말한다.
- 사용자가 제시한 자동화 아이디어는 결론이 아니라 후보로 다룬다.
- 반복성 높고, 위험 낮고, 검증 쉬운 작업을 첫 후보로 추천한다.
- 환경 설정 중에는 `environment-state.md`에 작업 루트, repo, remote, branch, GitHub auth 상태를 업데이트한다.
- 매 phase 전환 또는 3-5회 질의응답마다 `interview-state.md`와 `logs/`를 업데이트한다.
- 세션이 끊기면 먼저 `environment-state.md`, `interview-state.md`, `automation-brief.md`, `mission-backlog.md`를 읽고 이어간다.

### Work Grounding 산출물

```text
automation-brief.md

1. 나의 역할
2. 내가 책임지는 결과
3. 주요 이해관계자
4. 반복 업무 영역
5. 업무별 작업 목록
6. 작업별 입력/출력/도구/판단 기준
7. 자동화 후보 분류
8. 첫 미션 후보
```

### 인터뷰 연속성

인터뷰는 한 번에 끝나지 않을 수 있다. 그래서 대화의 현재 위치를 파일에 남긴다.

```text
interview-state.md

1. 현재 단계
2. 마지막으로 확인한 답변
3. 아직 묻지 않은 질문
4. 다음 질문
5. 완료 조건 대비 남은 항목
```

에이전트는 긴 인터뷰 중간에 항상 다음 질문을 분명히 남긴다.

```text
현재 위치: Work Grounding Pre-2 업무 영역 지도
지금까지 확인한 것: ...
다음 질문: 최근 1-2주 동안 반복한 업무 중 결과물이 파일이나 문서로 남는 일은 무엇인가요?
```

## 자동화 관점 분류

작업은 도구 이름이 아니라 일의 성격으로 분류한다.

| 분류 | 설명 | 예시 |
| --- | --- | --- |
| 수집 | 흩어진 정보를 모은다 | 문서, 메일, 이슈, 회의록 모으기 |
| 정리 | 정보를 구조화한다 | 요약, 태깅, 표 만들기 |
| 작성 | 초안을 만든다 | 보고서, 메일, PRD, 댓글 초안 |
| 변환 | 형식을 바꾼다 | 회의록을 액션아이템으로 바꾸기 |
| 검토 | 빠진 것과 틀린 것을 찾는다 | 체크리스트, 리뷰, 비교 |
| 판단 보조 | 선택지와 기준을 만든다 | 우선순위, 리스크, 대안 비교 |
| 실행 | 실제 시스템에 반영한다 | 파일 수정, PR 생성, 티켓 업데이트 |
| 모니터링 | 변화를 감지하고 알린다 | 실패 로그, 새 이슈, 일정 임박 |

초반 미션은 보통 정리, 작성, 변환, 검토에서 시작한다. 실행과 모니터링은 권한과 부작용이 커서 뒤로 둔다.

## Stage 2: Automation Exploration

`Automation Exploration`은 Work Grounding에서 선택한 자동화 후보를 실제 미션으로 정밀화하는 단계다.

이 단계는 Sprint-kit의 exploration 인터뷰 방식을 가져와 업무 자동화에 맞게 바꾼다.

### 6개 Phase

```text
Phase 1: 목적 정밀화
— 이 작업을 자동화해서 달성하려는 결과는 무엇인가?

Phase 2: 업무 영역 탐색
— 이 결과에 어떤 사람, 문서, 데이터, 도구, 정책이 관련되는가?

Phase 3: 현재 상태 공유
— 이 업무는 지금 어떤 순서로 진행되고 어디서 막히는가?

Phase 4: 실행 시나리오 탐색
— 사용자는 어떤 결과물을 만들고, AI는 어느 단계를 도울 수 있는가?

Phase 5: 가정 검증
— 이 자동화가 성립하려면 무엇이 사실이어야 하는가?

Phase 6: 미션 범위 합의
— 이번에 자동화할 것, 나중에 할 것, 하지 않을 것을 정리한다.
```

### Phase 1 이전과 이후의 관계

```text
Work Grounding
역할 → 목적/성과 → 업무 영역 → 작업 → 자동화 후보 선택

Automation Exploration
선택한 후보 → 자동화 목적 정밀화 → 관련 영역 탐색 → 시나리오 → 가정 검증 → 미션 확정
```

즉, `Phase 1: 목적 정밀화`는 전체 프로그램의 첫 단계가 아니다. 사용자의 역할과 업무 지도가 만들어진 뒤, 선택된 자동화 후보를 정밀화하는 첫 단계다.

### 인터뷰 리듬

각 중요한 항목은 `추출 → 제안 → 확정` 순서로 진행한다.

```text
1. 추출
   사용자의 의도와 현재 방식을 먼저 묻는다.

2. 제안
   사용자의 답변을 바탕으로 대안 1-2개를 제시한다.

3. 확정
   선택한 방향, 제외한 방향, 남은 가정을 기록한다.
```

대안은 사용자가 먼저 말한 뒤에 제시한다. AI가 먼저 선택지를 던지면 사용자의 실제 맥락을 놓칠 수 있다.

## 업무 영역 탐색 방법

Sprint-kit의 영역 탐색 방식을 업무 자동화에 맞게 바꾸면 다음 네 가지다.

| 방법 | 질문 | 적합한 경우 |
| --- | --- | --- |
| 엔티티 기반 Top-down | 이 업무에는 어떤 사람, 문서, 데이터, 도구, 결정 기준이 등장하는가? | 업무에 핵심 대상이 뚜렷할 때 |
| 퍼널 기반 | 시작부터 완료까지 어떤 단계에서 이탈, 대기, 재작업이 생기는가? | 전환율, 완료율, 처리 시간 개선이 목표일 때 |
| 터치포인트 매핑 | 어떤 채널과 시스템을 오가며 일이 진행되는가? | 이메일, Slack, 문서, 회의가 섞여 있을 때 |
| 영향 체인 역추적 | 원하는 결과가 성립하려면 무엇이 먼저 가능해야 하는가? | 목표는 있는데 어디서부터 바꿀지 흐릴 때 |

## Stage 3: Mission Execution

확정된 미션은 작은 실행 단위로 만든다.

```text
missions/
  M001-weekly-report-draft.md
  M002-customer-email-summary.md
```

각 미션 문서는 아래 구조를 가진다.

```text
# M001: 미션 이름

## 목표
## 현재 방식
## 자동화할 작업
## 입력
## 출력
## 포함 범위
## 제외 범위
## 검증 방법
## 위험과 가정
## 다음 행동
```

## Stage 4: Mission Backlog Loop

업무 지도와 미션 백로그는 한 번 만들고 끝나는 문서가 아니다. 미션을 실행할 때마다 업데이트한다.

```text
work-map.md
ontology-seeds.md
mission-backlog.md
missions/
logs/
```

| 파일 | 역할 |
| --- | --- |
| `work-map.md` | 역할, 성과, 업무 영역, 업무 흐름 |
| `ontology-seeds.md` | 사람, 문서, 데이터, 도구, 상태, 규칙, 관계 |
| `mission-backlog.md` | 자동화 후보, 우선순위, 난이도, 위험도, 상태, 다음 행동 |
| `missions/*.md` | 개별 자동화 미션 정의 |
| `logs/*.md` | 인터뷰와 실행 과정에서 나온 결정 기록 |

## 도구별 기능은 나중에 붙인다

초반에는 같은 개념을 먼저 배우고, 도구별 이름은 어댑터처럼 붙인다.

| 공통 개념 | Codex에서의 예 | Claude Code에서의 예 |
| --- | --- | --- |
| 지침 파일 | `AGENTS.md` | `CLAUDE.md` |
| 상태 점검 | `codex doctor` | `claude doctor` |
| 권한 관리 | sandbox, approval | permissions, modes |
| 클라우드/GitHub 연결 | Codex cloud, review | Claude web, web setup |

## 포함된 Skills

이 저장소에는 같은 Mission Discovery 흐름을 Codex와 Claude Code에서 각각 쓸 수 있는 skill로 포함한다. 기본 온보딩 설치에는 `work-mission-discovery`만 복사한다.

| 대상 | 위치 | 사용 예 |
| --- | --- | --- |
| Codex | `.agents/skills/work-mission-discovery/SKILL.md` | `$work-mission-discovery` |
| Claude Code | `.claude/skills/work-mission-discovery/SKILL.md` | `work-mission-discovery skill을 사용해주세요` |

두 skill 모두 `Work Environment Setup → Work Grounding → Automation Exploration → Mission Backlog` 흐름을 따른다. 공통 개념은 유지하고, 도구별 호출 방식만 다르게 둔다.

### 별도 재사용 Skill

`concept-board`는 온보딩에 자동 설치하지 않는 별도 skill이다. 작업 repo의 현재 상태, Git 흐름, 의사결정, 업무 지도, 자동화 후보를 `.concept-board/` 아래 HTML/SVG 보드로 시각화할 때 사용한다.

| 대상 | 위치 | 사용 예 |
| --- | --- | --- |
| Codex | `.agents/skills/concept-board/SKILL.md` | `$concept-board 현재 repo의 decision map을 만들어줘.` |
| Claude Code | `.claude/skills/concept-board/SKILL.md` | `concept-board skill로 현재 repo의 Git 흐름을 시각화해주세요.` |

## 인터뷰 완료 조건

인터뷰는 아래 조건이 모두 충족되면 완료로 본다.

| 조건 | 완료 증거 |
| --- | --- |
| 역할 이해 | 사용자의 역할, 책임, 이해관계자가 정리됨 |
| 목적 정렬 | 역할에서 좋아져야 할 결과가 1-3개로 정리됨 |
| 업무 지도 | 주요 업무 영역과 현재 흐름이 정리됨 |
| 작업 분해 | 최소 1개 업무 영역이 실행 단계까지 쪼개짐 |
| 자동화 분류 | 후보 작업이 수집/정리/작성/변환/검토/판단 보조/실행/모니터링으로 분류됨 |
| 후보 평가 | 반복성, 명확성, 입력, 검증, 위험, 시간 절약 기준으로 우선순위가 매겨짐 |
| 첫 미션 합의 | M001의 포함/제외/가정/검증 방법이 정리됨 |
| 다음 행동 | 바로 실행할 첫 작업과 필요한 파일/권한/데이터가 명확함 |

완료 산출물:

```text
environment-state.md
interview-state.md
automation-brief.md
work-map.md
ontology-seeds.md
mission-backlog.md
missions/M001-<slug>.md
logs/<YYYY-MM-DD>-mission-discovery.md
```

## 이후 작업 연계

인터뷰가 끝나면 바로 구현으로 뛰어들지 않고, M001을 다시 작은 실행 단위로 바꾼다.

```text
M001 범위 확인
→ 입력 샘플 확보
→ 기대 출력 예시 작성
→ 검증 방법 확정
→ 가장 작은 자동화 구현
→ 실제 입력으로 실행
→ 결과 검토
→ mission-backlog.md 업데이트
```

첫 실행 미션은 다음 조건을 만족해야 한다.

- 사용자가 결과를 직접 검토할 수 있다.
- 실패해도 실제 고객, 결제, 운영 데이터에 영향을 주지 않는다.
- 입력과 출력이 파일 또는 명확한 텍스트로 남는다.
- 완료 여부를 명령, diff, 문서, PR, 샘플 출력 중 하나로 확인할 수 있다.

## 좋은 시작 프롬프트

```text
제 업무를 AI와 함께 자동화 후보까지 쪼개고 싶습니다.

먼저 AI 작업 루트, GitHub 연결, local/remote, commit/push/pull을 확인하는 Work Environment Setup부터 진행해주세요.
그 다음 제 역할과 업무를 이해하는 Work Grounding으로 넘어가주세요.

진행 방식:
- 한 번에 1-3개만 질문해주세요.
- 필요한 경우 environment-state.md에 작업 환경 상태를 저장해주세요.
- 제가 답하면 역할, 책임지는 결과, 업무 영역, 작업 단위로 정리해주세요.
- 작업은 수집/정리/작성/변환/검토/판단 보조/실행/모니터링으로 분류해주세요.
- 반복성 높고, 위험 낮고, 검증 쉬운 첫 자동화 후보를 추천해주세요.
- 마지막에는 automation-brief.md와 mission-backlog.md 초안을 만들 수 있게 정리해주세요.
```
