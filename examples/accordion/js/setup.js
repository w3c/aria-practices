/*
Setup for the Accordion demo
Uses functions from the Helper JavaScript Functions Lib
Bryan Garaventa, 07/21/2016
*/

// Execute when the page finishes loading
bind(window, 'load', function(){

    // Configure optional functionality

    // Allow for each toggle to both open and close individually
    var allowToggle = false,

    // Allow for multiple accordion sections to be expanded at the same time
    allowMultiple = false;

    // Declare function for toggling the activated accordion toggle
    var toggleAccordion = function(o){

        // Check if the current toggle is expanded.
        var isOpen = getAttr(o, 'aria-expanded') == 'true' ? true : false;

        if (!allowMultiple){
            // Close all previously open accordion toggles
            forEach(toggles, function(i, p){
                // Hide all accordion sections, using aria-controls to specify the desired section
                addClass(getEl(getAttr(p, 'aria-controls')), 'hidden');
                // Set the expanded state on the triggering element
                setAttr(p, 'aria-expanded', 'false');
                remClass(p, 'open');

                if (!allowToggle)
                    remAttr(p, 'aria-disabled');
            });
        }

        if (allowToggle && isOpen){
            // Close the activated accordion if allowToggle=true, using aria-controls to specify the desired section
            addClass(getEl(getAttr(o, 'aria-controls')), 'hidden');
            // Set the expanded state on the triggering element
            setAttr(o, 'aria-expanded', 'false');
            remClass(o, 'open');
        }

        else{
            // Otherwise open the activated accordion, using aria-controls to specify the desired section
            remClass(getEl(getAttr(o, 'aria-controls')), 'hidden');
            // Set the expanded state on the triggering element
            setAttr(o, 'aria-expanded', 'true');
            addClass(o, 'open');
        }

        if (!allowToggle){
            // Set aria-disabled='true' if the accordion toggle is locked in an open state
            setAttr(o, 'aria-disabled', 'true');
        }
    },

    // Create the array of toggle elements for the accordion group, using the shared 'accAccordion' class name
    toggles = query('*.accAccordion', document, function(i, o){

// Create a click binding for mouse and touch device support, plus works for keyboard support on all native active elements like links and buttons
        bind(o, 'click', function(ev){
            toggleAccordion(this);

            if (ev.preventDefault)
                ev.preventDefault();

            else
                return false;
        });

// Now create a redundant keyDown binding to support all simulated elements such as all focusable divs and spans to provide the same functionality and accessibility
// tabindex="0" is required on such simulated elements
// Adding arrow key support here is okay, though all accordion toggles must also be in the regular tab order too.
        bind(o, 'keydown', function(ev){
            var k = ev.which || ev.keyCode;

            // 13 = Enter, 32 = Spacebar
            if (k == '13' || k == '32'){
                toggleAccordion(this);

                if (ev.preventDefault)
                    ev.preventDefault();

                else
                    return false;
            }
        });
    });

    // Check for the presence of data-defaultopen="true" and automatically open that accordion if found
    forEach(toggles, function(i, o){
        if (getAttr(o, 'data-defaultopen') == 'true')
            toggleAccordion(o);
    });
});