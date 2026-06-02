# CLAUDE.md

@AGENTS.md

## Claude Code Notes

Use the `work-mission-discovery` skill when the user asks to describe their work, map responsibilities, find automation candidates, create a mission backlog, or continue a saved onboarding interview.

Skills are model-invoked. If the user mentions `work-mission-discovery`, read the matching skill instructions from `.claude/skills/work-mission-discovery/SKILL.md` when available.

Use `/memory` only when the user wants to inspect or edit loaded memory. Keep the active interview state in project files, not only in chat memory.
