(function () {
  // Load syntax highlighting
  hljs.initHighlightingOnLoad();


  fetch('notice.html')
    .then((response) => {
      console.log(response.getElementById('support-notice'))
    })

  let exampleHeader = document.getElementById('ex_label')
  let template = document.importNode('notice.html#support-notice', true)
  console.log('loaded', template, exampleHeader)
}());
