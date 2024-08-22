/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   tabs-actions.js
 *
 *   Desc:   Tablist widget that implements ARIA Authoring Practices
 */

'use strict';

class TabsManual {
  constructor(groupNode) {
    this.tablistNode = groupNode;

    this.tabs = [];

    this.firstTab = null;
    this.lastTab = null;

    this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
    this.tabpanels = [];

    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      var tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

      tab.tabIndex = -1;
      tab.setAttribute('aria-selected', 'false');
      this.tabpanels.push(tabpanel);

      tab.addEventListener('keydown', this.onKeydown.bind(this));
      tab.addEventListener('click', this.onClick.bind(this));
      tab.addEventListener('focusout', this.onFocusout.bind(this));

      this.getTabAriaActions(tab).forEach((action) => {
        action.addEventListener('keydown', this.onKeydown.bind(this));
        action.addEventListener('focusout', this.onFocusout.bind(this));

        this.getTabAriaActionOperations(action).forEach((operation) => {
          operation.addEventListener(
            'click',
            this.performTabOperation.bind(this)
          );
          operation.addEventListener(
            'keydown',
            this.performTabOperation.bind(this)
          );
        });
      });

      if (!this.firstTab) {
        this.firstTab = tab;
      }
      this.lastTab = tab;
    }

    this.setSelectedTab(this.firstTab);
  }

  getTabAriaActions(tab) {
    var actions = tab.getAttribute('aria-actions');
    if (actions) {
      return actions.split(' ').map((id) => document.getElementById(id));
    } else {
      return [];
    }
  }

  getTabAriaActionOperations(action) {
    const operationCode = action.getAttribute('data-operation');
    const idrefControls = action.getAttribute('aria-controls');
    let operations = [];
    if (operationCode) {
      operations.push(action);
    }
    if (idrefControls) {
      const context = document.getElementById(idrefControls);
      const nodes = Array.from(context.querySelectorAll('[data-operation]'));
      operations = operations.concat(nodes);
    }
    return operations;
  }

  getTabAssociatedWithAction(action) {
    return document.querySelector(`[aria-actions~="${action.id}"]`);
  }

  getClosestTabWrapper(el) {
    return el.closest('[role="presentation"]');
  }

  getActionAssociatedWithOperation(operation) {
    const idrefAction = operation.getAttribute('data-action');
    if (idrefAction) {
      return document.getElementById(idrefAction);
    } else {
      return operation;
    }
  }

  makeTabeAndActionsFocusable(tab) {
    tab.removeAttribute('tabindex');
    this.getTabAriaActions(tab).forEach((action) => {
      action.removeAttribute('tabindex');
    });
  }

  makeTabAndActionsUnfocusable(tab) {
    if (tab.getAttribute('aria-selected') !== 'true') {
      tab.tabIndex = -1;
      this.getTabAriaActions(tab).forEach((action) => {
        action.tabIndex = -1;
      });
    }
  }

  setSelectedTab(currentTab) {
    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      if (currentTab === tab) {
        tab.setAttribute('aria-selected', 'true');
        this.makeTabeAndActionsFocusable(tab);
        this.tabpanels[i].classList.remove('is-hidden');
      } else {
        tab.setAttribute('aria-selected', 'false');
        this.makeTabAndActionsUnfocusable(tab);
        this.tabpanels[i].classList.add('is-hidden');
      }
    }
  }

  moveFocusToTab(currentTab) {
    currentTab.focus();
    this.tabs.forEach((tab) => {
      if (currentTab === tab) {
        this.makeTabeAndActionsFocusable(tab);
      } else if (tab.getAttribute('aria-selected') !== 'true') {
        this.makeTabAndActionsUnfocusable(tab);
      }
    });
  }

  moveFocusToPreviousTab(currentTab) {
    var index;

    if (currentTab === this.firstTab) {
      this.moveFocusToTab(this.lastTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.moveFocusToTab(this.tabs[index - 1]);
    }
  }

  moveFocusToNextTab(currentTab) {
    var index;

    if (currentTab === this.lastTab) {
      this.moveFocusToTab(this.firstTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.moveFocusToTab(this.tabs[index + 1]);
    }
  }

  /* EVENT HANDLERS */

  onKeydown(event) {
    var tgt = event.currentTarget,
      flag = false;

    if (tgt.getAttribute('role') !== 'tab') {
      tgt = this.getTabAssociatedWithAction(tgt);
    }

    switch (event.key) {
      case 'ArrowLeft':
        this.moveFocusToPreviousTab(tgt);
        flag = true;
        break;

      case 'ArrowRight':
        this.moveFocusToNextTab(tgt);
        flag = true;
        break;

      case 'Home':
        this.moveFocusToTab(this.firstTab);
        flag = true;
        break;

      case 'End':
        this.moveFocusToTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  // Since this example uses buttons for the tabs, the click onr also is activated
  // with the space and enter keys
  onClick(event) {
    this.setSelectedTab(event.currentTarget);
  }

  performTabOperation(event) {
    if (event.type === 'keydown' && event.code !== 'Enter') {
      return;
    }

    const operation = event.currentTarget;
    const operationCode = operation.getAttribute('data-operation');
    const action = this.getActionAssociatedWithOperation(operation);
    const tab = this.getTabAssociatedWithAction(action);
    const tabPanel = document.getElementById(tab.getAttribute('aria-controls'));

    switch (operationCode) {
      case 'clipboard-copy': {
        const tabText = tabPanel.textContent.replace(/\s+/g, ' ').trim();
        navigator.clipboard.writeText(tabText).then(
          () => {
            this.presentFeedback(
              operation,
              `Copied ${tab.textContent} tab contents to clipboard`
            );
          },
          (err) => {
            this.presentFeedback(
              operation,
              `Failed to copy ${tab.textContent} tab contents to clipboard`,
              err
            );
          }
        );
        break;
      }
      default: {
        this.presentFeedback(
          operation,
          `<em>Sorry, haven’t implemented the ${operationCode} operation yet</em>`,
          'error'
        );
      }
    }
  }

  presentFeedback(operation, msg, err) {
    const output = operation.closest('.tabs').querySelector('output');
    if (output) {
      output.innerHTML = `<span class="${err ? 'error' : 'success'}">${msg}</span>`;
    }
  }

  onFocusout(event) {
    const tabWrapperOld = this.getClosestTabWrapper(event.currentTarget);
    const tabWrapperNew = this.getClosestTabWrapper(event.relatedTarget);
    if (tabWrapperOld !== tabWrapperNew) {
      const tab = tabWrapperOld.querySelector('[role="tab"]');
      this.makeTabAndActionsUnfocusable(tab);
    }
  }
}

// Initialize tablist

window.addEventListener('load', function () {
  var tablists = document.querySelectorAll('[role=tablist].manual');
  for (var i = 0; i < tablists.length; i++) {
    new TabsManual(tablists[i]);
  }
});
