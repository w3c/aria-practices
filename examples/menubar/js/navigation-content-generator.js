/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File: navigation-content-generator.js
 */

class NavigationContentGenerator {
  constructor(siteURL, siteName) {
    this.siteName = siteName;
    this.siteURL = siteURL;
    this.fillerTextSentences = [];

    this.fillerTextSentences.push(
      'The content on this page is associated with the <a href="$linkURL">$linkName</a> link for <a href="$siteURL">$siteName</a>.'
    );
  }

  generateParagraph(linkURL, linkName) {
    var content = '';
    this.fillerTextSentences.forEach(
      (s) =>
        (content += s
          .replace('$siteName', this.siteName)
          .replace('$siteURL', this.siteURL)
          .replace('$linkName', linkName)
          .replace('$linkURL', linkURL))
    );
    return content;
  }
}
