# HTML Landing Page – Accessibility Test Fixture

A deliberately non-compliant HTML landing page for testing the APG MCP server with Cursor.

**Intent:** Fix this page using Cursor with the WAI-ARIA APG MCP server enabled. The prompt "Fix accessibility issues in this page to follow WAI-ARIA Authoring Practices" should drive the AI to fetch pattern specs and apply them.

**Deliberate issues include:**
- No `lang` on `<html>`
- `div`/`span` used as navigation and buttons (no `role`, `tabindex`, or keyboard support)
- Accordion-like sections implemented with `div` + `onclick` (no ARIA, no keyboard)
- Images without `alt` text
- Form inputs without associated labels
- No landmarks (`main`, `nav`, `header`, `footer`)
- Inconsistent heading hierarchy (h2 → h4)
