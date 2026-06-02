# Execution Playbook

Use this when the user needs an end-to-end, interruption-resistant onboarding experience.

## Installation Flow

Default to project-level installation. Avoid global installation during onboarding unless the user explicitly wants the behavior across all repositories.

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

3. Verify:

   ```text
   $work-mission-discovery 를 사용해서 현재 적용된 지침과 다음 질문을 요약해주세요.
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

4. Verify:

   ```text
   work-mission-discovery skill을 사용해서 현재 인터뷰 상태를 확인해주세요.
   ```

Expected: Claude Code selects the skill from `.claude/skills`. Skills are model-invoked, not slash commands.

## Continuity Flow

Use files as the source of continuity, not chat memory alone.

At the end of each phase, after 3-5 Q&A rounds, or before stopping, update:

```text
interview-state.md
logs/<YYYY-MM-DD>-mission-discovery.md
automation-brief.md
mission-backlog.md
```

On resume:

1. Read `interview-state.md`.
2. Read `automation-brief.md` if it exists.
3. Read `mission-backlog.md` if it exists.
4. Read the latest `logs/*.md`.
5. Summarize current phase, confirmed facts, open questions, and next question.
6. Ask exactly the next smallest useful question.

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
