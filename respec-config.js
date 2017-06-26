var respecConfig = {
  // Embed RDFa data in the output.
  doRDFa: '1.1',
  includePermalinks: true,
  permalinkEdge: true,
  permalinkHide: false,
  // Specification status (e.g., WD, LC, NOTE, etc.). If in doubt use ED.
  specStatus: 'ED',
  // crEnd: "2012-04-30",
  // perEnd: "2013-07-23",
  // publishDate: "2013-08-22",
  noRecTrack: true,
  diffTool: 'http://www.aptest.com/standards/htmldiff/htmldiff.pl',

  // The specifications short name, as in http://www.w3.org/TR/short-name/
  shortName: 'wai-aria-practices-1.1',

  // If you wish the publication date to be other than today,
  // set publishDate.
  // publishDate: "2009-08-06",
  copyrightStart: '2015',

  // If there is a previously published draft, uncomment this
  // and set its YYYY-MM-DD date and its maturity status.
  //
  // previousPublishDate:  "",
  // previousMaturity:  "",
  // prevRecURI: "",
  // previousDiffURI: "",

  // If there a publicly available Editors Draft, this is the link
  edDraftURI: 'https://w3c.github.io/aria-practices/',

  // If this is a LCWD, uncomment and set the end of its review period
  // lcEnd: "2012-02-21",

  // Editors, add as many as you like.
  // “name” is the only required field.
  editors: [{
    name: 'Matt King',
    mailto: 'mck@fb.com',
    company: 'Facebook',
    companyURI: 'http://www.facebook.com/',
    w3cid: 44582
  }, {
    name: 'James Nurthen',
    mailto: 'james.nurthen@oracle.com',
    company: 'Oracle Corporation',
    companyURI: 'http://www.oracle.com/',
    w3cid: 37155
  }, {
    name: 'Michiel Bijl',
    company: 'Invited Expert',
    w3cid: 74040
  }, {
    name: 'Michael Cooper',
    url: 'https://www.w3.org/People/cooper/',
    mailto: 'cooper@w3.org',
    company: 'W3C',
    companyURI: 'https://www.w3.org/',
    w3cid: 34017
  }, {
    name: 'Joseph Scheuhammer',
    company: 'Inclusive Design Research Centre, OCAD University',
    companyURI: 'http://idrc.ocad.ca/',
    note: 'Previous Editor',
    w3cid: 42279
  }, {
    name: 'Lisa Pappas',
    company: 'SAS',
    companyURI: 'http://www.sas.com/',
    note: 'Previous Editor',
    w3cid: 41725
  }, {
    name: 'Rich Schwerdtfeger',
    company: 'IBM Corporation',
    companyURI: 'http://ibm.com/',
    note: 'Previous Editor',
    w3cid: 2460
  }],

  // Authors, add as many as you like.
  // This is optional, uncomment if you have authors as well as editors.
  // Same format and requirements as editors.

  // authors: [
  //   {
  //     name: "Your Name",
  //     url: "http://example.org/",
  //     company: "Your Company",
  //     companyURI: "http://example.com/"
  //   },
  // ],

  // Spec URLs
  ariaSpecURLs: {
    'ED': 'https://w3c.github.io/aria/aria/aria.html',
    'FPWD': 'https://www.w3.org/TR/wai-aria-1.1/',
    'WD': 'https://www.w3.org/TR/wai-aria-1.1/',
    'REC': 'https://www.w3.org/TR/wai-aria/'
  },
  accNameURLs: {
    'ED': 'https://w3c.github.io/aria/accname-aam/accname-aam.html',
    'WD': 'https://www.w3.org/TR/accname-aam-1.1/',
    'FPWD': 'https://www.w3.org/TR/accname-aam-1.1/',
    'REC': 'https://www.w3.org/TR/accname-aam-1.1/'
  },
  coreMappingURLs: {
    'ED': 'https://w3c.github.io/aria/core-aam/core-aam.html',
    'WD': 'https://www.w3.org/TR/core-aam-1.1/',
    'FPWD': 'https://www.w3.org/TR/core-aam-1.1/',
    'REC': 'https://www.w3.org/TR/core-aam-1.1/'
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

  // errata: 'http://www.w3.org/2010/02/rdfa/errata.html',

  // name of the WG
  wg: 'Accessible Rich Internet Applications Working Group',

  // URI of the public WG page
  wgURI: 'https://www.w3.org/WAI/ARIA/',

  // Name (without the @w3c.org) of the public mailing
  // to which comments are due.
  wgPublicList: 'public-aria',

  // URI of the patent status for this WG, for Rec-track documents
  // !!!! IMPORTANT !!!!
  // This is important for Rec-track documents, do not copy a patent URI
  // from a random document unless you know what you're doing.
  // If in doubt ask your friendly neighbourhood Team Contact.
  wgPatentURI: 'https://www.w3.org/2004/01/pp-impl/83726/status',
  maxTocLevel: 4,

  localBiblio: biblio,

  preProcess: [linkCrossReferences]
};
