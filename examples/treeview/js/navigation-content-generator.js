/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File: navigation-content-generator.js
*/



var NavigationContentGenerator = function () {

  this.titleSentence = 'The content on this page is associated with the $title link for Mytihical University.';
  this.dummySentences = [];

  this.dummySentences.push('The text content in this paragraph is just dummy content to provided a visual change when the $title link is selected from the menu.  ');
  this.dummySentences.push('Mythical University doesn\'t really exist, but the use of an organizational name is useful to provide content for the $title link.  ');
};

NavigationContentGenerator.prototype.generate = function (title) {
  var content = this.titleSentence.replace('$title', title);
  this.dummySentences.forEach(s => content += s.replace('$title', title));
  return content;
}

