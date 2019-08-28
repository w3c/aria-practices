'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');

const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');

const exampleFile = 'feed/feed.html';

const ex = {
  feedLinkSelector: '#ex1 a',
  feedSelector: '[role="feed"]',
  articleSelector: '[role="article"]',
  timeToLoad10Articles: 2500,
  numArticlesLoadedInSet: 10,
  delayTimeSelector: '#delay-time-select'
};

const navigateToFeed = async function (t) {
  await t.context.session.findElement(By.css(ex.feedLinkSelector)).click();

  return t.context.session.wait(
    () => {
      return t.context.session.getCurrentUrl().then(url => {
        return url != t.context.url;
      });
    },
    t.context.waitTime,
    'The feed url did not load after clicking: ' + ex.feedLinkSelector
  );
};

const waitForArticlesToLoad = async function (t) {
  // Wait for artilces to load
  return t.context.session.wait(
    async function () {
      let element = await t.context.session.findElement(By.css(ex.feedSelector));
      return (await element.getAttribute('aria-busy')) !== 'true';
    },
    ex.timeToLoad10Articles,
    'Expected to have articles loaded on after page load after: ' + ex.timeToLoad10Articles
  );
};

const loadMoreArticles = async function (t) {
  return t.context.session.executeScript(() => {
    window.scrollBy(0,2000);
  });
};

const checkFocus = async function (t, selector, index) {
  return t.context.session.wait(
    () => {
      return t.context.session.executeScript(function () {
        const [selector, index] = arguments;
        const items = document.querySelectorAll(selector);
        return items[index] === document.activeElement;
      }, selector, index);
    },
    t.context.waitTime,
    'Timeout: Focus did not reach item at index ' + index + ' of items: ' + selector
  );
};

// Attributes

ariaTest('role="feed" exists', exampleFile, 'feed-role', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await assertAriaRoles(t, 'main-content', 'feed', 1, 'div');
});

// This bug has been reported in issue: https://github.com/w3c/aria-practices/issues/911
ariaTest.failing('aria-labelledby attribute on feed element', exampleFile, 'feed-aria-labelledby', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await assertAriaLabelledby(t, ex.feedSelector);
});

ariaTest('aria-busy attribute on feed element', exampleFile, 'feed-aria-busy', async (t) => {
  t.plan(2);
  await navigateToFeed(t);
  await assertAttributeValues(t, ex.feedSelector, 'aria-busy', 'true');
  await waitForArticlesToLoad(t);
  await assertAttributeDNE(t, ex.feedSelector, 'aria-busy');
});

ariaTest('role="article" exists', exampleFile, 'article-role', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);
  await assertAriaRoles(t, 'main-content', 'article', 10, 'div');
});

ariaTest('tabindex="-1" on article elements', exampleFile, 'article-tabindex', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);
  await assertAttributeValues(t, ex.articleSelector, 'tabindex', '0');
});

ariaTest('aria-labelledby set on article elements', exampleFile, 'article-labelledby', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);
  await assertAriaLabelledby(t, ex.articleSelector);
});

ariaTest('aria-describedby set on article elements', exampleFile, 'article-describedby', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);
  await assertAriaDescribedby(t, ex.articleSelector);
});

ariaTest('aria-posinset on article element', exampleFile, 'article-aria-posinset', async (t) => {
  t.plan(30);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);

  let articles = await t.context.session.findElements(By.css(ex.articleSelector));
  for (let index = 1; index <= articles.length; index++) {
    t.is(
      await articles[index - 1].getAttribute('aria-posinset'),
      index.toString(),
      'Article number ' + index + ' does not have aria-posinset set correctly.'
    );
  }

  await loadMoreArticles(t);
  await waitForArticlesToLoad(t);

  articles = await t.context.session.findElements(By.css(ex.articleSelector));
  for (let index = 1; index <= articles.length; index++) {
    t.is(
      await articles[index - 1].getAttribute('aria-posinset'),
      index.toString(),
      'Article number ' + index + ' does not have aria-posinset set correctly.'
    );
  }
});

ariaTest('aria-setsize on article element', exampleFile, 'article-aria-setsize', async (t) => {
  t.plan(30);

  await navigateToFeed(t);
  await waitForArticlesToLoad(t);

  let articles = await t.context.session.findElements(By.css(ex.articleSelector));
  let numArticles = articles.length;
  for (let index = 1; index <= numArticles; index++) {
    t.is(
      await articles[index - 1].getAttribute('aria-setsize'),
      numArticles.toString(),
      'Article number ' + index + ' does not have aria-setsize set correctly, ' +
        'after first load.'
    );
  }

  await loadMoreArticles(t);
  await waitForArticlesToLoad(t);

  articles = await t.context.session.findElements(By.css(ex.articleSelector));
  numArticles = articles.length;
  for (let index = 1; index <= numArticles; index++) {
    t.is(
      await articles[index - 1].getAttribute('aria-setsize'),
      (ex.numArticlesLoadedInSet * 2).toString(),
      'Article number ' + index + ' does not have aria-setsize set correctly, ' +
        'after triggering more artilces to load.'
    );
  }
});

// Keys

ariaTest('PAGE DOWN moves focus between articles', exampleFile, 'key-page-down', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);

  let articles = await t.context.session.findElements(By.css(ex.articleSelector));
  articles[0].sendKeys(Key.PAGE_DOWN);

  t.true(
    await checkFocus(t, ex.articleSelector, 1),
    'Focus should be on next article after sending PAGE DOWN to first article'
  );
});

ariaTest('PAGE UP moves focus between articles', exampleFile, 'key-page-up', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);

  let articles = await t.context.session.findElements(By.css(ex.articleSelector));
  articles[1].sendKeys(Key.PAGE_UP);

  t.true(
    await checkFocus(t, ex.articleSelector, 0),
    'Focus should be on first article after sending PAGE UP to last article'
  );
});

ariaTest('CONTROL+END moves focus out of feed', exampleFile, 'key-control-end', async (t) => {
  t.plan(1);
  await navigateToFeed(t);
  await waitForArticlesToLoad(t);

  let articles = await t.context.session.findElements(By.css(ex.articleSelector));
  articles[0].sendKeys(Key.chord(Key.CONTROL, Key.END));

  t.true(
    await checkFocus(t, ex.delayTimeSelector, 0),
    'Focus should move off the feed (onto element: ' + ex.delayTimeSelector + ') after sending keys CONTROL+END'
  );

});

// This bug has been reported in issue: https://github.com/w3c/aria-practices/issues/911
ariaTest.failing('key home moves focus out of feed', exampleFile, 'key-control-home', async (t) => {
  t.fail();
});

