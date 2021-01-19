/**
 * Create a file '.env' with the following:
 *   GITHUB_TOKEN=yourkey
 *   GITHUB_PROJECT_COLUMN_ID=yourColumnId
 *
 * If you want a new project created, you do not have to include a GITHUB_PROJECT_COLUMN_ID
 */

const { Octokit } = require('@octokit/rest');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'aria-at-repo-maintenance',
});

const ariaPracticesUrl = 'https://w3c.github.io/aria-practices/';
const ariaPracticesFile = path.join(__dirname, '..', 'aria-practices.html');

(async () => {
  let output = fs.readFileSync(ariaPracticesFile, function (err) {
    console.log('Error reading html:', err);
  });
  const $ = cheerio.load(output);
  const examples = [];
  $('.widget a[href^="examples/"]').each((index, el) => {
    const title = $(el).text();
    const href = $(el).attr('href');

    if (href.indexOf('examples/landmarks') === -1) {
      examples.push({
        title,
        url: ariaPracticesUrl + href,
      });
    }
  });

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
