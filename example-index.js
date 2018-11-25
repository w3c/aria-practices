const fs = require('fs')

ariaRoles = [
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


function replaceSection (id, content, newContent ) {

  var indexStart = content.indexOf('id="' + id + '"');

  if (indexStart > 0) {
    indexStart = content.indexOf('>', indexStart) + 1;

    indexEnd = content.indexOf('</section>', indexStart);

    console.log('Replacing at: ' + indexStart + ' .... ' + indexEnd);

    if (indexStart > 0 && indexEnd > 0 ) {
      content = content.slice(0, indexStart) + newContent + content.slice(indexEnd);
    }
  }

  return content;

}

function getTitle (data) {

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


function addLandmarkRole (landmark, hasLabel, title, ref) {

  var example = {};
  example['title'] = title;
  example['ref']   = ref;
  addExampleToRoles(landmark, example);
  if (hasLabel) {
    addExampleToPropertiesAndStates('aria-labelledby', example);
  }
}

var count = 0;

function findHTMLFiles(path) {

  fs.readdir(path, function(err, items) {
      for (var i = 0; i < items.length; i++) {

        var new_path = path + '/' + items[i];

        var stats = fs.lstatSync(new_path);

        if (stats.isDirectory()) {
          findHTMLFiles(new_path);
        }

        if (stats.isFile() &&
            (new_path.indexOf('.html') > 0) &&
            (new_path.indexOf('landmark') < 0)) {

          count += 1;

          var data = fs.readFileSync(new_path, 'utf8');

          var ref   = new_path;
          var title = getTitle(data);
          var roles = getRoles(data);
          var props = getPropertiesAndStates(data);

          console.log('\nFile ' + count + ': ' + ref);
          console.log('Title  ' + count + ': ' + title);
          console.log('Roles  ' + count + ': ' + roles);
          console.log('Props  ' + count + ': ' + props);

          var example = {};
          example['title'] = title;
          example['ref']   = ref;

          addExampleToRoles(roles, example);

          addExampleToPropertiesAndStates(props, example);
        }
      }
  });
};

findHTMLFiles('examples');


var res = fs.readdir('examples');

for (r in res) {

  // handle landmark examples separately
  if (res[r].indexOf('landmark') < 0) {

  }

}

// Add landmark examples, since they are a different format

addLandmarkRole('banner',        false, 'Banner Landmark',        'http://localhost/GitHub/aria-practices/examples/landmarks/banner.html');
addLandmarkRole('complementary', true,  'Complementary Landmark', 'http://localhost/GitHub/aria-practices/examples/landmarks/complementary.html');
addLandmarkRole('contentinfo',   false, 'Contentinfo Landmark',   'http://localhost/GitHub/aria-practices/examples/landmarks/contentinfo.html');
addLandmarkRole('form',          true,  'Form Landmark',          'http://localhost/GitHub/aria-practices/examples/landmarks/form.html');
addLandmarkRole('main',          true,  'Main Landmark',          'http://localhost/GitHub/aria-practices/examples/landmarks/main.html');
addLandmarkRole('navigation',    true,  'Navigation Landmark',    'http://localhost/GitHub/aria-practices/examples/landmarks/navigation.html');
addLandmarkRole('region',        true,  'Region Landmark',        'http://localhost/GitHub/aria-practices/examples/landmarks/region.html');
addLandmarkRole('search',        true,  'Search Landmark',        'http://localhost/GitHub/aria-practices/examples/landmarks/search.html');

var practices = fs.readFileSync("aria-practices.html", function(err){
  console.log("Error reading aria practices:", err );
});

var sorted = [];

for (role in indexOfRoles) {
  sorted.push(role);
}

sorted.sort();

html = '';
for (let i = 0; i < sorted.length; i++) {
  var role = sorted[i];
  var examples = indexOfRoles[role];

  html += '    <tr>\n';
  html += '      <td><code>' + role + '</code></td>\n';
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

practices = replaceSection('examples_by_roles_tbody', practices, html);

sorted = [];

for (prop in indexOfPropertiesAndStates) {
  sorted.push(prop);
}

sorted.sort();

html = ''
for (let i = 0; i < sorted.length; i++) {
  var prop = sorted[i];
  var examples = indexOfPropertiesAndStates[prop];

  html += '    <tr>\n';
  html += '      <td><code>' + prop + '</code></td>\n';
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

practices = replaceSection('examples_by_props_tbody', practices, html);

fs.writeFile("aria-practices.html", practices, function(err){
  if (err) {
    console.log("Error saving updated aria practices:", err );
  }
});
