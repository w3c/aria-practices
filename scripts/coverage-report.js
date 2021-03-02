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
  'cell',
  'checkbox',
  'columnheader',
  'combobox',
  'complementary',
  'contentinfo',
  'definition',
  'dialog',
  'directory',
  'document',
  'feed',
  'figure',
  'form',
  'grid',
  'gridcell',
  'group',
  'heading',
  'img',
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
  'navigation',
  'none',
  'note',
  'option',
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

console.log('Generating index...');

function getColumn(data, indexStart) {
  let count = 0;
  let index = data.lastIndexOf('<tr', indexStart);

  while (index > 0 && index <= indexStart) {
    let indexTd = data.indexOf('<td', index);
    let indexTh = data.indexOf('<th', index);

    index = Math.min(indexTh, indexTd);

    if (index <= indexStart) {
      count += 1;
    }

    index += 1;
  }

  return count;
}

function getRolesFromExample(data) {
  let roles = [];

  let indexStart = data.indexOf('<code>', 0);
  let indexEnd = data.indexOf('</code>', indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    let code = data.substring(indexStart + 6, indexEnd).trim();

    for (let i = 0; i < ariaRoles.length; i++) {
      if (
        getColumn(data, indexStart) === 1 &&
        code == ariaRoles[i] &&
        roles.indexOf(ariaRoles[i]) < 0
      ) {
        roles.push(ariaRoles[i]);
      }
    }

    indexStart = data.indexOf('<code>', indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('</code>', indexStart);
    }
  }

  return roles;
}

function getPropertiesAndStatesFromExample(data) {
  let propertiesAndStates = [];

  let indexStart = data.indexOf('<code>', 0);
  let indexEnd = data.indexOf('</code>', indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    let code = data.substring(indexStart + 6, indexEnd);

    for (let i = 0; i < ariaPropertiesAndStates.length; i++) {
      if (
        getColumn(data, indexStart) === 2 &&
        code.indexOf(ariaPropertiesAndStates[i]) >= 0 &&
        propertiesAndStates.indexOf(ariaPropertiesAndStates[i]) < 0
      ) {
        propertiesAndStates.push(ariaPropertiesAndStates[i]);
      }
    }

    indexStart = data.indexOf('<code>', indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('</code>', indexStart);
    }
  }

  return propertiesAndStates;
}

function addExampleToRoles(roles, example) {
  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];

    if (role === '') {
      continue;
    }

    if (!indexOfRolesInExamples[role]) {
      indexOfRolesInExamples[role] = [];
    }
    indexOfRolesInExamples[role].push(example);
  }
}

function addExampleToPropertiesAndStates(props, example) {
  for (let i = 0; i < props.length; i++) {
    let prop = props[i];

    if (prop === '') {
      continue;
    }

    if (!indexOfPropertiesAndStatesInExamples[prop]) {
      indexOfPropertiesAndStatesInExamples[prop] = [];
    }
    indexOfPropertiesAndStatesInExamples[prop].push(example);
  }
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

// Index roles, properties and states used in examples
glob
  .sync('examples/!(landmarks)/**/!(index).html', {
    cwd: path.join(__dirname, '..'),
    nodir: true,
  })
  .forEach(function (file) {
    let data = fs.readFileSync(file, 'utf8');
    let ref = file.replace('examples/', '../examples/');
    let title = data
      .substring(data.indexOf('<title>') + 7, data.indexOf('</title>'))
      .split('|')[0]
      .replace('Examples', '')
      .replace('Example of', '')
      .replace('Example', '')
      .trim();

    let example = {
      title: title,
      ref: ref,
    };

    addExampleToRoles(getRolesFromExample(data), example);
    addExampleToPropertiesAndStates(
      getPropertiesAndStatesFromExample(data),
      example
    );
  });

// Index roles, properties and states used in guidance

function getClosestId(data, index) {
  let id = '';
  let indexStart = data.lastIndexOf('id="', index);
  let indexEnd = data.indexOf('"', indexStart + 4);

  if (indexStart >= 0 && indexEnd >= 0) {
    id = data.substring(indexStart + 4, indexEnd);
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

function getHeaderContent(data, index) {
  let content = '';

  let indexStart = data.indexOf('>', index);
  let indexEnd = data.indexOf('</h', indexStart);

  if (indexStart > 1 && indexEnd > 1) {
    content = data.substring(indexStart + 1, indexEnd).trim();

    content = content.replace(/<code>/g, ' ');
    content = content.replace(/<\/code>/g, ' ');
  }

  return content;
}

function getRolesPropertiesAndStatesFromHeaders(data, url) {
  function getRolesPropertiesAndStatesFromHeader(level) {
    let indexStart = data.indexOf('<h' + level + '>', 0);
    let indexEnd = data.indexOf('</h' + level + '>', indexStart);

    while (indexStart > 1 && indexEnd > 1) {
      let content = getHeaderContent(data, indexStart);

      let contentItems = content.toLowerCase().split(' ');

      ariaRoles.forEach(function (role) {
        if (contentItems.indexOf(role) >= 0) {
          console.log('h' + level + ': ' + role + ', ' + content);
          addGuidanceToRole(role, url, content, getClosestId(data, indexStart));
        }
      });

      ariaPropertiesAndStates.forEach(function (prop) {
        if (contentItems.indexOf(prop) >= 0) {
          console.log('h' + level + ': ' + prop + ', ' + content);
          addGuidanceToPropertyOrState(
            prop,
            url,
            content,
            getClosestId(data, indexStart)
          );
        }
      });

      indexStart = data.indexOf('<h' + level + '>', indexEnd);

      if (indexStart > 0) {
        indexEnd = data.indexOf('</h' + level + '>', indexStart);
      }
    }
  }

  getRolesPropertiesAndStatesFromHeader(2);
  getRolesPropertiesAndStatesFromHeader(3);
  getRolesPropertiesAndStatesFromHeader(4);
  getRolesPropertiesAndStatesFromHeader(5);
  getRolesPropertiesAndStatesFromHeader(6);
}

function getRolesFromDataAttributesOnHeaders(data, url) {
  let indexStart = data.indexOf('data-aria-roles="', 0);
  let indexEnd = data.indexOf('"', indexStart + 17);

  while (indexStart > 1 && indexEnd > 1) {
    let content = getHeaderContent(data, indexStart);

    let roles = data
      .substring(indexStart + 17, indexEnd)
      .trim()
      .toLowerCase();

    roles = roles.split(' ');

    ariaRoles.forEach(function (role) {
      if (roles.indexOf(role) >= 0) {
        console.log('data: ' + role + ', ' + content);
        addGuidanceToRole(
          role,
          url,
          content + ' (D)',
          getClosestId(data, indexStart)
        );
      }
    });

    indexStart = data.indexOf('data-aria-roles="', indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('"', indexStart + 17);
    }
  }
}

function getPropertiesAndStatesFromDataAttributesOnHeaders(data, url) {
  let indexStart = data.indexOf('data-aria-props="', 0);
  let indexEnd = data.indexOf('"', indexStart + 17);

  while (indexStart > 1 && indexEnd > 1) {
    let content = getHeaderContent(data, indexStart);

    let props = data
      .substring(indexStart + 17, indexEnd)
      .trim()
      .toLowerCase();

    props = props.split(' ');

    ariaPropertiesAndStates.forEach(function (prop) {
      if (props.indexOf(prop) >= 0) {
        console.log('data: ' + prop + ', ' + content);
        addGuidanceToPropertyOrState(
          prop,
          url,
          content + ' (D)',
          getClosestId(data, indexStart)
        );
      }
    });

    indexStart = data.indexOf('data-aria-props="', indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('"', indexStart + 17);
    }
  }
}
function getRolesPropertiesAndStatesFromGuidance(data, url) {
  getRolesPropertiesAndStatesFromHeaders(data, url);
  getRolesFromDataAttributesOnHeaders(data, url);
  getPropertiesAndStatesFromDataAttributesOnHeaders(data, url);
}

let data = fs.readFileSync(
  path.join(__dirname, '../aria-practices.html'),
  'utf8'
);

getRolesPropertiesAndStatesFromGuidance(data, '../aria-practices.html');

// Add landmark examples, since they are a different format
addLandmarkRole(
  ['banner'],
  false,
  'Banner Landmark',
  '../examples/landmarks/banner.html'
);
addGuidanceToRole(
  'banner',
  '../aria-practices.html',
  'Banner',
  'aria_lh_banner'
);

addLandmarkRole(
  ['complementary'],
  true,
  'Complementary Landmark',
  '../examples/landmarks/complementary.html'
);
addGuidanceToRole(
  'complementary',
  '../aria-practices.html',
  'Complementary',
  'aria_lh_complementary'
);

addLandmarkRole(
  ['contentinfo'],
  false,
  'Contentinfo Landmark',
  '../examples/landmarks/contentinfo.html'
);
addGuidanceToRole(
  'contentinfo',
  '../aria-practices.html',
  'Contentinfo',
  'aria_lh_contentinfo'
);

addLandmarkRole(
  ['form'],
  true,
  'Form Landmark',
  '../examples/landmarks/form.html'
);
addGuidanceToRole('form', '../aria-practices.html', 'Form', 'aria_lh_form');

addLandmarkRole(
  ['main'],
  true,
  'Main Landmark',
  '../examples/landmarks/main.html'
);
addGuidanceToRole('main', '../aria-practices.html', 'Main', 'aria_lh_main');

addLandmarkRole(
  ['navigation'],
  true,
  'Navigation Landmark',
  '../examples/landmarks/navigation.html'
);
addGuidanceToRole(
  'navigation',
  '../aria-practices.html',
  'Navigation',
  'aria_lh_navigation'
);

addLandmarkRole(
  ['region'],
  true,
  'Region Landmark',
  '../examples/landmarks/region.html'
);
addGuidanceToRole(
  'region',
  '../aria-practices.html',
  'Region',
  'aria_lh_region'
);

addLandmarkRole(
  ['search'],
  true,
  'Search Landmark',
  '../examples/landmarks/search.html'
);
addGuidanceToRole(
  'search',
  '../aria-practices.html',
  'Search',
  'aria_lh_search'
);

function getListItem(item) {
  return `
        <li><a href="${item.ref}">${item.title}</a></li>`;
}

function getListHTML(list) {
  let html = '<abbr title="none" style="color: gray">-</abbr>';

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
