/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  image-resizing.js
 *
 *   Desc:   Resizes images to fit in figure elements
 */

'use strict';

function resizeImagesInFigures() {
  const figures = document.querySelectorAll('#at figure');
  for(let i = 0; i < figures.length; i++) {
    const image = figures[i].querySelector('img');
    if (image) {
      const rect = figures[i].getBoundingClientRect();
      image.style.width = (rect.width - 16) + 'px';
    }
  }
}

window.addEventListener('load', resizeImagesInFigures);
window.addEventListener('resize', resizeImagesInFigures);
