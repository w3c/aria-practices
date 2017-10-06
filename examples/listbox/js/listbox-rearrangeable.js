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

  ex1ImportantListbox.enableMoveUpDown(
    document.getElementById('ex1-up'),
    document.getElementById('ex1-down')
  );
  ex1ImportantListbox.setupDelete(document.getElementById('ex1-delete'), ex1UnimportantListbox);
  ex1UnimportantListbox.setupDelete(document.getElementById('ex1-add'), ex1ImportantListbox);

  var ex2 = document.getElementById('ex2');
  var ex2ImportantListbox = new aria.Listbox(document.getElementById('ms_imp_list'));
  var ex2UnimportantListbox = new aria.Listbox(document.getElementById('ms_unimp_list'));

  ex2ImportantListbox.setupDelete(document.getElementById('ex2-add'), ex2UnimportantListbox);
  ex2UnimportantListbox.setupDelete(document.getElementById('ex2-delete'), ex2ImportantListbox);

  var ex3 = document.getElementById('ex3');
  var ex3Listbox = new aria.Listbox(document.getElementById('ss_elem_list'));
});
