'use strict';

const path = require('path');
const { test } = require('ava');
const webdriver = require('webdriverio');

const startGeckodriver = require('./util/start-geckodriver');

let session, geckodriver;

test.before(async (t) => {
  geckodriver = await startGeckodriver(1022, 12 * 1000);
  session = webdriver.remote({
    port: geckodriver.port,
    path: '/',
    capabilities: {
      browserName: 'firefox'
    }
  }).init();
  await session;
});

test.beforeEach((t) => {
  t.context.session = session;
});

test.after.always(() => {
  return Promise.resolve(session && session.end())
    .then(() => geckodriver && geckodriver.stop());
});

module.exports = { test };
