/**
 * @namespace aria
 */
var aria = aria || {};

// anchorItem item to focus on with control + END
aria.Feed = function (feedNode, anchorItem) {
  this.feedNode = feedNode;
  this.anchorItem = anchorItem;
  this.feedItems = [];
  this.focusedIndex = null;
  this.setupEvents();
};

aria.Feed.prototype.getFeedNode = function () {
  return this.feedNode;
};

aria.Feed.prototype.addItem = function (item) {
  this.feedItems.push(item);
};

aria.Feed.prototype.setupEvents = function () {
  this.feedNode.addEventListener('click', this.handleArticleClicked.bind(this));
  this.feedNode.addEventListener('focus', this.handleArticleFocused.bind(this));
  this.feedNode.addEventListener('keydown', this.mapKeyShortcut.bind(this));
};

aria.Feed.prototype.handleArticleClicked = function (event) {
  var clickedArticle =
    aria.Utils.getAncestorBySelector(event.target, '[role="article"]');

  if (clickedArticle) {
    this.focusedIndex = clickedArticle.getAttribute('aria-posinset');
  }
};

aria.Feed.prototype.handleArticleFocused = function (event) {

  this.handleArticleClicked(event);
  console.log(event);
};

aria.Feed.prototype.focusItem = function (item) {
  if (!item || !item.focus) {
    return;
  }

  item.focus();
  this.focusedIndex = item.getAttribute('aria-posinset');
};

aria.Feed.prototype.mapKeyShortcut = function (event) {
  var key = event.which || event.keyCode;

  switch (key) {
    case aria.KeyCode.PAGE_UP:
      event.preventDefault();
      // Move up focus
      if (this.focusedIndex > 1) {
        // Need to increment by 2 because focusIndex is 1-indexed
        this.focusItem(this.feedItems[this.focusedIndex - 2]);
      }
      break;
    case aria.KeyCode.PAGE_DOWN:
      event.preventDefault();
      // Move down focus
      if (this.feedItems.length >= this.focusedIndex) {
        // Do not need to increment focusIndex because it is 1-indexed
        this.focusItem(this.feedItems[this.focusedIndex]);
      }
      break;
    case aria.KeyCode.HOME:
      if (event.ctrlKey && this.feedItems.length > 0) {
        event.preventDefault();
        this.focusItem(this.feedItems[0]);
      }
      break;
    case aria.KeyCode.END:
      if (event.ctrlKey) {
        event.preventDefault();
        this.anchorItem.focus();
      }
      break;
  }

};
