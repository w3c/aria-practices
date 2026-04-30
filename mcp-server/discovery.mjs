/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   discovery.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATTERNS_DIR = path.resolve(__dirname, '..', 'content', 'patterns');

/**
 * Discovers all pattern files. Returns { id, path, name }.
 * @returns {Array<{id: string, path: string, name: string}>}
 */
export function discoverPatterns() {
  const entries = fs.readdirSync(PATTERNS_DIR, { withFileTypes: true });
  const patterns = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirPath = path.join(PATTERNS_DIR, entry.name);
    const files = fs.readdirSync(dirPath);
    const patternFile = files.find((f) => f.endsWith('-pattern.html'));

    if (!patternFile) continue;

    const patternId = patternFile.replace(/-pattern\.html$/, '');
    const fullPath = path.join(dirPath, patternFile);
    const name = extractPatternName(fullPath);

    patterns.push({
      id: patternId,
      path: fullPath,
      name: name || patternId,
    });
  }

  return patterns.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Extracts h1 text as pattern name from HTML file.
 * @param {string} filePath
 * @returns {string}
 */
function extractPatternName(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = load(html);
  const h1 = $('main h1').first();
  return h1.length ? h1.text().trim() : '';
}
