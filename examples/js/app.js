(function () {
  // Load syntax highlighting
  hljs.initHighlightingOnLoad();

  // Add support notice to all examples
  window.addEventListener('DOMContentLoaded', addSupportNotice, false);

  function addSupportNotice() {
    // The "Example" heading
    var exampleHeading = document.getElementById('ex_label');
    if (!exampleHeading) {
      return;
    }

    // The #browser_and_AT_support link
    var supportLink = document.querySelector('a[href$="#browser_and_AT_support"]');
    if (!supportLink) {
      return;
    }

    // Get the right relative URL to the root aria-practices page
    var urlPrefix = supportLink.getAttribute('href').split('#')[0];

    // Expected outcome '../js/app.js' OR '../../js/app.js'
    var scriptSource = document.querySelector('[src$="app.js"]').getAttribute('src');
    // Replace 'app.js' part with 'notice.html'
    var fetchSource = scriptSource.replace('app.js', 'notice.html');

    fetch(fetchSource)
    .then(function(response) {
      // Return notice.html as text
      return response.text();
    })
    .then(function(html) {
      // Parse response as text/html
      var parser = new DOMParser();
      return parser.parseFromString(html, "text/html");
    })
    .then(function(doc) {
      // Get the details element from the parsed response
      var noticeElement = doc.querySelector('details');
      // Rewrite links with the right urlPrefix
      var links = doc.querySelectorAll('a[href^="/#"]');
      for (var i = 0; i < links.length; ++i) {
        links[i].pathname = urlPrefix;
      }
      // Insert the support notice after the page's example heading
      exampleHeading.parentNode.insertBefore(noticeElement, exampleHeading.nextSibling);
    })
  }
}());
