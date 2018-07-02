var Glob = require('Glob');
fs = require('fs')

ariaRoles = [
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
]

ariaPropertiesAndStates = [
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
]

indexOfRoles = []
indexOfPropertiesAndStates = []

console.log('Generating index...');

function getTitle(data) {

  title =  data.substring(data.indexOf('<title>') + 7, data.indexOf('</title>'));

  title = title.split('|');

  return title[0];

}

function getColumn(data, indexStart) {
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


function getRoles(data) {


  var roles = '';

  var indexStart = data.indexOf('<code>' , 0);
  var indexEnd = data.indexOf('</code>' , indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    code =  data.substring(indexStart + 6, indexEnd).trim();


    for (var i = 0; i < ariaRoles.length; i++) {

      if ((getColumn(data, indexStart) === 1) && (code === ariaRoles[i]) && (roles.indexOf(ariaRoles[i]) < 0)) {
        roles += ariaRoles[i] + ' ';
      }
    }

    indexStart = data.indexOf('<code>' , indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('</code>' , indexStart);
    }

  }

  return roles

}

function getPropertiesAndStates(data) {

  var propertiesAndStates = '';

  var indexStart = data.indexOf('<code>' , 0);
  var indexEnd = data.indexOf('</code>' , indexStart);

  while (indexStart > 1 && indexEnd > 1) {
    code =  data.substring(indexStart + 6, indexEnd);


    for (var i = 0; i < ariaPropertiesAndStates.length; i++) {

      if ((getColumn(data, indexStart) === 2) &&
          (code.indexOf(ariaPropertiesAndStates[i]) >= 0) &&
          (propertiesAndStates.indexOf(ariaPropertiesAndStates[i]) < 0)) {
        propertiesAndStates += ariaPropertiesAndStates[i] + ' ';
      }
    }

    indexStart = data.indexOf('<code>' , indexEnd);

    if (indexStart > 0) {
      indexEnd = data.indexOf('</code>' , indexStart);
    }

  }

  return propertiesAndStates

}

function addExampleToRoles(roles, example) {

  var roles = roles.split(' ');

  for (var i = 0; i < roles.length; i++) {
    var role = roles[i];
    if (role === '') continue;
    if (!indexOfRoles[role]) {
      indexOfRoles[role] = [];
    }
    indexOfRoles[role].push(example);
  }

}

function addExampleToPropertiesAndStates(props, example) {

  var props = props.split(' ');

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    if (prop === '') continue;
    if (!indexOfPropertiesAndStates[prop]) {
      indexOfPropertiesAndStates[prop] = [];
    }
    indexOfPropertiesAndStates[prop].push(example);
  }

}

var res = Glob.sync('examples/**/*.html');

for (r in res) {

  var data = fs.readFileSync(res[r], 'utf8');

  var ref   = res[r];
  var title = getTitle(data);
  var roles = getRoles(data);
  var props = getPropertiesAndStates(data);

  console.log('\nFile ' + r + ': ' + ref);
  console.log('Title  ' + r + ': ' + title);
  console.log('Roles  ' + r + ': ' + roles);
  console.log('Props  ' + r + ': ' + props);

  var example = {};
  example['title'] = title;
  example['ref']   = ref;

  addExampleToRoles(roles, example);

  addExampleToPropertiesAndStates(props, example);
}

var sorted = [];

for (role in indexOfRoles) {
  sorted.push(role);
}

sorted.sort();

html = '';
html += '\n\n<h2 id="id-examples-by-role">Examples by Role</h2>\n';
html += '<table aria-labelledby="id-examples-by-role">\n';
html += '  <thead>\n';
html += '    <tr>\n';
html += '      <th>Role</th>\n';
html += '      <th>Examples</th>\n';
html += '    </tr>\n';
html += '  </thead>\n';


html += '  <tbody>\n';
for (let i = 0; i < sorted.length; i++) {
  var role = sorted[i];
  var examples = indexOfRoles[role];

  html += '    <tr>\n';
  html += '      <td>' + role + '</td>\n';
  html += '      <td>\n';
  if (examples.length === 1) {
    html += '        <a href="' + examples[0].ref + '">' + examples[0].title + '</a>\n';
  }
  else {
    html += '        <ul>\n';
    for (let j = 0; j < examples.length; j++) {
      html += '          <li><a href="' + examples[j].ref + '">' + examples[j].title + '</a></li>\n';
    }
    html += '        </ul>\n';

  }
  html += '      </td>\n';
  html += '    </tr>\n';
}
html += '  </tbody>\n';
html += '</table>\n';



sorted = [];

for (prop in indexOfPropertiesAndStates) {
  sorted.push(prop);
}

sorted.sort();

html += '\n\n<h2 id="id-examples-by-props">Examples By Properties and States</h2>\n';
html += '<table aria-labelledby="id-examples-by-props">\n';
html += '  <thead>\n';
html += '    <tr>\n';
html += '      <th>Property or State</th>\n';
html += '      <th>Examples</th>\n';
html += '    </tr>\n';
html += '  </thead>\n';


html += '  <tbody>\n';
for (let i = 0; i < sorted.length; i++) {
  var prop = sorted[i];
  var examples = indexOfPropertiesAndStates[prop];

  html += '    <tr>\n';
  html += '      <td>' + prop + '</td>\n';
  html += '      <td>\n';
  if (examples.length === 1) {
    html += '        <a href="' + examples[0].ref + '">' + examples[0].title + '</a>\n';
  }
  else {
    html += '        <ul>\n';
    for (let j = 0; j < examples.length; j++) {
      html += '          <li><a href="' + examples[j].ref + '">' + examples[j].title + '</a></li>\n';
    }
    html += '        </ul>\n';

  }
  html += '      </td>\n';
  html += '    </tr>\n';
}
html += '  </tbody>\n';
html += '</table>\n';

console.log(html);

fs.writeFile("example-index.html", html);
