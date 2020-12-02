#!/usr/bin/env node
/* eslint-disable no-console */

const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const htmlparser2 = require('htmlparser2');
const { spawnSync } = require('child_process');

const examplePath = path.resolve(__dirname, '..', '..', 'examples');
const testsPath = path.resolve(__dirname, '..', 'tests');
const ignoreExampleDirs = path.resolve(
  __dirname,
  'report_files',
  'ignore_test_directories'
);
const ignoreExampleFiles = path.resolve(
  __dirname,
  'report_files',
  'ignore_html_files'
);
const ignoredDataTestId = 'test-not-required';

const ignoreDirectories = fs
  .readFileSync(ignoreExampleDirs)
  .toString()
  .trim()
  .split('\n')
  .map((d) => path.resolve(examplePath, d));
const ignoreFiles = fs
  .readFileSync(ignoreExampleFiles)
  .toString()
  .trim()
  .split('\n')
  .map((f) => path.resolve(examplePath, f));

/**
 * Recursively find all example pages, saves to exampleFiles global
 * object.
 *
 * @param {String} currentDirPath - root example directory
 */
const getExampleFiles = function (currentDirPath, exampleFiles) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (
      stat.isFile() &&
      path.extname(filePath) == '.html' &&
      ignoreFiles.indexOf(filePath) === -1
    ) {
      exampleFiles.push(filePath);
    } else if (
      stat.isDirectory() &&
      ignoreDirectories.indexOf(filePath) === -1
    ) {
      getExampleFiles(filePath, exampleFiles);
    }
  });
};

/**
 * Return human readable name for a "Keyboard Support" table row.
 *
 * @param {jQuery object} $         - loaded Cheerio dom
 * @param {jQuery object} $tableRow - root example directory
 */
const getKeyboardRowName = function ($, $tableRow) {
  return $('th', $tableRow).text().replace(/\n/g, ', ');
};

/**
 * Return human readable name for an "Attributes" table row.
 *
 * @param {jQuery object} $         - loaded Cheerio dom
 * @param {jQuery object} $tableRow - root example directory
 */
const getAttributeRowName = function ($, $tableRow) {
  // use the containt 'th' text to identify the row. If there is no text
  // in the 'th' element, use the 'element' column text.
  let rowName = $('th', $tableRow).text();
  if (!rowName) {
    rowName = $(':nth-child(3)', $tableRow).text();
  }
  return rowName;
};

/**
 * Processes all example files to find data-test-ids and missing data-test-ids
 * Builds exampleCoverage object:
 * {
 *   <exampleFile>: {
 *     existingTestIds: <array of discovered data-test-ids>
 *     missingTests: <copy of array of discovered data-test-ids>
 *     missingAttrs: <rows in attribute table missing data-test-ids>
 *     missingKeys: <rows in keyboard support table missing data-test-ids>
 *   }
 * }
 *
 * @param {Array} exampleFiles     - all example files to process
 * @param {Object} exampleCoverage - object to add coverage information to
 */
const processDocumentationInExampleFiles = function (
  exampleFiles,
  exampleCoverage
) {
  for (let exampleFile of exampleFiles) {
    var data = fs.readFileSync(exampleFile);
    const dom = htmlparser2.parseDOM(data);
    const $ = cheerio.load(dom);

    let dataTestIds = new Set();
    let attrsMissingIds = new Set();
    let keysMissingIds = new Set();

    // Find all the "Keyboard Interaction" table rows
    $('table.def tbody tr').each(function () {
      let $row = $(this);
      let dataTestId = $row.attr('data-test-id');

      if (dataTestId === ignoredDataTestId) {
        return;
      }

      if (dataTestId !== undefined) {
        dataTestIds.add(dataTestId);
      } else {
        keysMissingIds.add(getKeyboardRowName($, $row));
      }
    });

    // Find all the "Attribute" table rows
    $('table.attributes tbody tr').each(function () {
      let $row = $(this);
      let dataTestId = $row.attr('data-test-id');

      if (dataTestId === ignoredDataTestId) {
        return;
      }

      if (dataTestId !== undefined) {
        dataTestIds.add(dataTestId);
      } else {
        attrsMissingIds.add(getAttributeRowName($, $row));
      }
    });

    // Use the relative path to identify the example page
    const example = path.relative(examplePath, exampleFile);

    exampleCoverage[example] = {
      existingTestIds: dataTestIds,
      missingTests: new Set(dataTestIds),
      missingAttrs: attrsMissingIds,
      missingKeys: keysMissingIds,
    };
  }
};

/**
 * Runs ava tests in coverage mode to collect data on which tests exist.
 * After running, `exampleCoverage[example].missingTests` will be an array of
 * only data-test-ids for which no regression test was found.
 *
 * @param {Object} exampleCoverage - object with existing coverage information
 */
const getRegressionTestCoverage = function (exampleCoverage) {
  process.env.REGRESSION_COVERAGE_REPORT = 1;

  const allTestFiles = [];
  fs.readdirSync(testsPath).forEach(function (testfile) {
    allTestFiles.push(path.join(testsPath, testfile));
  });

  const cmd = path.resolve(
    __dirname,
    '..',
    '..',
    'node_modules',
    'ava',
    'cli.js'
  );
  const cmdargs = [...allTestFiles, '--tap', '-c', '1'];

  const output = spawnSync(cmd, cmdargs);
  const avaResults = output.stdout.toString();
  const avaError = output.stderr.toString();

  if (avaError) {
    console.log('AVA error with following message, exiting script.\n\n');
    console.log(avaError);
    process.exitCode = 1;
    process.exit();
  }

  let testRegex = /^# (\S+) [>›] (\S+\.html) \[data-test-id="(\S+)"\]/gm;
  let matchResults;
  // eslint-disable-next-line no-cond-assign
  while ((matchResults = testRegex.exec(avaResults))) {
    let example = matchResults[2];
    let dataTestId = matchResults[3];

    // If the test file has a data-test-id, the data-test-id must exist on
    // the test page.
    exampleCoverage[example].missingTests.delete(matchResults[3]);
  }
};

// Process example files and results of regression test to find coverage information.
const exampleFiles = [];
const exampleCoverage = {};
getExampleFiles(examplePath, exampleFiles);
processDocumentationInExampleFiles(exampleFiles, exampleCoverage);
getRegressionTestCoverage(exampleCoverage);

let examplesWithNoTests = 0;
let examplesWithNoTestsReport = '';
let examplesMissingSomeTests = 0;
let examplesMissingSomeTestsReport = '';
let missingTestIds = 0;
let missingTestIdsReport = '';
let totalTestIds = 0;

for (let example in exampleCoverage) {
  const existingTestIds = exampleCoverage[example].existingTestIds.size;
  const missingTests = exampleCoverage[example].missingTests.size;
  const missingKeys = exampleCoverage[example].missingKeys.size;
  const missingAttrs = exampleCoverage[example].missingAttrs.size;

  if (existingTestIds !== missingTests) {
    totalTestIds += existingTestIds;
  }

  if (missingTests || missingKeys || missingAttrs) {
    let exampleName = example;

    if (existingTestIds === missingTests) {
      examplesWithNoTestsReport += '- ' + exampleName + '\n';
      examplesWithNoTests++;
    } else if (missingTests) {
      examplesMissingSomeTestsReport += '- ' + exampleName + ':\n';

      for (let testId of exampleCoverage[example].missingTests) {
        examplesMissingSomeTestsReport += '   - ' + testId + '\n';
      }

      examplesMissingSomeTests += 1;
      missingTestIds += missingTests;
    }

    if (missingKeys || missingAttrs) {
      missingTestIdsReport += '- ' + exampleName + '\n';
      if (missingKeys) {
        missingTestIdsReport += '   - "Keyboard Support" table(s):\n';
        for (let row of exampleCoverage[example].missingKeys) {
          missingTestIdsReport += '      - ' + row + '\n';
        }
      }

      if (missingAttrs) {
        missingTestIdsReport += '   - "Attributes" table(s):\n';
        for (let row of exampleCoverage[example].missingAttrs) {
          missingTestIdsReport += '      - ' + row + '\n';
        }
      }
    }
  }
}

let badFileNames = [];
fs.readdirSync(testsPath).forEach(function (testFile) {
  let dirName = testFile.split('_')[0];
  let dir = path.join(examplePath, dirName);

  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    badFileNames.push([testFile, dir]);
  }
});

console.log('\n#### Regression test coverage:\n');
console.log('\n#### Examples without any regression tests:\n');
console.log(examplesWithNoTestsReport || 'None found.\n');
console.log('\n#### Examples missing some regression tests:\n');
console.log(examplesMissingSomeTestsReport || 'None found.\n');
console.log(
  '\n#### Example pages with Keyboard or Attribute table rows that do not have data-test-ids:\n'
);
console.log(missingTestIdsReport || 'None found.\n');

console.log('#### SUMMARY:\n');
console.log('  ' + exampleFiles.length + ' example pages found.');
console.log(
  '  ' + examplesWithNoTests + ' example pages have no regression tests.'
);
console.log(
  '  ' +
    examplesMissingSomeTests +
    ' example pages are missing approximately ' +
    missingTestIds +
    ' out of approximately ' +
    totalTestIds +
    ' tests.\n'
);

if (examplesMissingSomeTests) {
  console.log(
    'ERROR - missing tests:\n\n  Please write missing tests for this report to pass.\n'
  );
  process.exitCode = 1;
}

if (badFileNames.length) {
  console.log(
    "ERROR - bad file names:\n\n  Some test files do not follow the correct naming convention. Test file names should begin with the root parent directory of example being tested followed by an underscore ('_'). Please correct the following bad test file(s):\n"
  );

  for (let file of badFileNames) {
    console.log('  ' + file[0]);
  }
  console.log('\n');
  process.exitCode = 1;
}
