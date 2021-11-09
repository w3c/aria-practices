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
 * @param {string} currentDirPath - root example directory
 * @param exampleFiles
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
 * @param {jQuery} $         - loaded Cheerio dom
 * @param {jQuery} $tableRow - root example directory
 * @returns {string}
 */
const getKeyboardRowName = function ($, $tableRow) {
  return $('th', $tableRow).text().replace(/\n/g, ', ');
};

/**
 * Return human readable name for an "Attributes" table row.
 *
 * @param {jQuery} $         - loaded Cheerio dom
 * @param {jQuery} $tableRow - root example directory
 * @returns {string}
 */
const getAttributeRowName = function ($, $tableRow) {
  // use the 'th' contents text to identify the row. If there is no text
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
 * @param {object} exampleCoverage - object to add coverage information to
 */
const processDocumentationInExampleFiles = function (
  exampleFiles,
  exampleCoverage
) {
  for (let exampleFile of exampleFiles) {
    var data = fs.readFileSync(exampleFile, 'utf-8');
    const dom = htmlparser2.parseDocument(data);
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
 * @param {object} exampleCoverage - object with existing coverage information
 */
const getRegressionTestCoverage = function (exampleCoverage) {
  process.env.REGRESSION_COVERAGE_REPORT = 1;

  const allTestFiles = [];
  fs.readdirSync(testsPath).forEach(function (testFile) {
    allTestFiles.push(path.join(testsPath, testFile));
  });

  const cmd = path.resolve(
    __dirname,
    '..',
    '..',
    'node_modules',
    'ava',
    'cli.js'
  );
  const cmdArgs = [...allTestFiles, '--tap', '-c', '1'];

  const output = spawnSync(cmd, cmdArgs);
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
  while ((matchResults = testRegex.exec(avaResults))) {
    let example = matchResults[2];

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

for (let example in exampleCoverage) {
  const existingTestIds = exampleCoverage[example].existingTestIds.size;
  const missingTests = exampleCoverage[example].missingTests.size;
  const missingKeys = exampleCoverage[example].missingKeys.size;
  const missingAttrs = exampleCoverage[example].missingAttrs.size;

  if (missingTests || missingKeys || missingAttrs) {
    let exampleName = path.resolve('examples', example);

    if (existingTestIds === missingTests) {
      console.warn(
        `${exampleName}:1:1: warning: Example does not have any regression tests`
      );
    } else if (missingTests) {
      for (let testId of exampleCoverage[example].missingTests) {
        console.warn(
          `${exampleName}:1:1: warning: Example is missing some regression test '${testId}'`
        );
      }
    }

    if (missingKeys || missingAttrs) {
      if (missingKeys) {
        for (let row of exampleCoverage[example].missingKeys) {
          console.warn(
            `${exampleName}:1:1: warning: Keyboard support table rows missing data-test-id '${row}'`
          );
        }
      }

      if (missingAttrs) {
        for (let row of exampleCoverage[example].missingAttrs) {
          console.warn(
            `${exampleName}:1:1: warning: Attribute support table rows missing data-test-id '${row}'`
          );
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
    console.error(
      `${testFile}:1:1: error: Test file names should begin with the root parent directory of example being tested followed by an underscore ('_').`
    );
  }
});
