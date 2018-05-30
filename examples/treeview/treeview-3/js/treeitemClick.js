/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   Treeitem.js
*
*   Desc:   Setup click events for Tree widget examples
*/

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initialize all treeitems based on the role=treeitem
 */

window.addEventListener('load', function (event) {

  var treeitems = document.querySelectorAll('[role="treeitem"]');
  var res=[];
  for (var i = 0; i < treeitems.length; i++) {
    //
    treeitems[i].addEventListener('click', function (event) {
      var treeitem = event.currentTarget;
      var selected=treeitem.getAttribute('aria-selected');
      var label = treeitem.innerHTML;
        console.log(treeitem.getAttribute('aria-selected'));
        // console.log(label.trim());
        if(selected==='true'){
            res.push(label.trim());
        }else if(selected==='false'){
          if(res.includes(label.trim())) {
            var index=res.indexOf(label.trim());
            res.splice(index,1);
          }
        }

        document.getElementById('last_action').value=res;

      event.stopPropagation();
      event.preventDefault();
    });
  }

});
