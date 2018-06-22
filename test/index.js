'use strict';

const path = require('path');
const { test } = require('ava');
const webdriver = require('webdriverio');

const geckodriver = require('./util/geckodriver');

let driver, stopGeckoDriver;

test.before(async (t) => {
  const { stop, port } = await geckodriver(1022, 12 * 1000);
  stopGeckoDriver = stop;
  driver = webdriver.remote({
	port,
	path: '/',
	capabilities: {
      browserName: 'firefox'
	}
  }).init();
  await driver;
});

test.beforeEach((t) => {
  t.context.driver = driver;
});

test.after.always(() => {
  return Promise.resolve(driver && driver.end())
	.then(() => stopGeckoDriver && stopGeckoDriver());
});

module.exports = { test };
