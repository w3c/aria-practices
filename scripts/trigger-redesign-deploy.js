const { Octokit } = require('@octokit/rest');

// octokit should be authenticated with GITHUB_TOKEN from GA
const octokit = new Octokit();

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
