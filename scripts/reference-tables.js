var fs = require('fs');
var i;

var fileNameTemplate = 'reference-tables.template';
var fileNameIndex = '../examples/index.html';
var examplesDirectory = '../examples/';

var ariaRoles = [
  'banner',
  'navigation',
  'main',
  'complementary',
  'contentinfo',
  'search',
  'form',
  'button',
  'checkbox',
  'gridcell',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'progressbar',
  'radio',
  'scrollbar',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'tabpanel',
  'textbox',
  'treeitem',
  'combobox',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'tablist',
  'tree',
  'treegrid',
  'application',
  'article',
  'cell',
  'columnheader',
  'definition',
  'directory',
  'document',
  'feed',
  'figure',
  'group',
  'heading',
  'img',
  'list',
  'listitem',
  'math',
  'none',
  'note',
  'presentation',
  'row',
  'rowgroup',
  'rowheader',
  'separator',
  'table',
  'term',
  'toolbar',
  'tooltip'
];

var ariaPropertiesAndStates = [
  'aria-atomic',
  'aria-busy',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-dropeffect',
  'aria-errormessage',
  'aria-flowto',
  'aria-grabbed',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-live',
  'aria-owns',
  'aria-relevant',
  'aria-roledescription',
  'aria-atomic',
  'aria-busy',
  'aria-live',
  'aria-relevant',
  'aria-autocomplete',
  'aria-checked',
  'aria-disabled',
  'aria-errormessage',
  'aria-expanded',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-label',
  'aria-level',
  'aria-modal',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-placeholder',
  'aria-pressed',
  'aria-readonly',
  'aria-required',
  'aria-selected',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
  'aria-activedescendant',
  'aria-colcount',
  'aria-colindex',
  'aria-colspan',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
  'aria-posinset',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowspan',
  'aria-setsize'
];

var indexOfRoles = [];
var indexOfPropertiesAndStates = [];

console.log('Generating index...');

function replaceSection (id, content, newContent) {
  var indexStart = content.indexOf(id);

  if (indexStart > 0) {
    indexStart = content.indexOf('>', indexStart) + 1;
    indexEnd = indexStart + 1;

    console.log('Replacing at: ' + indexStart + ' .... ' + indexEnd);

    content = content.slice(0, indexStart) + newContent + content.slice(indexEnd);
  }

  return content;
}

function getTitle (data) {
  title = data.substring(data.indexOf('<title>') + 7, data.indexOf('</title>'));

  title = title.split('|');

  title = title[0].replace('Examples', '');
  title = title.replace('Example of', '');
  title = title.replace('Example', '');

  return title;
}

function getColumn (data, indexStart) {
  var count = 0;
  var index = data.lastIndexOf('<tr', indexStart);

  while (index > 0 && index <= indexStart) {
    var indexTd = data.indexOf('<td', index);
    var indexTh = data.indexOf('<th', index);

    var index = Math.min(indexTh, indexTd);

    if (index <= indexStart) {
      count += 1;
    }

    index += 1;
  }

  return count;
}

function getRoles (data) {
  var roles = '';

  var indexStart = data.indexOf('<code>', 0);
  var indexEnd = data.indexOf('</code>', indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    code = data.substring(indexStart + 6, indexEnd).trim();

    for (var i = 0; i < ariaRoles.length; i++) {
      if ((getColumn(data, indexStart) === 1) && (code === ariaRoles[i]) && (roles.indexOf(ariaRoles[i]) < 0)) {
        roles += ariaRoles[i] + ' ';
      }
    }

    indexStart = data.indexOf('<code>', indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('</code>', indexStart);
    }
  }

  return roles;
}

function getPropertiesAndStates (data) {
  var propertiesAndStates = '';

  var indexStart = data.indexOf('<code>', 0);
  var indexEnd = data.indexOf('</code>', indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    code = data.substring(indexStart + 6, indexEnd);

    for (var i = 0; i < ariaPropertiesAndStates.length; i++) {
      if ((getColumn(data, indexStart) === 2) &&
          (code.indexOf(ariaPropertiesAndStates[i]) >= 0) &&
          (propertiesAndStates.indexOf(ariaPropertiesAndStates[i]) < 0)) {
        propertiesAndStates += ariaPropertiesAndStates[i] + ' ';
      }
    }

    indexStart = data.indexOf('<code>', indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('</code>', indexStart);
    }
  }

  return propertiesAndStates;
}

function addExampleToRoles (roles, example) {
  var roles = roles.split(' ');

  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];

    if (role === '') {
      continue;
    }

    if (!indexOfRoles[role]) {
      indexOfRoles[role] = [];
    }
    indexOfRoles[role].push(example);
  }
}

function addExampleToPropertiesAndStates (props, example) {
  var props = props.split(' ');

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];

    if (prop === '') {
      continue;
    }

    if (!indexOfPropertiesAndStates[prop]) {
      indexOfPropertiesAndStates[prop] = [];
    }
    indexOfPropertiesAndStates[prop].push(example);
  }
}

function addLandmarkRole (landmark, hasLabel, title, ref) {
  var example = {};

  example.title = title;
  example.ref = ref;
  addExampleToRoles(landmark, example);
  if (hasLabel) {
    addExampleToPropertiesAndStates('aria-labelledby', example);
  }
}

var count = 0;

function findHTMLFiles (path) {
  fs.readdirSync(path).forEach(function (file) {
    var newPath = path + '/' + file;

    var stats = fs.statSync(newPath);

    if (stats.isDirectory()) {
      findHTMLFiles(newPath);
    }

    if (stats.isFile() &&
        (newPath.indexOf('.html') > 0) &&
        (newPath.indexOf('index.html') < 0) &&
        (newPath.indexOf('landmark') < 0)) {
      count += 1;

      var data = fs.readFileSync(newPath, 'utf8');

      var ref = newPath;
      var title = getTitle(data);
      var roles = getRoles(data);
      var props = getPropertiesAndStates(data);

      console.log('\nFile ' + count + ': ' + ref);
      console.log('Title  ' + count + ': ' + title);
      console.log('Roles  ' + count + ': ' + roles);
      console.log('Props  ' + count + ': ' + props);

      var example = {};

      example.title = title;
      example.ref = ref;

      addExampleToRoles(roles, example);

      addExampleToPropertiesAndStates(props, example);
    }
  });
};

findHTMLFiles(examplesDirectory);

var res = fs.readdir('.');

for (r in res) {

  // Handle landmark examples separately
  if (res[r].indexOf('landmark') < 0) {
  }
}

// Add landmark examples, since they are a different format

addLandmarkRole('banner', false, 'Banner Landmark', examplesDirectory + 'landmarks/banner.html');
addLandmarkRole('complementary', true, 'Complementary Landmark', examplesDirectory + 'landmarks/complementary.html');
addLandmarkRole('contentinfo', false, 'Contentinfo Landmark', examplesDirectory + 'landmarks/contentinfo.html');
addLandmarkRole('form', true, 'Form Landmark', examplesDirectory + 'landmarks/form.html');
addLandmarkRole('main', true, 'Main Landmark', examplesDirectory + 'landmarks/main.html');
addLandmarkRole('navigation', true, 'Navigation Landmark', examplesDirectory + 'landmarks/navigation.html');
addLandmarkRole('region', true, 'Region Landmark', examplesDirectory + 'landmarks/region.html');
addLandmarkRole('search', true, 'Search Landmark', examplesDirectory + 'landmarks/search.html');

var exampleIndexFile = fs.readFileSync(fileNameTemplate, function (err) {
  console.log('Error reading aria index:', err);
});

var sorted = [];

for (role in indexOfRoles) {
  sorted.push(role);
}

sorted.sort();

var html = sorted.reduce(function (set,role) {
  var examples = indexOfRoles[role];

  var examplesHTML = '';
  if (examples.length === 1) {
    examplesHTML = '    <a href="' + examples[0].ref + '">' + examples[0].title + '</a>';
  }
  else {
    function exampleListItem (item) { return '      <li><a href="' + item.ref + '">' + item.title + '</a></li>';};
    examplesHTML = '    <ul>' + examples.map(exampleListItem).join('\n') + '</ul>';
  }
  return set + '<tr>\n  <td><code>' + role + '</code></td>\n  <td>' + examplesHTML + '</td>\n</tr>';
}, '');

exampleIndexFile = replaceSection('examples_by_role_tbody', exampleIndexFile, html);

sorted = [];

for (prop in indexOfPropertiesAndStates) {
  sorted.push(prop);
}

sorted.sort();

html = sorted.reduce(function (set,prop) {
  var examples = indexOfPropertiesAndStates[prop];

  var examplesHTML = '';
  if (examples.length === 1) {
    examplesHTML = '<a href="' + examples[0].ref + '">' + examples[0].title + '</a>';
  }
  else {
    function exampleListItem (item) { return '      <li><a href="' + item.ref + '">' + item.title + '</a></li>';};
    examplesHTML = '    <ul>' + examples.map(exampleListItem).join('\n') + '</ul>';
  }
  return set + '<tr>\n  <td><code>' + role + '</code></td>\n  <td>' + examplesHTML + '</td>\n</tr>';
}, '');

exampleIndexFile = replaceSection('examples_by_props_tbody', exampleIndexFile, html);

fs.writeFile(fileNameIndex, exampleIndexFile, function (err) {
  if (err) {
    console.log('Error saving updated aria practices:', err);
  }
});
