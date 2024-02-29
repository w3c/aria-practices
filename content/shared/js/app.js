/* global hljs */

'use strict';

(function () {
  // Load syntax highlighting
  hljs.highlightAll();

  // Add usage warning to all examples
  window.addEventListener('DOMContentLoaded', addExampleUsageWarning, false);

  // Rewrite links so they point to the proper spec document
  window.addEventListener('DOMContentLoaded', resolveSpecLinks, false);

  // Support levels iframes should not show scrollbars, so a message with the
  // correct height will be posted from the iframe.
  window.addEventListener('message', fixIframeHeight);

  async function addExampleUsageWarning() {
    // Determine we are on an example page
    if (!document.location.href.match(/examples\/[^/]+\.html/)) return;

    // Generate the usage warning link using app.js link as a starting point
    const scriptSource = document
      .querySelector('[src$="app.js"]')
      .getAttribute('src');
    const fetchSource = scriptSource.replace(
      '/js/app.js',
      '/templates/example-usage-warning.html'
    );

    // Load and parse the usage warning and insert it before the h1
    const html = await (await fetch(fetchSource)).text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Pull out the relevant part, the details element
    const warningElement = doc.querySelector('details');
    warningElement.classList.add('note'); // Needed for styling

    // Insert the usage warning before the page's h1
    const heading = document.querySelector('h1');
    heading.parentNode.insertBefore(warningElement, heading.nextSibling);
  }

  async function resolveSpecLinks() {
    const { specLinks } = await import('./specLinks.mjs');
    const fixSpecLink = specLinks({ specStatus: 'ED' });
    document.querySelectorAll('a[href]').forEach(fixSpecLink);
  }

  function fixIframeHeight(event) {
    const data = event.data;
    if (!data.iframe || !data.height || isNaN(data.height)) {
      return;
    }
    const iframe = document.querySelector(`.${data.iframe}`);
    if (!iframe) return;
    iframe.style.height = data.height + 'px';
  }
})();
