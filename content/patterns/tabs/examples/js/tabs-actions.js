'use strict';

function addClickHandlers() {
  const menuitems = document.querySelectorAll('[role=menuitem]');
  menuitems.forEach(function (menuitem) {
    menuitem.addEventListener('click', onMenuitemClick);
    menuitem.addEventListener('keydown', onMenuitemClick);
  });
}

function onMenuitemClick(event) {
  if (event.type === 'keydown' && event.code !== 'Enter') {
    return;
  }
  const menuitem = event.currentTarget;
  if (menuitem.textContent === 'Copy tab contents to clipboard') {
    const tab = menuitem.closest('.menu-button-actions').previousElementSibling;
    const tabPanel = document.getElementById(tab.getAttribute('aria-controls'));
    const tabText = tabPanel.textContent.replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(tabText).then(
      function () {
        alert('Tab contents copied to clipboard');
      },
      function (err) {
        alert('Error copying tab contents to clipboard: ', err);
      }
    );
  }
}

window.addEventListener('load', function () {
  addClickHandlers();
});
