const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');

let pageExamples = [
  {
    exampleId: 'ex1',
    linkSelector: '#ex1 span',
  },
  {
    exampleId: 'ex2',
    linkSelector: '#ex2 img',
    alt: true,
  },
  {
    exampleId: 'ex3',
    linkSelector: '#ex3 span',
    ariaLabel: true,
  },
];

ariaTest(
  'Test "role" attribute exists',
  'link/link.html',
  'link-role',
  async (t) => {
    for (let i = 0; i < pageExamples.length; i++) {
      let ex = pageExamples[i];
      let linkLocator = By.css(ex.linkSelector);
      let linkElement = await t.context.session.findElement(linkLocator);

      t.is(
        await linkElement.getAttribute('role'),
        'link',
        '[role="link"] attribute should exist on element select by: ' +
          ex.linkSelector
      );
    }
  }
);

ariaTest(
  'Test "tabindex" attribute set to 0',
  'link/link.html',
  'tabindex',
  async (t) => {
    for (let i = 0; i < pageExamples.length; i++) {
      let ex = pageExamples[i];
      let linkLocator = By.css(ex.linkSelector);
      let linkElement = await t.context.session.findElement(linkLocator);

      t.is(
        await linkElement.getAttribute('tabindex'),
        '0',
        '[tab-index=0] attribute should exist on element selected by: ' +
          ex.linkSelector
      );
    }
  }
);

ariaTest('Test "alt" attribute exists', 'link/link.html', 'alt', async (t) => {
  for (let i = 0; i < pageExamples.length; i++) {
    let ex = pageExamples[i];
    if (!Object.prototype.hasOwnProperty.call(ex, 'alt')) {
      continue;
    }
    let linkLocator = By.css(ex.linkSelector);
    let linkElement = await t.context.session.findElement(linkLocator);

    t.truthy(
      await linkElement.getAttribute('alt'),
      '"alt" attribute should exist on element selected by: ' + ex.linkSelector
    );
  }
});

ariaTest(
  'Test "aria-label" attribute exists',
  'link/link.html',
  'aria-label',
  async (t) => {
    for (let i = 0; i < pageExamples.length; i++) {
      let ex = pageExamples[i];
      if (!Object.prototype.hasOwnProperty.call(ex, 'ariaLabel')) {
        continue;
      }

      await assertAriaLabelExists(t, ex.linkSelector);
    }
  }
);

ariaTest(
  'Test "ENTER" key behavior',
  'link/link.html',
  'key-enter',
  async (t) => {
    for (let i = 0; i < pageExamples.length; i++) {
      await t.context.session.get(t.context.url);

      let ex = pageExamples[i];
      let linkLocator = By.css(ex.linkSelector);
      let linkElement = await t.context.session.findElement(linkLocator);

      await linkElement.sendKeys(Key.ENTER);
      await t.context.session
        .wait(() => {
          return t.context.session.getCurrentUrl().then((url) => {
            return url != t.context.url;
          });
        }, t.context.waitTime)
        .catch(() => {});

      t.not(
        await t.context.session.getCurrentUrl(),
        t.context.url,
        'ENTER key on element with selector "' +
          ex.linkSelector +
          '" should activate link.'
      );
    }
  }
);
