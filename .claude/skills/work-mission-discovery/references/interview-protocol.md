# Interview Protocol

## Principles

- Start from role and outcome, not from tools.
- Keep the user in their domain language.
- Ask for current behavior before suggesting future behavior.
- Ask one narrow question when the user is uncertain.
- Reframe solutions into outcomes without rejecting the user's idea.

## Question Anti-Patterns

| Avoid | Better |
| --- | --- |
| "어떤 자동화 툴을 쓰고 싶나요?" | "이 일을 자동화하면 어떤 시간이 줄거나 어떤 실수가 줄어야 하나요?" |
| "Slack 봇을 만들까요?" | "이 업무에서 반복적으로 확인하거나 전달하는 정보는 무엇인가요?" |
| "API로 연결하면 되나요?" | "그 정보는 지금 어디에서 확인하시나요?" |
| "이 작업을 자동화하면 되겠네요." | "자동화 후보로 보이지만, 입력과 검증 방법을 먼저 확인하겠습니다." |

## Work Grounding Detail

### Pre-0: Role Definition

Ask:

- "어떤 역할을 맡고 계신가요?"
- "그 역할에서 최종적으로 책임지는 결과는 무엇인가요?"
- "누가 그 결과의 영향을 받나요?"

Capture:

- Role name.
- Responsibility.
- Stakeholders.
- Decision authority.

### Pre-1: Outcome Definition

Ask:

- "좋아져야 하는 결과를 시간, 품질, 매출, 리스크, 만족도 중 어디에 가깝게 볼 수 있나요?"
- "현재 가장 아쉬운 지점은 무엇인가요?"

Capture outcomes as state changes, not features.

### Pre-2: Work Area Map

Use four exploration methods:

| Method | Use |
| --- | --- |
| Entity top-down | Follow people, documents, data, tools, and decision objects. |
| Funnel | Follow steps from request/start to completion. |
| Touchpoint map | List channels and systems the work crosses. |
| Impact chain | Ask "for this result to happen, what must happen first?" recursively. |

### Pre-3: Workflow Decomposition

For each work area, capture:

- Trigger.
- Inputs.
- Steps.
- Output.
- Tools.
- Decision points.
- Rework loops.
- Handoff points.
- Evidence of completion.

### Pre-4: Automation Classification

Classify each task as one or more:

`수집`, `정리`, `작성`, `변환`, `검토`, `판단 보조`, `실행`, `모니터링`.

Mark first-mission suitability:

- Good first mission: repeated, low risk, text/file based, easy to verify.
- Later mission: high permissions, external side effects, unclear rules, weak verification.

### Pre-5: Candidate Selection

Present 2-4 candidates. For each candidate, state:

- What changes for the user.
- Cost or setup needed.
- Risk if wrong.
- Verification method.
- Why it is or is not a good first mission.

Recommend one default.

## Automation Exploration Detail

### Phase 1: Purpose Refinement

Reframe the selected candidate into an outcome.

Ask:

- "이 작업이 자동화되면 어떤 결과가 좋아져야 하나요?"
- "시간 절약, 실수 감소, 품질 일관성, 의사결정 보조 중 무엇이 핵심인가요?"

### Phase 2: Work Area Exploration

Identify people, documents, data, tools, rules, and decisions.

If the user adds a new related area, validate by:

- Causal link: how does this area affect the outcome?
- Impact scope: does this widen the mission beyond the first scope?

### Phase 3: Current-State Sharing

Restate the current flow in user-visible terms:

```text
현재는 이렇게 보입니다:
1. ...
2. ...
3. ...

제가 놓친 앱 밖/문서 밖/회의 밖 흐름이 있나요?
```

### Phase 4: Execution Scenario Exploration

For each scenario:

```text
[상황]
...

질문:
1. 이 상황에서 최종 결과물은 무엇인가요?
2. 사람이 반드시 판단해야 하는 부분은 어디인가요?
3. AI가 초안/정리/검토로 도와도 되는 부분은 어디인가요?
```

After the answer, propose 1-2 alternatives and confirm.

### Phase 5: Assumption Validation

Extract assumptions:

- User behavior assumptions.
- Policy or business rule assumptions.
- Data availability assumptions.
- Technical feasibility assumptions.
- Permission and side-effect assumptions.

For each assumption, state:

- If true: what the mission can do.
- If false: what fallback is needed.
- How to verify.

### Phase 6: Mission Scope Agreement

Present:

```text
[포함]
- ...

[제외]
- ... 이유:

[나중에]
- ... 이유:

[확인된 가정]
- ...

[미확인 가정]
- ... 확인 방법:
```

Proceed to artifact creation only after this scope is accepted or if the user explicitly asks for a draft.
