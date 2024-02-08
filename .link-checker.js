const HTMLParser = require('node-html-parser');

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
      matchHash: (ids, hash, ssr) => {
        if (ssr) {
          // This is where the react-partial keeps data about READMEs and other *.md files
          const overviewFiles =
            ssr['props']['initialPayload']['overview']['overviewFiles'];
          for (let file of overviewFiles) {
            if (file['richText']) {
              const html = HTMLParser.parse(file['richText']);
              const githubIds = html
                .querySelectorAll('[id]')
                .map((idElement) => idElement.getAttribute('id'));
              return githubIds.includes(`user-content-${hash}`);
            }
          }
        }
        return ids.includes(hash) || ids.includes(`user-content-${hash}`);
      },
    },
  ],
  ignoreHashesOnExternalPagesMatchingRegex: [
    // Some hash links are resolved with JS and are therefore difficult to check algorithmically
    /^https:\/\/html\.spec\.whatwg\.org\/multipage\//,
  ],
};
