(function () {
  var tablist = document.querySelectorAll('[role="tablist"]')[0];
  var tabs = document.querySelectorAll('[role="tab"]');
  var panels = document.querySelectorAll('[role="tabpanel"]');

  // For easy reference
  var keys = {
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46
  };

  // Add or substract depenign on key pressed
  var direction = {
    37: -1,
    38: -1,
    39: 1,
    40: 1
  };

  // Bind listeners
  for (i = 0; i < tabs.length; ++i) {
    addListeners(i);
  };

  function addListeners (index) {
    tabs[index].addEventListener('click', activateTab);
    tabs[index].addEventListener('keyup', keyEventListener);
    tabs[index].addEventListener('focus', focusTab);
    tabs[index].index = index;
  };

  // Activate a tab panel after 300 milliseconds
  function focusTab (event) {
    setTimeout(activateTab, 300, event);
  };

  // Activates any given tab panel
  function activateTab (event) {
    deactivateTabs();

    event.target.removeAttribute('tabindex');
    event.target.setAttribute('aria-selected', 'true');

    var controls = event.target.getAttribute('aria-controls');
    document.getElementById(controls).removeAttribute('hidden');
  };

  // Handle key pressed on tabs
  function keyEventListener (event) {
    var key = event.keyCode;

    switch (key) {
      case keys.end:
        event.preventDefault();
        focusLastTab();
        break;
      case keys.home:
        event.preventDefault();
        focusFirstTab();
        break;
      case keys.left:
      case keys.right:
      case keys.up:
      case keys.down:
        determineOrientation(event);
        break;
      case keys.delete:
        detectDeletable(event);
        break;
    };
  };

  function determineOrientation (event) {
    var target = event.target;
    var key = event.keyCode;
    var vertical = tablist.getAttribute('aria-orientation') == 'vertical';
    var proceed = false;

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        proceed = true;
      };
    }
    else {
      if (key === keys.left || key === keys.right) {
        proceed = true;
      };
    };

    if (proceed) {
      switchTab(event);
    };
  };

  // Either focus the next, previous, first, or last tab
  // depening on key pressed
  function switchTab (event) {
    var pressed = event.keyCode;

    if (direction[pressed]) {
      var target = event.target;
      if (target.index !== undefined) {
        if (tabs[target.index + direction[pressed]]) {
          tabs[target.index + direction[pressed]].focus();
        }
        else if (pressed === keys.left || pressed === keys.up) {
          focusLastTab();
        }
        else if (pressed === keys.right || pressed == keys.down) {
          focusFirstTab();
        };
      };
    };
  };

  // Deactivate all tabs and tab panels
  function deactivateTabs () {
    for (t = 0; t < tabs.length; t++) {
      tabs[t].setAttribute('tabindex', '-1');
      tabs[t].setAttribute('aria-selected', 'false');
    };

    for (p = 0; p < panels.length; p++) {
      panels[p].setAttribute('hidden', 'hidden');
    };
  };

  // Make a guess
  function focusFirstTab () {
    tabs[0].focus();
  };

  // Make a guess
  function focusLastTab () {
    tabs[tabs.length - 1].focus();
  };

  // Detect if a tab is deletable
  function detectDeletable (event) {
    target = event.target;
    if (target.getAttribute('data-deletable') !== undefined) {
      deleteTab(event, target);
      focusFirstTab();
    };
  };

  // Deletes a tab and its panel
  function deleteTab (event) {
    if (!target) {
      target = event.target;
    };
    panel = document.getElementById(target.getAttribute('aria-controls'));

    target.remove();
    panel.remove();
  };

  // Focus panel
  function focusPanel (event) {
    var panelID = event.target.getAttribute('aria-controls');

    var panel = document.getElementById(panelID);

    panel.setAttribute('tabindex', -1);
    panel.focus();
  };
})();
