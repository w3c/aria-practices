'use strict';

const { test } = require('..');

test('hello 1', (t) => {
  t.context.driver.url('http://cachemonet.com');
  t.pass();
});
