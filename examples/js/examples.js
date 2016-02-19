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

aria.widget.SourceCode = function() {
  this.location = new Array();
  this.code = new Array();
}

/**
 * @method add
 *
 * @memberOf aria.widget.SourceCode
 *
 * @desc  Adds source code 
 */
 
aria.widget.SourceCode.prototype.add = function( location_id, code_id ) {
  this.location[this.location.length] = location_id;
  this.code[this.code.length] = code_id;
}

/**
 * @method make
 *
 * @memberOf aria.widget.SourceCode
 *
 * @desc  Generates HTML content for source code 
 */
 
aria.widget.SourceCode.prototype.make = function() {

   var node_code;
   var node_location;

   for(var i = 0; i < this.location.length; i++ ) {
     
     node_location = document.getElementById( this.location[i] );
     node_code     = document.getElementById( this.code[i] );
     
     node_location.className = "sourcecode";
     this.createCode( node_location, "", node_code );
     
   } // endfor
     
}

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
 
aria.widget.SourceCode.prototype.createCode = function(location, spaces, node) {

  function hasText(s) {
    if (typeof s !== 'string') return false;
  
    for(var i = 0; i < s.length; i++) {
      var c = s[i]
      if (c !== ' ' && c !== '\n' && c !== '\r') return true;
    }
    return false;
  }

  var i;

  var node_name = node.nodeName.toLowerCase();

  location.innerHTML = location.innerHTML + "<br/>" + spaces + "&lt;" + node_name;
  
  for(i=0; i < node.attributes.length; i++ ) {
 
     if( !(((node_name == "script" ) || (node_name = "style")) && (node.attributes[i].nodeName.toLowerCase() == "id") ) ) { 
          
       location.innerHTML = location.innerHTML + "&nbsp;" + node.attributes[i].nodeName + "=\"";
       location.innerHTML = location.innerHTML + node.attributes[i].value + "\"";
     
       if( ((i + 1) != node.attributes.length) && (node.attributes.length > 2 ) ) {

          location.innerHTML = location.innerHTML + "<br/>" + spaces;
        
          for(var j=2; j <= node_name.length; j++ )
            location.innerHTML = location.innerHTML + "&nbsp;";
             
       } // endif
 
    } // endif
 
  }  // endfor
  
  location.innerHTML = location.innerHTML + "&gt;";

  var count = 0;

  for(i=0; i < node.childNodes.length; i++ ) {
  
    var n = node.childNodes[i];
  
    switch( n.nodeType ) {
    
      case Node.ELEMENT_NODE:
         this.createCode( location, spaces + "&nbsp;&nbsp;", n);
           count++;
         break;

      case Node.TEXT_NODE:
           if (hasText(n.nodeValue)) {
             location.innerHTML = location.innerHTML + "<br/>" + spaces + "&nbsp;&nbsp;" + n.nodeValue;
           }  
           count++;
         break;


    }  // end switch
  

  } // end for

    if( count > 0 ) { 
      location.innerHTML = location.innerHTML + "<br/>" + spaces + "&lt;/" + node.nodeName.toLowerCase();
      location.innerHTML = location.innerHTML + "&gt;";
    } // end if

}

var sourceCode = new aria.widget.SourceCode();


