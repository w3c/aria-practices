#!/usr/bin/env node
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   index.mjs
 */

import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { discoverPatterns } from './discovery.mjs';
import { loadPatternAsMarkdown, getPatternsDir } from './parser.mjs';

const URI_SCHEME = 'apg://pattern';
const PATTERNS = discoverPatterns();

const server = new McpServer({
  name: 'wai-aria-apg',
  version: '1.0.0',
});

server.registerResource(
  'pattern',
  new ResourceTemplate(`${URI_SCHEME}/{patternId}`, {
    list: async () => ({
      resources: PATTERNS.map((p) => ({
        uri: `${URI_SCHEME}/${p.id}`,
        name: p.name,
        description: `WAI-ARIA Authoring Practices: ${p.name}`,
        mimeType: 'text/markdown',
      })),
    }),
  }),
  {
    title: 'WAI-ARIA Pattern',
    description: 'ARIA design pattern documentation',
    mimeType: 'text/markdown',
  },
  async (uri, { patternId }) => {
    const patternsDir = getPatternsDir();
    const markdown = loadPatternAsMarkdown(patternsDir, patternId);

    if (!markdown) {
      throw new Error(`Pattern not found: ${patternId}`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: markdown,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
