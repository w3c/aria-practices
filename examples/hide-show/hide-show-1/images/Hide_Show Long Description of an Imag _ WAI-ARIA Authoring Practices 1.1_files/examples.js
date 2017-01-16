/**
 * @namespace aria
 */

var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};

/* ---------------------------------------------------------------- */
/*                  Source code generators                          */
/* ---------------------------------------------------------------- */

/**
 * @constructor SourceCode
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a slider widget using ARIA
 *
 * @property  location      Array  -  Object containing the keyCodes used by the slider widget
 * @property  code          Array  -  JQuery node object
 */

aria.widget.SourceCode = function () {
  this.location = new Array();
  this.code = new Array();
};

/**
 * @method add
 *
 * @memberOf aria.widget.SourceCode
 *
 * @desc  Adds source code
 */

aria.widget.SourceCode.prototype.add = function (locationId, codeId) {
  this.location[this.location.length] = locationId;
  this.code[this.code.length] = codeId;
};

/**
 * @method make
 *
 * @memberOf aria.widget.SourceCode
 *
 * @desc  Generates HTML content for source code
 */

aria.widget.SourceCode.prototype.make = function () {

  var nodeCode;
  var nodeLocation;

  for (var i = 0; i < this.location.length; i++) {

    nodeLocation = document.getElementById(this.location[i]);
    nodeCode = document.getElementById(this.code[i]);

    nodeLocation.className = 'sourcecode';
    this.createCode(nodeLocation, '', nodeCode);

  } // endfor

};

/**
 * @method createCode
 *
 * @memberOf aria.widget.SourceCode
 *
 * @desc  Specify the source code and the location of the source code
 *
 * @param  location   String   - id of element to put the source code
 * @param  spaces     String   - Any spaces to precede the source code
 * @param  node       Object   - DOM Element node to use to generate the source code
 */

aria.widget.SourceCode.prototype.createCode = function (location, spaces, node) {

  function hasText (s) {
    if (typeof s !== 'string') {return false;}

    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c !== ' ' && c !== '\n' && c !== '\r') {return true;}
    }
    return false;
  }

  var i;

  var nodeNameStr = node.nodeName.toLowerCase();

  location.innerHTML = location.innerHTML + '<br/>' + spaces + '&lt;' + nodeNameStr;

  for (i = 0; i < node.attributes.length; i++) {

    location.innerHTML = location.innerHTML + '&nbsp;' + node.attributes[i].nodeName + '="';
    location.innerHTML = location.innerHTML + node.attributes[i].value + '"';

    if (((i + 1) != node.attributes.length) && (node.attributes.length > 2)) {

      location.innerHTML = location.innerHTML + '<br/>' + spaces;

      for (var j = 2; j <= nodeNameStr.length; j++) {
        location.innerHTML = location.innerHTML + '&nbsp;';
      }

    } // endif

  } // endfor

  location.innerHTML = location.innerHTML + '&gt;';

  var count = 0;

  for (i = 0; i < node.childNodes.length; i++) {

    var n = node.childNodes[i];

    switch (n.nodeType) {

      case Node.ELEMENT_NODE:
        this.createCode(location, spaces + '&nbsp;&nbsp;', n);
        count++;
        break;

      case Node.TEXT_NODE:
        if (hasText(n.nodeValue)) {
          location.innerHTML = location.innerHTML + '<br/>' + spaces + '&nbsp;&nbsp;' + n.nodeValue;
        }
        count++;
        break;

    } // end switch

  } // end for

  if (count > 0) {
    location.innerHTML = location.innerHTML + '<br/>' + spaces + '&lt;/' + node.nodeName.toLowerCase();
    location.innerHTML = location.innerHTML + '&gt;';
  } // end if

};

var sourceCode = new aria.widget.SourceCode();
