/**
 * @namespace aria
 */

/* exported sourceCode */

'use strict';

var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                           */
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};

/* ---------------------------------------------------------------- */
/*                  Source code generators                          */
/* ---------------------------------------------------------------- */

// Default indentation according to the ARIA Practices Code Guide:
// https://github.com/w3c/aria-practices/wiki/Code-Guide.
var DEFAULT_INDENT = '&nbsp;&nbsp;';

// Void elements according to “HTML 5.3: The HTML Syntax”:
// https://w3c.github.io/html/syntax.html#void-elements.
var VOID_ELEMENTS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

/**
 * Creates a slider widget using ARIA
 *
 * @property {Array} location Object containing the keyCodes used by the slider widget
 * @property {Array} code JQuery node object
 * @class SourceCode
 * @memberof aria.widget
 */
aria.widget.SourceCode = function () {
  this.location = new Array();
  this.code = new Array();
  this.exampleHeader = new Array();
  this.resources = new Array();
};

/**
 * Adds source code
 *
 * @param {string} locationId      - ID of `code` element that will display the example html
 * @param {string} codeId          - ID of element containing only and all of the html used to render the example widget
 * @param {string} exampleHeaderId - ID of header element under which the "Open in Codepen" button belongs
 * @param {string} cssJsFilesId    - ID of element containing links to all the relevant js and css files used for the example widget
 * @function add
 * @memberof aria.widget.SourceCode
 */
aria.widget.SourceCode.prototype.add = function (
  locationId,
  codeId,
  exampleHeaderId,
  cssJsFilesId
) {
  this.location[this.location.length] = locationId;
  this.code[this.code.length] = codeId;
  this.exampleHeader[this.exampleHeader.length] = exampleHeaderId;
  this.resources[this.resources.length] = cssJsFilesId;
};

/**
 * Generates HTML content for source code
 *
 * @function make
 * @memberof aria.widget.SourceCode
 */
aria.widget.SourceCode.prototype.make = function () {
  for (var i = 0; i < this.location.length; i++) {
    var sourceCodeNode = document.getElementById(this.location[i]);
    var nodeCode = document.getElementById(this.code[i]);

    sourceCodeNode.className = 'sourcecode';
    this.createCode(sourceCodeNode, nodeCode, 0, true);

    // Remove unnecessary `<br>` element.
    if (sourceCodeNode.innerHTML.startsWith('<br>')) {
      sourceCodeNode.innerHTML = sourceCodeNode.innerHTML.replace('<br>', '');
    }

    // Adds the "Open In CodePen" button by the example header
    if (this.exampleHeader[i]) {
      addOpenInCodePenForm(
        i,
        this.exampleHeader[i],
        this.code[i],
        this.resources[i]
      );
    }
  }
};

/**
 * Creates the HTML for one node
 *
 * @param {HTMLElement} sourceCodeNode element to put the source code in
 * @param {object} node DOM Element node to use to generate the source code
 * @param {number} indentLevel Level of indentation
 * @param {boolean} skipFirst Whether to skip the first node
 * @function createCode
 * @memberof aria.widget.SourceCode
 */
aria.widget.SourceCode.prototype.createCode = function (
  sourceCodeNode,
  node,
  indentLevel,
  skipFirst
) {
  if (!skipFirst) {
    var openTag = '';
    var nodeNameStr = node.nodeName.toLowerCase();

    openTag += '<br/>' + indentation(indentLevel) + '&lt;' + nodeNameStr;

    var wrapAttributes = node.attributes.length > 2;

    for (var attrPos = 0; attrPos < node.attributes.length; attrPos++) {
      if (!wrapAttributes || attrPos === 0) {
        openTag += '&nbsp;';
      }

      var attributeValue = sanitizeNodeValue(node.attributes[attrPos].value);
      openTag +=
        node.attributes[attrPos].nodeName + '="' + attributeValue + '"';

      if (wrapAttributes && attrPos !== node.attributes.length - 1) {
        openTag += '<br/>' + indentation(indentLevel);
        openTag += '&nbsp;'.repeat(nodeNameStr.length + 2);
      }
    }

    openTag += '&gt;';

    sourceCodeNode.innerHTML += openTag;
    indentLevel++;
  }

  for (var i = 0; i < node.childNodes.length; i++) {
    var childNode = node.childNodes[i];

    switch (childNode.nodeType) {
      case Node.ELEMENT_NODE:
        // To remove the SVG definitions from the example's source code, add the id `svg_definitions`
        if (childNode.id !== 'svg_definitions') {
          this.createCode(sourceCodeNode, childNode, indentLevel, false);
        }
        break;

      case Node.TEXT_NODE:
        if (hasText(childNode.nodeValue)) {
          var textNodeContent = sanitizeNodeValue(childNode.nodeValue).trim();
          textNodeContent = indentLines(
            textNodeContent,
            indentation(indentLevel)
          );

          sourceCodeNode.innerHTML += '<br/>' + textNodeContent;
        }
        break;

      case Node.COMMENT_NODE:
        if (hasText(childNode.nodeValue)) {
          var commentNodeContent = sanitizeNodeValue(childNode.nodeValue);
          commentNodeContent = '&lt;!--' + commentNodeContent + '--&gt;';
          commentNodeContent = indentLines(
            commentNodeContent,
            indentation(indentLevel)
          );

          sourceCodeNode.innerHTML += '<br/>' + commentNodeContent;
        }
        break;
    }
  }

  if (!skipFirst && !VOID_ELEMENTS.includes(node.tagName.toLowerCase())) {
    indentLevel--;

    var closeTag = '&lt;/' + node.nodeName.toLowerCase() + '&gt;';

    if (node.childNodes.length > 0) {
      sourceCodeNode.innerHTML += '<br/>' + indentation(indentLevel);
    }

    sourceCodeNode.innerHTML += closeTag;
  }
};

/**
 * Returns the indentation string based on a given indent level.
 *
 * @param {number} indentLevel
 * @returns {string}
 */
function indentation(indentLevel) {
  return DEFAULT_INDENT.repeat(indentLevel);
}

/**
 * Tests whether the input string contains any non-whitespace character.
 *
 * `\S`: Any non-whitespace character
 *
 * Examples:
 *
 * ```
 * hasText('\t\n\r  ');
 * //> false
 *
 * hasText('\tcontent\n\r  ');
 * //> true
 * ```
 *
 * @param {string} nodeContent content of a node to test for whitespace characters
 * @returns {boolean}
 */
function hasText(nodeContent) {
  if (typeof nodeContent !== 'string') {
    return false;
  }

  return /\S/.test(nodeContent);
}

/**
 * Replaces the characters `<` and `>` with their respective HTML entities.
 *
 * @param {string} textContent
 * @returns {string}
 */
function sanitizeNodeValue(textContent) {
  if (typeof textContent !== 'string') {
    return '';
  }

  var output = stripIndentation(textContent);

  return output
    .replace(new RegExp('<', 'g'), '&lt;')
    .replace(new RegExp('>', 'g'), '&gt;');
}

/**
 * Strips any leading indentation from the text content of a node.
 *
 * @param {string} textContent
 * @returns {string}
 */
function stripIndentation(textContent) {
  var textIndentation = detectIndentation(textContent);

  if (textIndentation === 0) {
    return textContent;
  }

  var firstLine = textContent.substring(0, textContent.indexOf('\n'));
  var lines = textContent.split('\n').slice(1);

  lines = lines.map(function (line) {
    if (line === '') {
      return line;
    }

    return line.substring(textIndentation);
  });

  return firstLine + '\n' + lines.join('\n');
}

/**
 * Determines the indentation level of text content.
 *
 * Algorithm:
 *
 * Case 1: `textContent` is on the same line as opening and closing tag**:
 *
 * In other words, the text doesn’t contain any newline. Return 0.
 *
 * Case 2: `textContent` is on the same line as opening tag**:
 *
 * We already know there is at least one newline, because case 1 didn’t return.
 * We can now find the first indented line that contains any non-whitespace
 * character in order to determine present indentation.
 *
 * 1. Starting from the position after the first newline, iterate over each
 *    character in `textContent`.
 * 2. If the character is a non-whitespace (i.e. `/\S/`), `break`.
 * 3. If the character is a newline, reset the indentation level and
 *    `continue`.
 * 4. Increment the indentation level.
 *
 * Return the indentation level.
 *
 * @param {string} textContent
 * @returns {number} The level of indentation
 */
function detectIndentation(textContent) {
  // Case 1
  if (!textContent.includes('\n')) {
    return 0;
  }

  // Case 2
  var indentationLevel = 0;
  for (var i = textContent.indexOf('\n') + 1; i < textContent.length; i++) {
    if (/\S/.test(textContent[i])) {
      break;
    }

    if (textContent[i] === '\n') {
      indentationLevel = 0;
      continue;
    }

    indentationLevel++;
  }

  return indentationLevel;
}

/**
 * Prepends each line of a string with the provided indentation string.
 *
 * @param {string} input
 * @param {string} indentation
 * @returns {string}
 */
function indentLines(input, indentation) {
  var lines = input.split('\n');

  lines = lines.map(function (line) {
    return indentation + line;
  });

  return lines.join('\n');
}

/**
 * Creates and adds an "Open in CodePen" button
 *
 * @param {string} exampleIndex - the example number, if there are multiple examples
 * @param {string} exampleHeaderId - the example header to place the button next to
 * @param {string} exampleCodeId - the example html code
 * @param {string} exampleFilesId - the element containing all relevant CSS and JS file
 */
function addOpenInCodePenForm(
  exampleIndex,
  exampleHeaderId,
  exampleCodeId,
  exampleFilesId
) {
  var jsonInputId = 'codepen-data-ex-' + exampleIndex;
  var buttonId = exampleCodeId + '-codepenbutton';

  var form = document.createElement('form');
  form.setAttribute('action', 'https://codepen.io/pen/define');
  form.setAttribute('method', 'POST');
  form.setAttribute('target', '_blank');

  var input = document.createElement('input');
  input.setAttribute('id', jsonInputId);
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'data');

  var button = document.createElement('button');
  button.innerText = 'Open In CodePen';
  button.id = buttonId;
  button.style.display = 'none';

  form.appendChild(input);
  form.appendChild(button);

  var exampleHeader = document.getElementById(exampleHeaderId);
  exampleHeader.parentNode.insertBefore(form, exampleHeader.nextSibling);

  // Correct the indentation for the example html
  var indentedExampleHtml = document.getElementById(exampleCodeId).innerHTML;
  indentedExampleHtml = indentedExampleHtml.replace(/^\n+/, '');
  var indentation = indentedExampleHtml.match(/^\s+/)[0];
  var exampleHtml = indentedExampleHtml.replace(
    new RegExp('^' + indentation, 'gm'),
    ''
  );

  var path = location.pathname.split('/');
  var filename =
    path.length > 0 ? path[path.length - 1].replace('.html', '') : '';
  var postJson = {
    title: filename,
    html: exampleHtml,
    css: '',
    js: '',
    head: '<base href="' + location.href + '">',
    css_external:
      location.origin +
      '/examples/css/core.css;' +
      'https://www.w3.org/StyleSheets/TR/2016/base.css;' +
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
    js_external: location.origin + 'examples/js/utils.js',
  };

  var totalFetchedFiles = 0;
  var fileLinks = document.querySelectorAll('#' + exampleFilesId + ' a');

  for (let fileLink of fileLinks) {
    var request = new XMLHttpRequest();

    request.open('GET', fileLink.href, true);
    request.onload = function () {
      var href = this.responseURL;
      if (this.status >= 200 && this.status < 400) {
        if (href.indexOf('css') !== -1) {
          postJson.css = postJson.css.concat(this.response);
        }
        if (href.indexOf('js') !== -1) {
          postJson.js = postJson.js.concat(this.response);
        }
        totalFetchedFiles++;
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          "Not showing 'Open in Codepen' button. Could not load resource: " +
            href
        );
      }
    };
    request.onerror = function () {
      // eslint-disable-next-line no-console
      console.warn(
        "Not showing 'Open in Codepen' button. Could not load resource: " +
          fileLink.href
      );
    };
    request.send();
  }

  var timerId = setInterval(() => {
    if (totalFetchedFiles === fileLinks.length) {
      clearInterval(timerId);
      document.getElementById(jsonInputId).value = JSON.stringify(postJson);
      var button = document.getElementById(buttonId);
      button.style.display = '';
    }
  }, 500);

  setTimeout(() => {
    clearInterval(timerId);
    // eslint-disable-next-line no-console
    console.warn(
      "Not showing 'Open in Codepen' button. Timeout when loading resource."
    );
  }, 10000);
}

var sourceCode = new aria.widget.SourceCode();
