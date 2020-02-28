(function () {
  // Load syntax highlighting
  hljs.initHighlightingOnLoad();

  // Add support notice to all examples
  addSupportNotice()

  function addSupportNotice() {
    fetch('/examples/js/notice.html')
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
