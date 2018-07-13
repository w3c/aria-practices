'use strict';

const path = require('path');
const { test } = require('ava');
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');

const startGeckodriver = require('./util/start-geckodriver');

let session, geckodriver;
const firefoxArgs = process.env.CI ? [ '-headless' ] : [];

test.before(async (t) => {
  geckodriver = await startGeckodriver(1022, 12 * 1000);
  session = new webdriver.Builder()
    .usingServer('http://localhost:' + geckodriver.port)
    .withCapabilities({
      'moz:firefoxOptions': {
        args: firefoxArgs
      }
    })
    .forBrowser('firefox')
    .build();
  await session;
});

test.beforeEach((t) => {
  t.context.session = session;
});

test.after.always(() => {
  return Promise.resolve(session && session.close())
    .then(() => geckodriver && geckodriver.stop());
});

/**
 * Declare a test for a behavior documented on and demonstrated by an
 * aria-practices examples page.
 *
 * @param {String} page - path to the example file
 * @param {String} testId - unique identifier for the documented behavior
 *                          within the demonstration page
 * @param {Function} body - script which implements the test
 */
const ariaTest = (desc, page, testId, body) => {
  const absPath = path.resolve(__dirname, '..', 'examples', ...page.split('/'));
  const url = 'file://' + absPath;
  const selector = '[data-test-id="' + testId + '"]';

  const testName = page + ' ' + selector + ': ' + desc;
  test.serial(testName, async function (t) {
    t.context.url = url;
    await t.context.session.get(url);

    const assert = require('assert');
    assert(
      (await t.context.session.findElements(By.css(selector))).length,
      'Cannot find behavior description for this test in example page:' + testId
    );

    return body.apply(this, arguments);
  });
};

module.exports = { ariaTest };
