/*
Simple accordion pattern example
Gerard K. Cohen, 05/20/2017
*/

Array.from(document.querySelectorAll('.Accordion')).forEach(function (accordion) {

  // Allow for each toggle to both open and close individually
  var allowToggle = accordion.hasAttribute('data-allow-toggle');
  // Allow for multiple accordion sections to be expanded at the same time
  var allowMultiple = accordion.hasAttribute('data-allow-multiple');

  // Create the array of toggle elements for the accordion group
  var triggers = Array.from(accordion.querySelectorAll('.Accordion-trigger'));
  var panels = Array.from(accordion.querySelectorAll('.Accordion-panel'));

  accordion.addEventListener('click', function (event) {
    var target = event.target;

    if (target.classList.contains('Accordion-trigger')) {
      // Check if the current toggle is expanded.
      var isExpanded = target.getAttribute('aria-expanded') == 'true';

      if (!allowMultiple) {
        // Close all previously open accordion toggles
        triggers.forEach(function (trigger) {
          if (trigger.getAttribute('aria-expanded') == 'true') {
            // Hide all accordion sections, using aria-controls to specify the desired section
            document.getElementById(trigger.getAttribute('aria-controls')).setAttribute('hidden', '');
            // Set the expanded state on the triggering element
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (allowToggle && isExpanded) {
        // Close the activated accordion if allowToggle=true, using aria-controls to specify the desired section
        document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
        // Set the expanded state on the triggering element
        target.setAttribute('aria-expanded', 'false');
      }
      else if (!allowToggle && !isExpanded) {
        // Otherwise open the activated accordion, using aria-controls to specify the desired section
        document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');
        // Set the expanded state on the triggering element
        target.setAttribute('aria-expanded', 'true');
      }

      event.preventDefault();
    }
  });

  // Bind keyboard behaviors on the main accordion container
  accordion.addEventListener('keydown', function (event) {
    var target = event.target;
    var key = event.which.toString();
    // 33 = Page Up, 34 = Page Down
    var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

    // Is this coming from an accordion header?
    if (target.classList.contains('Accordion-trigger')) {
      // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
      // 38 = Up, 40 = Down
      if (key.match(/38|40/) || ctrlModifier) {
        var index = triggers.indexOf(target);
        var direction = (key.match(/34|40/)) ? 1 : -1;
        var length = triggers.length;
        var newIndex = (index + length + direction) % length;

        triggers[newIndex].focus();

        event.preventDefault();
      }
      else if (key.match(/35|36/)) {
        // 35 = End, 36 = Home keyboard operations
        switch (key) {
          // Go to first accordion
          case '36':
            triggers[0].focus();
            break;
            // Go to last accordion
          case '35':
            triggers[triggers.length - 1].focus();
            break;
        }

        event.preventDefault();
      }
    }
    else if (ctrlModifier) {
      // Control + Page Up/ Page Down keyboard operations
      // Catches events that happen inside of panels
      panels.forEach(function (panel, index) {
        if (panel.contains(target)) {
          triggers[index].focus();

          event.preventDefault();
        }
      });
    }
  });

});
