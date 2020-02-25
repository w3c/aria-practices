(function () {
  // Load syntax highlighting
  hljs.initHighlightingOnLoad();

  // Add support notice to all examples
  fetch('/examples/js/notice.html')
  .then(function(response) {
    return response.text()
  })
  .then(function(html) {
    var parser = new DOMParser()
    return parser.parseFromString(html, "text/html")
  })
  .then(function(templateResponse) {
    var templateFragment = templateResponse.getElementById('support-notice')
    return document.importNode(templateFragment.content, true)
  })
  .then(function(fragment) {
    document.getElementById('ex_label').append(fragment)
  })
}());
