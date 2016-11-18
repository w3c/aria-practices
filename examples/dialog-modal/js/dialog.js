(function() {
  var aria = aria || {};

  aria.KeyCode = {
    TAB : 9,
    DOWN : 40,
    ESCAPE : 27,
    LEFT : 37,
    RIGHT : 39,
    SPACE : 32,
    UP : 38
  };

  aria.Utils = aria.Utils || {};

  /*
   * When util functions move focus around, set this true so the focus listener
   * can ignore the events.
   */
  aria.Utils.IgnoreUtilFocusChanges = false;
  
  /**
   * @desc Set focus on descendant nodes until the first focusable element is
   *       found.
   * @param element
   *          DOM node for which to find the first focusable descendant.
   * @returns
   *  true if a focusable element is found and focus is set.         
   */
  aria.Utils.focusFirstDescendant = function(element) {
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (aria.Utils.focusFirst(child))
        return true;
    }
    return false;
  } // end focusFirstDescendant

  /**
   * @desc Set Attempt to set focus on the current node or any of its
   *       descendants until the first focusable element is found.
   * @param element
   *          Starting node. This is the first node that will be tested for
   *          focusability. If it is not focusable, descendants will be
   *          recursively tested.
   * @returns
   *  true if a focusable element is found and focus is set.         
   */
  aria.Utils.focusFirst = function(element) {
    aria.Utils.IgnoreUtilFocusChanges = true;
    try {
      element.focus();
    } catch (e) {
    }
    aria.Utils.IgnoreUtilFocusChanges = false;
    if (document.activeElement == element)
      return true;
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (aria.Utils.focusFirst(child))
        return true;
    }
    return false;
  } // end focusFirst
  
  /**
   * @desc Find the last descendant node that is focusable.
   * @param element
   *          DOM node for which to find the last focusable descendant.
   * @returns
   *  true if a focusable element is found and focus is set.          
   */
  aria.Utils.focusLastDescendant = function(element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
      var child = element.childNodes[i];
      if (aria.Utils.focusLast(child))
        return true;
    }
    return false;
  } // end focusLastDescendant
  
  /**
   * @desc Set Attempt to set focus on the current node or any of its
   *       descendants until the last focusable element is found.
   * @param element
   *          Starting node. This is the first node that will be tested for
   *          focusability. If it is not focusable, descendants will be
   *          recursively tested.
   * @returns
   *  true if a focusable element is found and focus is set.         
   */
  aria.Utils.focusLast = function(element) {
    aria.Utils.IgnoreUtilFocusChanges = true;
    try {
      element.focus();
    } catch (e) {
    }
    aria.Utils.IgnoreUtilFocusChanges = false;
    if (document.activeElement == element)
      return true;
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
      var child = element.childNodes[i];
      if (aria.Utils.focusLast(child))
        return true;
    }
    return false;
  } // end focusLast

  /* Modals can open modals. Keep track of them with this array. */
  aria.OpenDialogList = new Array(0);

  /**
   * @constructor
   * @desc Dialog object providing modal focus management.
   * 
   * Assumptions: The element serving as the dialog container is present in the
   * DOM and hidden. The dialog container has role="dialog".
   * 
   * @param dialogId
   *          The ID of the element serving as the dialog container.
   * @param focusAfterClosed
   *          Either the DOM node or the ID of the DOM node to focus when the
   *          dialog closes.
   * @param focusFirst
   *          Optional parameter containing either the DOM node or the ID of the
   *          DOM node to focus when the dialog opens. If not specified, the
   *          first focusable element in the dialog will receive focus.
   */
  aria.Dialog = function(dialogId, focusAfterClosed, focusFirst) {
    this.dialogNode = document.getElementById(dialogId);
    if (this.dialogNode == null
        || this.dialogNode.getAttribute("role") != "dialog") {
      throw new Error(
          "Dialog() requires a DOM element with ARIA role of dialog.");
    }
    if (typeof focusAfterClosed === 'string') {
      this.focusAfterClosed = document.getElementById(focusAfterClosed);
    } else if (typeof focusAfterClosed === 'object') {
      this.focusAfterClosed = focusAfterClosed;
    } else {
      throw new Error(
          "the focusAfterClosed parameter is required for the aria.Dialog constructor.");
    }
    if (typeof focusFirst === 'string') {
      this.focusFirst = document.getElementById(focusFirst);
    } else if (typeof focusFirst === 'object') {
      this.focusFirst = focusFirst;
    } else {
      this.focusFirst = null;
    }
    // Bracket the dialog node with two invisible, focusable nodes.
    // While this dialog is open, we use these to make sure that focus never
    // leaves the document even if dialogNode is the first or last node.
    var preDiv = document.createElement("div");
    this.preNode = this.dialogNode.parentNode.insertBefore(preDiv,
        this.dialogNode);
    this.preNode.tabIndex = 0;
    var postDiv = document.createElement("div");
    this.postNode = this.dialogNode.parentNode.insertBefore(postDiv,
        this.dialogNode.nextSibling);
    this.postNode.tabIndex = 0;
    // If this modal is opening on top of one that is already open,
    // get rid of the document focus listener of the open dialog.
    if (aria.OpenDialogList.length > 0) {
      aria.OpenDialogList[aria.OpenDialogList.length - 1].removeListeners();
    }
    this.addListeners();
    aria.OpenDialogList.push(this);
    this.dialogNode.className = "default_dialog"; // make visible
    if (this.focusFirst == null) {
      aria.Utils.focusFirstDescendant(this.dialogNode);
    } else {
      this.focusFirst.focus();
    }
    this.lastFocus = document.activeElement;
  } // end Dialog constructor

  /**
   * @desc
   *  Hides the current top dialog, 
   *  removes listeners of the top dialog, 
   *  restore listeners of a parent dialog if one was open under the one that just closed,
   *  and sets focus on the element specified for focusAfterClosed.
   */
  aria.Dialog.prototype.close = function() {
    aria.OpenDialogList.pop();
    this.removeListeners();
    this.preNode.remove();
    this.postNode.remove();
    this.dialogNode.className = "hidden";
    this.focusAfterClosed.focus();
    // If a dialog was open underneath this one, restore its listeners.
    if (aria.OpenDialogList.length > 0) {
      aria.OpenDialogList[aria.OpenDialogList.length - 1].addListeners();
    }
  } // end close

  /**
   * @desc
   *  Hides the current dialog and replaces it with another.
   *  
   * @param newDialogId
   *  ID of the dialog that will replace the currently open top dialog.
   * @param newFocusAfterClosed
   *  Optional ID or DOM node specifying where to place focus when the new dialog closes.
   *  If not specified, focus will be placed on the element specified by the dialog being replaced.
   * @param newFocusFirst
   *  Optional ID or DOM node specifying where to place focus in the new dialog when it opens.
   *  If not specified, the first focusable element will receive focus.
   */
  aria.Dialog.prototype.replace = function(newDialogId, newFocusAfterClosed,
      newFocusFirst) {
    aria.OpenDialogList.pop();
    this.removeListeners();
    this.preNode.remove();
    this.postNode.remove();
    this.dialogNode.className = "hidden";
    if (typeof newFocusAfterClosed !== 'undefined') {
      var dialog = new aria.Dialog(newDialogId, newFocusAfterClosed,
          newFocusFirst);
    } else {
      var dialog = new aria.Dialog(newDialogId, this.focusAfterClosed,
          newFocusFirst);
    }
  } // end replace

  aria.Dialog.prototype.addListeners = function() {
    this.dialogNode.addEventListener('keyup', this.keyupListener.bind(this),
        false);
    document.addEventListener('focus', this.trapFocus, true);
  } // end addListeners

  aria.Dialog.prototype.removeListeners = function() {
    this.dialogNode.removeEventListener('keyup', this.keyupListener.bind(this),
        false);
    document.removeEventListener('focus', this.trapFocus, true);
  } // end removeListeners

  aria.Dialog.prototype.keyupListener = function(event) {
    var key = event.which || event.keyCode;
    if (key === aria.KeyCode.ESCAPE) {
      if (aria.OpenDialogList.length > 0) {
        var topDialog = aria.OpenDialogList.slice(-1)[0];
        /*
         * The need to do the following test mystifies me. Even though the
         * propagation of the escape event is stopped, after the second time the
         * second dialog is created, the escape event will propagate to both
         * dialogs. To combat this strageness, I make sure the event target is
         * in the the dialog that was open when escape was released. Not sure
         * how robust this is across browsers.
         */
        if (topDialog.dialogNode.contains(event.target)) {
          topDialog.close();
        }
      } // end if at least one dialog is open
      event.stopPropagation();
    } // end if key was escape
  } // end keyupListener

  aria.Dialog.prototype.trapFocus = function(event) {
    if (aria.Utils.IgnoreUtilFocusChanges) {
      return;
    }
    var currentDialog = aria.OpenDialogList.slice(-1)[0];
    if (currentDialog.dialogNode.contains(event.target)) {
      currentDialog.lastFocus = event.target;
    } else {
      aria.Utils.focusFirstDescendant(currentDialog.dialogNode);
      if (currentDialog.lastFocus == document.activeElement) {
        aria.Utils.focusLastDescendant(currentDialog.dialogNode);
      }
      currentDialog.lastFocus = document.activeElement;
    }
  } // end trapFocus

  window.openDialog = function(dialogId, focusAfterClosed, focusFirst) {
    var dialog = new aria.Dialog(dialogId, focusAfterClosed);
  }

  window.closeDialog = function(closeButton) {
    var topDialog = aria.OpenDialogList.slice(-1)[0];
    if (topDialog.dialogNode.contains(closeButton)) {
      topDialog.close();
    }
  } // end closeDialog

  window.replaceDialog = function(newDialogId, newFocusAfterClosed,
      newFocusFirst) {
    var topDialog = aria.OpenDialogList.slice(-1)[0];
    if (topDialog.dialogNode.contains(document.activeElement)) {
      topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
    }
  } // end replaceDialog

})();