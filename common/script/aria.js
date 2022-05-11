/**
 * roleInfo is structured like this:
 *
 * name: the name of the role
 * fragID: the @id for the role in the document
 * parentRoles: roles from which it inherits
 * localprops: local properties and states
 */

/* jshint shadow: true, unused: false, laxbreak:true, laxcomma:true, asi: true, eqeqeq: false, strict: implied, jquery: true */
/* global require, updateReferences, ariaAttributeReferences */

var roleInfo = {};

function ariaAttributeReferences() {
      var propList = {};
      var globalSP = [];

      var skipIndex = 0;
      var myURL = document.URL;
      if (myURL.match(/\?fast/)) {
        skipIndex = 1;
      }

      // process the document before anything else is done
      // first get the properties
      Array.prototype.slice
        .call(document.querySelectorAll('pdef, sdef'))
        .forEach(function (item) {
          var type = item.localName === 'pdef' ? 'property' : 'state';
          var container = item.parentNode;
          var content = item.innerHTML;
          var sp = document.createElement('span');
          var title = item.getAttribute('title');
          if (!title) {
            title = content;
          }
          sp.className = type + '-name';
          sp.title = title;
          sp.innerHTML =
            '<code>' +
            content +
            '</code> <span class="type-indicator">' +
            type +
            '</span>';
          sp.setAttribute('aria-describedby', 'desc-' + title);
          var dRef = item.nextElementSibling;
          var desc = cloneWithoutIds(dRef.firstElementChild).innerHTML;
          dRef.id = 'desc-' + title;
          dRef.setAttribute('role', 'definition');
          var heading = document.createElement('h4');
          heading.appendChild(sp);
          container.replaceChild(heading, item);
          // add this item to the index
          propList[title] = {
            is: type,
            title: title,
            name: content,
            desc: desc,
            roles: [],
          };
          var abstract = container.querySelector('.' + type + '-applicability');
          if (
            (abstract.textContent || abstract.innerText) ===
            'All elements of the base markup'
          ) {
            globalSP.push({
              is: type,
              title: title,
              name: content,
              desc: desc,
              prohibited: false,
              deprecated: false,
            });
          } else if (
            (abstract.textContent || abstract.innerText) ===
            'All elements of the base markup except for some roles or elements that prohibit its use'
          ) {
            globalSP.push({
              is: type,
              title: title,
              name: content,
              desc: desc,
              prohibited: true,
              deprecated: false,
            });
          } else if (
            (abstract.textContent || abstract.innerText) ===
            'Use as a global deprecated in ARIA 1.2'
          ) {
            globalSP.push({
              is: type,
              title: title,
              name: content,
              desc: desc,
              prohibited: false,
              deprecated: true,
            });
          }
          // the rdef is gone.  if we are in a div, convert that div to a section

          if (container.nodeName.toLowerCase() == 'div') {
            // change the enclosing DIV to a section with notoc
            var sec = document.createElement('section');
            Array.prototype.slice
              .call(container.attributes)
              .forEach(function (attr) {
                sec.setAttribute(attr.name, attr.value);
              });
            sec.classList.add('notoc');
            var theContents = container.innerHTML;
            sec.innerHTML = theContents;
            container.parentNode.replaceChild(sec, container);
          }
        });

      if (!skipIndex) {
        // we have all the properties and states - spit out the
        // index
        var propIndex = '';
        var sortedList = [];

        Object.keys(propList).forEach(function (key) {
          sortedList.push(key);
        });
        sortedList = sortedList.sort();

        for (var i = 0; i < sortedList.length; i++) {
          var item = propList[sortedList[i]];
          propIndex +=
            '<dt><a href="#' +
            item.title +
            '" class="' +
            item.is +
            '-reference">' +
            item.name +
            '</a></dt>\n';
          propIndex += '<dd>' + item.desc + '</dd>\n';
        }
        var node = document.getElementById('index_state_prop');
        var parentNode = node.parentNode;
        var l = document.createElement('dl');
        l.id = 'index_state_prop';
        l.className = 'compact';
        l.innerHTML = propIndex;
        parentNode.replaceChild(l, node);

        var globalSPIndex = '';
        sortedList = globalSP.sort(function (a, b) {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
        for (i = 0; i < sortedList.length; i++) {
          var lItem = sortedList[i];
          globalSPIndex += '<li>';
          if (lItem.is === 'state') {
            globalSPIndex +=
              '<sref ' +
              (lItem.prohibited ? 'data-prohibited ' : '') +
              (lItem.deprecated ? 'data-deprecated ' : '') +
              'title="' +
              lItem.name +
              '">' +
              lItem.name +
              ' (state)</sref>';
          } else {
            globalSPIndex +=
              '<pref ' +
              (lItem.prohibited ? 'data-prohibited ' : '') +
              (lItem.deprecated ? 'data-deprecated ' : '') +
              '>' +
              lItem.name +
              '</pref>';
          }
          if (lItem.prohibited) {
            globalSPIndex += ' (Except where prohibited)';
          }
          if (lItem.deprecated) {
            globalSPIndex += ' (Global use deprecated in ARIA 1.2)';
          }
          globalSPIndex += '</li>\n';
        }
        parentNode = document.querySelector('#global_states');
        if (parentNode) {
          node = parentNode.querySelector('.placeholder');
          if (node) {
            l = document.createElement('ul');
            l.innerHTML = globalSPIndex;
            parentNode.replaceChild(l, node);
          }
        }
        // there is only one role that uses the global properties
        parentNode = document.querySelector(
          '#roletype td.role-properties span.placeholder'
        );
        if (parentNode) {
          node = parentNode.parentNode;
          if (
            (parentNode.textContent || parentNode.innerText) ===
            'Placeholder for global states and properties'
          ) {
            l = document.createElement('ul');
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
      var roleIndex = '';
      var fromAuthor = '';
      var fromContent = '';
      var fromEncapsulation = '';
      var fromLegend = '';
      var fromProhibited = '';

      Array.prototype.slice
        .call(document.querySelectorAll('rdef'))
        .forEach(function (item) {
          var container = item.parentNode;
          var content = item.innerHTML;
          var sp = document.createElement('h4');
          var title = item.getAttribute('title');
          if (!title) {
            title = content;
          }

          var pnID = title;
          container.id = pnID;
          sp.className = 'role-name';
          sp.title = title;
          // is this a role or an abstract role
          var type = 'role';
          var isAbstract = false;
          var abstract = container.querySelectorAll('.role-abstract');
          if (abstract.innerText === 'True') {
            type = 'abstract role';
            isAbstract = true;
          }
          sp.innerHTML =
            '<code>' +
            content +
            '</code> <span class="type-indicator">' +
            type +
            '</span>';
          // sp.id = title;
          sp.setAttribute('aria-describedby', 'desc-' + title);
          var dRef = item.nextElementSibling;
          var desc = cloneWithoutIds(dRef.firstElementChild).innerHTML;
          dRef.id = 'desc-' + title;
          dRef.setAttribute('role', 'definition');
          container.replaceChild(sp, item);
          roleIndex +=
            '<dt><a href="#' +
            pnID +
            '" class="role-reference"><code>' +
            content +
            '</code>' +
            (isAbstract ? ' (abstract role) ' : '') +
            '</a></dt>\n';
          roleIndex += '<dd>' + desc + '</dd>\n';
          // grab info about this role
          // do we have a parent class?  if so, put us in that parents list
          var node = Array.prototype.slice.call(
            container.querySelectorAll('.role-parent rref')
          );
          // s will hold the name of the parent role if any
          var s = null;
          var parentRoles = [];
          if (node.length) {
            node.forEach(function (roleref) {
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
          Array.prototype.slice
            .call(
              container.querySelectorAll(
                '.role-properties, .role-required-properties, .role-disallowed'
              )
            )
            .forEach(function (node) {
              if (
                node &&
                ((node.textContent && node.textContent.length !== 1) ||
                  (node.innerText && node.innerText.length !== 1))
              ) {
                // looks like we do
                Array.prototype.slice
                  .call(node.querySelectorAll('pref,sref'))
                  .forEach(function (item) {
                    var name = item.getAttribute('title');
                    if (!name) {
                      name = item.textContent || item.innerText;
                    }
                    var type = item.localName === 'pref' ? 'property' : 'state';
                    var req = node.classList.contains(
                      'role-required-properties'
                    );
                    var dis = node.classList.contains('role-disallowed');
                    var dep = item.hasAttribute('data-deprecated');
                    attrs.push({
                      is: type,
                      name: name,
                      required: req,
                      disallowed: dis,
                      deprecated: dep,
                    });

                    // remember that the state or property is
                    // referenced by this role
                    propList[name].roles.push(title);
                  });
              }
            });
          roleInfo[title] = {
            name: title,
            fragID: pnID,
            parentRoles: parentRoles,
            localprops: attrs,
          };

          // is there a namefrom indication?  If so, add this one to
          // the list
          if (!isAbstract) {
            Array.prototype.slice
              .call(container.querySelectorAll('.role-namefrom'))
              .forEach(function (node) {
                var reqRef = container.querySelector('.role-namerequired');
                var req = '';
                if (reqRef && reqRef.innerText === 'True') {
                  req = ' (name required)';
                }

                if (node.textContent.indexOf('author') !== -1) {
                  fromAuthor +=
                    '<li><a href="#' +
                    pnID +
                    '" class="role-reference"><code>' +
                    content +
                    '</code></a>' +
                    req +
                    '</li>';
                }
                if (!isAbstract && node.textContent.indexOf('content') !== -1) {
                  fromContent +=
                    '<li><a href="#' +
                    pnID +
                    '" class="role-reference"><code>' +
                    content +
                    '</code></a>' +
                    req +
                    '</li>';
                }
                if (node.textContent.indexOf('prohibited') !== -1) {
                  fromProhibited +=
                    '<li><a href="#' +
                    pnID +
                    '" class="role-reference"><code>' +
                    content +
                    '</code></a>' +
                    req +
                    '</li>';
                }
                if (node.textContent.indexOf('encapsulation') !== -1) {
                  fromEncapsulation +=
                    '<li><a href="#' +
                    pnID +
                    '" class="role-reference"><code>' +
                    content +
                    '</code></a>' +
                    req +
                    '</li>';
                }
                if (node.textContent.indexOf('legend') !== -1) {
                  fromLegend +=
                    '<li><a href="#' +
                    pnID +
                    '" class="role-reference"><code>' +
                    content +
                    '</code></a>' +
                    req +
                    '</li>';
                }
              });
          }
          if (container.nodeName.toLowerCase() == 'div') {
            // change the enclosing DIV to a section with notoc
            var sec = document.createElement('section');
            Array.prototype.slice
              .call(container.attributes)
              .forEach(function (attr) {
                sec.setAttribute(attr.name, attr.value);
              });

            sec.classList.add('notoc');
            var theContents = container.innerHTML;
            sec.innerHTML = theContents;
            container.parentNode.replaceChild(sec, container);
          }
        });

      var getStates = function (role) {
        var ref = roleInfo[role];
        if (!ref) {
          msg.pub('error', 'No role definition for ' + role);
        } else if (ref.allprops) {
          return ref.allprops;
        } else {
          var myList = ref.localprops;
          Array.prototype.slice.call(ref.parentRoles).forEach(function (item) {
            var pList = getStates(item);
            myList = myList.concat(pList);
          });
          ref.allprops = myList;
          return myList;
        }
      };

      // TODO: test this on a page where `skipIndex` is truthy
      if (!skipIndex) {
        // build up the complete inherited SP lists for each role
        // however, if the role already specifies an item, do not include it
        Object.entries(roleInfo).forEach(function (index) {
          var item = index[1];
          var output = '';
          var placeholder = document.querySelector(
            '#' + item.fragID + ' .role-inherited'
          );

          if (placeholder) {
            var myList = [];
            item.parentRoles.forEach(function (role) {
              myList = myList.concat(getStates(role));
            });
            /* jshint loopfunc: true */
            // strip out any items that we have locally
            if (item.localprops.length && myList.length) {
              for (var j = myList.length - 1; j >= 0; j--) {
                item.localprops.forEach(function (x) {
                  if (x.name == myList[j].name) {
                    myList.splice(j, 1);
                  }
                });
              }
            }

            var reducedList = myList.reduce((uniqueList, item) => {
              return uniqueList.includes(item)
                ? uniqueList
                : [...uniqueList, item];
            }, []);

            var sortedList = reducedList.sort((a, b) => {
              if (a.name == b.name) {
                // Ensure deprecated false properties occur first
                if (a.deprecated !== b.deprecated) {
                  return a.deprecated ? 1 : b.deprecated ? -1 : 0;
                }
              }
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            }, []);

            var prev;
            for (var k = 0; k < sortedList.length; k++) {
              var property = sortedList[k];
              var req = '';
              var dep = '';
              if (property.required) {
                req = ' <strong>(required)</strong>';
              }
              if (property.deprecated) {
                dep = ' <strong>(deprecated on this role in ARIA 1.2)</strong>';
              }
              if (prev != property.name) {
                output += '<li>';
                if (property.is === 'state') {
                  output +=
                    '<sref>' + property.name + '</sref> (state)' + req + dep;
                } else {
                  output += '<pref>' + property.name + '</pref>' + req + dep;
                }
                output += '</li>\n';
                prev = property.name;
              }
            }
            if (output !== '') {
              output = '<ul>\n' + output + '</ul>\n';
              placeholder.innerHTML = output;
            }
          }
        });

        // Update state and property role references
        var getAllSubRoles = function (role) {
          var ref = subRoles[role];
          if (ref && ref.length) {
            var myList = [];
            ref.forEach(function (item) {
              if (!myList.item) {
                myList[item] = 1;
                myList.push(item);
                var childList = getAllSubRoles(item);
                myList = myList.concat(childList);
              }
            });
            return myList;
          } else {
            return [];
          }
        };

        Object.entries(propList).forEach(function (index) {
          var output = '';
          var item = index[1];
          var section = document.querySelector('#' + item.name);
          var placeholder = section.querySelector(
            '.state-applicability, .property-applicability'
          );
          if (
            placeholder &&
            (placeholder.textContent || placeholder.innerText) ===
              'Placeholder' &&
            item.roles.length
          ) {
            // update the used in roles list
            var sortedList = [];
            sortedList = item.roles.sort();
            for (var j = 0; j < sortedList.length; j++) {
              output += '<li><rref>' + sortedList[j] + '</rref></li>\n';
            }
            if (output !== '') {
              output = '<ul>\n' + output + '</ul>\n';
            }
            placeholder.innerHTML = output;
            // also update any inherited roles
            var myList = [];
            item.roles.forEach(function (role) {
              var children = getAllSubRoles(role);
              // Some subroles have required properties which are also required by the superclass.
              // Example: The checked state of radio, which is also required by superclass checkbox.
              // We only want to include these one time, so filter out the subroles.
              children = children.filter(function (subrole) {
                return subrole.indexOf(propList[item.name].roles) === -1;
              });
              myList = myList.concat(children);
            });
            placeholder = section.querySelector(
              '.state-descendants, .property-descendants'
            );
            if (placeholder && myList.length) {
              sortedList = myList.sort();
              output = '';
              var last = '';
              for (j = 0; j < sortedList.length; j++) {
                var sItem = sortedList[j];
                if (last != sItem) {
                  output += '<li><rref>' + sItem + '</rref></li>\n';
                  last = sItem;
                }
              }
              if (output !== '') {
                output = '<ul>\n' + output + '</ul>\n';
              }
              placeholder.innerHTML = output;
            }
          } else if (
            placeholder &&
            (placeholder.textContent || placeholder.innerText) ===
              'Use as a global deprecated in ARIA 1.2' &&
            item.roles.length
          ) {
            // update the used in roles list
            var sortedList = [];
            sortedList = item.roles.sort();
            //remove roletype from the sorted list
            const index = sortedList.indexOf('roletype');
            if (index > -1) {
              sortedList.splice(index, 1);
            }

            for (var j = 0; j < sortedList.length; j++) {
              output += '<li><rref>' + sortedList[j] + '</rref></li>\n';
            }
            if (output !== '') {
              output = '<ul>\n' + output + '</ul>\n';
            }
            placeholder.innerHTML = output;
            // also update any inherited roles
            var myList = [];
            item.roles.forEach(function (role) {
              var children = getAllSubRoles(role);
              // Some subroles have required properties which are also required by the superclass.
              // Example: The checked state of radio, which is also required by superclass checkbox.
              // We only want to include these one time, so filter out the subroles.
              children = children.filter(function (subrole) {
                return subrole.indexOf(propList[item.name].roles) === -1;
              });
              myList = myList.concat(children);
            });
            placeholder = section.querySelector(
              '.state-descendants, .property-descendants'
            );
            if (placeholder && myList.length) {
              sortedList = myList.sort();
              output = '';
              var last = '';
              for (j = 0; j < sortedList.length; j++) {
                var sItem = sortedList[j];
                if (last != sItem) {
                  output += '<li><rref>' + sItem + '</rref></li>\n';
                  last = sItem;
                }
              }
              if (output !== '') {
                output = '<ul>\n' + output + '</ul>\n';
              }
              placeholder.innerHTML = output;
            }
          }
          else if (
          placeholder &&
          (placeholder.textContent || placeholder.innerText) ===
            'All elements of the base markup except for some roles or elements that prohibit its use' &&
          item.roles.length
          ) {
            // for prohibited roles the roles list just includes those roles which are prohibited... weird I know but it is what it is
            var sortedList = [];
            sortedList = item.roles.sort();
            //remove roletype from the sorted list
            const index = sortedList.indexOf('roletype');
            if (index > -1) {
              sortedList.splice(index, 1);
            }
            output += 'All elements of the base markup except for the following roles: ';
            for (var j = 0; j < sortedList.length-1; j++) {
              output += '<rref>' + sortedList[j] + '</rref>, ';
            }
            output += '<rref>' + sortedList[sortedList.length-1] + '</rref>';
            placeholder.innerHTML = output;
          }
        });

        // spit out the index
        var node = document.getElementById('index_role');
        var parentNode = node.parentNode;
        var list = document.createElement('dl');
        list.id = 'index_role';
        list.className = 'compact';
        list.innerHTML = roleIndex;
        parentNode.replaceChild(list, node);

        // and the namefrom lists
        node = document.getElementById('index_fromauthor');
        if (node) {
          parentNode = node.parentNode;
          list = document.createElement('ul');
          list.id = 'index_fromauthor';
          list.className = 'compact';
          list.innerHTML = fromAuthor;
          parentNode.replaceChild(list, node);
        }

        node = document.getElementById('index_fromcontent');
        if (node) {
          parentNode = node.parentNode;
          list = document.createElement('ul');
          list.id = 'index_fromcontent';
          list.className = 'compact';
          list.innerHTML = fromContent;
          parentNode.replaceChild(list, node);
        }

        node = document.getElementById('index_fromencapsulation');
        if (node) {
          parentNode = node.parentNode;
          list = document.createElement('ul');
          list.id = 'index_fromencapsulation';
          list.className = 'compact';
          list.innerHTML = fromEncapsulation;
          parentNode.replaceChild(list, node);
        }

        node = document.getElementById('index_fromlegend');
        if (node) {
          parentNode = node.parentNode;
          list = document.createElement('ul');
          list.id = 'index_fromlegend';
          list.className = 'compact';
          list.innerHTML = fromLegend;
          parentNode.replaceChild(list, node);
        }

        node = document.getElementById('index_fromprohibited');
        if (node) {
          parentNode = node.parentNode;
          list = document.createElement('ul');
          list.id = 'index_fromprohibited';
          list.className = 'compact';
          list.innerHTML = fromProhibited;
          parentNode.replaceChild(list, node);
        }
        // assuming we found some parent roles, update those parents with their children
        for (var i = 0; i < subRoles.length; i++) {
          var item = subRoles[subRoles[i]];
          var sortedList = item.sort(function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
          });
          var output = '<ul>\n';
          for (var j = 0; j < sortedList.length; j++) {
            output += '<li><rref>' + sortedList[j] + '</rref></li>\n';
          }
          output += '</ul>\n';
          // put it somewhere
          var subRolesContainer = document.querySelector('#' + subRoles[i]);
          if (subRolesContainer) {
            var subRolesListContainer = subRolesContainer.querySelector(
              '.role-children'
            );
            if (subRolesListContainer) {
              subRolesListContainer.innerHTML = output;
            }
          }
        }
      }

      // prune out unused rows throughout the document
      Array.prototype.slice
        .call(
          document.querySelectorAll(
            '.role-abstract, .role-parent, .role-base, .role-related, .role-scope, .role-mustcontain, .role-required-properties, .role-properties, .role-namefrom, .role-namerequired, .role-namerequired-inherited, .role-childpresentational, .role-presentational-inherited, .state-related, .property-related,.role-inherited, .role-children, .property-descendants, .state-descendants, .implicit-values'
          )
        )
        .forEach(function (item) {
          var content = item.innerText;
          if (content.length === 1 || content.length === 0) {
            // there is no item - remove the row
            item.parentNode.parentNode.removeChild(item.parentNode);
          } else if (
            content === 'Placeholder' &&
            !skipIndex &&
            (item.className === 'role-inherited' ||
              item.className === 'role-children' ||
              item.className === 'property-descendants' ||
              item.className === 'state-descendants')
          ) {
            item.parentNode.remove();
          }
        });

      updateReferences(document);

      function cloneWithoutIds(node) {
        const clone = node.cloneNode(true);
        for (const elementWithId of clone.querySelectorAll("[id]")) {
          elementWithId.removeAttribute("id");
        }
        return clone;
      }
  }

require(['core/pubsubhub'], function (respecEvents) {
  const button = respecUI.addCommand(
    'Save roles as JSON',
    showAriaSave,
    null,
    '☁️'
  );

  function showAriaSave() {
    const json = JSON.stringify(roleInfo, null, '  ');
    const href = "data:text/html;charset=utf-8," + "/* This file is generated - do not modify */\nvar roleInfo = " + encodeURIComponent(json);
    const ariaUI = document.createElement('div');
    ariaUI.classList.add('respec-save-buttons');
    ariaUI.innerHTML = `
        <a href="${href}" download="roleInfo.json" class="respec-save-button">Save JSON</a>
      `;
    respecUI.freshModal('Save Aria roles as JSON', ariaUI, button);
    ariaUI.querySelector('a').focus();
  }
  respecEvents.sub('end', function (msg) {
    if (msg == 'w3c/conformance') {
      ariaAttributeReferences();
    }
  });
});

