/**
 * roleInfo is structured like this:
 *
 * name: the name of the role
 * fragID: the @id for the role in the document
 * parentRoles: roles from which it inherits
 * localprops: local properties and states
 */

/* jshint shadow: true, unused: false, laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global $, require, updateReferences */

var roleInfo = {};

require(["core/pubsubhub"], function( respecEvents ) {
    respecEvents.sub("end-all", function() {
        var m = document.URL;
        if (m.match(/\#saveRoles/)) {
            var $modal
            ,   $overlay
            ,   buttons = {}
            ;
            var conf, doc, msg;
            var ui = {
                closeModal: function () {
                    if ($overlay) {
                        $overlay.fadeOut(200, function () { $overlay.remove(); $overlay = null; });
                    }
                    if (!$modal) {
                        return;
                    }
                    $modal.remove();
                    $modal = null;
                }
            ,   freshModal: function (title, content) {
                    if ($modal) {
                        $modal.remove();
                    }
                    if ($overlay) {
                        $overlay.remove();
                    }
                    var width = 500;
                    $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide();
                    $modal = $("<div id='respec-modal' class='removeOnSave'><h3></h3><div class='inside'></div></div>").hide();
                    $modal.find("h3").text(title);
                    $modal.find(".inside").append(content);
                    $("body")
                        .append($overlay)
                        .append($modal);
                    $overlay
                        .click(this.closeModal)
                        .css({
                            display:    "block"
                        ,   opacity:    0
                        ,   position:   "fixed"
                        ,   zIndex:     10000
                        ,   top:        "0px"
                        ,   left:       "0px"
                        ,   height:     "100%"
                        ,   width:      "100%"
                        ,   background: "#000"
                        })
                        .fadeTo(200, 0.5)
                        ;
                    $modal
                        .css({
                            display:        "block"
                        ,   position:       "fixed"
                        ,   opacity:        0
                        ,   zIndex:         11000
                        ,   left:           "50%"
                        ,   marginLeft:     -(width/2) + "px"
                        ,   top:            "100px"
                        ,   background:     "#fff"
                        ,   border:         "5px solid #666"
                        ,   borderRadius:   "5px"
                        ,   width:          width + "px"
                        ,   padding:        "0 20px 20px 20px"
                        ,   maxHeight:      ($(window).height() - 150) + "px"
                        ,   overflowY:      "auto"
                        })
                        .fadeTo(200, 1)
                        ;
                }
            };
            var supportsDownload = $("<a href='foo' download='x'>A</a>")[0].download === "x"
            ;
            var $div = $("<div></div>")
            ,   buttonCSS = {
                    background:     "#eee"
                ,   border:         "1px solid #000"
                ,   borderRadius:   "5px"
                ,   padding:        "5px"
                ,   margin:         "5px"
                ,   display:        "block"
                ,   width:          "100%"
                ,   color:          "#000"
                ,   textDecoration: "none"
                ,   textAlign:      "center"
                ,   fontSize:       "inherit"
                }
            ,   addButton = function (title, content, fileName, popupContent) {
                    if (supportsDownload) {
                        $("<a></a>")
                            .appendTo($div)
                            .text(title)
                            .css(buttonCSS)
                            .attr({
                                href:   "data:text/html;charset=utf-8," + encodeURIComponent(content)
                            ,   download:   fileName
                            })
                            .click(function () {
                                ui.closeModal();
                            })
                            ;
                    }
                    else {
                        $("<button></button>")
                            .appendTo($div)
                            .text(title)
                            .css(buttonCSS)
                            .click(function () {
                                popupContent();
                                ui.closeModal();
                            })
                            ;
                    }
                    
                }
            ;
            var s = "var roleInfo = " + JSON.stringify(roleInfo, null, '\t') ;
            addButton("Save Role Values", s, "roleInfo.js", s) ;
            ui.freshModal("Save Roles, States, and Properties", $div);
        }
    });

    respecEvents.sub("end", function( msg ) {
        if (msg == "w3c/conformance") {
                var propList = {};
                var globalSP = [];

                var skipIndex = 0;
                var myURL = document.URL;
                if (myURL.match(/\?fast/)) {
                    skipIndex = 1;
                }


                // process the document before anything else is done
                // first get the properties
                $.each(document.querySelectorAll("pdef, sdef"), function(i, item) {
                    var type = (item.localName === "pdef" ? "property" : "state");
                    var container = item.parentNode;
                    var content = item.innerHTML;
                    var sp = document.createElement("span");
                    var title = item.getAttribute("title");
                    if (!title) {
                        title = content;
                    }
                    sp.className = type + "-name";
                    sp.title = title;
                    sp.innerHTML = "<code>" + content + "</code> <span class=\"type-indicator\">" + type + "</span>";
                    sp.setAttribute("aria-describedby", "desc-" + title);
                    var dRef = item.nextElementSibling;
                    var desc = dRef.firstElementChild.innerHTML;
                    dRef.id = "desc-" + title;
                    dRef.setAttribute("role", "definition");
                    var heading = document.createElement("h4");
                    heading.appendChild(sp);
                    container.replaceChild(heading, item);
                    // add this item to the index
                    propList[title] = { is: type, title: title, name: content, desc: desc, roles: [] };
                    var abstract = container.querySelector("." + type + "-applicability");
                    if ((abstract.textContent || abstract.innerText) === "All elements of the base markup") {
                        globalSP.push({ is: type, title: title, name: content, desc: desc, prohibited: false });
                    } 
                    else if ((abstract.textContent || abstract.innerText) === "All elements of the base markup except for some roles or elements that prohibit its use") {
                        globalSP.push({ is: type, title: title, name: content, desc: desc, prohibited: true });
                    } 
                    
                    // the rdef is gone.  if we are in a div, convert that div to a section

                    if (container.nodeName.toLowerCase() == "div") {
                        // change the enclosing DIV to a section with notoc
                        var sec = document.createElement("section") ;
                        $.each(container.attributes, function(i, attr) {
                            sec.setAttribute(attr.name, attr.value);
                        });
                        $(sec).addClass("notoc");
                        var theContents = container.innerHTML;
                        sec.innerHTML = theContents;
                        container.parentNode.replaceChild(sec, container) ;
                    }
                });
                
                if (!skipIndex) {
                    // we have all the properties and states - spit out the
                    // index
                    var propIndex = "";
                    var sortedList = [];
                    $.each(propList, function(i) {
                        sortedList.push(i);
                    });
                    sortedList = sortedList.sort();

                    for (var i = 0; i < sortedList.length; i++) {
                        var item = propList[sortedList[i]];
                        propIndex += "<dt><a href=\"#" + item.title + "\" class=\"" + item.is + "-reference\">" + item.name + "</a></dt>\n";
                        propIndex += "<dd>" + item.desc + "</dd>\n";
                    }
                    var node = document.getElementById("index_state_prop");
                    var parentNode = node.parentNode;
                    var l = document.createElement("dl");
                    l.id = "index_state_prop";
                    l.className = "compact";
                    l.innerHTML = propIndex;
                    parentNode.replaceChild(l, node);

                    var globalSPIndex = "";
                    sortedList = globalSP.sort(function(a,b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0 });
                    for (i = 0; i < sortedList.length; i++) {
                        var lItem = sortedList[i];
                        globalSPIndex += "<li>";
                        if (lItem.is === "state") {
                            globalSPIndex += "<sref title=\"" + lItem.name + "\">" + lItem.name + " (state)</sref>";
                        } else {
                            globalSPIndex += "<pref>" + lItem.name + "</pref>";
                        }
                        if (lItem.prohibited) {
                            globalSPIndex += " (Except where prohibited)";
                        }
                        globalSPIndex += "</li>\n";
                    }
                    parentNode = document.querySelector("#global_states");
                    if (parentNode) {
                        node = parentNode.querySelector(".placeholder");
                        if (node) {
                            l = document.createElement("ul");
                            l.innerHTML = globalSPIndex;
                            parentNode.replaceChild(l, node);
                        }
                    }
                    // there is only one role that uses the global properties
                    parentNode = document.querySelector("#roletype td.role-properties span.placeholder");
                    if (parentNode) {
                        node = parentNode.parentNode;
                        if ((parentNode.textContent || parentNode.innerText) === "Placeholder for global states and properties") {
                            l = document.createElement("ul");
                            l.innerHTML = globalSPIndex;
                            node.replaceChild(l, parentNode);
                        }
                    }
                }

                // what about roles?
                //
                // we need to do a few things here:
                //   1. expand the rdef elements.
                //   2. accumulate the roles into a table for the indices
                //   3. grab the parent role reference so we can build up the tree
                //   4. grab any local states and properties so we can hand those down to the children
                //

                var subRoles = [];
                var roleIndex = "";
                var fromAuthor = "";
                var fromContent = "";
                var fromEncapsulation = "";
                var fromLegend = "";
                var fromProhibited = "";

                $.each(document.querySelectorAll("rdef"), function(i,item) {
                    var container = item.parentNode;
                    var $pn = $(container) ;
                    var content = item.innerHTML;
                    var sp = document.createElement("h4");
                    var title = item.getAttribute("title");
                    if (!title) {
                        title = content;
                    }
                    var pnID = $pn.makeID("", title) ;
                    sp.className = "role-name";
                    sp.title = title;
                    // is this a role or an abstract role
                    var type = "role";
                    var isAbstract = false;
                    var abstract = container.querySelectorAll(".role-abstract");
                    if ($(abstract).text() === "True") {
                        type = "abstract role";
                        isAbstract = true;
                    }
                    sp.innerHTML = "<code>" + content + "</code> <span class=\"type-indicator\">" + type + "</span>";
                    // sp.id = title;
                    sp.setAttribute("aria-describedby", "desc-" + title);
                    var dRef = item.nextElementSibling;
                    var desc = dRef.firstElementChild.innerHTML;
                    dRef.id = "desc-" + title;
                    dRef.setAttribute("role", "definition");
                    container.replaceChild(sp, item);
                    roleIndex += "<dt><a href=\"#" + pnID + "\" class=\"role-reference\"><code>" + content + "</code>" + ( isAbstract ? " (abstract role) " : "" ) + "</a></dt>\n";
                    roleIndex += "<dd>" + desc + "</dd>\n";
                    // grab info about this role
                    // do we have a parent class?  if so, put us in that parents list
                    var node = container.querySelectorAll(".role-parent rref");
                    // s will hold the name of the parent role if any
                    var s = null;
                    var parentRoles = [];
                    if (node) {
                        $.each(node, function(foo, roleref) {
                            s = roleref.textContent || roleref.innerText;

                            if (!subRoles[s]) {
                                subRoles.push(s);
                                subRoles[s] = [];
                            }
                            subRoles[s].push(title);
                            parentRoles.push(s);
                        });
                    }
                    // are there supported states / properties in this role?  
                    var attrs = [];
                    $.each(container.querySelectorAll(".role-properties, .role-required-properties, .role-disallowed"), function(i, node) {
                        if (node && ((node.textContent && node.textContent.length !== 1) || (node.innerText && node.innerText.length !== 1))) {
                            // looks like we do
                            $.each(node.querySelectorAll("pref,sref"), function(i, item) {
                                var name = item.getAttribute("title");
                                if (!name) {
                                    name = item.textContent || item.innerText;
                                }
                                var type = (item.localName === "pref" ? "property" : "state");
                                var req = $(node).hasClass("role-required-properties");
                                var dis = $(node).hasClass("role-disallowed");
                                attrs.push( { is: type, name: name, required: req, disallowed: dis } );                                
                                
                                // remember that the state or property is
                                // referenced by this role
                                propList[name].roles.push(title);
                            });
                        }
                    });
                    roleInfo[title] = { "name": title, "fragID": pnID, "parentRoles": parentRoles, "localprops": attrs };
                    // is there a namefrom indication?  If so, add this one to
                    // the list
                    if (!isAbstract) {
                        $.each(container.querySelectorAll(".role-namefrom"), function(i, node) {
                            var reqRef = container.querySelector(".role-namerequired");
                            var req = "";
                            if (reqRef && reqRef.innerText === "True") {
                                req = " (name required)";
                            }

                            if (node.textContent.indexOf("author") !== -1) {
                                fromAuthor += "<li><a href=\"#" + pnID + "\" class=\"role-reference\"><code>" + content + "</code></a>" + req + "</li>";
                            } 
                            if (!isAbstract && node.textContent.indexOf("content") !== -1) {
                                fromContent += "<li><a href=\"#" + pnID + "\" class=\"role-reference\"><code>" + content + "</code></a>" + "</li>";
                            }
                            if (node.textContent.indexOf("prohibited") !== -1) {
                                fromProhibited += "<li><a href=\"#" + pnID + "\" class=\"role-reference\"><code>" + content + "</code></a>" + req + "</li>";
                            }
                            if (node.textContent.indexOf("encapsulation") !== -1) {
                                fromEncapsulation += "<li><a href=\"#" + pnID + "\" class=\"role-reference\"><code>" + content + "</code></a>" + req + "</li>"; 
                            }
                            if (node.textContent.indexOf("legend") !== -1) {
                                fromLegend += "<li><a href=\"#" + pnID + "\" class=\"role-reference\"><code>" + content + "</code></a>" + req + "</li>";
                            }               
                        });
                    }
                    if (container.nodeName.toLowerCase() == "div") {
                        // change the enclosing DIV to a section with notoc
                        var sec = document.createElement("section") ;
                        $.each(container.attributes, function(i, attr) {
                            sec.setAttribute(attr.name, attr.value);
                        });
                        $(sec).addClass("notoc");
                        var theContents = container.innerHTML;
                        sec.innerHTML = theContents;
                        container.parentNode.replaceChild(sec, container) ;
                    }
                });

                var getStates = function(role) {
                    var ref = roleInfo[role];
                    if (!ref) {
                        msg.pub("error", "No role definition for " + role);
                    } else if (ref.allprops) {
                        return ref.allprops;
                    } else {
                        var myList = [];
                        $.merge(myList, ref.localprops);
                        $.each(ref.parentRoles, function(i, item) {
                            var pList = getStates(item);
                            $.merge(myList, pList);
                        });
                        ref.allprops = myList;
                        return myList;
                    }
                };
                    
                if (!skipIndex) {
                    // build up the complete inherited SP lists for each role
                    // however, if the role already specifies an item, do not include it
                    $.each(roleInfo, function(i, item) {
                        var output = "";
                        var placeholder = document.querySelector("#" + item.fragID + " .role-inherited");
                        if (placeholder) {
                            var myList = [];
                            $.each(item.parentRoles, function(j, role) {
                                $.merge(myList, getStates(role));
                            });
                            /* jshint loopfunc: true */
                            // strip out any items that we have locally
                            if (item.localprops.length && myList.length) {
                                for (var j = myList.length - 1; j >=0; j--) {
                                    item.localprops.forEach(function(x) {
                                        if (x.name == myList[j].name) {
                                            myList.splice(j, 1);
                                        }
                                    });
                                }
                            }
                            var sortedList = [];
                            sortedList = myList.sort(function(a,b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0 });
                            var prev;
                            for (var k = 0; k < sortedList.length; k++) {
                                var role = sortedList[k];
                                var req = "";
                                if (role.required) {
                                    req = " <strong>(required)</strong>";
                                }
                                if (prev != role.name) {
                                    output += "<li>";
                                    if (role.is === "state") {
                                        output += "<sref title=\"" + role.name + "\">" + role.name + " (state)</sref>" + req;
                                    } else {
                                        output += "<pref>" + role.name + "</pref>" + req;
                                    }
                                    output += "</li>\n";
                                    prev = role.name;
                                }
                            }
                            if (output !== "") {
                                output = "<ul>\n" + output + "</ul>\n";
                                placeholder.innerHTML = output;
                            }
                        }
                    });
                    
                    // Update state and property role references
                    var getAllSubRoles = function(role) {
                        var ref = subRoles[role];
                        if (ref && ref.length) {
                            var myList = [];
                            $.each(ref, function(j, item) {
                                if (!myList.item) {
                                    myList[item] = 1;
                                    myList.push(item);
                                    var childList = getAllSubRoles(item);
                                    $.merge(myList, childList);
                                }
                            });
                            return myList;
                        } else {
                            return [];
                        }
                    };
                        
                    $.each(propList, function(i, item) {
                        var output = "";
                        var section = document.querySelector("#" + item.name);
                        var placeholder = section.querySelector(".state-applicability, .property-applicability");
                        if (placeholder && ((placeholder.textContent || placeholder.innerText) === "Placeholder") && item.roles.length) {
                            // update the used in roles list
                            var sortedList = [];
                            sortedList = item.roles.sort();
                            for (var j = 0; j < sortedList.length; j++) {
                                output += "<li><rref>" + sortedList[j] + "</rref></li>\n";
                            }
                            if (output !== "") {
                                output = "<ul>\n" + output + "</ul>\n";
                            }
                            placeholder.innerHTML = output;
                            // also update any inherited roles
                            var myList = [];
                            $.each(item.roles, function(j, role) {
                                var children = getAllSubRoles(role);
                                // Some subroles have required properties which are also required by the superclass.
                                // Example: The checked state of radio, which is also required by superclass checkbox.
                                // We only want to include these one time, so filter out the subroles.
                                children = $.grep(children, function(subrole) {
                                    return $.inArray(subrole, propList[item.name].roles) == -1;
                                });
                                $.merge(myList, children);
                            });
                            placeholder = section.querySelector(".state-descendants, .property-descendants");
                            if (placeholder && myList.length) {
                                sortedList = myList.sort();
                                output = "";
                                var last = "";
                                for (j = 0; j < sortedList.length; j++) {
                                    var sItem = sortedList[j];
                                    if (last != sItem) {
                                        output += "<li><rref>" + sItem + "</rref></li>\n";
                                        last = sItem;
                                    }
                                }
                                if (output !== "") {
                                    output = "<ul>\n" + output + "</ul>\n";
                                }
                                placeholder.innerHTML = output;
                            }
                        }
                    });
                    
                    // spit out the index
                    var node = document.getElementById("index_role");
                    var parentNode = node.parentNode;
                    var list = document.createElement("dl");
                    list.id = "index_role";
                    list.className = "compact";
                    list.innerHTML = roleIndex;
                    parentNode.replaceChild(list, node);

                    // and the namefrom lists
                    node = document.getElementById("index_fromauthor");
                    if (node) {
                        parentNode = node.parentNode;
                        list = document.createElement("ul");
                        list.id = "index_fromauthor";
                        list.className = "compact";
                        list.innerHTML = fromAuthor;
                        parentNode.replaceChild(list, node);
                    }

                    node = document.getElementById("index_fromcontent");
                    if (node) {
                        parentNode = node.parentNode;
                        list = document.createElement("ul");
                        list.id = "index_fromcontent";
                        list.className = "compact";
                        list.innerHTML = fromContent;
                        parentNode.replaceChild(list, node);
                    }

                    node = document.getElementById("index_fromencapsulation");
                    if (node) {
                        parentNode = node.parentNode;
                        list = document.createElement("ul");
                        list.id = "index_fromencapsulation";
                        list.className = "compact";
                        list.innerHTML = fromEncapsulation;
                        parentNode.replaceChild(list, node);
                    }

                    node = document.getElementById("index_fromlegend");
                    if (node) {
                        parentNode = node.parentNode;
                        list = document.createElement("ul");
                        list.id = "index_fromlegend";
                        list.className = "compact";
                        list.innerHTML = fromLegend;
                        parentNode.replaceChild(list, node);
                    }

                    node = document.getElementById("index_fromprohibited");
                    if (node) {
                        parentNode = node.parentNode;
                        list = document.createElement("ul");
                        list.id = "index_fromprohibited";
                        list.className = "compact";
                        list.innerHTML = fromProhibited;
                        parentNode.replaceChild(list, node);
                    }
                    // assuming we found some parent roles, update those parents with their children
                    for (var i=0; i < subRoles.length; i++) {
                        var item = subRoles[subRoles[i]];
                        var sortedList = item.sort(function(a,b) { return a < b ? -1 : a > b ? 1 : 0 });
                        var output = "<ul>\n";
                        for (var j=0; j < sortedList.length; j++) {
                            output += "<li><rref>" + sortedList[j] + "</rref></li>\n";
                        }
                        output += "</ul>\n";
                        // put it somewhere
                        var subRolesContainer = document.querySelector("#" + subRoles[i]);
                        if (subRolesContainer) {
                            var subRolesListContainer = subRolesContainer.querySelector(".role-children");
                            if (subRolesListContainer) {
                                subRolesListContainer.innerHTML = output;
                            }
                        }
                    }

                }

                // prune out unused rows throughout the document
                
                $.each(document.querySelectorAll(".role-abstract, .role-parent, .role-base, .role-related, .role-scope, .role-mustcontain, .role-required-properties, .role-properties, .role-namefrom, .role-namerequired, .role-namerequired-inherited, .role-childpresentational, .role-presentational-inherited, .state-related, .property-related,.role-inherited, .role-children, .property-descendants, .state-descendants, .implicit-values"), function(i, item) {
                    var content = $(item).text();
                    if (content.length === 1 || content.length === 0) {
                        // there is no item - remove the row
                        item.parentNode.remove();
                    } else if (content === "Placeholder" 
                               && !skipIndex 
                               && (item.className === "role-inherited" 
                                   || item.className === "role-children"
                                   || item.className === "property-descendants"
                                   || item.className === "state-descendants" )) {
                        item.parentNode.remove();
                    }
                });

                updateReferences(document);

            }
    });

});
