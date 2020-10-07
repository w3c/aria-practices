/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File: navigation-content-generator.js
*/

"use strict";

var NavigationContentGenerator = function (name) {

  this.name = name;
  this.fillerTextSentences = [];

  this.fillerTextSentences.push('The content on this page is associated with the $title link for $name.');
  this.fillerTextSentences.push('The text content in this paragraph is filler text providing a detectable change of content when the $title link is selected from the menu.  ');
  this.fillerTextSentences.push('$name doesn\'t really exist, but the use of an organizational name is useful to provide content for the $title link.  ');
  this.fillerTextSentences.push('Since $name doesn\'t exist there really is no real content associated with the $title link.');
};

NavigationContentGenerator.prototype.generateParagraph = function (title) {
  var content = '';
  this.fillerTextSentences.forEach(s => content += s.replace('$name', this.name).replace('$title', title));
  return content;
}

