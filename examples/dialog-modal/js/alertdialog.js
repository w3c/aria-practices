function initAlertDialog () {
  function discardInput (closeButton, inputId) {
    var input = document.getElementById(inputId);
    input.value = '';
    closeDialog(closeButton);
  }

  function triggerAlert (alertId) {
    return new Promise(function (resolve, reject) {
      try {
        var alert = document.getElementById(alertId);
        alert.classList.remove('hidden');
        setTimeout(function () {
          alert.classList.add('hidden');
          resolve();
        }, 3000);
      }
      catch (err) {
        reject(err);
      }
    });
  }

  function openAlertDialog (dialogId, focusAfterClosed, focusFirst) {
    var target = document.getElementById(focusAfterClosed.getAttribute('aria-controls'));
    if (target && target.value) {
      var dialog = document.getElementById(dialogId);
      var desc = document.getElementById(dialog.getAttribute('aria-describedby'));
      var wordCount = document.getElementById('word_count');
      if (!wordCount) {
        wordCount = document.createElement('p');
        wordCount.id = 'word_count';
        desc.appendChild(wordCount);
      }
      var count = target.value.split(/\s/).length;
      var frag = (count > 1) ? 'words' : 'word';
      wordCount.textContent =  count + ' ' + frag + ' will be deleted.';
      openDialog(dialogId, focusAfterClosed, focusFirst);
    }
    else {
      triggerAlert('alert_toast').then(function () {
        // optionally do something on notification end
      });
    }
  }

  window.openAlertDialog = openAlertDialog;
  window.discardInput = discardInput;
}

document.addEventListener('DOMContentLoaded', initAlertDialog);
