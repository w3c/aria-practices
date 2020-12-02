const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertTabOrder = require('../util/assertTabOrder');
const assertHasFocus = require('../util/assertHasFocus');

const exampleFile = 'disclosure/disclosure-navigation.html';

const ex = {
  buttonSelector: '#exTest button',
  menuSelector: '#exTest > li > ul',
  linkSelector: '#exTest > li > ul a',
  buttonSelectors: [
    '#exTest > li:nth-child(1) button',
    '#exTest > li:nth-child(2) button',
    '#exTest > li:nth-child(3) button',
  ],
  menuSelectors: [
    '#exTest > li:nth-child(1) ul',
    '#exTest > li:nth-child(2) ul',
    '#exTest > li:nth-child(3) ul',
  ],
};

// Attributes

ariaTest(
  '"aria-controls" attribute on button',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-expanded" attribute on button',
  exampleFile,
  'button-aria-expanded',
  async (t) => {
    await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'false');

    let buttons = await t.context.queryElements(t, ex.buttonSelector);
    let menus = await t.context.queryElements(t, ex.menuSelector);
    for (let i = buttons.length - 1; i >= 0; i--) {
      await buttons[i].click();
      t.true(
        await menus[i].isDisplayed(),
        'Each dropdown menu should display after clicking its trigger'
      );
      await assertAttributeValues(
        t,
        ex.buttonSelectors[i],
        'aria-expanded',
        'true'
      );
    }
  }
);

ariaTest(
  '"aria-current" attribute on links',
  exampleFile,
  'link-aria-current',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const menus = await t.context.queryElements(t, ex.menuSelector);

    for (let b = 0; b < buttons.length; b++) {
      const links = await t.context.queryElements(t, 'a', menus[b]);

      for (let l = 0; l < links.length; l++) {
        await buttons[b].click();
        await links[l].click();

        t.is(
          await links[l].getAttribute('aria-current'),
          'page',
          'after clicking link at index ' +
            l +
            ' on menu ' +
            b +
            'aria-current should be set to page'
        );

        let ariaCurrentLinks = await t.context.queryElements(
          t,
          `${ex.linkSelector}[aria-current="page"]`
        );

        t.is(
          ariaCurrentLinks.length,
          1,
          'after clicking link at index ' +
            l +
            ' on menu ' +
            b +
            ', only one link should have aria-current set'
        );
      }
    }
  }
);

// Keys

ariaTest(
  'TAB should move focus between buttons',
  exampleFile,
  'key-tab',
  async (t) => {
    await assertTabOrder(t, ex.buttonSelectors);
  }
);

ariaTest(
  'key ENTER expands dropdown',
  exampleFile,
  'key-enter-space',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const menus = await t.context.queryElements(t, ex.menuSelector);

    for (let i = buttons.length - 1; i >= 0; i--) {
      await buttons[i].sendKeys(Key.ENTER);
      await assertAttributeValues(
        t,
        ex.buttonSelectors[i],
        'aria-expanded',
        'true'
      );
      t.true(
        await menus[i].isDisplayed(),
        'Dropdown menu should display sending ENTER to its trigger'
      );

      await buttons[i].sendKeys(Key.ENTER);
      await assertAttributeValues(
        t,
        ex.buttonSelectors[i],
        'aria-expanded',
        'false'
      );
      t.false(
        await menus[i].isDisplayed(),
        'Dropdown menu should close after sending ENTER twice to its trigger'
      );
    }
  }
);

ariaTest(
  'key SPACE expands dropdown',
  exampleFile,
  'key-enter-space',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const menus = await t.context.queryElements(t, ex.menuSelector);

    for (let i = buttons.length - 1; i >= 0; i--) {
      await buttons[i].sendKeys(Key.SPACE);
      await assertAttributeValues(
        t,
        ex.buttonSelectors[i],
        'aria-expanded',
        'true'
      );
      t.true(
        await menus[i].isDisplayed(),
        'Dropdown menu should display sending SPACE to its trigger'
      );

      await buttons[i].sendKeys(Key.SPACE);
      await assertAttributeValues(
        t,
        ex.buttonSelectors[i],
        'aria-expanded',
        'false'
      );
      t.false(
        await menus[i].isDisplayed(),
        'Dropdown menu should close after sending SPACE twice to its trigger'
      );
    }
  }
);

ariaTest('key ESCAPE closes dropdown', exampleFile, 'key-escape', async (t) => {
  const button = await t.context.session.findElement(
    By.css(ex.buttonSelectors[0])
  );
  const menu = await t.context.session.findElement(By.css(ex.menuSelectors[0]));
  const firstLink = await t.context.session.findElement(
    By.css(`${ex.menuSelectors[0]} a`)
  );

  await button.click();
  t.true(await menu.isDisplayed(), 'Dropdown menu is displayed on click');

  await firstLink.sendKeys(Key.ESCAPE);
  await assertAttributeValues(
    t,
    ex.buttonSelectors[0],
    'aria-expanded',
    'false'
  );
  t.false(
    await menu.isDisplayed(),
    'Dropdown menu should close after sending ESCAPE to the menu'
  );
});

ariaTest(
  'arrow keys move focus between disclosure buttons',
  exampleFile,
  'key-arrows',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    await buttons[0].sendKeys(Key.ARROW_RIGHT);
    await assertHasFocus(
      t,
      ex.buttonSelectors[1],
      'right arrow moves focus from first to second button'
    );

    await buttons[0].sendKeys(Key.ARROW_DOWN);
    await assertHasFocus(
      t,
      ex.buttonSelectors[1],
      'down arrow moves focus from first to second button'
    );

    await buttons[1].sendKeys(Key.ARROW_RIGHT);
    await assertHasFocus(
      t,
      ex.buttonSelectors[2],
      'right arrow moves focus from second to third button'
    );

    await buttons[2].sendKeys(Key.ARROW_RIGHT);
    await assertHasFocus(
      t,
      ex.buttonSelectors[2],
      'right arrow does not move focus from last button'
    );

    await buttons[0].sendKeys(Key.ARROW_LEFT);
    await assertHasFocus(
      t,
      ex.buttonSelectors[0],
      'left arrow does not move focus from first button'
    );

    await buttons[1].sendKeys(Key.ARROW_LEFT);
    await assertHasFocus(
      t,
      ex.buttonSelectors[0],
      'left arrow moves focus from second to first button'
    );

    await buttons[1].sendKeys(Key.ARROW_UP);
    await assertHasFocus(
      t,
      ex.buttonSelectors[0],
      'up arrow moves focus from second to first button'
    );

    await buttons[2].sendKeys(Key.ARROW_LEFT);
    await assertHasFocus(
      t,
      ex.buttonSelectors[1],
      'left arrow moves focus from third to second button'
    );
  }
);

ariaTest(
  'down arrow moves focus from button to open menu',
  exampleFile,
  'key-arrows',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const menu = await t.context.session.findElement(
      By.css(ex.menuSelectors[0])
    );

    // open menu
    await buttons[0].click();
    await menu.isDisplayed();

    await buttons[0].sendKeys(Key.ARROW_DOWN);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:first-child a`,
      'down arrow moves focus to open menu'
    );

    await buttons[1].sendKeys(Key.ARROW_DOWN);
    await assertHasFocus(
      t,
      ex.buttonSelectors[2],
      "down arrow moves focus to next button if active button's menu is closed"
    );
  }
);

ariaTest(
  'home and end move focus to first and last buttons',
  exampleFile,
  'key-home-end',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    await buttons[1].sendKeys(Key.HOME);
    await assertHasFocus(
      t,
      ex.buttonSelectors[0],
      'home key moves focus to first button'
    );

    await buttons[0].sendKeys(Key.END);
    await assertHasFocus(
      t,
      ex.buttonSelectors[2],
      'end key moves focus to last button'
    );
  }
);

ariaTest(
  'arrow keys move focus between open menu links',
  exampleFile,
  'key-arrows',
  async (t) => {
    const button = await t.context.session.findElement(
      By.css(ex.buttonSelectors[0])
    );
    const menu = await t.context.session.findElement(
      By.css(ex.menuSelectors[0])
    );
    const menuLinks = await t.context.queryElements(
      t,
      `${ex.menuSelectors[0]} a`
    );

    await button.click();
    await menu.isDisplayed();

    await menuLinks[0].sendKeys(Key.ARROW_DOWN);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:nth-child(2) a`,
      'down arrow moves focus from first to second link'
    );

    await menuLinks[0].sendKeys(Key.ARROW_RIGHT);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:nth-child(2) a`,
      'right arrow moves focus from first to second link'
    );

    await menuLinks[2].sendKeys(Key.ARROW_DOWN);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:last-child a`,
      'down arrow does not move focus from last link'
    );

    await menuLinks[0].sendKeys(Key.ARROW_UP);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:nth-child(1) a`,
      'up arrow does not move focus from first link'
    );

    await menuLinks[1].sendKeys(Key.ARROW_LEFT);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:nth-child(1) a`,
      'left arrow moves focus from second to first link'
    );

    await menuLinks[1].sendKeys(Key.ARROW_UP);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:nth-child(1) a`,
      'up arrow moves focus from second to first link'
    );
  }
);

ariaTest(
  'home and end move focus to first and last open menu link',
  exampleFile,
  'key-home-end',
  async (t) => {
    const button = await t.context.session.findElement(
      By.css(ex.buttonSelectors[0])
    );
    const menu = await t.context.session.findElement(
      By.css(ex.menuSelectors[0])
    );
    const menuLinks = await t.context.queryElements(
      t,
      `${ex.menuSelectors[0]} a`
    );

    await button.click();
    await menu.isDisplayed();

    await menuLinks[1].sendKeys(Key.HOME);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:nth-child(1) a`,
      'home key moves focus to first link'
    );

    await menuLinks[0].sendKeys(Key.END);
    await assertHasFocus(
      t,
      `${ex.menuSelectors[0]} li:last-child a`,
      'end key moves focus to last link'
    );
  }
);
