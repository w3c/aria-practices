#!/usr/bin/env node
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   reference-tables.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

const exampleFilePath = path.join(__dirname, '..', 'examples', 'index.html');
const exampleTemplatePath = path.join(__dirname, 'reference-tables.template');

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
  // 'region', Region is generated differently from other roles
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

let indexOfRoles = {};
let indexOfPropertiesAndStates = {};

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

function getRoles(data) {
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

function getPropertiesAndStates(data) {
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
    ref: ref,
  };

  addExampleToRoles(landmark, example);
  if (hasLabel) {
    addExampleToPropertiesAndStates(['aria-labelledby'], example);
  }
}

glob
  .sync('examples/!(landmarks)/**/!(index).html', {
    cwd: path.join(__dirname, '..'),
    nodir: true,
  })
  .forEach(function (file) {
    let data = fs.readFileSync(file, 'utf8');
    let ref = file.replace('examples/', '');
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

    addExampleToRoles(getRoles(data), example);
    addExampleToPropertiesAndStates(getPropertiesAndStates(data), example);
  });

// Add landmark examples, since they are a different format
addLandmarkRole(['banner'], false, 'Banner Landmark', 'landmarks/banner.html');
addLandmarkRole(
  ['complementary'],
  true,
  'Complementary Landmark',
  'landmarks/complementary.html'
);
addLandmarkRole(
  ['contentinfo'],
  false,
  'Contentinfo Landmark',
  'landmarks/contentinfo.html'
);
addLandmarkRole(['form'], true, 'Form Landmark', 'landmarks/form.html');
addLandmarkRole(['main'], true, 'Main Landmark', 'landmarks/main.html');
addLandmarkRole(
  ['navigation'],
  true,
  'Navigation Landmark',
  'landmarks/navigation.html'
);
addLandmarkRole(['region'], true, 'Region Landmark', 'landmarks/region.html');
addLandmarkRole(['search'], true, 'Search Landmark', 'landmarks/search.html');

function exampleListItem(item) {
  return `
                <li><a href="${item.ref}">${item.title}</a></li>`;
}

let sortedRoles = Object.getOwnPropertyNames(indexOfRoles).sort();

let examplesByRole = sortedRoles.reduce(function (set, role) {
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

$('#examples_by_role_tbody').html(examplesByRole);

let sortedPropertiesAndStates = Object.getOwnPropertyNames(
  indexOfPropertiesAndStates
).sort();

let examplesByProps = sortedPropertiesAndStates.reduce(function (set, prop) {
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

$('#examples_by_props_tbody').html(examplesByProps);

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
