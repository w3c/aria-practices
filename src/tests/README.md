# MCP Server Test Fixtures

Test projects for validating the WAI-ARIA APG MCP server with Cursor. Each project deliberately violates accessibility best practices so you can prompt Cursor (with the MCP server enabled) to fix them.

| Project | Stack | Run |
|---------|-------|-----|
| [html-landing](./html-landing/) | Plain HTML/CSS/JS | Open `index.html` in a browser |
| [react-ts](./react-ts/) | React + TypeScript + Vite | `npm install && npm run dev` |

**Workflow:**
1. Add the APG MCP server to Cursor (see main README)
2. Open one of these projects in Cursor
3. Prompt: *"Fix accessibility issues in this [page/app] to follow WAI-ARIA Authoring Practices"*
4. The AI should use the MCP server to fetch pattern specs and apply fixes
