/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
* ARIA Combobox Examples
*/

var FRUITS_AND_VEGGIES = [
  'Apple',
  'Artichoke',
  'Asparagus',
  'Banana',
  'Beets',
  'Bell pepper',
  'Broccoli',
  'Brussels sprout',
  'Cabbage',
  'Carrot',
  'Cauliflower',
  'Celery',
  'Chard',
  'Chicory',
  'Corn',
  'Cucumber',
  'Daikon',
  'Date',
  'Edamame',
  'Eggplant',
  'Elderberry',
  'Fennel',
  'Fig',
  'Garlic',
  'Grape',
  'Honeydew melon',
  'Iceberg lettuce',
  'Jerusalem artichoke',
  'Kale',
  'Kiwi',
  'Leek',
  'Lemon',
  'Mango',
  'Mangosteen',
  'Melon',
  'Mushroom',
  'Nectarine',
  'Okra',
  'Olive',
  'Onion',
  'Orange',
  'Parship',
  'Pea',
  'Pear',
  'Pineapple',
  'Potato',
  'Pumpkin',
  'Quince',
  'Radish',
  'Rhubarb',
  'Shallot',
  'Spinach',
  'Squash',
  'Strawberry',
  'Sweet potato',
  'Tomato',
  'Turnip',
  'Ugli fruit',
  'Victoria plum',
  'Watercress',
  'Watermelon',
  'Yam',
  'Zucchini'
];

function searchVeggies (searchString) {
  var results = [];

  for (var i = 0; i < FRUITS_AND_VEGGIES.length; i++) {
    var veggie = FRUITS_AND_VEGGIES[i].toLowerCase();
    if (veggie.indexOf(searchString.toLowerCase()) === 0) {
      results.push(FRUITS_AND_VEGGIES[i]);
    }
  }

  return results;
}

/**
 * @function onload
 * @desc Initialize the combobox examples once the page has loaded
 */
window.addEventListener('load', function () {
  var ex1Combobox = new aria.ListboxCombobox(
    document.getElementById('ex1-combobox'),
    document.getElementById('ex1-input'),
    document.getElementById('ex1-listbox'),
    searchVeggies,
    false
  );

  var ex2Combobox = new aria.ListboxCombobox(
    document.getElementById('ex2-combobox'),
    document.getElementById('ex2-input'),
    document.getElementById('ex2-listbox'),
    searchVeggies,
    true
  );

  var ex3Combobox = new aria.ListboxCombobox(
    document.getElementById('ex3-combobox'),
    document.getElementById('ex3-input'),
    document.getElementById('ex3-listbox'),
    searchVeggies,
    true,
    function () {
      // on show
      document.getElementById('ex3-combobox-arrow')
        .setAttribute('aria-label', 'Hide vegetable options');
    },
    function () {
      // on hide
      document.getElementById('ex3-combobox-arrow')
        .setAttribute('aria-label', 'Show vegetable options');
    }
  );

  document.getElementById('ex3-combobox-arrow').addEventListener(
    'click',
    function () {
      if (ex3Combobox.shown) {
        document.getElementById('ex3-input').focus();
        ex3Combobox.hideListbox();
      }
      else {
        document.getElementById('ex3-input').focus();
        ex3Combobox.updateResults(true);
      }
    }
  );
});
