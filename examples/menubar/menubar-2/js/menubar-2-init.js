/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   menubar-2-init.js
*
*   Desc:   Creates a menubar to control the styling of text in a textarea element
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

window.addEventListener('load', function () {
    var menubar      = new MenubarAction(document.getElementById('menubar1'));
    var styleManager = new StyleManager('textarea1');
    menubar.init(styleManager);
  });

