(function () {
  // Load syntax highlighting
  hljs.initHighlightingOnLoad();

  // Add support notice to all examples
  addSupportNotice()

  function addSupportNotice() {
    // Expected outcome '../js/app.js' OR '../../js/app.js'
    var scriptSource = document.querySelector('[src$="app.js"]').getAttribute('src')
    // Cut off the 'app.js' part so we know where to grab our template
    var jsPath = scriptSource.split('app.js')[0]
    // Append the template filename to the path
    var fetchSource = jsPath + 'notice.html'

    fetch(fetchSource)
    .then(function(response) {
      // Return notice.html as text
      return response.text()
    })
    .then(function(html) {
      // Parse response as text/html
      var parser = new DOMParser()
      return parser.parseFromString(html, "text/html")
    })
    .then(function(templateResponse) {
      // Get the template element from the parsed response
      var templateFragment = templateResponse.getElementById('support-notice')
      // Import the template contents
      return document.importNode(templateFragment.content, true)
    })
    .then(function(fragment) {
      var exLabel = document.getElementById('ex_label')
      // Insert the support notice after the page's example heading
      exLabel.parentNode.insertBefore(fragment, exLabel.nextSibling)
    })
  }
}());
