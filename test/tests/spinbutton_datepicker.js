const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
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
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
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

// keys

ariaTest('up arrow on day', exampleFile, 'spinbutton-up-arrow', async (t) => {
  let control = parseInt(ex.dayNow);
  let daysInMonth = parseInt(ex.dayMax);

  // Send up arrow to day date spinner
  let daySpinner = await t.context.session.findElement(By.css(ex.daySelector));
  await daySpinner.sendKeys(Key.ARROW_UP);

  // Add a day to the control
  control = (control + 1) % daysInMonth;

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending 1 up arrow to the day spinner, the day should be: ' + control
  );

  // Send up arrow 30 more times to date spinner
  for (let i = 1; i <= 30; i++) {
    await daySpinner.sendKeys(Key.ARROW_UP);
  }

  // Add 30 days to the control
  control = (control + 30) % daysInMonth;

  if (control === 0) {
    control = parseInt(ex.dayMax);
  }

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending 31 up arrows to the day spinner, the day should be: ' +
      control
  );
});

ariaTest(
  'down arrow on day',
  exampleFile,
  'spinbutton-down-arrow',
  async (t) => {
    let control = 31;

    // Set to December for a 31 day month
    let monthSpinner = await t.context.session.findElement(
      By.css(ex.monthSelector)
    );
    await monthSpinner.sendKeys(Key.END);

    // Send down arrow to day date spinner
    let daySpinner = await t.context.session.findElement(
      By.css(ex.daySelector)
    );

    // Set to first of month
    await daySpinner.sendKeys(Key.HOME);

    await daySpinner.sendKeys(Key.ARROW_DOWN);

    t.is(
      parseInt(await daySpinner.getText()),
      control,
      'After sending 1 down arrow to the day spinner, the day should be: ' +
        control
    );

    // Send down arrow 30 more times to date spinner
    for (let i = 1; i <= 30; i++) {
      await daySpinner.sendKeys(Key.ARROW_DOWN);
    }

    // Subtract 30 days to the control
    control -= 30;

    t.is(
      parseInt(await daySpinner.getText()),
      control,
      'After sending 31 down arrows to the day spinner, the day should be: ' +
        control
    );
  }
);

ariaTest('up arrow on month', exampleFile, 'spinbutton-up-arrow', async (t) => {
  let date = new Date();
  date.setDate(1); // This is necessary to do the correct date math for months.

  let monthSpinner = await t.context.session.findElement(
    By.css(ex.monthSelector)
  );

  // Send up arrow 12 times to date spinner
  for (let i = 1; i <= 12; i++) {
    await monthSpinner.sendKeys(Key.ARROW_UP);
    const index = new Date(date.setMonth(date.getMonth() + 1)).getMonth();
    t.is(
      await monthSpinner.getText(),
      valuesMonth[index],
      `After sending ${i} up arrows to the month spinner, the month should be: ${valuesMonth[index]}`
    );
  }
});

ariaTest(
  'down arrow on month',
  exampleFile,
  'spinbutton-down-arrow',
  async (t) => {
    let control = 0;

    // Send down arrow to month date spinner
    let monthSpinner = await t.context.session.findElement(
      By.css(ex.monthSelector)
    );
    // Set to January
    await monthSpinner.sendKeys(Key.HOME);

    await monthSpinner.sendKeys(Key.ARROW_DOWN);

    // Subtract a month to the control
    control = 11;

    t.is(
      await monthSpinner.getText(),
      valuesMonth[control],
      'After sending 1 down arrow to the month spinner, the month should be: ' +
        valuesMonth[control]
    );

    // Send down arrow 30 more times to date spinner
    for (let i = 1; i <= 30; i++) {
      await monthSpinner.sendKeys(Key.ARROW_DOWN);
    }

    // Subtract 30 months to the control
    control = 12 + ((control - 30) % 12);

    t.is(
      await monthSpinner.getText(),
      valuesMonth[control],
      'After sending 31 down arrows to the month spinner, the month should be: ' +
        valuesMonth[control]
    );
  }
);

ariaTest('up arrow on year', exampleFile, 'spinbutton-up-arrow', async (t) => {
  // Send up arrow to day date spinner
  let yearSpinner = await t.context.session.findElement(
    By.css(ex.yearSelector)
  );
  await yearSpinner.sendKeys(Key.ARROW_UP);

  let nextYear = (parseInt(ex.yearNow) + 1).toString();

  t.is(
    await yearSpinner.getText(),
    nextYear,
    'After sending 1 up arrow to the year spinner, the year should be: ' +
      nextYear
  );

  let manyYears = parseInt(ex.yearMax) - parseInt(ex.yearNow);
  for (let i = 1; i <= manyYears; i++) {
    await yearSpinner.sendKeys(Key.ARROW_UP);
  }

  t.is(
    await yearSpinner.getText(),
    ex.yearMax,
    'After sending ' +
      (manyYears + 1) +
      ' up arrows to the year spinner, the year should be: ' +
      ex.yearMax
  );
});

ariaTest(
  'down arrow on year',
  exampleFile,
  'spinbutton-down-arrow',
  async (t) => {
    // Send down arrow to year date spinner
    let yearSpinner = await t.context.session.findElement(
      By.css(ex.yearSelector)
    );
    await yearSpinner.sendKeys(Key.ARROW_DOWN);

    // Subtract a year to the control
    let lastYear = (parseInt(ex.yearNow) - 1).toString();

    t.is(
      await yearSpinner.getText(),
      lastYear,
      'After sending 1 down arrow to the year spinner, the year should be: ' +
        lastYear
    );

    let manyYears = parseInt(ex.yearNow) - parseInt(ex.yearMin);
    for (let i = 1; i <= manyYears; i++) {
      await yearSpinner.sendKeys(Key.ARROW_DOWN);
    }

    t.is(
      await yearSpinner.getText(),
      ex.yearMin,
      'After sending ' +
        manyYears +
        ' down arrows to the year spinner, the year should be: ' +
        ex.yearMin
    );
  }
);

ariaTest('page up on day', exampleFile, 'spinbutton-page-up', async (t) => {
  let control = parseInt(ex.dayNow);

  // Set to December for a 31 day month
  let monthSpinner = await t.context.session.findElement(
    By.css(ex.monthSelector)
  );
  await monthSpinner.sendKeys(Key.END);

  // Send page up to day date spinner
  let daySpinner = await t.context.session.findElement(By.css(ex.daySelector));

  // Set to first of month
  await daySpinner.sendKeys(Key.HOME);

  await daySpinner.sendKeys(Key.PAGE_UP);

  // Add a day to the control
  control = 6;

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending 1 page up to the day spinner, the day should be: ' + control
  );

  // Send page up 5 more times to date spinner
  for (let i = 1; i <= 5; i++) {
    await daySpinner.sendKeys(Key.PAGE_UP);
  }

  // Add 25 days to the control
  control = 31;

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending 6 page ups to the day spinner, the day should be: ' + control
  );

  // Set to end of month
  await daySpinner.sendKeys(Key.END);

  // Rolls around to start of month
  control = 1;

  await daySpinner.sendKeys(Key.PAGE_UP);

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending page up to the day spinner on the last day of the month, the day should be: ' +
      control
  );

  // Set to end of month
  await daySpinner.sendKeys(Key.END);

  // Set to four days before
  for (let i = 1; i <= 4; i++) {
    await daySpinner.sendKeys(Key.DOWN);
  }

  await daySpinner.sendKeys(Key.PAGE_UP);

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending page up to the day spinner on 4 days before the end of the month, the day should be: ' +
      control
  );
});

ariaTest('page down on day', exampleFile, 'spinbutton-page-down', async (t) => {
  let control = parseInt(ex.dayNow);

  // Set to December for a 31 day month
  let monthSpinner = await t.context.session.findElement(
    By.css(ex.monthSelector)
  );
  await monthSpinner.sendKeys(Key.END);

  // Send page down to day date spinner
  let daySpinner = await t.context.session.findElement(By.css(ex.daySelector));

  // Set to 31st
  await daySpinner.sendKeys(Key.END);

  await daySpinner.sendKeys(Key.PAGE_DOWN);

  // Subtract 5 days to the control
  control = 26;

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending 1 page down to the day spinner, the day should be: ' +
      control
  );

  // Send page down 5 more times to date spinner
  for (let i = 1; i <= 5; i++) {
    await daySpinner.sendKeys(Key.PAGE_DOWN);
  }

  // Subtract 25 days to the control
  control -= 25;

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending 6 page downs to the day spinner, the day should be: ' +
      control
  );

  await daySpinner.sendKeys(Key.PAGE_DOWN);

  // End of month if hit when at first of month.
  control = 31;

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending page downs to the day spinner when set to 1, the day should be: ' +
      control
  );

  // Set to first of month
  await daySpinner.sendKeys(Key.HOME);

  // Set to five
  for (let i = 1; i <= 4; i++) {
    await daySpinner.sendKeys(Key.UP);
  }

  await daySpinner.sendKeys(Key.PAGE_DOWN);

  t.is(
    parseInt(await daySpinner.getText()),
    control,
    'After sending page down to the day spinner when set to 5, the day should be: ' +
      control
  );
});

ariaTest('page up on month', exampleFile, 'spinbutton-page-up', async (t) => {
  let control = 1;

  // Send page up to day date spinner
  let monthSpinner = await t.context.session.findElement(
    By.css(ex.monthSelector)
  );

  // Set to January
  await monthSpinner.sendKeys(Key.HOME);

  await monthSpinner.sendKeys(Key.PAGE_UP);

  // Add 5 month to the control
  control += 5;

  t.is(
    await monthSpinner.getText(),
    valuesMonth[control - 1],
    'After sending 1 page up to the month spinner, the month should be: ' +
      valuesMonth[control - 1]
  );

  // Send page up 2 more times to date spinner
  for (let i = 1; i <= 2; i++) {
    await monthSpinner.sendKeys(Key.PAGE_UP);
  }

  // Should roll around to January
  control = 1;

  t.is(
    await monthSpinner.getText(),
    valuesMonth[control - 1],
    'After sending 3 page ups to the month spinner, the month should be: ' +
      valuesMonth[control - 1]
  );

  // Set to December
  await monthSpinner.sendKeys(Key.END);

  // Should roll around to January
  await monthSpinner.sendKeys(Key.PAGE_UP);

  t.is(
    await monthSpinner.getText(),
    valuesMonth[control - 1],
    'After sending page ups to the month spinner in December, the month should be: ' +
      valuesMonth[control - 1]
  );

  // Set to December
  await monthSpinner.sendKeys(Key.END);

  // Set to August
  for (let i = 1; i <= 4; i++) {
    await monthSpinner.sendKeys(Key.DOWN);
  }

  await monthSpinner.sendKeys(Key.PAGE_UP);

  t.is(
    await monthSpinner.getText(),
    valuesMonth[control - 1],
    'After sending page up to the month spinner on August, the month should be: ' +
      valuesMonth[control - 1]
  );
});

ariaTest(
  'page down on month',
  exampleFile,
  'spinbutton-page-down',
  async (t) => {
    let control = 12;

    // Send page down to month date spinner
    let monthSpinner = await t.context.session.findElement(
      By.css(ex.monthSelector)
    );

    // Set spinner to December
    await monthSpinner.sendKeys(Key.END);

    await monthSpinner.sendKeys(Key.PAGE_DOWN);

    // Subtract 5 month to the control
    control -= 5;

    t.is(
      await monthSpinner.getText(),
      valuesMonth[control - 1],
      'After sending 1 page down to the month spinner, the month should be: ' +
        valuesMonth[control - 1]
    );

    // Send page down 2 more times to date spinner
    for (let i = 1; i <= 2; i++) {
      await monthSpinner.sendKeys(Key.PAGE_DOWN);
    }

    // Roll around to December
    control = 12;

    t.is(
      await monthSpinner.getText(),
      valuesMonth[control - 1],
      'After sending 3 page downs to the month spinner, the month should be: ' +
        valuesMonth[control - 1]
    );

    // Set to January
    await monthSpinner.sendKeys(Key.HOME);

    // Roll around to December
    await monthSpinner.sendKeys(Key.PAGE_DOWN);

    t.is(
      await monthSpinner.getText(),
      valuesMonth[control - 1],
      'After sending page down to the month spinner on January, the month should be: ' +
        valuesMonth[control - 1]
    );

    // Set to January
    await monthSpinner.sendKeys(Key.HOME);

    // Set to May
    for (let i = 1; i <= 4; i++) {
      await monthSpinner.sendKeys(Key.ARROW_UP);
    }

    await monthSpinner.sendKeys(Key.PAGE_DOWN);

    t.is(
      await monthSpinner.getText(),
      valuesMonth[control - 1],
      'After sending page down to the month spinner on May, the month should be: ' +
        valuesMonth[control - 1]
    );
  }
);

ariaTest('page up on year', exampleFile, 'spinbutton-page-up', async (t) => {
  // Send page up to day date spinner
  let yearSpinner = await t.context.session.findElement(
    By.css(ex.yearSelector)
  );
  await yearSpinner.sendKeys(Key.PAGE_UP);

  let nextYear = (parseInt(ex.yearNow) + 5).toString();

  t.is(
    await yearSpinner.getText(),
    nextYear,
    'After sending 1 page up to the year spinner, the year should be: ' +
      nextYear
  );

  let manyYears = Math.ceil((parseInt(ex.yearMax) - parseInt(ex.yearNow)) / 5);
  for (let i = 1; i <= manyYears; i++) {
    await yearSpinner.sendKeys(Key.PAGE_UP);
  }

  t.is(
    await yearSpinner.getText(),
    ex.yearMax,
    'After sending ' +
      (manyYears + 1) +
      ' page ups to the year spinner, the year should be: ' +
      ex.yearMax
  );
});

ariaTest(
  'down arrow on year',
  exampleFile,
  'spinbutton-page-down',
  async (t) => {
    // Send down arrow to year date spinner
    let yearSpinner = await t.context.session.findElement(
      By.css(ex.yearSelector)
    );
    await yearSpinner.sendKeys(Key.PAGE_UP);
    await yearSpinner.sendKeys(Key.PAGE_DOWN);

    t.is(
      await yearSpinner.getText(),
      ex.yearNow,
      'After sending 1 up arrow, then 1 down arrow to the year spinner, the year should be: ' +
        ex.yearNow
    );

    let manyYears = Math.ceil(
      (parseInt(ex.yearNow) - parseInt(ex.yearMin)) / 5
    );
    for (let i = 1; i <= manyYears; i++) {
      await yearSpinner.sendKeys(Key.PAGE_DOWN);
    }

    t.is(
      await yearSpinner.getText(),
      ex.yearMin,
      'After sending ' +
        manyYears +
        ' down arrows to the year spinner, the year should be: ' +
        ex.yearMin
    );
  }
);

ariaTest('home on day', exampleFile, 'spinbutton-home', async (t) => {
  // Send home to day date spinner
  let daySpinner = await t.context.session.findElement(By.css(ex.daySelector));
  await daySpinner.sendKeys(Key.HOME);

  t.is(
    await daySpinner.getText(),
    '1',
    'After sending home to the day spinner, the day should be: 1'
  );
});

ariaTest('end on day', exampleFile, 'spinbutton-end', async (t) => {
  // Send home to day date spinner
  let daySpinner = await t.context.session.findElement(By.css(ex.daySelector));
  await daySpinner.sendKeys(Key.END);

  t.is(
    await daySpinner.getText(),
    ex.dayMax,
    'After sending end to the day spinner, the day should be: ' + ex.dayMax
  );
});

ariaTest('home on month', exampleFile, 'spinbutton-home', async (t) => {
  // Send home to month date spinner
  let monthSpinner = await t.context.session.findElement(
    By.css(ex.monthSelector)
  );
  await monthSpinner.sendKeys(Key.HOME);

  t.is(
    await monthSpinner.getText(),
    'January',
    'After sending home to the month spinner, the month should be: January'
  );
});

ariaTest('end on month', exampleFile, 'spinbutton-end', async (t) => {
  // Send home to month date spinner
  let monthSpinner = await t.context.session.findElement(
    By.css(ex.monthSelector)
  );
  await monthSpinner.sendKeys(Key.END);

  t.is(
    await monthSpinner.getText(),
    'December',
    'After sending end to the month spinner, the month should be: December'
  );
});

ariaTest('home on year', exampleFile, 'spinbutton-home', async (t) => {
  // Send home to year date spinner
  let yearSpinner = await t.context.session.findElement(
    By.css(ex.yearSelector)
  );
  await yearSpinner.sendKeys(Key.HOME);

  t.is(
    await yearSpinner.getText(),
    ex.yearMin,
    'After sending home to the year spinner, the year should be: ' + ex.yearMin
  );
});

ariaTest('end on year', exampleFile, 'spinbutton-end', async (t) => {
  // Send home to year date spinner
  let yearSpinner = await t.context.session.findElement(
    By.css(ex.yearSelector)
  );
  await yearSpinner.sendKeys(Key.END);

  t.is(
    await yearSpinner.getText(),
    ex.yearMax,
    'After sending end to the year spinner, the year should be: ' + ex.yearMax
  );
});
