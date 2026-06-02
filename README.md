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

M. Meta Monitoring Loop
   두 번째 CLI 세션이 파일과 Git 상태를 읽고 작업 현황판과 조언을 갱신한다

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
| Local/Remote | 내 컴퓨터의 repo와 GitHub repo는 연결된 한 쌍이다 |
| 인증과 권한 | CLI가 외부 서비스에 접근하려면 로그인된 권한이 필요하다 |
| 지침 파일 | 반복해서 말할 작업 방식을 파일로 저장한다 |
| 안전한 권한 | 읽기, 수정, 실행, 외부 접근은 위험도가 다르다 |
| 작업 단위 | 좋은 요청은 목표, 현재 상태, 제약, 완료 기준을 포함한다 |
| 메인 세션 | 실제 설치, 인터뷰, 구현, 검증을 진행하는 CLI 대화다 |
| 모니터 세션 | 다른 CLI가 접근 가능한 작업 내용을 읽고 `meta-monitor/` 안에만 현황과 조언을 쓴다 |
| Briefing Board | 현재 phase, 결정, 위험, 다음 행동, 메타 세션 TUI, 질문 입력창, 설정, 시각화를 HTML로 보여주는 작업 지도다 |
| 모니터 전용 폴더 | 메타 모니터 세션이 쓸 수 있는 유일한 write 영역이다 |

## Stage -2: Web Entry

웹페이지는 진입점 역할만 한다. 사용자가 브라우저에서 설치 명령을 확인하고, `codex` 또는 `claude`가 실행되는 상태까지 도달하면 웹페이지의 역할은 끝난다.

정적 진입 페이지:

```text
web/index.html
```

로컬에서 열기:

```bash
open web/index.html
```

이 페이지가 담당하는 것:

- Codex 또는 Claude Code 선택
- 운영체제별 설치 명령 안내
- 설치 확인 명령 안내
- 로그인 시작 명령 안내
- CLI에 붙여넣을 handoff prompt 제공

이 페이지가 담당하지 않는 것:

- GitHub repo 생성
- `AGENTS.md` / `CLAUDE.md` 설치
- skill 설치
- 업무 인터뷰 진행
- 미션 백로그 작성

위 작업들은 CLI가 설치된 뒤 터미널 안에서 이어간다.

## Stage -1: CLI Handoff And Onboarding Kit Installation

이 단계의 목적은 설치된 CLI가 사용자의 실제 업무 저장소에서 온보딩을 이어받게 만드는 것이다.

기본값은 **프로젝트 단위 설치**다. 전역 설치는 모든 저장소에 영향을 주므로 초보자 온보딩에서는 나중 선택지로 둔다.

### 설치 대상

| 항목 | Codex | Claude Code | 목적 |
| --- | --- | --- | --- |
| 지속 지침 | `AGENTS.md` | `CLAUDE.md` | 매 세션 반복할 작업 방식 저장 |
| Skill | `.agents/skills/work-mission-discovery/` | `.claude/skills/work-mission-discovery/` | 업무 인터뷰와 미션 백로그 생성 |
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

# Claude Code project skill
mkdir -p .claude/skills
cp -R /path/to/onboarding/.claude/skills/work-mission-discovery .claude/skills/
```

이 온보딩 저장소 자체에서는 이미 두 위치에 skill이 들어 있다.

사용 확인:

```text
Codex: "$work-mission-discovery 를 사용해서 제 업무 온보딩 인터뷰를 시작해주세요."
Claude Code: "work-mission-discovery skill을 사용해서 제 업무 온보딩 인터뷰를 시작해주세요."
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

## Meta Monitoring Loop

Meta Monitor는 이제 별도 레포에서 관리한다.

```text
https://github.com/day1-ax-tools/meta-monitor
```

이 onboarding 레포는 메타 모니터를 직접 구현하거나 배포하지 않는다. 장기 작업에서 사용자가 명시적으로 요청할 때, 별도 `day1-ax-tools/meta-monitor` 레포의 `meta-monitor/` 런타임을 대상 repo에 설치해 연결한다. 이 repo 안의 로컬 `meta-monitor/` 폴더는 데모/개발용 설치물이며 Git에 커밋하지 않는다.

온보딩이 CLI로 넘어간 뒤에는 사용자가 진행 상황을 계속 기억하기 어렵다. 이때 선택적으로 두 번째 CLI 세션을 열어 `메타 모니터 세션`으로 사용한다. 메타 모니터는 자동으로 켜지지 않는다. 사용자가 명시적으로 요청한 repo에서만 온보딩하고 작동한다.

핵심 원칙은 "모든 작업 내용은 관찰하되, 모델 내부 추론 과정은 관찰하지 않는 모니터"다. 같은 로컬 작업자의 메인 세션 채팅 기록, 실행 명령, 파일 변경, 로그, 산출물에는 접근할 수 있어야 한다. 다만 내부 추론 과정까지 읽으면 메타 모니터가 메인 세션과 동기화되어 독립적인 관찰자 역할을 잃을 수 있으므로 의도적으로 관찰 대상에서 제외한다. 접근 가능한 작업 내용, 상태 파일, 로그, diff를 근거로 현황판과 조언을 만든다.

### 세션 역할

| 세션 | 역할 | 읽는 것 | 쓰는 것 |
| --- | --- | --- | --- |
| 메인 세션 | 설치, 환경 설정, 인터뷰, 미션 실행 | 사용자 답변, repo 파일, 모니터 조언 | `environment-state.md`, `interview-state.md`, `automation-brief.md`, `mission-backlog.md`, `logs/` |
| 모니터 세션 | 진행 상황 관찰, 위험 감지, 시각화, 질문 응답 | 채팅 기록, 실행 명령, 파일 변경, 상태 파일, 로그, `git status`, `git diff --stat` | `meta-monitor/**` 안의 파일만 |

### 활성화 조건

메타 모니터는 아래 조건이 충족될 때만 시작한다.

- 사용자가 "메타 모니터를 켜자", "Briefing Board를 만들자", "보조 세션으로 관찰하자"처럼 명시적으로 요청한다.
- 현재 repo에 온보딩 지침과 `work-mission-discovery` skill이 설치되어 있거나, 설치 절차를 먼저 진행한다.
- 메인 세션의 작업 내용이 관찰 가능한 형태로 남아 있다.
- `meta-monitor/settings.json`이 생성되어 provider, model, effort, language, context, fast mode 설정이 기록된다. language fallback은 `en`이고, 현재 언어는 터미널에서 사용자가 입력하는 언어를 우선한다.
- 모니터 세션의 write scope가 `meta-monitor/**`로 제한된다.

### Skill / Plugin / MCP 선택

초기 구현은 **skill 기반**을 기본값으로 둔다.

| 방식 | 적합한 시점 | 장점 | 한계 |
| --- | --- | --- | --- |
| Skill | 지금 바로 repo별 온보딩과 운영 규칙을 적용할 때 | 설치가 가볍고 Codex/Claude Code 모두 같은 개념으로 운영 가능 | 실제 세션 연결, settings 저장 자동화, live UI 제어는 제한적 |
| Plugin | skill, 템플릿, Briefing Board asset을 한 번에 배포하고 싶을 때 | 설치 경험과 파일 구조를 표준화하기 좋음 | runtime 제어 자체는 여전히 별도 도구가 필요 |
| MCP | 세션 기록 수집, Briefing Board 저장, 모델 실행 설정, context telemetry를 실제 API처럼 제어해야 할 때 | live bridge와 자동화가 가능 | 초기 온보딩에는 무겁고 설치/권한 리스크가 큼 |

권장 경로:

```text
v1: onboarding skill + separate day1-ax-tools/meta-monitor runtime
→ v2: plugin으로 skill과 Briefing Board asset 배포
→ v3: MCP로 live session bridge, settings persistence, context telemetry 자동화
```

즉, 지금은 onboarding skill과 별도 Meta Monitor runtime repo로 시작하되, `meta-monitor/settings.json`과 `meta-monitor/session-data.jsonl` 계약을 유지해 plugin/MCP로 확장하기 쉽게 만든다.

### 운영 리듬

```text
메인 세션이 보이는 질문, 답변 요약, 도구/명령 요약, 파일 변경, 검증 결과를 main-session-events.jsonl에 저장한다
→ 모니터 워커가 AGENTS.md/CLAUDE.md와 main-session-events.jsonl을 읽어 monitor-input.latest.json을 만든다
→ monitor-prompt.md가 최신 입력 JSON을 메타 설명으로 바꾼다
→ 모니터 세션이 meta-monitor/meta-advice.md와 Briefing Board를 갱신한다
→ 사용자는 브라우저에서 Briefing Board를 보고, 필요할 때만 추가 질문을 보조 큐로 보낸다
→ 필요하면 메인 세션이 meta-monitor/meta-advice.md를 읽고 다음 행동에 반영한다
```

### 모니터 세션 시작 프롬프트

두 번째 터미널에서 같은 repo로 이동한 뒤 AI CLI를 하나 더 실행하고 아래 프롬프트를 붙여넣는다. Codex를 모니터로 쓰는 것을 기본값으로 두지만, 같은 파일 계약을 지키면 다른 AI CLI도 가능하다.

```text
당신은 메타 모니터 세션입니다.

메인 작업 세션의 사용자에게 보이는 작업 내용을 최대한 읽어주세요. 핵심 입력은 meta-monitor/main-session-events.jsonl입니다. 이 파일에는 메인 세션의 보이는 질문, 답변 요약, 실행 명령, 도구 출력 요약, 파일 변경, 생성 산출물, 결정, 검증 결과가 들어갑니다. 단, 모델 내부 추론 과정은 읽거나 추적하지 마세요. 추론 과정까지 읽으면 메타 모니터가 메인 세션과 동기화되어 독립적인 관찰자 역할을 잃을 수 있습니다. meta-monitor/AGENTS.md, meta-monitor/CLAUDE.md, meta-monitor/monitor-input.schema.json, meta-monitor/monitor-prompt.md, 현재 repo의 environment-state.md, interview-state.md, automation-brief.md, mission-backlog.md, logs/ 및 git status/diff도 함께 근거로 사용해주세요.

필요하면 meta-monitor/monitor-input.latest.json, meta-monitor/briefing-board.html, meta-monitor/monitor-state.json, meta-monitor/meta-advice.md, meta-monitor/session-data.jsonl을 업데이트하고, 복잡한 관계는 meta-monitor/visualizations/ 아래 HTML로 시각화해주세요.

메인 세션을 방해하지 말고 조언은 meta-monitor/meta-advice.md에 남겨주세요. 읽기는 repo 전체에서 가능하지만, 쓰기는 meta-monitor/ 폴더 안으로만 제한해주세요. 제품 코드, 미션 산출물, environment-state.md, interview-state.md, mission-backlog.md는 수정하지 마세요. meta-monitor/settings.json의 language를 따르고, fallback은 en으로 두되 현재 언어는 메인 세션 터미널 입력 언어를 우선해주세요. 현재 입력이 한국어이면 language.current는 ko로 설정해주세요. context 사용량이 70%를 넘으면 meta-monitor/session-handoff.md를 최신 파일 하나로만 갱신하고 context clear를 준비해주세요.
```

### Briefing Board 산출물

| 파일 | 목적 |
| --- | --- |
| `meta-monitor/briefing-board.html` | 현재 phase, 목표, 진행률, 결정, 열린 질문, 위험, 다음 행동, 실시간 모니터 콘솔, 설정 버튼 |
| `meta-monitor/bridge-server.mjs` | 질문 제출, 출력 조회, `/api/events` 실시간 스트림을 제공하는 로컬 bridge |
| `meta-monitor/main-session-events.jsonl` | 메인 세션의 보이는 질문, 답변 요약, 결정, 산출물 변경, 검증 결과 이벤트 |
| `meta-monitor/monitor-input.schema.json` | 모니터 입력 JSON의 표준 구조 |
| `meta-monitor/monitor-prompt.md` | 입력 JSON을 메타 설명으로 바꾸는 prompt 계약 |
| `meta-monitor/monitor-input.latest.json` | 워커가 매 처리마다 생성하는 최신 입력 패킷 |
| `meta-monitor/monitor-worker.mjs` | 메인 세션 이벤트를 우선 읽고, 없을 때 질문 큐를 읽어 read-only Codex 실행 결과를 `meta-monitor/meta-advice.md`에 쓰는 monitor worker |
| `meta-monitor/settings.json` | provider, model, effort, language, context, fast mode, design, write scope 설정 |
| `meta-monitor/monitor-state.json` | 처리한 관찰 signature, 질문, runtime model, 마지막 답변 상태 |
| `meta-monitor/meta-advice.md` | 메인 세션에 전달할 조언, 확인 질문, 리스크 |
| `meta-monitor/questions.jsonl` | Briefing Board에서 Submit한 추가 질문 보조 큐 |
| `meta-monitor/session-data.jsonl` | 메타 모니터 세션의 관찰, 질문, 답변, 도구 사용, 산출물 변경 이벤트 |
| `meta-monitor/session-handoff.md` | context 70% 초과 시 다음 모니터 세션이 이어받을 최신 handoff 하나 |
| `meta-monitor/visualizations/work-map-dashboard.html` | 역할, 성과, 업무 영역, 작업 분해 시각화 |
| `meta-monitor/visualizations/mission-dashboard.html` | 자동화 후보, 우선순위, 상태 시각화 |
| `meta-monitor/visualizations/decision-map.html` | 복잡한 선택지와 tradeoff 시각화 |

### Briefing Board UI 구성

`meta-monitor/briefing-board.html`은 실제 CLI를 대체하지 않는다. 대신 메타 모니터 세션을 브라우저에서 관찰하고, 로컬 bridge가 켜져 있을 때 질문을 monitor CLI 큐로 제출하며, 설정을 준비하는 화면이다.

| 영역 | 역할 |
| --- | --- |
| 상단 상태 태그 | 현재 레포, 로컬 폴더, 브랜치, 메인 세션, 모니터 세션, 언어, 쓰기 범위, 컨텍스트 경고선을 보여준다 |
| 상단 탭 | `메타 모니터 콘솔`, `현황`, `업무 지도`, `미션 백로그`, `의사결정 지도`로 화면을 나눈다 |
| 메타 모니터 콘솔 | 최근 메인 세션 이벤트, 추가 질문 입력, 제출 상태, 실시간 연결 상태, 답변 로그를 한 터미널형 콘솔에서 보여준다 |
| 출력 확인 | 최근 관찰 이벤트는 `meta-monitor/main-session-events.jsonl`, 최신 입력은 `meta-monitor/monitor-input.latest.json`, 최근 모니터 답변은 `meta-monitor/meta-advice.md`에서 읽어와 콘솔에 누적한다 |
| 우상단 설정 버튼 | provider, model, effort, language, context 크기, fast mode, provider 기반 디자인 설정을 dialog에서 수정한다 |
| 현황 탭 | 현재 phase, 목표, 진행률, 리스크, 다음 행동을 보여준다 |
| 시각화 탭 | 복잡한 업무 지도, 의사결정, backlog를 각 탭과 `meta-monitor/visualizations/`의 HTML로 출력한다 |
| Write scope 배지 | 모니터 세션의 쓰기 권한이 `meta-monitor/**`로 제한되어 있음을 표시한다 |

브리핑 보드의 사용자-facing UI는 현재 사용자의 입력 언어를 따른다. 현재 메인 세션 입력이 한국어이면 탭, 버튼, 상태 메시지, 설정 label도 한국어로 표시한다.

정적 HTML은 파일을 직접 저장하지 못할 수 있다. 그래서 Briefing Board는 설정 UI에서 JSON을 만들고, 사용자가 복사한 설정 반영 프롬프트를 메타 모니터 CLI에 붙여넣어 `meta-monitor/settings.json`을 갱신하는 방식을 기본값으로 둔다. 출력 확인은 로컬 bridge가 켜져 있을 때 동작한다. 콘솔은 `/api/events` 실시간 스트림으로 최근 메인 세션 이벤트, 추가 질문, `meta-monitor/meta-advice.md`의 답변을 받는다. 별도 worker인 `meta-monitor/monitor-worker.mjs`는 `meta-monitor/main-session-events.jsonl`을 우선 읽어 `meta-monitor/monitor-input.latest.json`을 만들고, `meta-monitor/monitor-prompt.md`로 답변 파일을 갱신한다. 추가 질문 제출은 `/api/questions`를 통해 보조 큐에 쓴다. `/api/monitor-output`은 수동 새로고침 fallback으로 둔다. 추후 MCP가 붙으면 이 저장 과정을 자동화할 수 있다.

### 모델 설정

`meta-monitor/settings.json`은 메타 모니터 세션 시작 전에 만들어야 한다.

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

설정 의미:

| 항목 | 의미 |
| --- | --- |
| `provider` | 사용할 모델 제공자 |
| `model` | 사용할 모델 이름 |
| `effort` | reasoning/analysis effort 설정 |
| `language` | 모니터 응답과 Briefing Board 언어. fallback은 `en`, 현재 언어는 터미널 입력 언어 우선 |
| `contextWindowTokens` | 모델 context 창 크기 |
| `contextSoftLimitRatio` | handoff를 준비할 기준, 기본 0.7 |
| `fastMode` | 빠른 응답 우선 모드 |
| `questionTransport` | Briefing Board Submit을 monitor CLI 큐로 넘기는 로컬 bridge 설정 |
| `answerWorker` | 관찰 이벤트 또는 질문 큐를 실제 답변 파일로 바꾸는 monitor worker 설정 |
| `monitorInput` | schema, prompt, 메인 세션 이벤트 로그, 최신 입력 JSON 위치 |
| `mainSession` | 모니터가 관찰하는 메인 세션의 provider, model, session id, 설명 |
| `design` | Briefing Board 디자인 출처. 현재 메인 세션 provider가 OpenAI면 `openai`, Claude면 `claude` |
| `writeScope` | 모니터 세션이 쓸 수 있는 경로, 기본 `meta-monitor/**` |

### Context Handoff

메타 모니터도 context 제한에 걸릴 수 있다. context 사용량이 `settings.json.contextSoftLimitRatio`를 넘으면 아래를 수행한다.

```text
context usage >= 70%
→ meta-monitor/session-handoff.md 갱신
→ handoff에는 긴 내용을 직접 복사하지 않고 파일 참조와 짧은 현재 상태만 기록
→ 이전 handoff 파일은 유지하지 않고 최신 파일 하나만 덮어쓴다
→ 새 모니터 세션을 시작하거나 context clear 후 session-handoff.md를 읽고 이어간다
```

`session-handoff.md`는 누적 보관하지 않는다. 오래된 handoff가 쌓이면 그것 자체가 context 오염원이 되기 때문이다. handoff는 가능한 한 참조 중심으로 쓴다. 참조한 파일이 사라지거나 변경되어 stale해지면, 그 항목은 삭제한다.

### Session Data

모니터 세션은 매 관찰/질문/답변/갱신마다 `meta-monitor/session-data.jsonl`에 이벤트를 남긴다. 이 데이터는 나중의 `learn` 기능이 반복적으로 사용한 기능, 가치 있는 구현 방식, 자주 쓰는 시각화, 좋은 질문 패턴을 찾아 기능화하는 재료가 된다.

메인 세션 데이터는 메인 세션이 별도로 저장한다. 메타 모니터가 바로 읽는 최소 이벤트 로그는 `meta-monitor/main-session-events.jsonl`이고, 장기 학습용 세부 로그 권장 경로는 아래와 같다.

```text
logs/main-session-data.jsonl
meta-monitor/session-data.jsonl
```

메타 모니터는 `logs/main-session-data.jsonl`을 읽을 수는 있지만 쓰지 않는다.

### 완료 조건

메타 모니터링은 필수 단계가 아니라 장기 작업을 돕는 보조 루프다. 켜는 경우 아래가 충족되어야 한다.

- 메인 세션의 작업 내용이 채팅 기록, 세션 로그, 명령/도구 출력, 파일, Git 상태로 관찰 가능하다.
- `meta-monitor/settings.json`이 존재하고 활성화 상태다.
- 모니터 세션이 읽은 작업 내용, 근거 파일, Git 상태를 `meta-monitor/monitor-input.latest.json`과 `meta-monitor/monitor-state.json`에 기록한다.
- `meta-monitor/briefing-board.html`이 TUI, 입력창, 설정 패널, 현재 phase, 다음 행동, 열린 위험을 보여준다.
- `meta-monitor/meta-advice.md`의 조언은 근거 파일을 가리킨다.
- `meta-monitor/main-session-events.jsonl`에 메인 세션의 보이는 질문과 답변 요약이 저장된다.
- `meta-monitor/session-data.jsonl`에 이번 모니터 세션 이벤트가 저장된다.
- context 사용량 70% 초과 시 `meta-monitor/session-handoff.md` 최신 파일 하나만 유지된다.
- 모니터 세션의 write는 `meta-monitor/**` 안으로만 제한된다.

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
| `mission-backlog.md` | 자동화 후보, 우선순위, 난이도, 위험도 |
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

이 저장소에는 같은 Mission Discovery 흐름을 Codex와 Claude Code에서 각각 쓸 수 있는 skill로 포함한다.

| 대상 | 위치 | 사용 예 |
| --- | --- | --- |
| Codex | `.agents/skills/work-mission-discovery/SKILL.md` | `$work-mission-discovery` |
| Claude Code | `.claude/skills/work-mission-discovery/SKILL.md` | `work-mission-discovery skill을 사용해주세요` |

두 skill 모두 `Work Environment Setup → Work Grounding → Automation Exploration → Mission Backlog` 흐름을 따른다. 공통 개념은 유지하고, 도구별 호출 방식만 다르게 둔다.

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

Meta Monitoring Loop를 켠 경우 추가 산출물:

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
meta-monitor/visualizations/*.html
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
- 장기 작업이 되면 별도 메타 모니터 세션이 읽을 수 있도록 상태 파일을 갱신하고, 메타 모니터 세션은 쓰기를 meta-monitor/ 안으로만 제한해서 HTML 현황판과 시각화를 갱신해주세요.
```
