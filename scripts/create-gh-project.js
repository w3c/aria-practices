/**
 * Create a file '.env' with the following:
 *   GITHUB_TOKEN=yourKey
 *   GITHUB_PROJECT_COLUMN_ID=yourColumnId
 *
 * If you want a new project created, you do not have to include a GITHUB_PROJECT_COLUMN_ID
 */

const { Octokit } = require('@octokit/rest');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'aria-at-repo-maintenance',
});

(async () => {
  let examples = await Promise.all(
    glob
      .sync('content/patterns/!(landmarks)/examples/!(index).html', {
        cwd: path.join(__dirname, '..'),
        nodir: true,
      })
      .map((filePath) => {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, { encoding: 'utf-8' }, (err, fileText) => {
            if (err) return reject(err);
            const $ = cheerio.load(fileText);
            const title = $('h1').first().text().trim();
            const url = filePath.replace(
              /^content\/patterns\/(.+)\/examples\/(.+\.html)$/,
              'https://www.w3.org/WAI/ARIA/apg/example-index/$1/$2'
            );
            resolve({ title, url });
          });
        });
      })
  );
  examples.sort((a, b) => a.url.localeCompare(b.url));

  let column_id = process.env.GITHUB_PROJECT_COLUMN_ID;

  // If a column id has not been provided, then create a project with just one column: "Backlog"
  if (!column_id) {
    let createProjectResult = await octokit.projects.createForRepo({
      owner: 'w3c',
      repo: 'aria-practices',
      name: 'New aria-practices project',
    });

    let createColumnResult = await octokit.projects.createColumn({
      project_id: createProjectResult.data.id,
      name: 'Backlog',
    });
    column_id = createColumnResult.data.id;
  }

  examples.forEach((ex) => {
    // Add the card
    octokit.projects.createCard({
      column_id,
      note: '[' + ex.title + '](' + ex.url + ')',
    });
  });
})();
