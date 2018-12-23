#!/usr/bin/env node
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   reference-tables.js
 */

const fs = require('fs');
const path = require('path');

const exampleFilePath = path.join(__dirname, '..', 'examples', 'index.html');
const exampleTemplatePath = path.join(__dirname, 'reference-tables.template');

let exampleIndexFile = fs.readFileSync(exampleTemplatePath, function (err) {
  console.log('Error reading aria index:', err);
});

const ariaRoles = [
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
  'main',
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
  'row',
  'rowgroup',
  'rowheader',
  'scrollbar',
  'search',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'table',
  'tablist',
  'tabpanel',
  'term',
  'textbox',
  'toolbar',
  'tooltip',
  'tree',
  'treegrid',
  'treeitem'
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
  'aria-valuetext'
];

let indexOfRoles = [];
let indexOfPropertiesAndStates = [];

console.log('Generating index...');

function replaceSection(id, content, newContent) {
  let indexStart = content.indexOf(id);
  let indexEnd;

  if (indexStart > 0) {
    indexStart = content.indexOf('>', indexStart) + 1;
    indexEnd = indexStart + 1;

    console.log('Replacing at: ' + indexStart + ' .... ' + indexEnd);

    return content.slice(0, indexStart) + newContent + content.slice(indexEnd);
  }
  return content;
}

function getTitle(data) {
  return data.substring(data.indexOf('<title>') + 7, data.indexOf('</title>'))
          .split('|')[0]
          .replace('Examples', '')
          .replace('Example of', '')
          .replace('Example', '')
          .trim();
}

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

function getRoles(data) {
  let roles = [];

  let indexStart = data.indexOf('<code>', 0);
  let indexEnd = data.indexOf('</code>', indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    let code = data.substring(indexStart + 6, indexEnd).trim();

    for (let i = 0; i < ariaRoles.length; i++) {
      if ((getColumn(data, indexStart) === 1) &&
        (code == ariaRoles[i]) &&
        (roles.indexOf(ariaRoles[i]) < 0)) {
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

function getPropertiesAndStates(data) {
  let propertiesAndStates = [];

  let indexStart = data.indexOf('<code>', 0);
  let indexEnd = data.indexOf('</code>', indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    let code = data.substring(indexStart + 6, indexEnd);

    for (let i = 0; i < ariaPropertiesAndStates.length; i++) {
      if ((getColumn(data, indexStart) === 2) &&
        (code.indexOf(ariaPropertiesAndStates[i]) >= 0) &&
        (propertiesAndStates.indexOf(ariaPropertiesAndStates[i]) < 0)) {
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

    if (!indexOfRoles[role]) {
      indexOfRoles[role] = [];
    }
    indexOfRoles[role].push(example);
  }
}

function addExampleToPropertiesAndStates(props, example) {
  for (let i = 0; i < props.length; i++) {
    let prop = props[i];

    if (prop === '') {
      continue;
    }

    if (!indexOfPropertiesAndStates[prop]) {
      indexOfPropertiesAndStates[prop] = [];
    }
    indexOfPropertiesAndStates[prop].push(example);
  }
}

function addLandmarkRole(landmark, hasLabel, title, ref) {
  let example = {
    title: title,
    ref: ref
  };

  addExampleToRoles(landmark, example);
  if (hasLabel) {
    addExampleToPropertiesAndStates(['aria-labelledby'], example);
  }
}

function findHTMLFiles(dir) {
  let count = 0;
  fs.readdirSync(dir).forEach(function (file) {
    let newPath = path.resolve(dir, file);

    let stats = fs.statSync(newPath);

    if (stats.isDirectory()) {
      findHTMLFiles(newPath);
    }

    if (stats.isFile() &&
      (newPath.indexOf('.html') > 0) &&
      (newPath.indexOf('index.html') < 0) &&
      (newPath.indexOf('landmark') < 0)) {
      count += 1;

      let data = fs.readFileSync(newPath, 'utf8');

      let ref = newPath.replace(exampleFilePath.replace('index.html', ''), '');
      let title = getTitle(data);
      let roles = getRoles(data);
      let props = getPropertiesAndStates(data);

      console.log('\nFile ' + count + ': ' + ref);
      console.log('Title  ' + count + ': ' + title);
      console.log('Roles  ' + count + ': ' + roles);
      console.log('Props  ' + count + ': ' + props);

      let example = {
        title: title,
        ref: ref
      };

      addExampleToRoles(roles, example);

      addExampleToPropertiesAndStates(props, example);
    }
  });
}


findHTMLFiles(path.join(__dirname, '..', 'examples'));

// Add landmark examples, since they are a different format
addLandmarkRole(['banner'], false, 'Banner Landmark', 'landmarks/banner.html');
addLandmarkRole(['complementary'], true, 'Complementary Landmark', 'landmarks/complementary.html');
addLandmarkRole(['contentinfo'], false, 'Contentinfo Landmark', 'landmarks/contentinfo.html');
addLandmarkRole(['form'], true, 'Form Landmark', 'landmarks/form.html');
addLandmarkRole(['main'], true, 'Main Landmark', 'landmarks/main.html');
addLandmarkRole(['navigation'], true, 'Navigation Landmark', 'landmarks/navigation.html');
addLandmarkRole(['region'], true, 'Region Landmark', 'landmarks/region.html');
addLandmarkRole(['search'], true, 'Search Landmark', 'landmarks/search.html');

let sorted = [];

for (let role in indexOfRoles) {
  sorted.push(role);
}

sorted.sort();

function exampleListItem(item) {
  return `
                <li><a href="${item.ref}">${item.title}</a></li>`;
}

let examplesByRole = sorted.reduce(function (set, role) {
  let examples = indexOfRoles[role];

  let examplesHTML = '';
  if (examples.length === 1) {
    examplesHTML = `<a href="${examples[0].ref}">${examples[0].title}</a>`;
  } else {
    examplesHTML = `
              <ul>${examples.map(exampleListItem).join('')}
              </ul>\n            `;
  }
  return `${set}
          <tr>
            <td><code>${role}</code></td>
            <td>${examplesHTML}</td>
          </tr>`;
}, '');

exampleIndexFile = replaceSection('examples_by_role_tbody', exampleIndexFile, examplesByRole);

sorted = [];

for (let prop in indexOfPropertiesAndStates) {
  sorted.push(prop);
}

sorted.sort();

let examplesByProps = sorted.reduce(function (set, prop) {
  let examples = indexOfPropertiesAndStates[prop];

  let examplesHTML = '';
  if (examples.length === 1) {
    examplesHTML = `<a href="${examples[0].ref}">${examples[0].title}</a>`;
  } else {
    examplesHTML = `
              <ul>${examples.map(exampleListItem).join('')}
              </ul>\n            `;
  }
  return `${set}
          <tr>
            <td><code>${prop}</code></td>
            <td>${examplesHTML}</td>
          </tr>`;
}, '');

exampleIndexFile = replaceSection('examples_by_props_tbody', exampleIndexFile, examplesByProps);

fs.writeFile(exampleFilePath, exampleIndexFile, function (err) {
  if (err) {
    console.log('Error saving updated aria practices:', err);
  }
});
