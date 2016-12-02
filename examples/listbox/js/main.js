/**
 * ARIA Listbox Examples
 * @function onload
 * @desc Initialize the listbox examples once the page has loaded
 */

window.addEventListener('load', function () {
  var ex1 = document.getElementById('ex1');
  var ex1ImportantListbox = new aria.Listbox(document.getElementById('ss_imp_list'));
  var ex1Toolbar = new aria.Toolbar(ex1.querySelector('[role="toolbar"]'));
  var ex1UnimportantListbox = new aria.Listbox(document.getElementById('ss_unimp_list'));

  ex1ImportantListbox.enableMoveUpDown();
  ex1ImportantListbox.setupDeleteDestination(ex1UnimportantListbox);
  ex1UnimportantListbox.setupDeleteDestination(ex1ImportantListbox);

  document.getElementById('ex1-up')
    .addEventListener('click', ex1ImportantListbox.moveUpItems.bind(ex1ImportantListbox));

  document.getElementById('ex1-down')
    .addEventListener('click', ex1ImportantListbox.moveDownItems.bind(ex1ImportantListbox));

  document.getElementById('ex1-delete')
    .addEventListener('click', ex1ImportantListbox.shiftItems.bind(ex1ImportantListbox));

  document.getElementById('ex1-add')
    .addEventListener('click', ex1UnimportantListbox.shiftItems.bind(ex1UnimportantListbox));

  var ex2 = document.getElementById('ex2');
  var ex2ImportantListbox = new aria.Listbox(document.getElementById('ms_imp_list'));
  var ex2UnimportantListbox = new aria.Listbox(document.getElementById('ms_unimp_list'));

  ex2ImportantListbox.setupDeleteDestination(ex2UnimportantListbox);
  ex2UnimportantListbox.setupDeleteDestination(ex2ImportantListbox);

  document.getElementById('ex2-add')
    .addEventListener('click', ex2ImportantListbox.shiftItems.bind(ex2ImportantListbox));

  document.getElementById('ex2-delete')
    .addEventListener('click', ex2UnimportantListbox.shiftItems.bind(ex2UnimportantListbox));
});
