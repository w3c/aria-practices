/**
 * ARIA Toolbar Examples
 * @function onload
 * @desc Initialize the toolbar example once the page has loaded
 */

window.addEventListener('load', function () {
  var ex1 = document.getElementById('ex1');
  var ex1Toolbar = new aria.Toolbar(ex1.querySelector('[role="toolbar"]'));
});
