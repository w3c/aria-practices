'use strict';

const path = require('path');
const { test } = require('ava');
const webdriver = require('webdriverio');
const { spawn } = require('child_process');

const startGeckoDriver = (port) => {
  const geckoDriver = path.join(
    __dirname, '..', 'node_modules', '.bin', 'geckodriver'
  );
  return new Promise((resolve) => {
    const child = spawn(geckoDriver, ['--port', port]);

	// TODO fix this
	setTimeout(() => resolve(child), 1000);
  });
};
let driver;

test.before(async (t) => {
  const port = Math.round(1024 + Math.random() * 1000);

  await startGeckoDriver(port);
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
test.after(() => console.log('end server'));

test.after.always(() => {
  return driver.end();
});

module.exports = { test };
