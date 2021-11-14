#!/usr/bin/env node
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   coverage-report.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');
const HTMLParser = require('node-html-parser');

const exampleFilePath = path.join(__dirname, '..', 'coverage', 'index.html');
const exampleTemplatePath = path.join(__dirname, 'coverage-report.template');

const csvRoleFilePath = path.join(
  __dirname,
  '..',
  'coverage',
  'role-coverage.csv'
);
const csvPropFilePath = path.join(
  __dirname,
  '..',
  'coverage',
  'prop-coverage.csv'
);

let output = fs.readFileSync(exampleTemplatePath, function (err) {
  console.log('Error reading aria index:', err);
});

const $ = cheerio.load(output);

const ariaRoles = [
  'alert',
  'alertdialog',
  'application',
  'article',
  'banner',
  'button',
  'caption',
  'cell',
  'checkbox',
  'code',
  'columnheader',
  'combobox',
  'complementary',
  'contentinfo',
  'definition',
  'deletion',
  'dialog',
  'directory',
  'document',
  'emphasis',
  'feed',
  'figure',
  'form',
  'generic',
  'grid',
  'gridcell',
  'group',
  'heading',
  'img',
  'input',
  'insertion',
  'link',
  'list',
  'listbox',
  'listitem',
  'log',
  'main',
  'marquee',
  'math',
  'menu',
  'menubar',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'meter',
  'navigation',
  'none',
  'note',
  'option',
  'paragraph',
  'presentation',
  'progressbar',
  'radio',
  'radiogroup',
  'region',
  'row',
  'rowgroup',
  'rowheader',
  'scrollbar',
  'search',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'status',
  'switch',
  'tab',
  'table',
  'tablist',
  'tabpanel',
  'term',
  'textbox',
  'timer',
  'toolbar',
  'tooltip',
  'tree',
  'treegrid',
  'treeitem',
];

const ariaPropertiesAndStates = [
  'aria-activedescendant',
  'aria-atomic',
  'aria-autocomplete',
  'aria-busy',
  'aria-checked',
  'aria-colcount',
  'aria-colindex',
  'aria-colspan',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-dropeffect',
  'aria-errormessage',
  'aria-expanded',
  'aria-flowto',
  'aria-grabbed',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-level',
  'aria-live',
  'aria-modal',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-owns',
  'aria-placeholder',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-relevant',
  'aria-required',
  'aria-roledescription',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowspan',
  'aria-selected',
  'aria-setsize',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
];

let indexOfRolesInExamples = {};
ariaRoles.forEach(function (role) {
  indexOfRolesInExamples[role] = [];
});

let indexOfRolesInGuidance = {};
ariaRoles.forEach(function (role) {
  indexOfRolesInGuidance[role] = [];
});

let indexOfPropertiesAndStatesInExamples = {};
ariaPropertiesAndStates.forEach(function (prop) {
  indexOfPropertiesAndStatesInExamples[prop] = [];
});

let indexOfPropertiesAndStatesInGuidance = {};
ariaPropertiesAndStates.forEach(function (prop) {
  indexOfPropertiesAndStatesInGuidance[prop] = [];
});

let indexOfExamples = [];

console.log('Generating index...');

function getRoles(html) {
  let roles = [];

  let exampleRoles = html.querySelectorAll(
    'table.data.attributes tbody tr > th:first-child code'
  );

  for (let i = 0; i < exampleRoles.length; i++) {
    let code = exampleRoles[i].textContent.toLowerCase().trim();
    for (let j = 0; j < ariaRoles.length; j++) {
      const hasRole = RegExp('\\b' + ariaRoles[j] + '\\b');

      if (hasRole.test(code) && roles.indexOf(ariaRoles[j]) < 0) {
        console.log('  [role]: ' + code);
        roles.push(ariaRoles[j]);
      }
    }
  }

  return roles;
}

function getPropertiesAndStates(html) {
  let propertiesAndStates = [];

  let exampleProps = html.querySelectorAll(
    'table.data.attributes tbody tr > th:nth-child(2) code'
  );

  for (let i = 0; i < exampleProps.length; i++) {
    let code = exampleProps[i].textContent.toLowerCase().trim().split('=')[0];
    for (let j = 0; j < ariaPropertiesAndStates.length; j++) {
      const hasPropOrState = RegExp('\\b' + ariaPropertiesAndStates[j] + '\\b');
      if (
        hasPropOrState.test(code) &&
        propertiesAndStates.indexOf(ariaPropertiesAndStates[j]) < 0
      ) {
        console.log('  [propertyOrState]: ' + code);
        propertiesAndStates.push(ariaPropertiesAndStates[j]);
      }
    }
  }

  return propertiesAndStates;
}

function addExampleToRoles(roles, example) {
  let items = [];
  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];

    if (role === '') {
      continue;
    }

    if (!indexOfRolesInExamples[role]) {
      indexOfRolesInExamples[role] = [];
    }
    indexOfRolesInExamples[role].push(example);
    items.push(role);
  }
  return items;
}

function addExampleToPropertiesAndStates(props, example) {
  let items = [];
  for (let i = 0; i < props.length; i++) {
    let prop = props[i];

    if (prop === '') {
      continue;
    }

    if (!indexOfPropertiesAndStatesInExamples[prop]) {
      indexOfPropertiesAndStatesInExamples[prop] = [];
    }
    indexOfPropertiesAndStatesInExamples[prop].push(example);
    items.push(prop);
  }

  return items;
}

function addLandmarkRole(landmark, hasLabel, title, ref) {
  let example = {
    title: title,
    ref: ref,
  };

  addExampleToRoles(landmark, example);
  if (hasLabel) {
    addExampleToPropertiesAndStates(['aria-labelledby'], example);
  }
}

function getNumberOfReferences(data, target, toLower) {
  if (typeof toLower === 'boolean' && toLower) {
    data = data.toLowerCase();
    target = target.toLowerCase();
  }

  const hasTarget = RegExp('\\b' + target + '\\b', 'g');
  let count = 0;
  while (hasTarget.test(data)) {
    count += 1;
    hasTarget.lastIndex;
  }
  return count;
}

function getUniqueRolesInExample(html, dataJS) {
  let roles = [];
  ariaRoles.forEach((role) => {
    let items = html.querySelectorAll('#ex1 [role=' + role + ']');
    if (items.length) {
      roles.push(role);
    } else {
      let items = html.querySelectorAll('#ex2 [role=' + role + ']');
      if (items.length) {
        roles.push(role);
      } else {
        let items = html.querySelectorAll('#ex3 [role=' + role + ']');
        if (items.length) {
          roles.push(role);
        } else {
          let id = getExampleCodeId(html);
          items = html.querySelectorAll('#' + id + ' [role=' + role + ']');
          if (items.length) {
            roles.push(role);
          } else {
            // Check Javascript

            const hasRole1 = RegExp(".role = '" + role, 'g');
            const hasRole2 = RegExp('.role = "' + role, 'g');
            if (hasRole1.test(dataJS) || hasRole2.test(dataJS)) {
              roles.push(role);
            } else {
              // Check for elements with default landmark roles
              switch (role) {
                case 'banner':
                  items = html.querySelectorAll('#' + id + ' header');
                  if (items.length) {
                    roles.push(role);
                  }
                  break;

                case 'complementary':
                  items = html.querySelectorAll('#' + id + ' aside');
                  if (items.length) {
                    roles.push(role);
                  }
                  break;

                case 'contentinfo':
                  items = html.querySelectorAll('#' + id + ' footer');
                  if (items.length) {
                    roles.push(role);
                  }
                  break;

                case 'navigation':
                  items = html.querySelectorAll('#' + id + ' nav');
                  if (items.length) {
                    roles.push(role);
                  }
                  break;

                case 'region':
                  items = html.querySelectorAll(
                    '#' + id + ' section[aria-label]'
                  );
                  if (items.length) {
                    roles.push(role);
                  }
                  items = html.querySelectorAll(
                    '#' + id + ' section[aria-labelledby]'
                  );
                  if (items.length) {
                    roles.push(role);
                  }
                  items = html.querySelectorAll('#' + id + ' section[title]');
                  if (items.length) {
                    roles.push(role);
                  }
                  break;

                default:
                  break;
              }
            }
          }
        }
      }
    }
  });
  roles.forEach((role) => console.log('  [Example role]: ' + role));
  console.log('  [Example Roles]: ' + roles.length);
  return roles;
}

function getUniqueAriaAttributeInExample(html, dataJS) {
  let attributes = [];

  ariaPropertiesAndStates.forEach(function (attribute) {
    let items = html.querySelectorAll('#ex1 [' + attribute + ']');
    if (items.length) {
      attributes.push(attribute);
    } else {
      items = html.querySelectorAll('#ex2 [' + attribute + ']');
      if (items.length) {
        attributes.push(attribute);
      } else {
        items = html.querySelectorAll('#ex3 [' + attribute + ']');
        if (items.length) {
          attributes.push(attribute);
        } else {
          let id = getExampleCodeId(html);
          items = html.querySelectorAll('#' + id + ' [' + attribute + ']');
          if (items.length) {
            attributes.push(attribute);
          } else {
            const hasAttribute1 = RegExp(attribute, 'g');
            let parts = attribute.split('-');
            let attribute2 =
              '.' +
              parts[0] +
              parts[1][0].toUpperCase() +
              parts[1].substring(1, parts[1].length - 1);

            const hasAttribute2 = RegExp(attribute2, 'g');
            if (hasAttribute1.test(dataJS) || hasAttribute2.test(dataJS)) {
              attributes.push(attribute);
            }
          }
        }
      }
    }
  });
  attributes.forEach((attribute) =>
    console.log('  [Example aria-* Attribute]: ' + attribute)
  );
  console.log('  [Example aria-* Attributes]: ' + attributes.length);
  return attributes;
}

function getExampleCodeId(html) {
  let startSeparator = html.querySelector('[role="separator"]');
  if (startSeparator && startSeparator.nextElementSibling.id) {
    return startSeparator.nextElementSibling.id;
  }
  return 'not found';
}

// Index roles, properties and states used in examples
glob
  .sync('examples/!(landmarks)/**/!(index).html', {
    cwd: path.join(__dirname, '..'),
    nodir: true,
  })
  .forEach(function (file) {
    console.log('[file]: ' + file);
    let dir = path.dirname(file);
    console.log('[ dir]: ' + dir);

    // Ignore any files in the 'examples/js` directory
    if (dir.indexOf('examples/js') >= 0) {
      return;
    }

    // Ignore any files in the 'examples/template` directory
    if (dir.indexOf('examples/coding-template') >= 0) {
      return;
    }

    if (file.toLowerCase().indexOf('deprecated') >= 0) {
      console.log('  [ignored]');
      return;
    }

    let data = fs.readFileSync(file, 'utf8');

    let html = HTMLParser.parse(data);

    let dataJS = '';
    let scripts = html.querySelectorAll('script[src]');
    for (let i = 0; i < scripts.length; i++) {
      let src = scripts[i].getAttribute('src');
      if (
        src.indexOf('examples.js') < 0 &&
        src.indexOf('highlight.pack.js') < 0 &&
        src.indexOf('app.js') < 0
      ) {
        console.log('  [script]: ' + src);
        dataJS += fs.readFileSync(path.join(dir, src), 'utf8');
      }
      dataJS += ' ';
    }

    let dataCSS = '';
    let cssFiles = html.querySelectorAll('link[href]');
    for (let i = 0; i < cssFiles.length; i++) {
      let href = cssFiles[i].getAttribute('href');
      if (
        href.indexOf('base.css') < 0 &&
        href.indexOf('core.css') < 0 &&
        href.indexOf('all.css') < 0
      ) {
        console.log('  [link]: ' + href);
        dataCSS += fs.readFileSync(path.join(dir, href), 'utf8');
      }
      dataCSS += ' ';
    }

    let ref = path.join('..', file);
    let title = html
      .querySelector('title')
      .textContent.split('|')[0]
      .replace('Examples', '')
      .replace('Example of', '')
      .replace('Example', '')
      .trim();

    let example = {
      title: title,
      ref: ref,

      codeId: getExampleCodeId(html),

      exampleRoles: getUniqueRolesInExample(html, dataJS),
      exampleAttributes: getUniqueAriaAttributeInExample(html, dataJS),

      highContrast: data.toLowerCase().indexOf('high contrast') > 0,
      svgHTML: html.querySelectorAll('svg').length,
      svgCSS: getNumberOfReferences(dataCSS, 'svg', true),
      contentCSS: getNumberOfReferences(dataCSS, 'content'),
      beforeCSS: getNumberOfReferences(dataCSS, '::before'),
      afterCSS: getNumberOfReferences(dataCSS, '::after'),
      forcedColorAdjust: getNumberOfReferences(dataCSS, 'forced-color-adjust'),

      svgJS: getNumberOfReferences(dataJS, 'svg', true),
      classJS: getNumberOfReferences(dataJS, 'constructor\\('),
      prototypeJS: getNumberOfReferences(dataJS, '.prototype.'),
      keyCodeJS: getNumberOfReferences(dataJS, '.keyCode'),
      whichJS: getNumberOfReferences(dataJS, '.which'),
      hasExternalJS: dataJS.length > 0,

      mouseDown: getNumberOfReferences(dataJS, 'mousedown', true),
      mouseEnter: getNumberOfReferences(dataJS, 'mouseenter', true),
      mouseLeave: getNumberOfReferences(dataJS, 'mouseleave', true),
      mouseMove: getNumberOfReferences(dataJS, 'mousemove', true),
      mouseOut: getNumberOfReferences(dataJS, 'mouseout', true),
      mouseOver: getNumberOfReferences(dataJS, 'mouseover', true),
      mouseUp: getNumberOfReferences(dataJS, 'mouseup', true),

      pointerDown: getNumberOfReferences(dataJS, 'pointerdown', true),
      pointerEnter: getNumberOfReferences(dataJS, 'pointerenter', true),
      pointerLeave: getNumberOfReferences(dataJS, 'pointerleave', true),
      pointerMove: getNumberOfReferences(dataJS, 'pointermove', true),
      pointerOut: getNumberOfReferences(dataJS, 'pointerout', true),
      pointerOver: getNumberOfReferences(dataJS, 'pointerover', true),
      pointerUp: getNumberOfReferences(dataJS, 'pointerup', true),
    };

    (example.documentationRoles = addExampleToRoles(getRoles(html), example)),
      console.log(
        '  [Documentation Roles]: ' + example.documentationRoles.length
      );
    (example.documentationAttributes = addExampleToPropertiesAndStates(
      getPropertiesAndStates(html),
      example
    )),
      console.log(
        '  [Documentation aria-* Attributes]: ' +
          example.documentationAttributes.length
      );

    indexOfExamples.push(example);
  });

// Index roles, properties and states used in guidance

function getClosestId(node) {
  let id = '';

  node = node.parentNode;

  while (node) {
    if (node.id) {
      return node.id;
    }
    node = node.parentNode;
  }

  return id;
}

function addGuidanceToRole(role, url, label, id) {
  let r = {};
  r.title = label;
  r.ref = url + '#' + id;

  if (!indexOfRolesInGuidance[role]) {
    indexOfRolesInGuidance[role] = [];
  }
  indexOfRolesInGuidance[role].push(r);
}

function addGuidanceToPropertyOrState(prop, url, label, id) {
  let r = {};
  r.title = label;
  r.ref = url + '#' + id;

  if (!indexOfPropertiesAndStatesInGuidance[prop]) {
    indexOfPropertiesAndStatesInGuidance[prop] = [];
  }
  indexOfPropertiesAndStatesInGuidance[prop].push(r);
}

function getRolesPropertiesAndStatesFromHeaders(html, url) {
  let dataHeadings = html.querySelectorAll('h2, h3, h4, h4, h5, h6');

  for (let i = 0; i < dataHeadings.length; i++) {
    let dataHeading = dataHeadings[i];
    let tagName = dataHeading.tagName;
    let content = dataHeading.textContent;
    let contentItems = content.toLowerCase().split(' ');

    ariaRoles.forEach(function (role) {
      if (contentItems.indexOf(role) >= 0) {
        console.log(tagName + ': ' + role + ', ' + content);
        addGuidanceToRole(role, url, content, getClosestId(dataHeading));
      }
    });

    ariaPropertiesAndStates.forEach(function (prop) {
      if (contentItems.indexOf(prop) >= 0) {
        console.log(tagName + ': ' + prop + ', ' + content);
        addGuidanceToPropertyOrState(
          prop,
          url,
          content,
          getClosestId(dataHeading)
        );
      }
    });
  }
}

function getRolesFromDataAttributesOnHeaders(html, url) {
  let dataRoles = html.querySelectorAll('[data-aria-roles]');

  for (let i = 0; i < dataRoles.length; i++) {
    let dataRole = dataRoles[i];
    let roles = dataRole.textContent.split(' ');
    let content = dataRole.textContent;

    ariaRoles.forEach(function (role) {
      if (roles.indexOf(role) >= 0) {
        console.log('data: ' + role + ', ' + content);
        addGuidanceToRole(role, url, content + ' (D)', getClosestId(dataRole));
      }
    });
  }
}

function getPropertiesAndStatesFromDataAttributesOnHeaders(html, url) {
  let dataProps = html.querySelectorAll('[data-aria-props]');

  for (let i = 0; i < dataProps.length; i++) {
    let dataProp = dataProps[i];
    let props = dataProp.textContent.split(' ');
    let content = dataProp.textContent;

    ariaPropertiesAndStates.forEach(function (prop) {
      if (props.indexOf(prop) >= 0) {
        console.log('data: ' + prop + ', ' + content);
        addGuidanceToPropertyOrState(
          prop,
          url,
          content + ' (D)',
          getClosestId(dataProp)
        );
      }
    });
  }
}

function getRolesPropertiesAndStatesFromGuidance(html, url) {
  getRolesPropertiesAndStatesFromHeaders(html, url);
  getRolesFromDataAttributesOnHeaders(html, url);
  getPropertiesAndStatesFromDataAttributesOnHeaders(html, url);
}

let data = fs.readFileSync(
  path.join(__dirname, '../aria-practices.html'),
  'utf8'
);

let html = HTMLParser.parse(data);

getRolesPropertiesAndStatesFromGuidance(html, '../aria-practices.html');

// Add landmark examples, since they are a different format
addLandmarkRole(
  ['banner'],
  false,
  'Banner Landmark',
  '../examples/landmarks/banner.html'
);

addLandmarkRole(
  ['complementary'],
  true,
  'Complementary Landmark',
  '../examples/landmarks/complementary.html'
);

addLandmarkRole(
  ['contentinfo'],
  false,
  'Contentinfo Landmark',
  '../examples/landmarks/contentinfo.html'
);

addLandmarkRole(
  ['form'],
  true,
  'Form Landmark',
  '../examples/landmarks/form.html'
);

addLandmarkRole(
  ['main'],
  true,
  'Main Landmark',
  '../examples/landmarks/main.html'
);

addLandmarkRole(
  ['navigation'],
  true,
  'Navigation Landmark',
  '../examples/landmarks/navigation.html'
);

addLandmarkRole(
  ['region'],
  true,
  'Region Landmark',
  '../examples/landmarks/region.html'
);

addLandmarkRole(
  ['search'],
  true,
  'Search Landmark',
  '../examples/landmarks/search.html'
);

function getListItem(item) {
  let highContrast = '';
  if (item.highContrast) {
    highContrast = ' (<abbr title="High Contrast Support">HC</abbr>)';
  }
  return `
                <li><a href="${item.ref}">${item.title}</a>${highContrast}</li>`;
}

function getListHTML(list) {
  //  let html = '<abbr title="none" style="color: gray">-</abbr>';
  let html = '';

  if (list.length === 1) {
    html = `<a href="${list[0].ref}">${list[0].title}</a>\n`;
  } else {
    if (list.length > 1) {
      html = `<ul>${list.map(getListItem).join('')}
            </ul>\n`;
    }
  }

  return html;
}

let sortedRoles = Object.getOwnPropertyNames(indexOfRolesInExamples).sort();

let countNoExamples = 0;
let countOneExample = 0;
let countMoreThanOneExample = 0;

let RoleWithNoExamples = sortedRoles.reduce(function (set, role) {
  let examples = indexOfRolesInExamples[role];
  let guidance = indexOfRolesInGuidance[role];

  if (examples.length === 0 && guidance.length == 0) {
    countNoExamples += 1;
    return `${set}
            <li><code>${role}</code></li>`;
  }

  return `${set}`;
}, '');

$('#roles_with_no_examples_ul').html(RoleWithNoExamples);

let RoleWithOneExample = sortedRoles.reduce(function (set, role) {
  let examples = indexOfRolesInExamples[role];
  let guidance = indexOfRolesInGuidance[role];

  if (
    (examples.length === 1 && guidance.length === 0) ||
    (examples.length === 0 && guidance.length === 1) ||
    (examples.length === 1 && guidance.length === 1)
  ) {
    countOneExample += 1;
    return `${set}
          <tr>
            <td><code>${role}</code></td>
            <td>${getListHTML(guidance)}</td>
            <td>${getListHTML(examples)}</td>
          </tr>`;
  }

  return `${set}`;
}, '');

$('#roles_with_one_example_tbody').html(RoleWithOneExample);

let RoleWithMoreThanOneExample = sortedRoles.reduce(function (set, role) {
  let examples = indexOfRolesInExamples[role];
  let guidance = indexOfRolesInGuidance[role];

  if (examples.length > 1 || guidance.length > 1) {
    countMoreThanOneExample += 1;
    return `${set}
          <tr>
            <td><code>${role}</code></td>
            <td>${getListHTML(guidance)}</td>
            <td>${getListHTML(examples)}</td>
          </tr>`;
  }

  return `${set}`;
}, '');

$('#roles_with_more_than_one_tbody').html(RoleWithMoreThanOneExample);

$('.roles_with_no_examples_count').html(countNoExamples.toString());
$('.roles_with_one_example_count').html(countOneExample.toString());
$('.roles_with_more_than_one_examples_count').html(
  countMoreThanOneExample.toString()
);

// Properties and States

let sortedPropertiesAndStates = Object.getOwnPropertyNames(
  indexOfPropertiesAndStatesInExamples
).sort();

countNoExamples = 0;
countOneExample = 0;
countMoreThanOneExample = 0;

let PropsWithNoExamples = sortedPropertiesAndStates.reduce(function (
  set,
  prop
) {
  let examples = indexOfPropertiesAndStatesInExamples[prop];
  let guidance = indexOfPropertiesAndStatesInGuidance[prop];

  if (examples.length === 0 && guidance.length === 0) {
    countNoExamples += 1;
    return `${set}
            <li><code>${prop}</code></li>`;
  }

  return `${set}`;
},
'');

$('#props_with_no_examples_ul').html(PropsWithNoExamples);
$('.props_with_no_examples_count').html(countNoExamples.toString());

let PropsWithOneExample = sortedPropertiesAndStates.reduce(function (
  set,
  prop
) {
  let examples = indexOfPropertiesAndStatesInExamples[prop];
  let guidance = indexOfPropertiesAndStatesInGuidance[prop];

  if (
    (examples.length === 1 && guidance.length === 0) ||
    (examples.length === 0 && guidance.length === 1) ||
    (examples.length === 1 && guidance.length === 1)
  ) {
    countOneExample += 1;
    return `${set}
          <tr>
            <td><code>${prop}</code></td>
            <td>${getListHTML(guidance)}</td>
            <td>${getListHTML(examples)}</td>
          </tr>`;
  }

  return `${set}`;
},
'');

$('#props_with_one_example_tbody').html(PropsWithOneExample);
$('.props_with_one_example_count').html(countOneExample.toString());

let PropsWithMoreThanOneExample = sortedPropertiesAndStates.reduce(function (
  set,
  prop
) {
  let examples = indexOfPropertiesAndStatesInExamples[prop];
  let guidance = indexOfPropertiesAndStatesInGuidance[prop];

  if (examples.length > 1 || guidance.length > 1) {
    countMoreThanOneExample += 1;

    return `${set}
          <tr>
            <td><code>${prop}</code></td>
            <td>${getListHTML(guidance)}</td>
            <td>${getListHTML(examples)}</td>
          </tr>`;
  }

  return `${set}`;
},
'');

$('#props_with_more_than_one_tbody').html(PropsWithMoreThanOneExample);
$('.props_with_more_than_one_examples_count').html(
  countMoreThanOneExample.toString()
);

// Example Coding Practices

function htmlYesOrNo(flag) {
  return flag ? 'Yes' : '';
}

let IndexOfExampleCodingPractices = indexOfExamples.reduce(function (
  set,
  example
) {
  function getDifference(a1, a2) {
    let diff = [];

    a1.forEach((item) => {
      if (!a2.includes(item)) {
        diff.push(item);
      }
    });

    a2.forEach((item) => {
      if (!a1.includes(item)) {
        diff.push(item);
      }
    });

    return diff;
  }

  let using = '';
  if (example.hasExternalJS) {
    if (example.classJS) {
      using += 'class';
    }
    if (example.prototypeJS) {
      if (example.classJS) {
        using += ', ';
      }
      using += 'prototype';
    }
  }

  let checkDocumentation = [];

  let rolesDiff = getDifference(
    example.exampleRoles,
    example.documentationRoles
  );
  let attributesDiff = getDifference(
    example.exampleAttributes,
    example.documentationAttributes
  );

  if (rolesDiff.length) {
    checkDocumentation.push(rolesDiff);
  }

  if (attributesDiff.length) {
    checkDocumentation.push(attributesDiff);
  }

  return `${set}
          <tr>
            <td><a href="${example.ref}">${example.title}</code></td>
            <td>${using}</td>
            <td>${htmlYesOrNo(example.keyCodeJS)}</td>
            <td>${htmlYesOrNo(example.whichJS)}</td>
            <td>${htmlYesOrNo(example.highContrast)}</td>
            <td>${example.codeId}</td>
            <td>${example.exampleRoles.length}</td>
            <td>${example.documentationRoles.length}</td>
            <td>${example.exampleAttributes.length}</td>
            <td>${example.documentationAttributes.length}</td>
            <td>${checkDocumentation}</td>
          </tr>`;
},
'');

let IndexOfExampleGraphics = indexOfExamples.reduce(function (set, example) {
  let count = example.svgHTML;
  count += example.svgCSS;
  count += example.svgJS;
  count += example.forcedColorAdjust;
  count += example.beforeCSS;
  count += example.afterCSS;
  count += example.contentCSS;

  if (count === 0) {
    return `${set}`;
  }
  return `${set}
          <tr>
            <td><a href="${example.ref}">${example.title}</code></td>
            <td>${htmlYesOrNo(example.svgHTML)}</td>
            <td>${htmlYesOrNo(example.svgCSS)}</td>
            <td>${htmlYesOrNo(example.svgJS)}</td>
            <td>${htmlYesOrNo(example.forcedColorAdjust)}</td>
            <td>${htmlYesOrNo(example.beforeCSS)}</td>
            <td>${htmlYesOrNo(example.afterCSS)}</td>
            <td>${htmlYesOrNo(example.contentCSS)}</td>
          </tr>`;
}, '');

let IndexOfExampleMousePointer = indexOfExamples.reduce(function (
  set,
  example
) {
  let mouseCount = example.mouseDown;
  mouseCount += example.mouseEnter;
  mouseCount += example.mouseLeave;
  mouseCount += example.mouseMove;
  mouseCount += example.mouseOut;
  mouseCount += example.mouseOver;
  mouseCount += example.mouseUp;

  let pointerCount = example.pointerDown;
  pointerCount += example.pointerEnter;
  pointerCount += example.pointerLeave;
  pointerCount += example.pointerMove;
  pointerCount += example.pointerOut;
  pointerCount += example.pointerOver;
  pointerCount += example.pointerUp;

  if (mouseCount === 0 && pointerCount === 0) {
    return `${set}`;
  }

  return `${set}
          <tr>
            <td><a href="${example.ref}">${example.title}</code></td>
            <td>${htmlYesOrNo(mouseCount)}</td>
            <td>${htmlYesOrNo(pointerCount)}</td>
          </tr>`;
},
'');

let countClass = indexOfExamples.reduce(function (set, example) {
  return set + (example.classJS ? 1 : 0);
}, 0);

let countPrototype = indexOfExamples.reduce(function (set, example) {
  return set + (example.prototypeJS ? 1 : 0);
}, 0);

let countHighContrast = indexOfExamples.reduce(function (set, example) {
  return set + (example.highContrast ? 1 : 0);
}, 0);

let countKeyCode = indexOfExamples.reduce(function (set, example) {
  return set + (example.keyCodeJS ? 1 : 0);
}, 0);

let countWhich = indexOfExamples.reduce(function (set, example) {
  return set + (example.whichJS ? 1 : 0);
}, 0);

let countSVG = indexOfExamples.reduce(function (set, example) {
  let svg = example.svgHTML ? 1 : 0;
  if (!svg && (example.svgCSS || example.svgJS)) {
    svg = 1;
  }

  return set + svg;
}, 0);

let countMouse = indexOfExamples.reduce(function (set, example) {
  let count = example.mouseDown;
  count += example.mouseEnter;
  count += example.mouseLeave;
  count += example.mouseMove;
  count += example.mouseOut;
  count += example.mouseOver;
  count += example.mouseUp;

  return set + (count ? 1 : 0);
}, 0);

let countPointer = indexOfExamples.reduce(function (set, example) {
  let count = example.pointerDown;
  count += example.pointerEnter;
  count += example.pointerLeave;
  count += example.pointerMove;
  count += example.pointerOut;
  count += example.pointerOver;
  count += example.pointerUp;

  return set + (count ? 1 : 0);
}, 0);

let countForcedColorAdjust = indexOfExamples.reduce(function (set, example) {
  return set + (example.forcedColorAdjust ? 1 : 0);
}, 0);

$('#example_coding_practices_tbody').html(IndexOfExampleCodingPractices);
$('#example_graphics_techniques_tbody').html(IndexOfExampleGraphics);
$('#example_mouse_pointer_tbody').html(IndexOfExampleMousePointer);

$('#example_summary_total').html(indexOfExamples.length);
$('#example_summary_hc').html(countHighContrast);
$('#example_summary_svg').html(countSVG);
$('#example_summary_force_color').html(countForcedColorAdjust);
$('#example_summary_keycode').html(countKeyCode);
$('#example_summary_which').html(countWhich);
$('#example_summary_class').html(countClass);
$('#example_summary_prototype').html(countPrototype);
$('#example_summary_mouse').html(countMouse);
$('#example_summary_pointer').html(countPointer);

// cheerio seems to fold the doctype lines despite the template
const result = $.html()
  .replace('<!DOCTYPE html>', '<!DOCTYPE html>\n')
  .replace(
    '<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">',
    '<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">\n'
  );

fs.writeFile(exampleFilePath, result, function (err) {
  if (err) {
    console.log('Error saving updated aria practices:', err);
  }
});

// Output CSV files

let roles = '"Role","Guidance","Examples","References"\n';
roles += sortedRoles.reduce(function (line, role) {
  let examples = indexOfRolesInExamples[role];
  let guidance = indexOfRolesInGuidance[role];

  let csvExampleTitles = examples.reduce(function (set, e) {
    return `${set},"Example: ${e.title}"`;
  }, '');
  let csvGuidanceTitles = guidance.reduce(function (set, g) {
    return `${set},"Guidance: ${g.title}"`;
  }, '');

  return `${line}"${role}","${guidance.length}","${examples.length}"${csvGuidanceTitles}${csvExampleTitles}\n`;
}, '');

fs.writeFile(csvRoleFilePath, roles, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  //file written successfully
});

let props = '"Property or State","Guidance","Examples","References"\n';
props += sortedPropertiesAndStates.reduce(function (line, prop) {
  let examples = indexOfPropertiesAndStatesInExamples[prop];
  let guidance = indexOfPropertiesAndStatesInGuidance[prop];

  let csvExampleTitles = examples.reduce(function (set, e) {
    return `${set},"Example: ${e.title}"`;
  }, '');
  let csvGuidanceTitles = guidance.reduce(function (set, g) {
    return `${set},"Guidance: ${g.title}"`;
  }, '');

  return `${line}"${prop}","${guidance.length}","${examples.length}"${csvGuidanceTitles}${csvExampleTitles}\n`;
}, '');

fs.writeFile(csvPropFilePath, props, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  //file written successfully
});
