const { Octokit } = require('@octokit/rest');

// octokit should be authenticated with GITHUB_TOKEN from GA
console.log(process.env.GH_TOKEN.substring(0, 8));
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
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
