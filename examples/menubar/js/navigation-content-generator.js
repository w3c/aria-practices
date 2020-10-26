/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File: navigation-content-generator.js
 */

'use strict';

class NavigationContentGenerator {
  constructor(siteURL, siteName) {
    this.siteName = siteName;
    this.siteURL = siteURL;
    this.fillerTextSentences = [];

    this.fillerTextSentences.push(
      'The content on this page is associated with the <a href="$linkURL">$linkName</a> link for <a href="$siteURL">$siteName</a>.'
    );
    //  this.fillerTextSentences.push('The text content in this paragraph is filler text providing a detectable change of content when the <a href="$linkURL">$linkName</a> link is selected from the menu.  ');
    //  this.fillerTextSentences.push('<a href="$siteURL">$siteName</a> doesn\'t really exist, but the use of an organizational name is useful to provide context for the <a href="$linkURL">$linkName</a> link.  ');
    //  this.fillerTextSentences.push('Since $siteName doesn\'t exist there really is no real content associated with the <a href="$linkURL">$linkName</a> link.');
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
