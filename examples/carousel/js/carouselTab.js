/*
*   File:   CarouselTab.js
*
*   Desc:   Carousel Tab widget that implements ARIA Authoring Practices
*
*   Author(s): Jon Gunderson, Nicholas Hoyt, and Mark McCarthy
*/

/*
*   @constructor CarouselTab
*
*
*/
var CarouselTab = function (domNode, groupObj) {

  this.domNode = domNode;
  this.tablist = groupObj;

  this.tabpanelDomNode = null;

  this.keyCode = Object.freeze({
    'RETURN'   : 13,
    'SPACE'    : 32,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

CarouselTab.prototype.init = function () {
  this.domNode.tabIndex = -1;
  this.domNode.setAttribute('aria-selected', 'false');
  this.tabpanelDomNode = document.getElementById(this.domNode.getAttribute('aria-controls'));

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this));
  this.domNode.addEventListener('click',      this.handleClick.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

};

CarouselTab.prototype.hideTabPanel = function(){
  this.tabpanelDomNode.classList.remove('active');
  this.domNode.classList.remove('focus');
}
CarouselTab.prototype.showTabPanel = function(){
  this.tabpanelDomNode.classList.add('active');
  this.domNode.classList.add('focus');
}

/* EVENT HANDLERS */

CarouselTab.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false,
 clickEvent;

console.log(event.keyCode);
  switch (event.keyCode) {

    case this.keyCode.UP:
      this.tablist.setSelectedToPreviousItem(this, true);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.tablist.setSelectedToNextItem(this, true);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.tablist.setSelectedToPreviousItem(this, true);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.tablist.setSelectedToNextItem(this, true);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

CarouselTab.prototype.handleClick = function (event) {
  this.tablist.setSelected(this);
  console.log("pause status is " + this.tablist.rotate)
};

CarouselTab.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.tablist.hasFocus = true;
  this.tablist.stopRotation();
};

CarouselTab.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
    this.tablist.startRotation();
  };
