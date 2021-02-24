const { ariaTest } = require('..');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/range-thermostat.html';

const ex = {
  rangeSelector: '#ex1 [input="range"]',
  buttonSelector: '#ex1 button',
  groupSelector: '#ex1 [role="group"]',
  tempSelector: '#id-temp-range',
  fanSelector: '#id-fan',
  tempMax: '38.0',
  tempMin: '10.0',
  tempDefault: '25.0',
  tempInc: '.1',
  tempPageInc: '2.0',
  tempSuffix: '°C',
  fanMax: '3',
  fanMin: '0',
  fanValues: ['Off', 'Low', 'Med', 'High'],
};

// Attributes

ariaTest(
  'role="group" on DIV element',
  exampleFile,
  'group-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'group', '1', 'div');
  }
);

ariaTest(
  '"aria-labelledby" set on group',
  exampleFile,
  'group-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.groupSelector);
  }
);

ariaTest(
  '"tabindex" set to "-1" on buttons',
  exampleFile,
  'button-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.buttonSelector, 'tabindex', '-1');
  }
);

ariaTest(
  '"aria-label" set on button',
  exampleFile,
  'button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-controls" attribute of button',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-orientation" set on ranges',
  exampleFile,
  'range-aria-orientation',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-orientation',
      'vertical'
    );
  }
);

ariaTest(
  '"aria-valuetext" reflects range value',
  exampleFile,
  'range-aria-valuetext',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-valuetext',
      ex.tempDefault + ex.tempSuffix
    );
    await assertAttributeValues(
      t,
      ex.fanSelector,
      'aria-valuetext',
      ex.fanValues[0]
    );
  }
);

ariaTest(
  '"range-aria-labelledby" set on temp range',
  exampleFile,
  'range-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.tempSelector);
  }
);
