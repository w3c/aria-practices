/* global hljs */

'use strict';

(function () {
  // Load syntax highlighting
  hljs.initHighlightingOnLoad();

  // Add support notice to all examples
  window.addEventListener('DOMContentLoaded', addSupportNotice, false);

  function addSupportNotice() {
    // The "Example" heading
    var headings = document.querySelectorAll('h2');
    var foundExampleHeading;
    for (var i = 0; i < headings.length; ++i) {
      if (headings[i].textContent.trim().match(/^Examples?$/)) {
        foundExampleHeading = true;
        break;
      }
    }
    if (!foundExampleHeading) {
      return;
    }

    // Use app.js link to create example-usage-warning.html link.
    // Expected outcome '../js/app.js' OR '../../js/app.js'
    var scriptSource = document
      .querySelector('[src$="app.js"]')
      .getAttribute('src');
    var fetchSource = scriptSource.replace(
      '/js/app.js',
      '/templates/example-usage-warning.html'
    );
    fetch(fetchSource)
      .then(function (response) {
        // Return example-usage-warning.html as text
        return response.text();
      })
      .then(function (html) {
        // Parse response as text/html
        var parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
      })
      .then(function (doc) {
        // Get the details element from the parsed response
        var warningElement = doc.querySelector('details');
        warningElement.classList.add('note'); // Needed for styling
        // Insert the support notice before the page's h1
        var heading = document.querySelector('h1');
        heading.parentNode.insertBefore(warningElement, heading.nextSibling);
      });
  }
})();
