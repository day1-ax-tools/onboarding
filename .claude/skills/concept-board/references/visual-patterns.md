# Visual Patterns

Choose visuals by the concept the user needs to understand.

| Need | Preferred visual |
| --- | --- |
| Current folder, work root, repo placement | Folder tree plus current-location marker |
| Local repo, GitHub remote, push, pull | Two-lane directional flow |
| Status, stage, commit, branch | Git branch graph plus status table |
| Work decomposition | Hierarchy tree or swimlane |
| Automation candidates | Risk/value matrix plus ranked table |
| Decision making | Decision map with criteria and tradeoffs |
| Architecture or data flow | System map with directional edges |
| Session recap | Timeline plus artifact matrix |
| Blockers and permissions | State machine or dependency map |

## Rendering Rules

- Use SVG for flows, graphs, trees, and architecture maps.
- Use HTML tables for exact labels, evidence, status, and source references.
- Keep text labels short inside nodes; put longer explanations next to the diagram.
- Use color, line style, shape, and grouping to show difference. Do not rely on color alone.
- Keep the board responsive. Fixed-format diagrams should have an explicit `viewBox`, stable node dimensions, and horizontal scroll if needed.
- Include a visible "last updated" timestamp near the board title.
- When a node comes from a source reference, expose that source in a table or legend.
