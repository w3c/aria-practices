'use strict';

var aria = aria || {};

aria.Utils = aria.Utils || {};

aria.Utils.disableCtrl = function (ctrl) {
  ctrl.setAttribute('disabled', true);
};

aria.Utils.enableCtrl = function (ctrl) {
  ctrl.removeAttribute('disabled');
};

aria.Utils.triggerAlert = function (alertEl, content) {
  return new Promise(function (resolve, reject) {
    try {
      alertEl.textContent = content || null;
      alertEl.classList.remove('hidden');
      alertEl.addEventListener(
        'transitionend',
        function (e) {
          if (!this.classList.contains('active')) {
            this.classList.add('hidden');
          }
        },
        true
      );
      setTimeout(function () {
        alertEl.classList.add('active');
      }, 1);
      setTimeout(function () {
        alertEl.classList.remove('active');
        resolve();
      }, 3000);
    } catch (err) {
      reject(err);
    }
  });
};

aria.Notes = function Notes(notesId, saveId, discardId, localStorageKey) {
  this.notesInput = document.getElementById(notesId);
  this.saveBtn = document.getElementById(saveId);
  this.discardBtn = document.getElementById(discardId);
  this.localStorageKey = localStorageKey || 'alertdialog-notes';
  this.initialized = false;

  Object.defineProperty(this, 'controls', {
    get: function () {
      return document.querySelectorAll(
        '[aria-controls=' + this.notesInput.id + ']'
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
  if (this.alert && !this.isCurrent) {
    aria.Utils.triggerAlert(this.alert, 'Saved');
  }
  localStorage.setItem(
    this.localStorageKey,
    JSON.stringify(val || this.notesInput.value)
  );
  aria.Utils.disableCtrl(this.saveBtn);
};

aria.Notes.prototype.loadSaved = function () {
  if (this.savedValue) {
    this.notesInput.value = this.savedValue;
  }
};

aria.Notes.prototype.discard = function () {
  localStorage.clear();
  this.notesInput.value = '';
  this.toggleControls();
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
  var notes = new aria.Notes('notes', 'notes_save', 'notes_confirm');
  notes.alert = document.getElementById('alert_toast');

  window.discardInput = function (closeBtn) {
    notes.discard.call(notes);
    closeDialog(closeBtn);
  };

  window.openAlertDialog = function (dialogId, triggerBtn, focusFirst) {
    var target = document.getElementById(
      triggerBtn.getAttribute('aria-controls')
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
