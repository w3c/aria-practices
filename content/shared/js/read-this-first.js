'use strict';

/**
 * Inserts the "Read This First" banner from /content/shared/templates/read-this-first.html into
 * pages after the h1 element when the DOM is loaded. The banner is configured using data
 * attributes on the script element.
 *
 * USAGE:
 * Add this script to your HTML page with the appropriate data attributes:
 *
 * <script data-read-this-first="showImage:true" src="../../shared/js/read-this-first.js"></script>
 *
 * CONFIGURATION OPTIONS:
 * - showImage: boolean (default: true) - Controls whether the illustration image is displayed
 *
 * BEHAVIOR:
 * - Banner is inserted after the h1 element when DOM is loaded
 * - If template file can't be fetched (e.g., CORS issues with file:// protocol), uses fallback
 * - Paths are automatically adjusted based on script location
 * - Image can be conditionally removed based on showImage setting
 */
(function () {
  const defaultConfig = {
    showImage: true,
  };

  // NOTE: If /content/shared/templates/read-this-first.html is ever changed, update this fallback banner to match
  // MUST HAVE `div class="read-this-first"`
  const fallbackBanner = `
    <div class="read-this-first">
      <div class="text">
        <img
          src="../../images/read-this-first.svg"
          width="178"
          alt="Illustration of a brown-skinned woman with a slight smile gesturing towards the right with her hand"
        >
        <h2>Read This First</h2>
        <p>
          No ARIA is better than Bad ARIA. Before using any ARIA, <a href="../../practices/read-me-first/read-me-first-practice.html" aria-label="Read this to understand why no ARIA is better than bad ARIA">read this to understand why</a>.
        </p>
      </div>
    </div>
  `;

  function getScriptBasePath() {
    const scriptElement = document.querySelector(
      'script[src*="read-this-first.js"]'
    );
    if (!scriptElement) return '../../';

    const scriptSrc = scriptElement.getAttribute('src');
    // Extract the directory path from the script src
    // e.g., "../../shared/js/read-this-first.js" gives "../../"
    const match = scriptSrc.match(/^(.*\/)shared\/js\/read-this-first\.js$/);
    return match ? match[1] : '../../';
  }

  function parseConfigFromDataAttribute() {
    const config = { ...defaultConfig };
    const configElem = document.querySelector('[data-read-this-first]');

    if (configElem) {
      const dataValue = configElem.getAttribute('data-read-this-first');
      if (dataValue) {
        const values = dataValue.split(';');
        values.forEach((v) => {
          let [prop, value] = v.split(':');
          if (prop) {
            prop = prop.trim();
          }
          if (value) {
            value = value.trim();
          }
          if (prop && value) {
            // Convert string values to appropriate types
            if (value === 'true' || value === 'false') {
              config[prop] = value === 'true';
            } else {
              config[prop] = value;
            }
          }
        });
      }
    }

    return config;
  }

  function removeImageIfNeeded(bannerElement, config) {
    if (!config.showImage) {
      const img = bannerElement.querySelector('img');
      if (img) img.remove();
    }
  }

  async function insertBanner(config) {
    // Get the first found h1 element on page
    const h1 = document.querySelector('h1');
    if (!h1) return;

    // Get the base path for relative URLs
    const basePath = getScriptBasePath();

    try {
      // Fetch the banner HTML from the template file (will fail with file:// protocol)
      const response = await fetch(
        `${basePath}shared/templates/read-this-first.html`
      );
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // Get the read-this-first div
      const bannerDiv = doc.querySelector('.read-this-first');

      if (!bannerDiv) return;

      const bannerElement = bannerDiv.cloneNode(true);
      removeImageIfNeeded(bannerElement, config);

      // Insert the banner after h1
      h1.parentNode.insertBefore(bannerElement, h1.nextSibling);
    } catch (error) {
      // Fallback to static banner if fetch fails (CORS will fail with file:// protocol)
      const tempBannerDiv = document.createElement('div');
      // Adjust paths in the fallback banner based on script location
      tempBannerDiv.innerHTML = fallbackBanner
        .replace(/src="\.\.\/\.\.\//g, `src="${basePath}`)
        .replace(/href="\.\.\/\.\.\//g, `href="${basePath}`);

      const fallbackBannerElement = tempBannerDiv.firstElementChild;
      removeImageIfNeeded(fallbackBannerElement, config);

      // Insert the banner after h1
      h1.parentNode.insertBefore(fallbackBannerElement, h1.nextSibling);
    }
  }

  async function init() {
    const config = parseConfigFromDataAttribute();
    await insertBanner(config);
  }

  if (document.readyState === 'loading') {
    // Initialize on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already loaded
    init();
  }
})();
