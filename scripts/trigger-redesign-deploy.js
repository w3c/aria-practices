const { Octokit } = require('@octokit/rest');

// octokit should be authenticated with GITHUB_TOKEN from GA
console.log(process.env.GITHUB_TOKEN.substring(0, 8));
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

(async () => {
  let workflowDispatchResult =
    await octokit.rest.actions.createWorkflowDispatch({
      owner: 'howard-e',
      repo: 'wai-aria-practices',
      workflow_id: 'deploy.yml',
      ref: 'master',
    });

  console.info(workflowDispatchResult);
})();
