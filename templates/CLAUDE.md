# CLAUDE.md

@AGENTS.md

## Claude Code Notes

Use the `work-mission-discovery` skill when the user needs AI CLI work environment setup, local/GitHub repo grounding, wants to describe their work, map responsibilities, find automation candidates, create a mission backlog, explicitly activate a meta monitor, create or read a Briefing Board, or continue a saved onboarding interview.

Skills are model-invoked. If the user mentions `work-mission-discovery`, read the matching skill instructions from `.claude/skills/work-mission-discovery/SKILL.md` when available.

Use `/memory` only when the user wants to inspect or edit loaded memory. Keep the active interview state in project files, not only in chat memory.

For meta monitoring, visible work content, saved files, and Git state can all be shared sources when the user allows it and access is technically available. Meta Monitor is a separate runtime repo: `https://github.com/day1-ax-tools/meta-monitor`; install or copy the runtime from that repo instead of inventing monitor files from scratch. Visible work content includes chat transcript, session log, commands, tool outputs, file changes, and generated artifacts. Save visible main-session turns and action summaries to `meta-monitor/main-session-events.jsonl`; this is the primary monitor input. If session history is unavailable, ask the main session to export, summarize, or save the missing work content before relying on project files and Git state alone. Intentionally exclude hidden model reasoning so the monitor stays independent from the main session's reasoning path. Restrict monitor-session writes to `meta-monitor/**` unless the user explicitly changes the write boundary. Use `meta-monitor/settings.json`, `meta-monitor/monitor-input.schema.json`, `meta-monitor/monitor-prompt.md`, `meta-monitor/monitor-input.latest.json`, `meta-monitor/briefing-board.html`, `meta-monitor/session-data.jsonl`, and one latest `meta-monitor/session-handoff.md`. In settings, language fallback is `en`, current language follows the user's terminal input in the main session, and Briefing Board design follows the main session provider. The Briefing Board should show repo/session identity tags, tabs for `메타 모니터 콘솔`, `현황`, `업무 지도`, `미션 백로그`, and `의사결정 지도`, a terminal-like monitor console backed by `/api/events`, and user-facing UI copy in the current user language. Use `meta-monitor/monitor-worker.mjs` or an equivalent monitor CLI loop to turn main-session events first, then queued questions, into `meta-monitor/meta-advice.md`.
