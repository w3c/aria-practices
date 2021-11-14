/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

/* global aria */

'use strict';

/**
 * ARIA Scrollable Listbox Example
 *
 * @function onload
 * @description Initialize the listbox example once the page has loaded
 */

window.addEventListener('load', function () {
  new aria.Listbox(document.getElementById('ss_elem_list'));
});
