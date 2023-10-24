/**
 * The main logic for the action.
 */
const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");

function getRunnerLabels(runner) {
  return runner.labels.map((label) => label.name);
}
function filterRunnerByName(runners, runnerName) {
  return runners.find((runner) => runner.name === runnerName);
}

async function run() {
  try {
    const token = core.getInput("github-token");
    const includeOrgRunners = core.getInput("include-org-runners");
    const runnerName = process.env.RUNNER_NAME;
    const orgRepo = process.env.GITHUB_REPOSITORY; // in the form of owner/repo
    const [org, repo] = orgRepo.split("/");
    core.debug(
      `org: ${org}, repo: ${repo}, Runner name: ${runnerName}, token: ${token}`,
    );

    // create octokit client
    const octokit = new Octokit({ auth: token });

    core.debug(`Getting runners for ${repo}`);
    // get repo runners
    const repoRunners = await octokit.paginate(
      octokit.actions.listSelfHostedRunnersForRepo,
      { owner: org, repo },
    );
    core.debug(`Got ${repoRunners.length} runners for repo: ${repo}`);

    let orgRunners = [];
    if (includeOrgRunners) {
      // get org runners
      orgRunners = await octokit.paginate(
        octokit.actions.listSelfHostedRunnersForOrg,
        { org },
      );
      core.debug(`Got ${orgRunners.length} runners for org:${org}`);
    }
    // combine runners
    const allRunners = [...repoRunners, ...orgRunners];

    // find the runner by name
    const theRunner = filterRunnerByName(allRunners, runnerName);
    if (!theRunner) {
      core.debug(`No runner found with the name: ${runnerName}`);
      core.debug(
        `Available runners: ${allRunners.map((runner) => runner.name)}`,
      );
      throw Error(`No runner found with the name: ${runnerName}`);
    }
    core.debug(`Runner found: ${theRunner.name}`);

    // get labels
    const labels = getRunnerLabels(theRunner);

    // set outputs
    core.setOutput("labels", JSON.stringify(labels));
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

module.exports = {
  run,
};
