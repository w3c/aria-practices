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

let indexOfExamples = [];

console.log('Generating index...');

function getRoles(html) {
  let roles = [];

  let exampleRoles = html.querySelectorAll(
    'table.data.attributes tbody tr:nth-child(1) code'
  );

  for (let i = 0; i < exampleRoles.length; i++) {
    let code = exampleRoles[i].textContent.toLowerCase().trim();
    for (let j = 0; j < ariaRoles.length; j++) {
      const hasRole = RegExp(ariaRoles[j] + '\\b');

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
    'table.data.attributes tbody tr:nth-child(2) code'
  );

  for (let i = 0; i < exampleProps.length; i++) {
    let code = exampleProps[i].textContent.toLowerCase().trim().split('=')[0];
    for (let j = 0; j < ariaPropertiesAndStates.length; j++) {
      const hasPropOrState = RegExp(ariaPropertiesAndStates[j] + '\\b');
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
      highContrast: data.toLowerCase().indexOf('high contrast') > 0,
      svgHTML: html.querySelectorAll('svg').length,
      svgCSS: getNumberOfReferences(dataCSS, 'svg', true),
      contentCSS: getNumberOfReferences(dataCSS, 'content:'),
      beforeCSS: getNumberOfReferences(dataCSS, ':before'),
      afterCSS: getNumberOfReferences(dataCSS, ':after'),
      svgJS: getNumberOfReferences(dataJS, 'svg', true),
      forceColorAdjust: getNumberOfReferences(dataCSS, 'forced-color-adjust'),
      classJS: getNumberOfReferences(dataJS, 'constructor\\('),
      prototypeJS: getNumberOfReferences(dataJS, '.prototype.'),
      keyCodeJS: getNumberOfReferences(dataJS, '.keyCode'),
      hasExternalJS: dataJS.length > 0,
    };

    addExampleToRoles(getRoles(html), example);
    addExampleToPropertiesAndStates(getPropertiesAndStates(html), example);

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
  let ariaLabel = '';
  let highContrast = '';
  if (item.highContrast) {
    ariaLabel = ` aria-label="${item.title} with High Contrast Support"`;
    highContrast = ' (<abbr title="High Contrast Support">HC</abbr>)';
  }
  return `
                <li><a href="${item.ref}"${ariaLabel}>${item.title}</a>${highContrast}</li>`;
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

// Example Coding Practices

function htmlYesOrNo(flag) {
  return flag
    ? 'Yes'
    : '<code aria-hidden="true">-</span><span class="sr-only">no</span>';
}

let IndexOfExample = indexOfExamples.reduce(function (set, example) {
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
  return `${set}
          <tr>
            <td><a href="${example.ref}">${example.title}</code></td>
            <td>${using}</td>
            <td>${htmlYesOrNo(example.highContrast)}</td>
            <td>${htmlYesOrNo(example.keyCodeJS)}</td>
            <td>${htmlYesOrNo(example.svgHTML)}</td>
            <td>${htmlYesOrNo(example.svgCSS)}</td>
            <td>${htmlYesOrNo(example.svgJS)}</td>
            <td>${htmlYesOrNo(example.forceColorAdjust)}</td>
            <td>${htmlYesOrNo(example.beforeCSS)}</td>
            <td>${htmlYesOrNo(example.afterCSS)}</td>
            <td>${htmlYesOrNo(example.contentCSS)}</td>
          </tr>`;
}, '');

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

let countSVG = indexOfExamples.reduce(function (set, example) {
  let svg = example.svgHTML ? 1 : 0;
  if (!svg && (example.svgCSS || example.svgJS)) {
    svg = 1;
  }

  return set + svg;
}, 0);

let countForceColorAdjust = indexOfExamples.reduce(function (set, example) {
  return set + (example.forceColorAdjust ? 1 : 0);
}, 0);

$('#example_coding_practices_tbody').html(IndexOfExample);
$('#example_summary_total').html(indexOfExamples.length);
$('#example_summary_hc').html(countHighContrast);
$('#example_summary_svg').html(countSVG);
$('#example_summary_force_color').html(countForceColorAdjust);
$('#example_summary_keycode').html(countKeyCode);
$('#example_summary_class').html(countClass);
$('#example_summary_prototype').html(countPrototype);

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
