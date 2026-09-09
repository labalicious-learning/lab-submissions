# Submission automation threat boundaries

- Student artifacts, PR titles/bodies, branch names, patches and model outputs are untrusted.
- The intake uses `pull_request_target` only to run the protected base SHA's data validator and post status/comments. It never checks out PR HEAD, runs student code, installs student dependencies, invokes a shell with student text, uses shared caches, or reads provider secrets. Changed blobs are fetched through the GitHub API at immutable SHAs with size/type/path limits. Only additions within one new packet are allowed.
- Intake's token has contents read, pull-request write and commit-status write. It cannot deploy, modify repository contents or access the AI environment. No persistent runner is used.
- The separate AI workflow is manually dispatched on main, protected by an environment review, exact-commit approval and student consent. The model receives no tools or keys. Output citations must reference actual supplied text; model content is escaped before posting. That validation does not prove the model's reasoning is correct.
- The provider key must be environment-scoped, not organization-wide or available to pull-request workflows. Set restrictive token access and budget alerts in the provider project. Do not introduce privileged workflow_run artifact execution or head checkout to simplify future automation.
- A preflight can miss personal information or obfuscated credentials. It cannot unpublish data. Instructors review images and metadata before publication and before AI processing. Never echo rejected file contents in error messages.
- Student code reproduction is a separate human-approved, disposable, secret-free activity. Automatic test execution, plagiarism detection, automatic grading and automatic merging are intentionally out of scope for this version.

GitHub event security reference: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target

Report sensitive incidents privately to your instructor or organization owner, not through a public issue. This repository is not a confidential reporting channel.
