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

    // The #browser_and_AT_support link
    var supportLink = document.querySelector(
      'a[href$="#browser_and_AT_support"]'
    );
    if (!supportLink) {
      return;
    }

    // Get the right relative URL to the root aria-practices page
    var urlPrefix = supportLink.getAttribute('href').split('#')[0];

    // Expected outcome '../js/app.js' OR '../../js/app.js'
    var scriptSource = document
      .querySelector('[src$="app.js"]')
      .getAttribute('src');
    // Replace 'app.js' part with 'notice.html'

    var fetchSource = scriptSource.replace('app.js', './notice.html');
    //fetch('https://raw.githack.com/w3c/aria-practices/1228-support-notice/examples/js/notice.html')
    fetch(fetchSource)
      .then(function (response) {
        // Return notice.html as text
        return response.text();
      })
      .then(function (html) {
        // Parse response as text/html
        var parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
      })
      .then(function (doc) {
        // Get the details element from the parsed response
        var noticeElement = doc.querySelector('details');
        // Rewrite links with the right urlPrefix
        var links = doc.querySelectorAll('a[href^="/#"]');
        for (var i = 0; i < links.length; ++i) {
          links[i].pathname = urlPrefix;
        }
        // Insert the support notice before the page's h1
        var heading = document.querySelector('h1');
        heading.parentNode.insertBefore(noticeElement, heading.nextSibling);
      });
  }
})();

// Add skipto.js to examples
(function () {
  let ref = window.location.href.split('examples')[0];
  if (ref) {
    let head = document.getElementsByTagName('head')[0];
    let scriptNode = document.createElement('script');
    scriptNode.setAttribute('src', ref + 'examples/js/skipto.js');
    head.appendChild(scriptNode);
  }
})();
