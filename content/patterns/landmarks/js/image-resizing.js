/* image-resizing.js */
function resizeImagesInFigures () {
  const figures = document.querySelectorAll('#at figure');
  for(let i = 0; i < figures.length; i += 1) {
    const image = figures[i].querySelector('img');
    if (image) {
      const rect = figures[i].getBoundingClientRect();
      image.style.width = (rect.width - 16) + 'px';
    }
  }
}

window.addEventListener('load', resizeImagesInFigures);
window.addEventListener('resize', resizeImagesInFigures);
