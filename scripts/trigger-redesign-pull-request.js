const { Octokit } = require('@octokit/rest');

// octokit should be authenticated with GITHUB_TOKEN from GA
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

(async () => {
  try {
    await octokit.rest.actions.createWorkflowDispatch({
      owner: 'howard-e',
      repo: 'wai-aria-practices',
      workflow_id: 'pull-request-create.yml',
      ref: 'master',
      inputs: {
        apg_branch: process.env.APG_BRANCH,
        apg_sha: process.env.APG_SHA,
        apg_pr_number: process.env.APG_PR_NUMBER,
      },
    });
    console.info('workflow.dispatch.success');
  } catch (e) {
    console.error('workflow.dispatch.fail', e);
  }
})();
