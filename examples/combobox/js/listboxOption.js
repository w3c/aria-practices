/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
var Option = function (domNode, listboxObj) {

  this.domNode = domNode;
  this.listbox = listboxObj;
  this.textContent    = domNode.textContent;
  this.textComparison = domNode.textContent.toLowerCase();

};

Option.prototype.init = function () {

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'option');
  }

  this.domNode.addEventListener('click',      this.handleClick.bind(this));
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this));

};

/* EVENT HANDLERS */

Option.prototype.handleClick = function (event) {
  this.listbox.setOption(this);
  this.listbox.close(true);
};

Option.prototype.handleMouseover = function (event) {
  this.listbox.hasHover = true;
  this.listbox.open();

};

Option.prototype.handleMouseout = function (event) {
  this.listbox.hasHover = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);
};
