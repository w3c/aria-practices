const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');
const assertAriaActivedescendant = require('../util/assertAriaActivedescendant');

const exampleFile = 'radio/radio-activedescendant.html';

const ex = {
  radiogroupSelector: '#ex1 [role="radiogroup"]',
  radioSelector: '#ex1 [role="radio"]',
  radiogroupSelectors: [
    '#ex1 [role="radiogroup"]:nth-of-type(1)',
    '#ex1 [role="radiogroup"]:nth-of-type(2)',
  ],
  radioSelectors: [
    '#ex1 [role="radiogroup"]:nth-of-type(1) [role="radio"]',
    '#ex1 [role="radiogroup"]:nth-of-type(2) [role="radio"]',
  ],
  innerRadioSelector: '[role="radio"]',
};

// Attributes

ariaTest(
  'role="radiogroup" on div element',
  exampleFile,
  'radiogroup-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'radiogroup', '2', 'ul');
  }
);

ariaTest(
  '"aria-labelledby" attribute on radiogroup',
  exampleFile,
  'radiogroup-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.radiogroupSelector);
  }
);

ariaTest(
  'tabindex on radiogroup',
  exampleFile,
  'radiogroup-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.radiogroupSelector, 'tabindex', '0');
  }
);

ariaTest(
  'aria-activedescendant',
  exampleFile,
  'radiogroup-aria-activedescendant',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.radiogroupSelectors[0],
      'aria-activedescendant',
      'rb11'
    );
    await assertAttributeValues(
      t,
      ex.radiogroupSelectors[1],
      'aria-activedescendant',
      'rb21'
    );
  }
);

ariaTest(
  'role="radio" on div elements',
  exampleFile,
  'radio-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'radio', '6', 'li');
  }
);

ariaTest(
  '"aria-checked" set on role="radio"',
  exampleFile,
  'radio-aria-checked',
  async (t) => {
    // The radio groups will be all unchecked on page load
    await assertAttributeValues(t, ex.radioSelector, 'aria-checked', 'false');

    const radiogroups = await t.context.queryElements(t, ex.radiogroupSelector);
    for (let radiogroup of radiogroups) {
      const radios = await t.context.queryElements(
        t,
        ex.innerRadioSelector,
        radiogroup
      );

      for (let checked = 0; checked < radios.length; checked++) {
        await radios[checked].click();
        for (let el = 0; el < radios.length; el++) {
          // test only one element has aria-checked="true"
          const isChecked = el === checked ? 'true' : 'false';
          t.is(
            await radios[el].getAttribute('aria-checked'),
            isChecked,
            'Tab at index ' +
              checked +
              ' is checked, therefore, tab at index ' +
              el +
              ' should have aria-checked="' +
              checked +
              '"'
          );
        }
      }
    }
  }
);

// Keys

ariaTest(
  'Moves focus to first or checked item',
  exampleFile,
  'key-tab',
  async (t) => {
    // On page load, the first item in the radio list should be in tab index
    await assertTabOrder(t, [
      ex.radiogroupSelectors[0],
      ex.radiogroupSelectors[1],
    ]);

    // Click the second item in each radio list
    await t.context.session
      .findElement(By.css(ex.radioSelectors[0] + ':nth-of-type(2)'))
      .click();
    await t.context.session
      .findElement(By.css(ex.radioSelectors[1] + ':nth-of-type(2)'))
      .click();

    // Now the second radio item in each list should be selected, but tab will take
    // the focus between the radio groups
    await assertTabOrder(t, [
      ex.radiogroupSelectors[0],
      ex.radiogroupSelectors[1],
    ]);
  }
);

ariaTest('Selects radio item', exampleFile, 'key-space', async (t) => {
  await t.context.session
    .findElement(By.css(ex.radiogroupSelectors[0]))
    .sendKeys(' ');
  const firstCrustRadioOption = ex.radioSelectors[0] + ':nth-of-type(1)';
  await assertAttributeValues(t, firstCrustRadioOption, 'aria-checked', 'true');

  await t.context.session
    .findElement(By.css(ex.radiogroupSelectors[1]))
    .sendKeys(' ');
  const firstDeliveryRadioOption = ex.radioSelectors[1] + ':nth-of-type(1)';
  await assertAttributeValues(
    t,
    firstDeliveryRadioOption,
    'aria-checked',
    'true'
  );
});

ariaTest(
  'RIGHT ARROW changes focus and checks radio',
  exampleFile,
  'key-down-right-arrow',
  async (t) => {
    for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
      const radiogroupSelector = ex.radiogroupSelectors[groupIndex];
      const radioSelector = ex.radioSelectors[groupIndex];
      const radiogroup = await t.context.session.findElement(
        By.css(radiogroupSelector)
      );
      const radios = await t.context.queryElements(t, radioSelector);

      // Right arrow moves focus to right
      for (let index = 0; index < radios.length; index++) {
        await radiogroup.sendKeys(Key.ARROW_RIGHT);
        const newIndex = (index + 1) % radios.length;

        await assertAriaActivedescendant(
          t,
          radiogroupSelector,
          radioSelector,
          newIndex
        );
        t.is(
          await radios[newIndex].getAttribute('aria-checked'),
          'true',
          'Radio at index ' +
            newIndex +
            ' should be checked after ARROW_RIGHT to radio' +
            ' at index ' +
            index
        );
      }
    }
  }
);

ariaTest(
  'DOWN ARROW changes focus and checks radio',
  exampleFile,
  'key-down-right-arrow',
  async (t) => {
    for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
      const radiogroupSelector = ex.radiogroupSelectors[groupIndex];
      const radioSelector = ex.radioSelectors[groupIndex];
      const radiogroup = await t.context.session.findElement(
        By.css(radiogroupSelector)
      );
      const radios = await t.context.queryElements(t, radioSelector);

      // Down arrow moves focus to right
      for (let index = 0; index < radios.length; index++) {
        await radiogroup.sendKeys(Key.ARROW_DOWN);
        const newIndex = (index + 1) % radios.length;

        await assertAriaActivedescendant(
          t,
          radiogroupSelector,
          radioSelector,
          newIndex
        );
        t.is(
          await radios[newIndex].getAttribute('aria-checked'),
          'true',
          'Radio at index ' +
            newIndex +
            ' should be checked after ARROW_DOWN to radio' +
            ' at index ' +
            index
        );
      }
    }
  }
);

ariaTest(
  'LEFT ARROW changes focus and checks radio',
  exampleFile,
  'key-up-left-arrow',
  async (t) => {
    for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
      const radiogroupSelector = ex.radiogroupSelectors[groupIndex];
      const radioSelector = ex.radioSelectors[groupIndex];
      const radiogroup = await t.context.session.findElement(
        By.css(radiogroupSelector)
      );
      const radios = await t.context.queryElements(t, radioSelector);

      // Left arrow moves focus to left
      for (let index of [0, 2, 1]) {
        await radiogroup.sendKeys(Key.ARROW_LEFT);
        const newIndex = index - 1 === -1 ? 2 : index - 1;

        await assertAriaActivedescendant(
          t,
          radiogroupSelector,
          radioSelector,
          newIndex
        );
        t.is(
          await radios[newIndex].getAttribute('aria-checked'),
          'true',
          'Radio at index ' +
            newIndex +
            ' should be checked after ARROW_LEFT to radio' +
            ' at index ' +
            index
        );
      }
    }
  }
);

ariaTest(
  'UP ARROW changes focus and checks radio',
  exampleFile,
  'key-up-left-arrow',
  async (t) => {
    for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
      const radiogroupSelector = ex.radiogroupSelectors[groupIndex];
      const radioSelector = ex.radioSelectors[groupIndex];
      const radiogroup = await t.context.session.findElement(
        By.css(radiogroupSelector)
      );
      const radios = await t.context.queryElements(t, radioSelector);

      // Up arrow moves focus to up
      for (let index of [0, 2, 1]) {
        await radiogroup.sendKeys(Key.ARROW_UP);
        const newIndex = index - 1 === -1 ? 2 : index - 1;

        await assertAriaActivedescendant(
          t,
          radiogroupSelector,
          radioSelector,
          newIndex
        );
        t.is(
          await radios[newIndex].getAttribute('aria-checked'),
          'true',
          'Radio at index ' +
            newIndex +
            ' should be checked after ARROW_UP to radio' +
            ' at index ' +
            index
        );
      }
    }
  }
);
