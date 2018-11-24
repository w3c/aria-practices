'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');

const exampleFile = 'alert/alert.html';

const ex = {
  buttonSelector: '#alert-trigger',
  alertSelector: '#ex1 [role="alert"]'
};

// Attributes

ariaTest('role="alert" on alert element', exampleFile, 'alert-role', async (t) => {
  t.plan(2);

  t.false(
    await t.context.session.findElement(By.css(ex.alertSelector)).isDisplayed(),
    '[role="alert"] element found and should not be displayed on pageload'
  );

  let alertButton = await t.context.session.findElement(By.css(ex.buttonSelector));
  await alertButton.click();

  t.true(
    await t.context.session.findElement(By.css(ex.alertSelector)).isDisplayed(),
    '[role="alert"] element found and is displayed after triggered'
  );
});
