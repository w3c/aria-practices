const HTMLParser = require('node-html-parser');

const getAttributeValue = (obj, attribute) => {
  if (typeof obj !== 'object' || obj === null) return undefined;
  if (obj.hasOwnProperty(attribute)) return obj[attribute];

  if (Array.isArray(obj)) {
    for (const element of obj) {
      const attributeValue = getAttributeValue(element, attribute);
      if (attributeValue !== undefined) return attributeValue;
    }
  } else {
    for (const key in obj) {
      const attributeValue = getAttributeValue(obj[key], attribute);
      if (attributeValue !== undefined) return attributeValue;
    }
  }

  return undefined;
};

module.exports = {
  filesToIgnore: [
    // For example:
    // 'content/shared/templates/example-usage-warning.html',
  ],
  excludedLinks: {
    'content/patterns/menubar/examples/menubar-navigation.html': [
      '#ex1 [role=menuitem]',
    ],
    'content/patterns/treeview/examples/treeview-navigation.html': [
      '#ex1 [role=treeitem]',
    ],
    'content/patterns/carousel/examples/carousel-2-tablist.html': [
      '.carousel-image a',
    ],
  },
  hashCheckHandlers: [
    {
      name: 'github',
      pattern: /^https:\/\/github\.com\/.*/,
      matchHash: (ids, hash, { reactPartial }) => {
        if (reactPartial) {
          // This is where the react-partial keeps data about READMEs and other *.md files
          const richText = getAttributeValue(reactPartial, 'richText');
          if (richText !== undefined) {
            const html = HTMLParser.parse(richText);
            const githubIds = html
              .querySelectorAll('[id]')
              .map((idElement) => idElement.getAttribute('id'));
            return githubIds.includes(`user-content-${hash}`);
          }
        }
        return ids.includes(hash) || ids.includes(`user-content-${hash}`);
      },
      getPartial: (html) => {
        return html
          .querySelectorAll('react-partial')
          .filter(
            (partialElement) =>
              partialElement.getAttribute('partial-name') === 'repos-overview' // This is the partial that handles the READMEs
          )
          .flatMap((element) => element.getElementsByTagName('script'))
          .map((element) => JSON.parse(element.innerHTML))[0];
      },
    },
  ],
  ignoreHashesOnExternalPagesMatchingRegex: [
    // Some hash links are resolved with JS and are therefore difficult to check algorithmically
    /^https:\/\/html\.spec\.whatwg\.org\/multipage\//,
  ],
};
