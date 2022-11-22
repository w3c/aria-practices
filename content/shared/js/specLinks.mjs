// This file is an ES module to make it easier to use in both frontend and backend contexts.
// Allows APG authors to easily write links to the correct version of the ARIA specification or other related specs.
// A typical spec link looks like this: <a href="#button" class="role-reference">button</a>.
// Other classes used for spec links include "property-reference" and "state-reference", and for a complete list, see below.

const specData = {
  ariaSpec: {
    classes: [
      'role-reference',
      'property-reference',
      'state-reference',
      'specref',
    ],
    statuses: {
      ED: 'https://w3c.github.io/aria/',
      FPWD: 'https://www.w3.org/TR/wai-aria-1.2/',
      WD: 'https://www.w3.org/TR/wai-aria-1.2/',
      REC: 'https://www.w3.org/TR/wai-aria/',
    },
  },
  accNameURLs: {
    classes: ['accname'],
    statuses: {
      ED: 'https://w3c.github.io/accname/',
      WD: 'https://www.w3.org/TR/accname-1.2/',
      FPWD: 'https://www.w3.org/TR/accname-1.2/',
      REC: 'https://www.w3.org/TR/accname/',
    },
  },
  coreMappingURLs: {
    classes: ['core-mapping'],
    statuses: {
      ED: 'https://w3c.github.io/core-aam/',
      WD: 'https://www.w3.org/TR/core-aam-1.2/',
      FPWD: 'https://www.w3.org/TR/core-aam-1.2/',
      REC: 'https://www.w3.org/TR/core-aam/',
    },
  },
  htmlMappingURLs: {
    classes: ['html-mapping'],
    statuses: {
      ED: 'https://w3c.github.io/html-aam/',
      WD: 'https://www.w3.org/TR/html-aam-1.0/',
      FPWD: 'https://www.w3.org/TR/html-aam-1.0/',
      REC: 'https://www.w3.org/TR/html-aam-1.0/',
    },
  },
};

// Must be initialized with a spec status, which determines which spec link to use.
// When in doubt, use ED (Editor's Draft).
const specLinks = ({ specStatus }) => {
  const baseUrls = Object.fromEntries(
    Object.entries(specData).map(([spec, { statuses }]) => [
      spec,
      statuses[specStatus],
    ])
  );

  // Returns a function which can be run over any link elements, and will correct the urls in the case the link is a spec link.
  const fixSpecLink = (a) => {
    const className = a.getAttribute('class');

    const specClasses = Object.entries(specData).find(([, { classes }]) =>
      classes.includes(className)
    );
    const spec = specClasses && specClasses[0];

    if (spec) {
      const currentHref = a.getAttribute('href');
      a.setAttribute('href', `${baseUrls[spec]}${currentHref}`);
    }
  };

  return fixSpecLink;
};

export { specLinks };
