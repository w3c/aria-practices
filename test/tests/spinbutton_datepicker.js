const { ariaTest } = require('..');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'spinbutton/datepicker-spinbuttons.html';

const valuesDay = [
  '',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteen',
  'fifteenth',
  'sixteenth',
  'seveneenth',
  'eighteenth',
  'nineteenth',
  'twentieth',
  'twenty first',
  'twenty second',
  'twenty third',
  'twenty fourth',
  'twenty fifth',
  'twenty sixth',
  'twenty seventh',
  'twenty eighth',
  'twenty ninth',
  'thirtieth',
  'thirty first',
];
const valuesMonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

var getDaysInMonth = function (year, month) {
  return new Date(year, month + 1, 0).getDate();
};

var d = new Date();

// The date picker uses the current day, month and year to setup
const ex = {
  groupSelector: '#example [role="group"]',
  spinbuttonSelector: '#example [role="spinbutton"]',

  yearSelector: '#example .spinbutton.year [role="spinbutton"]',
  yearMin: '2019',
  yearMax: '2040',
  yearNow: d.getFullYear().toString(),

  monthSelector: '#example .spinbutton.month [role="spinbutton"]',
  monthMin: '0',
  monthMax: '11',
  monthNow: d.getMonth().toString(),
  monthText: valuesMonth[d.getMonth()],

  daySelector: '#example .spinbutton.day [role="spinbutton"]',
  dayMin: '1',
  dayMax: getDaysInMonth(d.getFullYear(), d.getMonth()).toString(),
  dayNow: d.getDate().toString(),
  dayText: valuesDay[d.getDate()],

  yearIncreaseSelector: '#example .spinbutton.year .increase',
  yearDecreaseSelector: '#example .spinbutton.year .decrease',
  yearHiddenPreviousSelector: '#example .spinbutton.year .previous',
  yearHiddenNextSelector: '#example .spinbutton.year .next',

  monthIncreaseSelector: '#example .spinbutton.month .increase',
  monthDecreaseSelector: '#example .spinbutton.month .decrease',
  monthHiddenPreviousSelector: '#example .spinbutton.month .previous',
  monthHiddenNextSelector: '#example .spinbutton.month .next',

  dayIncreaseSelector: '#example .spinbutton.day .increase',
  dayDecreaseSelector: '#example .spinbutton.day .decrease',
  dayHiddenPreviousSelector: '#example .spinbutton.day .previous',
  dayHiddenNextSelector: '#example .spinbutton.day .next',
};

// Attributes

ariaTest(
  'role="group" on div element',
  exampleFile,
  'group-role',
  async (t) => {
    await assertAriaRoles(t, 'example', 'group', '1', 'div');
  }
);

ariaTest(
  '"aria-labelledby" attribute on group',
  exampleFile,
  'group-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.groupSelector);
  }
);

ariaTest(
  'role="spinbutton" on div element',
  exampleFile,
  'spinbutton-role',
  async (t) => {
    await assertAriaRoles(t, 'example', 'spinbutton', '3', 'div');
  }
);

ariaTest(
  '"aria-valuemax" represents the minimum value on spinbuttons',
  exampleFile,
  'spinbutton-aria-valuemax',
  async (t) => {
    await assertAttributeValues(t, ex.daySelector, 'aria-valuemax', ex.dayMax);
    await assertAttributeValues(
      t,
      ex.monthSelector,
      'aria-valuemax',
      ex.monthMax
    );
    await assertAttributeValues(
      t,
      ex.yearSelector,
      'aria-valuemax',
      ex.yearMax
    );
  }
);

ariaTest(
  '"aria-valuemin" represents the maximum value on spinbuttons',
  exampleFile,
  'spinbutton-aria-valuemin',
  async (t) => {
    await assertAttributeValues(t, ex.daySelector, 'aria-valuemin', ex.dayMin);
    await assertAttributeValues(
      t,
      ex.monthSelector,
      'aria-valuemin',
      ex.monthMin
    );
    await assertAttributeValues(
      t,
      ex.yearSelector,
      'aria-valuemin',
      ex.yearMin
    );
  }
);

ariaTest(
  '"aria-valuenow" reflects spinbutton value as a number',
  exampleFile,
  'spinbutton-aria-valuenow',
  async (t) => {
    await assertAttributeValues(t, ex.daySelector, 'aria-valuenow', ex.dayNow);
    await assertAttributeValues(
      t,
      ex.monthSelector,
      'aria-valuenow',
      ex.monthNow
    );
    await assertAttributeValues(
      t,
      ex.yearSelector,
      'aria-valuenow',
      ex.yearNow
    );
  }
);

ariaTest(
  '"aria-valuetext" reflects spin button value as a text string',
  exampleFile,
  'spinbutton-aria-valuetext',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.daySelector,
      'aria-valuetext',
      ex.dayText
    );
    await assertAttributeValues(
      t,
      ex.monthSelector,
      'aria-valuetext',
      ex.monthText
    );
  }
);

ariaTest(
  '"aria-label" provides accessible name for the spin buttons to screen reader users',
  exampleFile,
  'spinbutton-aria-label',
  async (t) => {
    await assertAttributeValues(t, ex.daySelector, 'aria-label', 'Day');
    await assertAttributeValues(t, ex.monthSelector, 'aria-label', 'Month');
    await assertAttributeValues(t, ex.yearSelector, 'aria-label', 'Year');
  }
);

ariaTest(
  '"tabindex=-1" removes previous and next from the tab order of the page',
  exampleFile,
  'button-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.dayIncreaseSelector, 'tabindex', '-1');
    await assertAttributeValues(t, ex.dayDecreaseSelector, 'tabindex', '-1');

    await assertAttributeValues(t, ex.monthIncreaseSelector, 'tabindex', '-1');
    await assertAttributeValues(t, ex.monthDecreaseSelector, 'tabindex', '-1');

    await assertAttributeValues(t, ex.yearIncreaseSelector, 'tabindex', '-1');
    await assertAttributeValues(t, ex.yearDecreaseSelector, 'tabindex', '-1');
  }
);

ariaTest(
  '"aria-label" provides accessible name for the previous and next buttons to screen reader users',
  exampleFile,
  'button-aria-label',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.dayIncreaseSelector,
      'aria-label',
      'next day'
    );
    await assertAttributeValues(
      t,
      ex.dayDecreaseSelector,
      'aria-label',
      'previous day'
    );

    await assertAttributeValues(
      t,
      ex.monthIncreaseSelector,
      'aria-label',
      'next month'
    );
    await assertAttributeValues(
      t,
      ex.monthDecreaseSelector,
      'aria-label',
      'previous month'
    );

    await assertAttributeValues(
      t,
      ex.yearIncreaseSelector,
      'aria-label',
      'next year'
    );
    await assertAttributeValues(
      t,
      ex.yearDecreaseSelector,
      'aria-label',
      'previous year'
    );
  }
);

ariaTest(
  '"aria-hidden" hides decorative and redundant content form screen reader users',
  exampleFile,
  'spinbutton-aria-hidden',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.dayHiddenPreviousSelector,
      'aria-hidden',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.dayHiddenNextSelector,
      'aria-hidden',
      'true'
    );

    await assertAttributeValues(
      t,
      ex.monthHiddenPreviousSelector,
      'aria-hidden',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.monthHiddenNextSelector,
      'aria-hidden',
      'true'
    );

    await assertAttributeValues(
      t,
      ex.yearHiddenPreviousSelector,
      'aria-hidden',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.yearHiddenNextSelector,
      'aria-hidden',
      'true'
    );
  }
);
