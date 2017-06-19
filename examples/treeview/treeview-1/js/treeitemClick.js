/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   Treeitem.js
*
*   Desc:   Setup click events for Tree widget examples

*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt @ University of Illinois
*/

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initialize all treeitems based on the role=treeitem
 */

window.addEventListener('load', function () {

  var treeitems = document.querySelectorAll('[role="treeitem"]');


  for (var i = 0; i <treeitems.length; i++) {

    treeitems[i].addEventListener('click', function (event) {
      var label = '';
      var treeitem = event.currentTarget;
      if (treeitem.getAttribute('aria-expanded')) {
        label += 'Folder: '
        treeitem = treeitem.firstElementChild;
      }
      label += treeitem.innerHTML.trim();

      document.getElementById('last_action').value = label.trim();

      event.stopPropagation();
      event.preventDefault();
    });

  }

});
