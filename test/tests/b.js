'use strict';

const { test } = require('..');

test('hello 2', (t) => {
  t.context.session.url('http://cachemonet.com');
  t.pass();
});
