#!/usr/bin/env node
const path = require('path');
const fs = require('fs/promises');
const glob = require('glob');
const HTMLParser = require('node-html-parser');
const fetch = require('node-fetch');
const options = require('../.link-checker');

async function checkLinks() {
  const indexLineNumbers = (fileContents) => {
    const lineBreakIndexes = [];
    for (var i = 0; i < fileContents.length; i++) {
      const character = fileContents.charAt(i);
      if (character === '\n') {
        lineBreakIndexes.push(i);
      }
    }
    const getLineNumber = (htmlElement) => {
      const elementIndex = htmlElement.range[0];
      let lineNumber;
      let columnNumber;
      for (let i = 0; i < lineBreakIndexes.length; i += 1) {
        const lineBreakIndex = lineBreakIndexes[i];
        if (lineBreakIndex > elementIndex) {
          lineNumber = i + 1;
          const startOfLineIndex = i === 0 ? 0 : lineBreakIndexes[i - 1] + 1;
          columnNumber = elementIndex - startOfLineIndex + 1;
          break;
        }
      }
      return { lineNumber, columnNumber };
    };
    return getLineNumber;
  };

  const checkPathForHash = (hrefOrSrc, ids = [], hash, { ssr } = {}) => {
    // On some websites, the ids may not exactly match the hash included
    // in the link.
    // For e.g. GitHub will prepend client facing ids with their own
    // calculated value. A heading in a README for example could be
    // 'Foo bar', navigated to with https://github.com/foo/bar#foo-bar,
    // but GitHub calculates the actual markup id included in the document
    // as being 'user-content-foo-bar' for its own page processing purposes.
    //
    // See https://github.com/w3c/aria-practices/issues/2809
    const handler = options.hashCheckHandlers.find(({ pattern }) =>
      pattern.test(hrefOrSrc)
    );
    if (handler) return handler.matchHash(ids, hash, { ssr });
    else return ids.includes(hash);
  };

  const countConsoleErrors = () => {
    let errorCount = 0;

    const getErrorCount = () => errorCount;

    const consoleError = (...args) => {
      errorCount += 1;
      console.error(...args);
    };

    return { consoleError, getErrorCount };
  };

  const htmlPaths = glob
    .sync('content/**/*.html', {
      cwd: path.join(__dirname, '..'),
    })
    .filter((htmlPath) => !options.filesToIgnore.includes(htmlPath));

  const nonHtmlPaths = glob.sync('content/**/*.!(html)', {
    cwd: path.join(__dirname, '..'),
  });

  const allLinkData = {};
  const externalPageLoaders = {};

  const { specLinks } = await import('../content/shared/js/specLinks.mjs');
  const fixSpecLink = specLinks({ specStatus: 'ED' });

  const { consoleError, getErrorCount } = countConsoleErrors();

  for (const htmlPath of htmlPaths) {
    const fileContents = await fs.readFile(htmlPath, { encoding: 'utf8' });
    const getLineNumber = indexLineNumbers(fileContents);
    const html = HTMLParser.parse(fileContents);

    const aElements = html.querySelectorAll(`a[href]`);
    const linkElements = html.querySelectorAll('link[href]');
    const scriptElements = html.querySelectorAll('script[src]');
    const imgElements = html.querySelectorAll('img[src]');

    // Handle feature which rewrites links to aria specs, see content/shared/js/specLinks.mjs for more info.
    aElements.forEach(fixSpecLink);

    const idElements = html.querySelectorAll('[id]');
    const ids = idElements.map((idElement) => {
      return idElement.getAttribute('id');
    });

    const links = [];

    let elementsToCheck = [
      ...linkElements,
      ...aElements,
      ...scriptElements,
      ...imgElements,
    ];

    const excludedElements = options.excludedLinks[htmlPath]?.flatMap(
      (excludedSelector) => {
        return html.querySelectorAll(excludedSelector);
      }
    );

    if (excludedElements) {
      elementsToCheck = elementsToCheck.filter(
        (element) => !excludedElements.includes(element)
      );
    }

    elementsToCheck.forEach((element) => {
      const hrefOrSrc =
        element.getAttribute('href') ?? element.getAttribute('src');
      const { lineNumber, columnNumber } = getLineNumber(element);
      links.push({ hrefOrSrc, lineNumber, columnNumber });

      if (hrefOrSrc.startsWith('http')) {
        const [externalPageLink] = hrefOrSrc.split('#');

        if (externalPageLoaders[externalPageLink]) {
          return;
        }

        const getPageData = async () => {
          try {
            const response = await fetch(externalPageLink, {
              headers: {
                // Spoof a normal looking User-Agent to keep the servers happy
                // See https://github.com/JustinBeckwith/linkinator/blob/main/src/index.ts
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
              },
            });
            const text = await response.text();
            const html = HTMLParser.parse(text);
            const ids = html
              .querySelectorAll('[id]')
              .map((idElement) => idElement.getAttribute('id'));

            // Handle GitHub README links.
            // These links are stored within a react-partial element
            const handler = options.hashCheckHandlers.find(({ pattern }) =>
              pattern.test(hrefOrSrc)
            );
            let ssr = undefined;
            if (handler) {
              ssr = handler.getPartial(html);
            }
            return { ok: response.ok, status: response.status, ids, ssr };
          } catch (error) {
            return {
              errorMessage:
                `Found broken external link on ${htmlPath}:${lineNumber}:${columnNumber}\n` +
                `  ${error.stack}`,
            };
          }
        };

        externalPageLoaders[externalPageLink] = getPageData;
      }
    });

    allLinkData[htmlPath] = { links, ids };
  }

  console.info(`Checked ${htmlPaths.length} source files`);

  const loadingCount = Object.keys(externalPageLoaders).length;

  console.info(`Checking ${loadingCount} external pages...`);

  let loadedCount = 0;

  let externalPageData = {};

  // Limit number of logs for readability
  const intervalId = setInterval(() => {
    console.info(`Checking ${loadedCount} of ${loadingCount} external pages`);
  }, 5000);

  await Promise.all(
    Object.entries(externalPageLoaders).map(
      async ([externalPageLink, getPageData]) => {
        let pageData = await getPageData();
        if (pageData.errorMessage) {
          console.info('Retrying once');
          pageData = await getPageData();
        }
        if (pageData.errorMessage) {
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          console.info('Retrying twice');
          pageData = await getPageData();
        }
        externalPageData[externalPageLink] = pageData;
        loadedCount += 1;
      }
    )
  );

  clearInterval(intervalId);
  console.info(`Checked ${loadingCount} of ${loadingCount} external pages`);

  for (const [htmlPath, { links }] of Object.entries(allLinkData)) {
    for (let { hrefOrSrc, lineNumber, columnNumber } of links) {
      const isIgnored =
        hrefOrSrc.startsWith('mailto') || hrefOrSrc.startsWith('javascript');
      const isExternalLink = hrefOrSrc.startsWith('http');
      const isRootRelativeLink = hrefOrSrc.startsWith('/');
      const isRelativeLink = !(
        isIgnored ||
        isExternalLink ||
        isRootRelativeLink
      );

      const hashIndex = hrefOrSrc.indexOf('#');
      let hash = null;
      let pathMinusHash;
      if (hashIndex !== -1) {
        hash = hrefOrSrc.substr(hashIndex + 1);
        pathMinusHash = hrefOrSrc.substr(0, hashIndex);
      } else {
        pathMinusHash = hrefOrSrc;
      }

      if (isRootRelativeLink) {
        consoleError(
          `Found root relative link, but only relative links are allowed, ` +
            `on ${htmlPath}:${lineNumber}:${columnNumber}`
        );
      }

      if (isRelativeLink) {
        const queryStringIndex = pathMinusHash.indexOf('?');
        if (queryStringIndex !== -1) {
          // Ignores query string
          pathMinusHash = pathMinusHash.substr(0, queryStringIndex);
        }

        const root = path.resolve(__dirname, '../');
        const sitePath =
          pathMinusHash === '' ? htmlPath : path.dirname(htmlPath);
        const absPath = path.resolve(root, sitePath, pathMinusHash);
        let relativePath = path.relative(root, absPath);

        const matchingPage = allLinkData[relativePath];

        let matchesHash = true;
        if (hash) {
          matchesHash = !!checkPathForHash(
            pathMinusHash,
            matchingPage?.ids,
            hash
          );
        }

        const isLinkBroken = !(
          matchingPage || nonHtmlPaths.includes(relativePath)
        );

        if (isLinkBroken) {
          consoleError(
            `Found broken link on ${htmlPath}:${lineNumber}:${columnNumber}`
          );
          continue;
        }

        if (!matchesHash) {
          consoleError(
            `Found broken hash on ${htmlPath}:${lineNumber}:${columnNumber}`
          );
        }
      }

      if (isExternalLink) {
        const pageData = externalPageData[pathMinusHash];
        if (!pageData) {
          throw new Error(
            `Expected external page data to have loaded for ${pathMinusHash}`
          );
        }

        if (pageData.errorMessage) {
          consoleError(pageData.errorMessage);
          continue;
        }

        if (!pageData.ok) {
          consoleError(
            `Found broken external link on ${htmlPath}:${lineNumber}:${columnNumber}, ` +
              `status was ${pageData.status}`
          );
          continue;
        }

        const isHashCheckingDisabled =
          !!options.ignoreHashesOnExternalPagesMatchingRegex.find((pattern) =>
            hrefOrSrc.match(pattern)
          );

        if (
          !isHashCheckingDisabled &&
          hash &&
          !checkPathForHash(hrefOrSrc, pageData.ids, hash, {
            ssr: pageData.ssr,
          })
        ) {
          consoleError(
            `Found broken external link on ${htmlPath}:${lineNumber}:${columnNumber}, ` +
              `hash "#${hash}" not found on page`
          );
        }
      }
    }
  }

  const errorCount = getErrorCount();
  const output = `Link checker found ${errorCount} broken link${
    errorCount === 1 ? '' : 's'
  }`;

  const failed = errorCount !== 0;
  if (failed) {
    console.error(output);
    process.exit(1);
  }
  console.info(output);
}

checkLinks();
