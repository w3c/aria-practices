'use strict';

const path = require('path');
const { test } = require('ava');
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');

const startGeckodriver = require('./util/start-geckodriver');

let session, geckodriver;
const firefoxArgs = process.env.CI ? [ '-headless' ] : [];
const testWaitTime = parseInt(process.env.TEST_WAIT_TIME) || 500;

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
  t.context.waitTime = testWaitTime;
});

test.after.always(() => {
  return Promise.resolve(session && session.close())
    .then(() => geckodriver && geckodriver.stop());
});

/**
 * Declare a test for a behavior documented on and demonstrated by an
 * aria-practices examples page.
 *
 * @param {String} desc - short description of the test
 * @param {String} page - path to the example file
 * @param {String} testId - unique identifier for the documented behavior
 *                          within the demonstration page
 * @param {Function} body - script which implements the test
 */
const ariaTest = (desc, page, testId, body) => {
  _ariaTest(desc, page, testId, body);
};

/**
 * Mark a declared test as failing using ava's 'test.failing' functionality.
 * If the test passes when it is expected to fail, a failure will be reported.
 *
 * See arguments for ariaTest.
 */
ariaTest.failing = (desc, page, testId, body) => {
  _ariaTest(desc, page, testId, body, 'FAILING');
};

const _ariaTest = (desc, page, testId, body, failing) => {
  const absPath = path.resolve(__dirname, '..', 'examples', ...page.split('/'));
  const url = 'file://' + absPath;
  const selector = '[data-test-id="' + testId + '"]';

  const testName = page + ' ' + selector + ': ' + desc;

  let runTest = failing ? test.failing : test.serial;
  runTest(testName, async function (t) {
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
