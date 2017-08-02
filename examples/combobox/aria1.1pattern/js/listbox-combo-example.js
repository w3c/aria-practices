/**
 * ARIA Combobox Examples
 */

var FRUITS_AND_VEGGIES = [
  'Apple',
  'Banana',
  'Carrot',
  'Celery',
  'Daikon',
  'Date',
  'Edamame',
  'Elderberry',
  'Fennel',
  'Fig',
  'Grape',
  'Honeydew melon',
  'Iceberg lettuce',
  'Jerusalem artichoke',
  'Kiwi',
  'Leek',
  'Lemon',
  'Mango',
  'Mushroom',
  'Nectarine',
  'Olive',
  'Onion',
  'Orange',
  'Pea',
  'Pear',
  'Pineapple',
  'Pumpkin',
  'Quince',
  'Radish',
  'Rhubarb',
  'Strawberry',
  'Sweet potato',
  'Tomato',
  'Ugli fruit',
  'Victoria plum',
  'Watercress',
  'Watermelon',
  'Yam',
  'Zucchini',
];

function searchVeggies(searchString) {
  var results = [];

  if (!searchString) {
    return results;
  }

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
    searchVeggies
  );
});
