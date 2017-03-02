/*
Setup for the Accordion demo
Uses functions from the Helper JavaScript Functions Lib
Bryan Garaventa, 07/21/2016
*/

// Execute when the page finishes loading
bind(window, 'load', function () {

  // Configure optional functionality

  // Allow for each toggle to both open and close individually
  var allowToggle = false,

  // Allow for multiple accordion sections to be expanded at the same time
  allowMultiple = false,

  // Main accordion parent container, for event delegation
  accordion = getEl('accordionGroup'),

  // Create the array of toggle elements for the accordion group, using the shared 'accAccordion' class name
  toggles = [].slice.call(query('*.accAccordion'), accordion),
  panels = [].slice.call(query('*.accPanel'), accordion);

  // Declare function for toggling the activated accordion toggle
  var toggleAccordion = function (o) {

    // Check if the current toggle is expanded.
    var isOpen = getAttr(o, 'aria-expanded') == 'true' ? true : false;

    if (!allowMultiple) {
      // Close all previously open accordion toggles
      forEach(toggles, function (i, p) {
        // Hide all accordion sections, using aria-controls to specify the desired section
        addClass(getEl(getAttr(p, 'aria-controls')), 'hidden');
        // Set the expanded state on the triggering element
        setAttr(p, 'aria-expanded', 'false');
        remClass(p, 'open');

        if (!allowToggle) {
          remAttr(p, 'aria-disabled');
        }
      });
    }

    if (allowToggle && isOpen) {
      // Close the activated accordion if allowToggle=true, using aria-controls to specify the desired section
      addClass(getEl(getAttr(o, 'aria-controls')), 'hidden');
      // Set the expanded state on the triggering element
      setAttr(o, 'aria-expanded', 'false');
      remClass(o, 'open');
    }

    else {
      // Otherwise open the activated accordion, using aria-controls to specify the desired section
      remClass(getEl(getAttr(o, 'aria-controls')), 'hidden');
      // Set the expanded state on the triggering element
      setAttr(o, 'aria-expanded', 'true');
      addClass(o, 'open');
    }

    if (!allowToggle) {
      // Set aria-disabled='true' if the accordion toggle is locked in an open state
      setAttr(o, 'aria-disabled', 'true');
    }
  };

  forEach(toggles, function (i, o) {
    // Create a click binding for mouse and touch device support, plus works for keyboard support on all native active elements like links and buttons
    bind(o, 'click', function (ev) {
      toggleAccordion(this);

      if (ev.preventDefault) {
        ev.preventDefault();
      }

      else {
        return false;
      }
    });

    // Check for the presence of data-defaultopen="true" and automatically open that accordion if found
    if (getAttr(o, 'data-defaultopen') == 'true') {
      toggleAccordion(o);
    }
  });

  // Bind keyboard behaviors on the main accordion container
  bind(accordion, 'keydown', function (ev) {
    var target = ev.target,
    whichKey = ev.which.toString(),
    // 33 = Page Up, 34 = Page Down
    ctrlModifier = (ev.ctrlKey && whichKey.match(/33|34/));

    // Is this coming from an accordion header?
    if (hasClass(target, 'accAccordion')) {
      // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
      // 38 = Up, 40 = Down
      if (whichKey.match(/38|40/) || ctrlModifier) {
        var index = toggles.indexOf(target),
        direction = (whichKey.match(/34|40/)) ? 1:-1,
        length = toggles.length,
        newIndex = (index +length + direction) % length;

        toggles[newIndex].focus();

        if (ev.preventDefault) {
          ev.preventDefault();
        }

        else {
          return false;
        }

      } else if (whichKey.match(/35|36/)) {
         // 35 = End, 36 = Home keyboard operations
        switch (whichKey) {
          // Go to first accordion
          case '36':
            toggles[0].focus();
            break;
          // Go to last accordion
          case '35':
            toggles[toggles.length-1].focus();
            break;
        }

        if (ev.preventDefault) {
          ev.preventDefault();
        }

        else {
          return false;
        }
      }
    } else if (ctrlModifier){
      // Control + Page Up/ Page Down keyboard operations
      // Catches events that happen inside of panels
      forEach(panels, function (i, o) {
        if (o.contains(target)) {
          toggles[i].focus();

          if (ev.preventDefault) {
            ev.preventDefault();
          }

          else {
            return false;
          }
        }
      });
    }

  });
});
