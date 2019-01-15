// ariaChild.js - script for aria child specifications to use
// when integrating content.  Requires a roleInfo.js file in the
// same directory that contains the roleInfo data structure.
//

/* jshint laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global $, require, roleInfo, updateReferences */
var localRoleInfo = {} ;

require(["core/pubsubhub"], function( respecEvents ) {
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
                    sp.innerHTML = "<code>" + content + "</code> <span class=\"type-indicator\">(" + type + ")</span>";
                    sp.setAttribute("aria-describedby", "desc-" + title);
                    var dRef = item.nextElementSibling;
                    var desc = dRef.firstElementChild.innerHTML;
                    dRef.id = "desc-" + title;
                    dRef.setAttribute("role", "definition");
                    var heading = document.createElement("h3");
                    heading.appendChild(sp);
                    container.replaceChild(heading, item);
                    // add this item to the index
                    propList[title] = { is: type, title: title, name: content, desc: desc, roles: [] };
                    var abstract = container.querySelector("." + type + "-applicability");
                    if ((abstract.textContent || abstract.innerText) === "All elements of the base markup") {
                        globalSP.push({ is: type, title: title, name: content, desc: desc });
                    }
                    // the pdef/sdef is gone.  if we are in a div, convert that div to a section

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

                $.each(document.querySelectorAll("rdef"), function(i,item) {
                    var container = item.parentNode;
                    var $pn = $(container) ;
                    var content = item.innerHTML;
                    var sp = document.createElement("h3");
                    var title = item.getAttribute("title");
                    if (!title) {
                        title = content;
                    }
                    var pnID = $pn.makeID("", title) ;
                    sp.className = "role-name";
                    sp.title = title;
                    // is this a role or an abstract role
                    var type = "role";
                    var abstract = container.querySelectorAll(".role-abstract");
                    if ($(abstract).text() === "True") {
                        type = "abstract role";
                    }
                    sp.innerHTML = "<code>" + content + "</code> <span class=\"type-indicator\">(" + type + ")</span>";
                    // sp.id = title;
                    sp.setAttribute("aria-describedby", "desc-" + title);
                    var dRef = item.nextElementSibling;
                    var desc = dRef.firstElementChild.innerHTML;
                    dRef.id = "desc-" + title;
                    dRef.setAttribute("role", "definition");
                    container.replaceChild(sp, item);
                    roleIndex += "<dt><a href=\"#" + pnID + "\" class=\"role-reference\">" + content + "</a></dt>\n";
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
                    $.each(container.querySelectorAll(".role-properties, .role-required-properties"), function(i, node) {
                        if (node && ((node.textContent && node.textContent.length !== 1) || (node.innerText && node.innerText.length !== 1))) {
                            // looks like we do
                            $.each(node.querySelectorAll("pref,sref"), function(i, item) {
                                var name = item.getAttribute("title");
                                if (!name) {
                                    name = item.textContent || item.innerText;
                                }
                                var type = (item.localName === "pref" ? "property" : "state");
                                var req = ($(node).hasClass("role-required-properties") ? true : false );
                                attrs.push( { is: type, name: name, required: req } );
                                // remember that the state or property is
                                // referenced by this role
                                propList[name].roles.push(title);
                            });
                        }
                    });
                    localRoleInfo[title] = { "name": title, "fragID": pnID, "parentRoles": parentRoles, "localprops": attrs };
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
                    var ref = localRoleInfo[role];
                    if (!ref) {
                        ref = roleInfo[role];
                    }
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
                    $.each(localRoleInfo, function(i, item) {
                        var output = "";
                        var placeholder = document.querySelector("#" + item.fragID + " .role-inherited");
                        if (placeholder) {
                            var myList = [];
                            $.each(item.parentRoles, function(j, role) {
                                $.merge(myList, getStates(role));
                            });
                            // strip out any items that we have locally
                            /* jshint loopfunc: true */
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
                            sortedList = myList.sort(function(a,b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
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
                                for (var k = 0; k < sortedList.length; k++) {
                                    var lItem = sortedList[k];
                                    if (last != lItem) {
                                        output += "<li><rref>" + lItem + "</rref></li>\n";
                                        last = lItem;
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

                updateReferences(document);

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
            }
    });
});

