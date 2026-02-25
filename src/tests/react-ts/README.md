# React + TypeScript – Accessibility Test Fixture

A minimal React + TypeScript project with deliberate accessibility issues for testing the APG MCP server with Cursor.

**Intent:** Fix this app using Cursor with the WAI-ARIA APG MCP server enabled. The prompt "Fix accessibility issues in this React app to follow WAI-ARIA Authoring Practices" should drive the AI to fetch pattern specs and apply them.

**Deliberate issues include:**
- Tabs implemented with `div` + `onClick` (no ARIA, no keyboard, no `tablist`/`tab`/`tabpanel`)
- Toggle button (`Mute`/`Unmute`) as `div` with no `role="button"`, `aria-pressed`, or keyboard support
- Image without `alt` text
- Form with unlabeled input and `div` used as submit control
- No landmarks (`main`, `header`, `nav`)
- Missing `lang` on `index.html`

**Run:**
```sh
npm install
npm run dev
```
