/**
 * ARIA Listbox Examples
 * @function onload
 * @desc Initialize the listbox examples once the page has loaded
 */

window.addEventListener('load', function () {
  var ex1 = document.getElementById('ex1');
  var ex1ImportantListbox = new aria.Listbox(document.getElementById('ss_imp_list'));
  var ex1UnimportantListbox = new aria.Listbox(document.getElementById('ss_unimp_list'));
  var ex1Toolbar = new aria.Toolbar(ex1.querySelector('[role="toolbar"]'));

  var ex2 = document.getElementById('ex2');
  var ex2ImportantListbox = new aria.Listbox(document.getElementById('ms_imp_list'));
  var ex2UnimportantListbox = new aria.Listbox(document.getElementById('ms_unimp_list'));

  /**
   * Setup button controls
   */
  document.getElementById('ex1-up').addEventListener(
    'click', ex1ImportantListbox.moveUpItems.bind(ex1ImportantListbox)
  );

  document.getElementById('ex1-down').addEventListener(
    'click', ex1ImportantListbox.moveDownItems.bind(ex1ImportantListbox)
  );

  document.getElementById('ex1-delete').addEventListener('click', function () {
    var itemsToMove = ex1ImportantListbox.deleteItems();
    ex1UnimportantListbox.addItems(itemsToMove);
  });

  document.getElementById('ex1-add').addEventListener('click', function () {
    var itemsToMove = ex1UnimportantListbox.deleteItems();
    ex1ImportantListbox.addItems(itemsToMove);
  });

  document.getElementById('ex2-add').addEventListener('click', function () {
    var itemsToMove = ex2ImportantListbox.deleteItems();
    ex2UnimportantListbox.addItems(itemsToMove);
  });

  document.getElementById('ex2-delete').addEventListener('click', function () {
    var itemsToMove = ex2UnimportantListbox.deleteItems();
    ex2ImportantListbox.addItems(itemsToMove);
  });
});
