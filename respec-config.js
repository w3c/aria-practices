'use strict';
// eslint-disable-next-line no-unused-vars
var respecConfig = {
  // Specification status (e.g., WD, LC, NOTE, etc.). If in doubt use ED.
  specStatus: 'ED',
  // crEnd: "2012-04-30",
  // perEnd: "2013-07-23",
  // publishDate: "2013-08-22",
  noRecTrack: true,

  // The specifications short name, as in https://www.w3.org/TR/short-name/
  shortName: 'wai-aria-practices-1.2',

  // If you wish the publication date to be other than today,
  // set publishDate.
  // publishDate: "2009-08-06",
  copyrightStart: '2018',

  // If there is a previously published draft, uncomment this
  // and set its YYYY-MM-DD date and its maturity status.
  //
  // previousPublishDate:  "",
  // previousMaturity:  "",
  // prevRecURI: "",
  // previousDiffURI: "",

  // Github repo
  github: 'w3c/aria-practices',

  // If this is a LCWD, uncomment and set the end of its review period
  // lcEnd: "2012-02-21",

  // Editors, add as many as you like.
  // “name” is the only required field.
  editors: [
    {
      name: 'Matt King',
      mailto: 'mck@fb.com',
      company: 'Facebook',
      companyURI: 'https://www.facebook.com/',
      w3cid: 44582,
    },
    {
      name: 'JaEun Jemma Ku',
      mailto: 'jku@uic.edu',
      company: 'University of Illinois',
      companyURI: 'https://illinois.edu/',
      w3cid: 74097,
    },
    {
      name: 'James Nurthen',
      mailto: 'nurthen@adobe.com',
      company: 'Adobe',
      companyURI: 'https://www.adobe.com/',
      w3cid: 37155,
    },
    {
      name: 'Zoë Bijl',
      company: 'Invited Expert',
      w3cid: 74040,
    },
    {
      name: 'Michael Cooper',
      url: 'https://www.w3.org/People/cooper/',
      company: 'W3C',
      companyURI: 'https://www.w3.org/',
      w3cid: 34017,
    },
  ],
  formerEditors: [
    {
      name: 'Joseph Scheuhammer',
      company: 'Inclusive Design Research Centre, OCAD University',
      companyURI: 'https://idrc.ocad.ca/',
      w3cid: 42279,
      retiredDate: '2014-10-01',
    },
    {
      name: 'Lisa Pappas',
      company: 'SAS',
      companyURI: 'https://www.sas.com/',
      w3cid: 41725,
      retiredDate: '2009-10-01',
    },
    {
      name: 'Rich Schwerdtfeger',
      company: 'IBM Corporation',
      companyURI: 'https://ibm.com/',
      w3cid: 2460,
      retiredDate: '2014-10-01',
    },
  ],

  // Authors, add as many as you like.
  // This is optional, uncomment if you have authors as well as editors.
  // Same format and requirements as editors.

  // authors: [
  //   {
  //     name: "Your Name",
  //     url: "https://example.org/",
  //     company: "Your Company",
  //     companyURI: "https://example.com/"
  //   },
  // ],

  // Spec URLs
  ariaSpecURLs: {
    ED: 'https://w3c.github.io/aria/',
    FPWD: 'https://www.w3.org/TR/wai-aria-1.2/',
    WD: 'https://www.w3.org/TR/wai-aria-1.2/',
    REC: 'https://www.w3.org/TR/wai-aria/',
  },
  accNameURLs: {
    ED: 'https://w3c.github.io/accname/',
    WD: 'https://www.w3.org/TR/accname-1.2/',
    FPWD: 'https://www.w3.org/TR/accname-1.2/',
    REC: 'https://www.w3.org/TR/accname/',
  },
  coreMappingURLs: {
    ED: 'https://w3c.github.io/core-aam/',
    WD: 'https://www.w3.org/TR/core-aam-1.2/',
    FPWD: 'https://www.w3.org/TR/core-aam-1.2/',
    REC: 'https://www.w3.org/TR/core-aam/',
  },
  htmlMappingURLs: {
    ED: 'https://w3c.github.io/html-aam/',
    WD: 'https://www.w3.org/TR/html-aam-1.0/',
    FPWD: 'https://www.w3.org/TR/html-aam-1.0/',
    REC: 'https://www.w3.org/TR/html-aam-1.0/',
  },

  // alternateFormats: [
  //   {
  //     uri: 'aria-practices-diff.html',
  //     label: "Diff from Previous Recommendation"
  //   },
  //   {
  //     uri: 'aria-practices.ps',
  //     label: "PostScript version"
  //   },
  //   {
  //     uri: 'aria-practices.pdf',
  //     label: "PDF version"
  //   }
  // ],

  // errata: 'https://www.w3.org/2010/02/rdfa/errata.html',
  group: 'aria',

  // Name (without the @w3c.org) of the public mailing
  // to which comments are due.
  wgPublicList: 'public-aria-practices',

  maxTocLevel: 4,
  // eslint-disable-next-line no-undef
  preProcess: [linkCrossReferences],
};
