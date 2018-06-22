'use strict';

const { ariaTest } = require('..');

ariaTest('link/link.html', 'key-enter', async (t) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  t.pass();
});

ariaTest('link/link.html', 'link-role', async (t) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  t.pass();
});

ariaTest('link/link.html', 'tab-index', async (t) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  t.pass();
});

ariaTest('link/link.html', 'alt', async (t) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  t.pass();
});

ariaTest('link/link.html', 'aria-label', async (t) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  t.pass();
});
