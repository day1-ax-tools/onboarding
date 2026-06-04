# Brief Board Visualization Plan

brief board는 CLI 대화 내용을 대신 판단하지 않는다. AI CLI가 markdown 산출물에 정리한 현재 상태를 읽고, 사용자가 다음 단계로 넘어갈 수 있는지 시각적으로 확인하게 해주는 로컬 현황판이다.

## Goals

- CLI 인터뷰의 현재 단계를 한눈에 보여준다.
- 사용자의 업무가 역할 → 성과 → 업무 영역 → 작업 → 자동화 후보 → 미션으로 좁혀지는 과정을 보여준다.
- local repo, GitHub remote, commit, push, pull 같은 공통 개념을 시각적으로 설명한다.
- 각 단계의 완료조건과 부족한 정보를 드러낸다.
- 업무 정의와 미션의 원본은 markdown이고, board는 표시용 projection이라는 경계를 유지한다.

## Rendering Stack

기본 렌더링은 외부 의존성 없이 `Vanilla HTML/CSS/JS + inline SVG`로 유지한다.

| Need | Tool | Reason |
| --- | --- | --- |
| Onboarding branch graph | Inline SVG | Branch, merge, state node 표현이 명확하고 GitHub Pages/file/local server에서 안정적이다. |
| Concept explanation | Inline SVG + HTML table | 방향성과 용어를 함께 보여주기 쉽다. |
| Work map | HTML grid + compact flow | 긴 텍스트가 섞여도 줄바꿈과 접근성을 유지한다. |
| Workflow decomposition | HTML flow diagram | Trigger → Inputs → Steps → Output → Evidence를 안정적으로 표현한다. |
| Candidate comparison | HTML table + risk/value matrix | 정렬, 상태, 검증 기준을 함께 보여준다. |
| Mission progress | Kanban lanes | 이어갈 작업, 후보, 보류, 완료/제외 상태를 직관적으로 보여준다. |
| Decisions and assumptions | Decision table + assumption map | 포함/제외/보류/미확인 가정을 추적한다. |

Mermaid, D3, Cytoscape 같은 외부 렌더러는 초기 온보딩 기본 경로에 넣지 않는다. 복잡한 graph가 필요해질 때 별도 `concept-board` skill이나 optional view에서 검토한다.

## Board Data Contract

`board-data.json`은 화면 표시용 데이터다. 원본은 `environment-state.md`, `work-map.md`, `ontology-seeds.md`, `mission-backlog.md`, `automation-brief.md`, `missions/*.md`다.

```json
{
  "version": 1,
  "updatedAt": "2026-06-04T00:00:00.000Z",
  "sources": [],
  "role": "Growth operations lead",
  "outcomes": [],
  "works": [],
  "workFlows": [],
  "tasks": [],
  "firstMission": null,
  "artifacts": [],
  "visualizations": []
}
```

`visualizations`는 점진적으로 추가한다. 기존 필드에서 렌더링 가능한 것은 기존 필드를 우선 사용하고, 복잡한 보드는 아래 계약으로 확장한다.

| Type | Source | Renderer |
| --- | --- | --- |
| `concept-flow` | `environment-state.md` | Local/remote, push/pull, folder map |
| `branch-graph` | `.onboarding/state.json` | Onboarding progress graph |
| `work-map-tree` | `work-map.md` | Role → outcome → work area |
| `workflow-flow` | `work-map.md` | Trigger → inputs → steps → output → evidence |
| `risk-value-matrix` | `mission-backlog.md` | Candidate value/risk comparison |
| `mission-kanban` | `mission-backlog.md`, `missions/*.md` | Candidate and mission status lanes |
| `decision-map` | `automation-brief.md`, `missions/*.md` | Included/excluded/deferred/unverified |
| `artifact-table` | source file list | Which artifact owns which truth |

## Dynamic Concept Board Contract

개념 보드는 static tutorial screen이 아니라 CLI 설명의 시각화 projection으로 동작한다. CLI가 현재 사용자의 repo, 단계, 질문, 산출물에 맞는 설명을 만들면 아래 파일을 갱신한다.

```text
.onboarding/concepts/current-concept.json
```

`brief-board.html`은 이 파일을 주기적으로 읽고, 존재하면 "현재 설명" 탭을 우선 표시한다. 파일이 없으면 기본 내장 개념인 작업 위치, Local/Remote, Commit, Push/Pull, 작업에서 미션까지를 보여준다.

Concept data shape:

```json
{
  "version": 1,
  "id": "git-local-remote-current",
  "label": "현재 설명",
  "type": "step-flow",
  "title": "local에서 만든 commit은 push 후 GitHub remote에도 존재합니다",
  "description": "현재 repo 기준으로 local에서 commit을 만들고, push 후 remote history에도 같은 commit이 반영되는 순서를 보여줍니다.",
  "updatedAt": "2026-06-04T00:00:00.000Z",
  "sourceRefs": ["environment-state.md", "git status", "git remote -v"],
  "nodes": [
    { "id": "edit", "label": "1. Edit", "detail": "파일 수정", "lane": "local", "status": "done" },
    { "id": "remote", "label": "GitHub", "detail": "remote repo", "lane": "remote" }
  ],
  "edges": [
    { "from": "edit", "to": "remote", "label": "push" }
  ],
  "rows": [
    ["local repo", "내 컴퓨터에 있는 작업 폴더"],
    ["remote repo", "GitHub에 있는 연결 저장소"]
  ],
  "note": "commit은 repo history의 기록 단위입니다. local에서 만들 수도 있고, push 후 remote에도 같은 commit이 존재할 수 있습니다."
}
```

Rules:

- HTML은 고정 shell로 유지하고, CLI는 구조화된 JSON만 갱신한다.
- `current-concept.json`은 표시용이다. 원본은 실제 repo 상태와 markdown 산출물이다.
- `sourceRefs`를 남겨 오래된 설명을 나중에 판별할 수 있게 한다.
- 숨겨진 추론, 인증 정보, 토큰, private log 원문은 저장하지 않는다.
- 동적 개념 보드는 온보딩에도 쓰지만, 나중에 독립 `concept-board` skill의 입력 형식으로 재사용할 수 있게 유지한다.

## Step Views

### 1. Environment And Concept Board

Purpose: 사용자가 지금 어디에서 작업하고 있으며, 내 컴퓨터의 local repo와 GitHub remote가 어떻게 연결되는지 이해한다.

Visuals:

- Folder tree for work root.
- Local/remote flow diagram.
- Ordered step flow: edit → status/add → commit → push, plus remote change → pull.
- Repo/session/tool status tags.

Completion signals:

- Work root is chosen.
- Current repo path is known.
- GitHub account/auth state is known.
- Remote URL and branch are known, or blocker is recorded.

### 2. Onboarding Branch Graph

Purpose: 설치, 인증, kit 설치, 작업 루트, GitHub 연결, 업무 지도, 미션 선택이 어떤 흐름으로 진행되는지 보여준다.

Visuals:

- Inline SVG branch graph.
- Branch table with current signal.
- Hook state and last updated timestamp.

Completion signals:

- Step state comes from `.onboarding/state.json`.
- A step is `done` only when the CLI verified evidence.
- Hooks are disposed when all required steps are done.

### 3. Work Definition Board

Purpose: 사용자의 역할과 책임지는 결과가 업무 영역으로 연결되는 것을 보여준다.

Visuals:

- Role/outcome/stakeholder summary.
- Work area table: area, outcome link, frequency, pain.
- Work map tree: role → outcomes → work areas.

Completion signals:

- Role, responsibility, stakeholder, and decision authority are summarized.
- 1-3 outcomes are written as state changes.
- 3-7 recurring work areas are connected to outcomes.

### 4. Workflow Decomposition Board

Purpose: 큰 업무가 자동화 후보가 될 수 있는 leaf task까지 충분히 쪼개졌는지 보여준다.

Visuals:

- Flow cards: Trigger → Inputs → Steps → Output → Evidence.
- Side badges: human decision, automation type, risk, candidate status.
- Missing fields are shown as "입력 대기" rather than hidden.

Completion signals:

- At least one high-value work area is decomposed to leaf tasks.
- Each leaf task has trigger, inputs, steps, output, human decision, completion evidence, automation type, and risk.
- Broad verbs such as "관리", "처리", "검토", "운영", "분석", "정리" have been decomposed further.

### 5. Automation Candidate Board

Purpose: 후보를 비교하고 왜 첫 미션으로 적합한지 보여준다.

Visuals:

- Risk/value matrix.
- Candidate score table.
- Type distribution.
- Verification readiness badges.

Completion signals:

- 2-4 candidates are compared.
- Each candidate has value, risk, input availability, verification, status, and next action.
- A default first mission is recommended.

### 6. Mission Scope Board

Purpose: 선택된 M001이 실제 실행 가능한 범위인지 확인한다.

Visuals:

- Included / excluded / deferred / unverified columns.
- Assumption table with verification or fallback.
- First implementation step.

Completion signals:

- The user accepts M001 or the open decision is recorded.
- Included, excluded, deferred, unverified items are recorded.
- Inputs, expected output, verification method, and next action are known.

### 7. Mission Backlog Board

Purpose: 온보딩 이후에도 이어갈 작업 목록을 유지한다.

Visuals:

- Kanban lanes: 이어갈 작업, 후보 목록, 나중에 검토, 완료/제외.
- Mission table with ID, status, next action, source.
- Artifact table showing source-of-truth files.

Completion signals:

- `mission-backlog.md` and `missions/*.md` are current.
- `board-data.json` was regenerated after source updates.
- The next action is visible for selected or active missions.

## Sample Screen File

단계별 샘플 화면은 `web/brief-board-visualization-samples.html`에 둔다. 이 파일은 실제 상태를 읽지 않고, 디자인과 정보 구조를 검토하기 위한 pattern preview다. 런타임에서는 CLI가 markdown 산출물과 `current-concept.json`을 갱신하고, `brief-board.html`이 이를 렌더링한다.

Use it for:

- 단계별 사용자 경험 리뷰.
- 새 시각화 타입 추가 전 wireframe 확인.
- CLI 인터뷰 산출물이 어떤 화면으로 바뀌는지 설명.

Do not use it as:

- Runtime board.
- Source of truth.
- Completion evidence.
