---
name: wai-aria-apg
description: Implements accessible UI components following WAI-ARIA Authoring Practices. Use when building accordions, tabs, dialogs, comboboxes, buttons, forms, or any ARIA widgets. Fetches pattern specs from the APG MCP server when available.
---

# WAI-ARIA Authoring Practices

When implementing accordions, tabs, dialogs, comboboxes, toggle buttons, forms, or other ARIA widgets, follow the WAI-ARIA Authoring Practices Guide (APG).

## How to apply

1. **If the APG MCP server is configured:** Fetch the relevant pattern via `apg://pattern/{name}` (e.g. `apg://pattern/accordion`, `apg://pattern/tabs`, `apg://pattern/button`) and apply its keyboard interaction, roles, states, and properties.
2. **Otherwise:** Reference https://www.w3.org/WAI/ARIA/apg/ for the pattern.
