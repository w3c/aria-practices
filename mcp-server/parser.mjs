/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   parser.mjs
 */

import { NodeHtmlMarkdown } from 'node-html-markdown';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SECTION_IDS = [
  'about',
  'examples',
  'keyboard_interaction',
  'roles_states_properties',
];

/**
 * Converts pattern HTML to markdown. Extracts main content sections.
 * @param {string} html - Pattern HTML string
 * @returns {string} Markdown
 */
export function htmlToMarkdown(html) {
  const $ = load(html);
  const parts = [];

  for (const id of SECTION_IDS) {
    const section = $(`#${id}`);
    if (section.length) {
      const md = NodeHtmlMarkdown.translate(section.html().trim());
      if (md) parts.push(md);
    }
  }

  return parts.join('\n\n');
}

/**
 * Reads pattern HTML from disk and converts to markdown.
 * @param {string} patternsDir - Path to content/patterns
 * @param {string} patternId - e.g. 'accordion', 'dialog-modal'
 * @returns {string} Markdown, or null if file not found
 */
export function loadPatternAsMarkdown(patternsDir, patternId) {
  const filePath = path.join(
    patternsDir,
    patternId,
    `${patternId}-pattern.html`
  );
  if (!fs.existsSync(filePath)) return null;

  const html = fs.readFileSync(filePath, 'utf8');
  return htmlToMarkdown(html);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolves the patterns directory relative to the mcp-server.
 * @returns {string} Absolute path to content/patterns
 */
export function getPatternsDir() {
  return path.resolve(__dirname, '..', 'content', 'patterns');
}
