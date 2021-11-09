/* global closeDialog, openDialog */

'use strict';

var aria = aria || {};

aria.Utils = aria.Utils || {};

aria.Utils.disableCtrl = function (ctrl) {
  ctrl.setAttribute('aria-disabled', 'true');
};

aria.Utils.enableCtrl = function (ctrl) {
  ctrl.removeAttribute('aria-disabled');
};

aria.Utils.setLoading = function (saveBtn, saveStatusView) {
  saveBtn.classList.add('loading');
  this.disableCtrl(saveBtn);

  // use a timeout for the loading message
  // if the saved state happens very quickly,
  // we don't need to explicitly announce the intermediate loading state
  const loadingTimeout = window.setTimeout(() => {
    saveStatusView.textContent = 'Loading';
  }, 200);

  // set timeout for saved state, to mimic loading
  const fakeLoadingTimeout = Math.random() * 2000;
  window.setTimeout(() => {
    saveBtn.classList.remove('loading');
    saveBtn.classList.add('saved');

    window.clearTimeout(loadingTimeout);
    saveStatusView.textContent = 'Saved successfully';
  }, fakeLoadingTimeout);
};

aria.Notes = function Notes(
  notesId,
  saveId,
  saveStatusId,
  discardId,
  localStorageKey
) {
  this.notesInput = document.getElementById(notesId);
  this.saveBtn = document.getElementById(saveId);
  this.saveStatusView = document.getElementById(saveStatusId);
  this.discardBtn = document.getElementById(discardId);
  this.localStorageKey = localStorageKey || 'alertdialog-notes';
  this.initialized = false;

  Object.defineProperty(this, 'controls', {
    get: function () {
      return document.querySelectorAll(
        '[data-textbox=' + this.notesInput.id + ']'
      );
    },
  });
  Object.defineProperty(this, 'hasContent', {
    get: function () {
      return this.notesInput.value.length > 0;
    },
  });
  Object.defineProperty(this, 'savedValue', {
    get: function () {
      return JSON.parse(localStorage.getItem(this.localStorageKey));
    },
    set: function (val) {
      this.save(val);
    },
  });
  Object.defineProperty(this, 'isCurrent', {
    get: function () {
      return this.notesInput.value === this.savedValue;
    },
  });
  Object.defineProperty(this, 'oninput', {
    get: function () {
      return this.notesInput.oninput;
    },
    set: function (fn) {
      if (typeof fn !== 'function') {
        throw new TypeError('oninput must be a function');
      }
      this.notesInput.addEventListener('input', fn);
    },
  });

  if (this.saveBtn && this.discardBtn) {
    this.init();
  }
};

aria.Notes.prototype.save = function (val) {
  const isDisabled = this.saveBtn.getAttribute('aria-disabled') === 'true';
  if (isDisabled) {
    return;
  }
  localStorage.setItem(
    this.localStorageKey,
    JSON.stringify(val || this.notesInput.value)
  );
  aria.Utils.disableCtrl(this.saveBtn);
  aria.Utils.setLoading(this.saveBtn, this.saveStatusView);
};

aria.Notes.prototype.loadSaved = function () {
  if (this.savedValue) {
    this.notesInput.value = this.savedValue;
  }
};

aria.Notes.prototype.restoreSaveBtn = function () {
  this.saveBtn.classList.remove('loading');
  this.saveBtn.classList.remove('saved');
  this.saveBtn.removeAttribute('aria-disabled');

  this.saveStatusView.textContent = '';
};

aria.Notes.prototype.discard = function () {
  localStorage.clear();
  this.notesInput.value = '';
  this.toggleControls();
  this.restoreSaveBtn();
};

aria.Notes.prototype.disableControls = function () {
  this.controls.forEach(aria.Utils.disableCtrl);
};

aria.Notes.prototype.enableControls = function () {
  this.controls.forEach(aria.Utils.enableCtrl);
};

aria.Notes.prototype.toggleControls = function () {
  if (this.hasContent) {
    this.enableControls();
  } else {
    this.disableControls();
  }
};

aria.Notes.prototype.toggleCurrent = function () {
  if (!this.isCurrent) {
    this.notesInput.classList.remove('can-save');
    aria.Utils.enableCtrl(this.saveBtn);
    this.restoreSaveBtn();
  } else {
    this.notesInput.classList.add('can-save');
    aria.Utils.disableCtrl(this.saveBtn);
  }
};

aria.Notes.prototype.keydownHandler = function (e) {
  var mod = navigator.userAgent.includes('Mac') ? e.metaKey : e.ctrlKey;
  if ((e.key === 's') & mod) {
    e.preventDefault();
    this.save();
  }
};

aria.Notes.prototype.init = function () {
  if (!this.initialized) {
    this.loadSaved();
    this.toggleCurrent();
    this.saveBtn.addEventListener('click', this.save.bind(this, undefined));
    this.discardBtn.addEventListener('click', this.discard.bind(this));
    this.notesInput.addEventListener('input', this.toggleControls.bind(this));
    this.notesInput.addEventListener('input', this.toggleCurrent.bind(this));
    this.notesInput.addEventListener('keydown', this.keydownHandler.bind(this));
    this.initialized = true;
  }
};

/** initialization */
document.addEventListener('DOMContentLoaded', function initAlertDialog() {
  var notes = new aria.Notes(
    'notes',
    'notes_save',
    'notes_save_status',
    'notes_confirm'
  );

  window.discardInput = function (closeBtn) {
    notes.discard.call(notes);
    closeDialog(closeBtn);
  };

  window.openAlertDialog = function (dialogId, triggerBtn, focusFirst) {
    // do not proceed if the trigger button is disabled
    if (triggerBtn.getAttribute('aria-disabled') === 'true') {
      return;
    }

    var target = document.getElementById(
      triggerBtn.getAttribute('data-textbox')
    );
    var dialog = document.getElementById(dialogId);
    var desc = document.getElementById(dialog.getAttribute('aria-describedby'));
    var wordCount = document.getElementById('word_count');
    if (!wordCount) {
      wordCount = document.createElement('p');
      wordCount.id = 'word_count';
      desc.appendChild(wordCount);
    }
    var count = target.value.split(/\s/).length;
    var frag = count > 1 ? 'words' : 'word';
    wordCount.textContent = count + ' ' + frag + ' will be deleted.';
    openDialog(dialogId, target, focusFirst);
  };
});
