

/*
 * Copyright 2011-2016 University of Illinois
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initializ all treeitems based on the role=treeitem
 */

window.addEventListener('load', function () {

  var treeitems = document.querySelectorAll('[role="treeitem"]');

  for (var i = 0; i <treeitems.length; i++) {

    treeitems[i].addEventListener('click', function (event) {
      var treeitem = event.currentTarget;
      var label = treeitem.getAttribute('aria-label');
      if (!label) label = treeitem.innerHTML;

      document.getElementById('last_action').value=label.trim();

      event.stopPropagation();
      event.preventDefault();
    });

  }

});
