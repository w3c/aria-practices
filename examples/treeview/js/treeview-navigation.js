/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File: treeview-navigation.js
 *   Desc: Tree item object for representing the state and user interactions for a
 *       tree widget for navigational links
 */

'use strict';

class TreeViewNavigation {
  constructor(node) {
    var linkURL, linkTitle;

    // Check whether node is a DOM element
    if (typeof node !== 'object') {
      return;
    }

    document.body.addEventListener(
      'focusin',
      this.handleBodyFocusin.bind(this)
    );

    this.treeNode = node;
    this.navNode = node.parentElement;

    this.treeitems = this.treeNode.querySelectorAll('[role="treeitem"]');
    for (let i = 0; i < this.treeitems.length; i++) {
      let ti = this.treeitems[i];
      ti.addEventListener('keydown', this.handleKeydown.bind(this));
      ti.addEventListener('click', this.handleLinkClick.bind(this));
      // first tree item is in tab sequence of page
      if (i == 0) {
        ti.tabIndex = 0;
      } else {
        ti.tabIndex = -1;
      }
      var groupNode = this.getGroupNode(ti);
      if (groupNode) {
        var span = ti.querySelector('span');
        span.addEventListener('click', this.handleSpanClick.bind(this));
      }
    }

    // Initial content for page
    if (location.href.split('#').length > 1) {
      linkURL = location.href;
      linkTitle = getLinkNameFromURL(location.href);
    } else {
      linkURL = location.href + '#home';
      linkTitle = 'Home';
    }

    this.contentGenerator = new NavigationContentGenerator(
      '#home',
      'Mythical University'
    );
    this.updateContent(linkURL, linkTitle, false);

    function getLinkNameFromURL(url) {
      function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      var name = url.split('#')[1];
      if (typeof name === 'string') {
        name = name.split('-').map(capitalize).join(' ');
      } else {
        name = 'Home';
      }
      return name;
    }
  }

  updateContent(linkURL, linkName, moveFocus) {
    var h1Node, paraNodes;

    if (typeof moveFocus !== 'boolean') {
      moveFocus = true;
    }

    // Update content area
    h1Node = document.querySelector('#ex1 .page h1');
    if (h1Node) {
      h1Node.textContent = linkName;
    }
    paraNodes = document.querySelectorAll('#ex1 .page p');
    paraNodes.forEach(
      (p) =>
        (p.innerHTML = this.contentGenerator.generateParagraph(
          linkURL,
          linkName
        ))
    );

    // move focus to the content region
    if (moveFocus && h1Node) {
      h1Node.tabIndex = -1;
      h1Node.focus();
    }

    // Update aria-current
    this.updateAriaCurrent(linkURL);
    document.location.href = linkURL;
  }

  updateAriaCurrent(url) {
    this.treeitems.forEach((item) => {
      if (item.href === url) {
        item.setAttribute('aria-current', 'page');
        // Make sure link is visible
        this.showTreeitem(item);
        this.setTabIndex(item);
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  showTreeitem(treeitem) {
    var parentNode = this.getParentTreeitem(treeitem);

    while (parentNode) {
      parentNode.setAttribute('aria-expanded', 'true');
      parentNode = this.getParentTreeitem(parentNode);
    }
  }

  setTabIndex(treeitem) {
    this.treeitems.forEach((item) => (item.tabIndex = -1));
    treeitem.tabIndex = 0;
  }

  getParentTreeitem(treeitem) {
    var node = treeitem.parentNode;

    if (node) {
      node = node.parentNode;
      if (node) {
        node = node.previousElementSibling;
        if (node && node.getAttribute('role') === 'treeitem') {
          return node;
        }
      }
    }
    return false;
  }

  isVisible(treeitem) {
    var flag = true;
    if (this.isInSubtree(treeitem)) {
      treeitem = this.getParentTreeitem(treeitem);
      if (!treeitem || treeitem.getAttribute('aria-expanded') === 'false') {
        return false;
      }
    }
    return flag;
  }

  isInSubtree(treeitem) {
    if (treeitem.parentNode && treeitem.parentNode.parentNode) {
      return treeitem.parentNode.parentNode.getAttribute('role') === 'group';
    }
    return false;
  }

  isExpandable(treeitem) {
    return treeitem.hasAttribute('aria-expanded');
  }

  isExpanded(treeitem) {
    return treeitem.getAttribute('aria-expanded') === 'true';
  }

  getGroupNode(treeitem) {
    var groupNode = false;
    var id = treeitem.getAttribute('aria-owns');
    if (id) {
      groupNode = document.getElementById(id);
    }
    return groupNode;
  }

  getVisibleTreeitems() {
    var items = [];
    for (var i = 0; i < this.treeitems.length; i++) {
      var ti = this.treeitems[i];
      if (this.isVisible(ti)) {
        items.push(ti);
      }
    }
    return items;
  }

  collapseTreeitem(treeitem) {
    if (treeitem.getAttribute('aria-owns')) {
      var groupNode = document.getElementById(
        treeitem.getAttribute('aria-owns')
      );
      if (groupNode) {
        treeitem.setAttribute('aria-expanded', 'false');
      }
    }
  }

  expandTreeitem(treeitem) {
    if (treeitem.getAttribute('aria-owns')) {
      var groupNode = document.getElementById(
        treeitem.getAttribute('aria-owns')
      );
      if (groupNode) {
        treeitem.setAttribute('aria-expanded', 'true');
      }
    }
  }

  expandAllSiblingTreeitems(treeitem) {
    var parentNode = treeitem.parentNode.parentNode;

    if (parentNode) {
      var siblingTreeitemNodes = parentNode.querySelectorAll(
        ':scope > li > a[aria-expanded]'
      );

      for (var i = 0; i < siblingTreeitemNodes.length; i++) {
        siblingTreeitemNodes[i].setAttribute('aria-expanded', 'true');
      }
    }
  }

  setFocusToTreeitem(treeitem) {
    treeitem.focus();
  }

  setFocusToNextTreeitem(treeitem) {
    var visibleTreeitems = this.getVisibleTreeitems();
    var nextItem = false;

    for (var i = visibleTreeitems.length - 1; i >= 0; i--) {
      var ti = visibleTreeitems[i];
      if (ti === treeitem) {
        break;
      }
      nextItem = ti;
    }
    if (nextItem) {
      this.setFocusToTreeitem(nextItem);
    }
  }

  setFocusToPreviousTreeitem(treeitem) {
    var visibleTreeitems = this.getVisibleTreeitems();
    var prevItem = false;

    for (var i = 0; i < visibleTreeitems.length; i++) {
      var ti = visibleTreeitems[i];
      if (ti === treeitem) {
        break;
      }
      prevItem = ti;
    }

    if (prevItem) {
      this.setFocusToTreeitem(prevItem);
    }
  }

  setFocusToParentTreeitem(treeitem) {
    if (this.isInSubtree(treeitem)) {
      var ti = treeitem.parentNode.parentNode.previousElementSibling;
      this.setFocusToTreeitem(ti);
    }
  }

  setFocusByFirstCharacter(treeitem, char) {
    var start,
      i,
      ti,
      index = -1;
    var visibleTreeitems = this.getVisibleTreeitems();
    char = char.toLowerCase();

    // Get start index for search based on position of treeitem
    start = visibleTreeitems.indexOf(treeitem) + 1;
    if (start >= visibleTreeitems.length) {
      start = 0;
    }

    // Check remaining items in the tree
    for (i = start; i < visibleTreeitems.length; i++) {
      ti = visibleTreeitems[i];
      if (char === ti.textContent.trim()[0].toLowerCase()) {
        index = i;
        break;
      }
    }

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      for (i = 0; i < start; i++) {
        ti = visibleTreeitems[i];
        if (char === ti.textContent.trim()[0].toLowerCase()) {
          index = i;
          break;
        }
      }
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToTreeitem(visibleTreeitems[index]);
    }
  }

  // Event handlers

  handleBodyFocusin(event) {
    var tgt = event.target;
    console.log('[handleBodyFocusin]: ' + this.treeNode.contains(tgt));

    if (this.treeNode.contains(tgt)) {
      this.navNode.classList.add('focus');
    } else {
      this.navNode.classList.remove('focus');
      this.updateAriaCurrent(document.location.href);
    }
  }

  handleSpanClick(event) {
    var tgt = event.currentTarget;

    if (this.isExpanded(tgt.parentNode)) {
      this.collapseTreeitem(tgt.parentNode);
    } else {
      this.expandTreeitem(tgt.parentNode);
    }

    event.preventDefault();
    event.stopPropagation();
  }

  handleLinkClick(event) {
    var tgt = event.currentTarget;
    this.updateContent(tgt.href, tgt.textContent.trim());

    event.preventDefault();
    event.stopPropagation();
  }

  handleKeydown(event) {
    var tgt = event.currentTarget,
      flag = false,
      key = event.key;

    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }

    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.shift) {
      if (
        event.keyCode == this.keyCode.SPACE ||
        event.keyCode == this.keyCode.RETURN
      ) {
        event.stopPropagation();
      } else {
        if (isPrintableCharacter(key)) {
          if (key == '*') {
            this.expandAllSiblingTreeitems(tgt);
            flag = true;
          } else {
            this.setFocusByFirstCharacter(tgt, key);
          }
        }
      }
    } else {
      switch (key) {
        // NOTE: Return key is supported through the click event
        case ' ':
          this.updateContent(tgt.href, tgt.textContent.trim());
          flag = true;
          break;

        case 'Up':
        case 'ArrowUp':
          this.setFocusToPreviousTreeitem(tgt);
          flag = true;
          break;

        case 'Down':
        case 'ArrowDown':
          this.setFocusToNextTreeitem(tgt);
          flag = true;
          break;

        case 'Right':
        case 'ArrowRight':
          if (this.isExpandable(tgt)) {
            if (this.isExpanded(tgt)) {
              this.setFocusToNextTreeitem(tgt);
            } else {
              this.expandTreeitem(tgt);
            }
          }
          flag = true;
          break;

        case 'Left':
        case 'ArrowLeft':
          if (this.isExpandable(tgt) && this.isExpanded(tgt)) {
            this.collapseTreeitem(tgt);
            flag = true;
          } else {
            if (this.isInSubtree(tgt)) {
              this.setFocusToParentTreeitem(tgt);
              flag = true;
            }
          }
          break;

        case 'Home':
          this.setFocusToTreeitem(this.treeitems[0]);
          flag = true;
          break;

        case 'End':
          var visibleTreeitems = this.getVisibleTreeitems();
          this.setFocusToTreeitem(
            visibleTreeitems[visibleTreeitems.length - 1]
          );
          flag = true;
          break;

        default:
          if (isPrintableCharacter(key)) {
            if (key == '*') {
              this.expandAllSiblingTreeitems(tgt);
              flag = true;
            } else {
              this.setFocusByFirstCharacter(tgt, key);
            }
          }
          break;
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initialize all treeitems based on the role=treeitem
 */

window.addEventListener('load', function () {
  var trees = document.querySelectorAll('nav [role="tree"]');

  for (let i = 0; i < trees.length; i++) {
    new TreeViewNavigation(trees[i]);
  }
});
