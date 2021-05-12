/* globals parents, respecConfig, localRoleInfo, roleInfo, require, norm, getDfnTitles */
/* exported linkCrossReferences, restrictReferences, fixIncludes */

function parents(element, selector) {
  var elements = [];
  var parent = element.parentElement;

  while (parent) {
    if (parent.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    if (parent.matches(selector)) {
      elements.push(parent);
    }

    parent = parent.parentElement;
  }
}

// NOTE: this was taken from https://github.com/w3c/respec/blob/develop/src/core/utils.js
/**
 * Trims string at both ends and replaces all other white space with a single space
 * @param {string} str
 */
function norm(str) {
  return str.trim().replace(/\s+/g, " ");
}

// NOTE: this was taken from https://github.com/w3c/respec/blob/develop/src/core/utils.js
/**
 * Creates and sets an ID to an element (elem)
 * using a specific prefix if provided, and a specific text if given.
 * @param {HTMLElement} elem element
 * @param {String} pfx prefix
 * @param {String} txt text
 * @param {Boolean} noLC do not convert to lowercase
 * @returns {String} generated (or existing) id for element
 */
 function addId(elem, pfx = "", txt = "", noLC = false) {
  if (elem.id) {
    return elem.id;
  }
  if (!txt) {
    txt = (elem.title ? elem.title : elem.textContent).trim();
  }
  let id = noLC ? txt : txt.toLowerCase();
  id = id
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\W+/gim, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  if (!id) {
    id = "generatedID";
  } else if (/\.$/.test(id) || !/^[a-z]/i.test(pfx || id)) {
    id = `x${id}`; // trailing . doesn't play well with jQuery
  }
  if (pfx) {
    id = `${pfx}-${id}`;
  }
  if (elem.ownerDocument.getElementById(id)) {
    let i = 0;
    let nextId = `${id}-${i}`;
    while (elem.ownerDocument.getElementById(nextId)) {
      i += 1;
      nextId = `${id}-${i}`;
    }
    id = nextId;
  }
  elem.id = id;
  return id;
}


// NOTE: this was taken from https://github.com/w3c/respec/blob/develop/src/core/utils.js#L474 while removing jQuery
function getDfnTitles(elem) {
  const titleSet = new Set();
  // data-lt-noDefault avoid using the text content of a definition
  // in the definition list.
  // ltNodefault is === "data-lt-noDefault"... someone screwed up 😖
  const normText = 'ltNodefault' in elem.dataset ? '' : norm(elem.textContent);
  const child = /** @type {HTMLElement | undefined} */ (elem.children[0]);
  if (elem.dataset.lt) {
    // prefer @data-lt for the list of title aliases
    elem.dataset.lt
      .split('|')
      .map((item) => norm(item))
      .forEach((item) => titleSet.add(item));
  } else if (
    elem.childNodes.length === 1 &&
    elem.getElementsByTagName('abbr').length === 1 &&
    child.title
  ) {
    titleSet.add(child.title);
  } else if (elem.textContent === '""') {
    titleSet.add('the-empty-string');
  }

  titleSet.add(normText);
  titleSet.delete('');

  // We could have done this with @data-lt (as the logic is same), but if
  // @data-lt was not present, we would end up using @data-local-lt as element's
  // id (in other words, we prefer textContent over @data-local-lt for dfn id)
  if (elem.dataset.localLt) {
    const localLt = elem.dataset.localLt.split('|');
    localLt.forEach((item) => titleSet.add(norm(item)));
  }

  const titles = [...titleSet];
  return titles;
}

function linkCrossReferences() {
  'use strict';

  var specBaseURL = respecConfig.ariaSpecURLs
    ? respecConfig.ariaSpecURLs[respecConfig.specStatus]
    : null;

  var coreMappingURL = respecConfig.coreMappingURLs
    ? respecConfig.coreMappingURLs[respecConfig.specStatus]
    : null;

  var accNameURL = respecConfig.accNameURLs
    ? respecConfig.accNameURLs[respecConfig.specStatus]
    : null;

  var htmlMappingURL = respecConfig.htmlMappingURLs
    ? respecConfig.htmlMappingURLs[respecConfig.specStatus]
    : null;

  var dpubModURL = respecConfig.dpubModURLs
    ? respecConfig.dpubModURLs[respecConfig.specStatus]
    : null;

  var graphicsModURL = respecConfig.graphicsModURLs
    ? respecConfig.graphicsModURLs[respecConfig.specStatus]
    : null;
  var graphicsMappingModURL = respecConfig.graphicsMappingModURLs
    ? respecConfig.graphicsMappingModURLs[respecConfig.specStatus]
    : null;
  var practicesURL = respecConfig.practicesURLs
    ? respecConfig.practicesURLs[respecConfig.specStatus]
    : null;

  function setHrefs(selString, baseUrl) {
    Array.prototype.slice
      .call(document.querySelectorAll(selString))
      .forEach(function (el) {
        var href = el.getAttribute('href');
        el.setAttribute('href', baseUrl + href);
      });
  }

  // First the links to the definitions of roles, states, and properties.
  if (!!specBaseURL) {
    setHrefs(
      'a.role-reference, a.property-reference, a.state-reference, a.specref',
      specBaseURL
    );
  } else {
    console.log('linkCrossReferences():  specBaseURL is not defined.');
  }

  // Second, for links to role, state, and property mappings in the core mapping
  // doc.
  if (!!coreMappingURL) {
    setHrefs('a.core-mapping', coreMappingURL);
  } else {
    console.log(
      'linkCrossReferences():  Note -- coreMappingURL is not defined.'
    );
  }

  // Third, for links into the accname document.
  if (!!accNameURL) {
    setHrefs('a.accname', accNameURL);
  } else {
    console.log('linkCrossReferences():  Note -- accNameURL is not defined.');
  }
  // Fourth, for links to role, state, and property mappings in the html mapping
  // doc.
  if (!!htmlMappingURL) {
    setHrefs('a.html-mapping', htmlMappingURL);
  } else {
    console.log(
      'linkCrossReferences():  Note -- htmlMappingURL is not defined.'
    );
  }
  // Links to the DPub WAI-ARIA Module.
  if (!!dpubModURL) {
    setHrefs(
      'a.dpub-role-reference, a.dpub-property-reference, a.dpub-state-reference, a.dpub',
      dpubModURL
    );
  } else {
    console.log('linkCrossReferences():  dpubModURL is not defined.');
  }
  // Links to the Graphics WAI-ARIA Module.
  if (!!graphicsModURL) {
    setHrefs(
      'a.graphics-role-reference, a.graphics-property-reference, a.graphics-state-reference, a.graphics',
      graphicsModURL
    );
  } else {
    console.log('linkCrossReferences():  graphicsModURL is not defined.');
  }
  // Links to the Graphics Mapping WAI-ARIA Module.
  if (!!graphicsMappingModURL) {
    setHrefs(
      'a.graphics-role-mapping, a.graphics-property-mapping, a.graphics-state-mapping, a.graphics-mapping',
      graphicsMappingModURL
    );
  } else {
    console.log(
      'linkCrossReferences():  graphicsMappingModURL is not defined.'
    );
  }
  // Links to the Authoring Practices.
  if (!!practicesURL) {
    setHrefs('a.practices', practicesURL);
  } else {
    console.log('linkCrossReferences():  practicesURL is not defined.');
  }

  // Update any terms linked using termref to be informative as all aria terms are linked informatively
  Array.prototype.slice
  .call(document.querySelectorAll('.termref'))
  .forEach(function (item) {
    item.classList.add("informative");
  });
}


function updateReferences(base) {
  // update references to properties
  //
  // New logic:
  //     1. for each item, find it's nearest 'section' ancestor (or nearest div
  //     with a class of role, property, or state)
  //     2. if we have not already seen this item in this section, it is a link using 'a'
  //     3. otherwise, it is just a styled reference to the item  using 'code'

  'use strict';

  var baseURL = respecConfig.ariaSpecURLs[respecConfig.specStatus];

  var sectionMap = {};
  Array.prototype.slice
    .call(base.querySelectorAll('pref, sref, rref'))
    .forEach(function (item) {
      // what are we referencing?
      var content = item.innerText;
      var usedTitle = false;
      var ref = item.getAttribute('title');
      if (!ref) {
        ref = item.getAttribute('data-lt');
        if (!ref) {
          ref = content;
        } else {
          usedTitle = true;
        }
      } else {
        usedTitle = true;
      }

      var isPreref = item.tagName.toLowerCase() === 'pref';
      var isSref = item.tagName.toLowerCase() === 'sref';
      // what sort of reference are we?
      var theClass = isPreref
        ? 'property-reference'
        : isSref
        ? 'state-reference'
        : 'role-reference';

      // property and state references are assumed to be in the parent document
      // a role reference might be local or might be elsewhere
      var URL = isPreref || isSref ? baseURL + '#' : '#';

      // assume we are making a link
      var theElement = 'a';

      // pSec is the nearest parent section element
      var parentNodes =  parents(item, 'section, div.role, div.state, div.property');
      if (parentNodes) {
        var pSec = parentNodes[0];
        var pID = pSec.id;
        if (pID) {
          if (sectionMap[pID]) {
            if (sectionMap[pID][ref]) {
              // only change the element if we not in a table or a dl
              if (parents(item, 'table dl').length === 0) {
                if (usedTitle) {
                  theElement = 'span';
                } else {
                  theElement = 'code';
                }
              }
            } else {
              sectionMap[pID][ref] = 1;
            }
          } else {
            sectionMap[pID] = {};
            sectionMap[pID][ref] = 1;
          }
        }
      }

      if (theElement === 'a' && item.tagName.toLowerCase() === 'rref') {
        if (typeof localRoleInfo !== 'undefined' && localRoleInfo[ref]) {
          ref = localRoleInfo[ref].fragID;
        } else if (baseURL && roleInfo[ref]) {
          ref = roleInfo[ref].fragID;
          URL = baseURL + '#';
        } else {
          // no roleInfo structure.  Make an assumption
          URL = baseURL + '#';
        }
      }
      var sp = document.createElement(theElement);
      if (theElement === 'a') {
        sp.href = URL + ref;
        sp.className = theClass;
        content = '<code>' + content + '</code>';
      }
      sp.innerHTML = content;
      item.parentElement.replaceChild(sp, item);
    });
}

// We should be able to remove terms that are not actually
// referenced from the common definitions. This array is
// indexed with the element ids of the dfn tags to be pruned.
var termNames = [];

function restrictReferences(utils, content) {
  'use strict';
  var base = document.createElement('div');
  base.innerHTML = content;
  updateReferences(base);

  // strategy: Traverse the content finding all of the terms defined
  Array.prototype.slice
    .call(base.querySelectorAll('dfn'))
    .forEach(function (item) {
      var titles = getDfnTitles(item);
      var n = addId(item, 'dfn', titles[0]);

      if (n) {
        termNames[n] = item.parentNode;
      }
    });

  return base.innerHTML;
}



// included files are brought in after proProc.  Create a DOM tree
// of content then call the updateReferences method above on it.  Return
// the transformed content
function fixIncludes(utils, content) {
  'use strict';
  var base = document.createElement('div');
  base.innerHTML = content;
  updateReferences(base);
  return base.innerHTML;
}
