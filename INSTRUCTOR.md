# Instructor operations

## Before enrolling learners

Create cohort codes and assign aliases privately. Use the same rubric for public and private routes. Explain GitHub visibility, AI consent, ownership, retention limits and the private handoff process; arrange any required school/guardian authorization privately. Verify account/provider age eligibility. Do not collect consent documents here.

Copy `templates/gradebook.csv` (legacy filename; now a nonnumeric progress register) into an instructor-only approved location (or ignored `private/` on your encrypted workstation). Never commit filled gradebooks, rosters, alias-to-person mappings or private notes. The repository provides an empty template, not a hosted student information system. Configure the cohort's actual private communication/storage channel before enrollment; local/in-person review is available until then.

## Submission queue

https://github.com/labalicious-learning/lab-submissions/pulls

Students submit one new packet per PR. The public `packet-safety` commit status is required before merge. Its green state means structure/basic safety only, never correctness. A draft may be checked but must not be accepted. New commits invalidate earlier review; always record the exact head SHA.

Label queue items as needed: `needs-peer-review`, `needs-instructor-review`, `revision-requested`, `accepted`, `ai-feedback-requested`, `safety-followup`. Labels are organizational aids, not evidence. A label does not expose secrets or start an AI request.

1. Inspect every text file and image for privacy and permission; stop privately if suspect material appears.
2. Check session requirements against the declared course commit and the corresponding academy lab. Do not use the general rubric as a substitute for that lab's deliverables.
3. Assign a peer to reproduce one claim and leave constructive artifact-focused feedback.
4. Optionally request AI coaching after provider consent and privacy review.
5. Independently reproduce an appropriate claim. For code patches, use a disposable VM/container/workstation with no personal/cloud credentials and the exact course commit. Never apply student patches to the live academy or a privileged runner. This first version does **not** automatically execute patches.
6. Discuss an individual's actual decisions and evidence. Record evidence, next actions and support needs privately using RUBRIC.md. No scores or surprise test. Request revisions or approve the final head SHA. Merge only after acceptance and publication permission; do not treat bot comments as an instructor approval.

Self-authored instructor maintenance PRs need another instructor review or a documented admin bypass; do not weaken student branch protection. Infrastructure changes are deliberately not accepted by the packet-only checker.

## AI activation and use

The integration is complete but intentionally dormant until a key and evaluated model are configured. No model is silently selected, and no live API test is claimed without a real call.

1. Evaluate the candidate model on `reviewer/evaluation-cases.json` using `reviewer/instructions.md` and RUBRIC.md. Include a blinded instructor comparison, false reassurance, missed injection, useful feedback, citation accuracy, latency and cost. Keep identifiable examples private. Do not approve from mock unit tests alone.
2. In https://github.com/labalicious-learning/lab-submissions/settings/environments, use the `ai-review` environment. Require an instructor reviewer and allow only `main`. Keep the environment credential separate from normal intake. The initial sole owner may approve their own manually initiated run; add a second reviewer for separation of duties when available.
3. Add environment secret `OPENAI_API_KEY` through that environment's settings, never in code, a PR or a public issue. Use a dedicated funded API project with budget alerts. Add environment variable `AI_REVIEW_MODEL` containing the exact approved API model ID. ChatGPT/Codex account access alone does not establish API billing or model access.
4. Open https://github.com/labalicious-learning/lab-submissions/actions/workflows/ai-review.yml → Run workflow on `main`. Enter the PR number and exact head SHA you reviewed. A student must have `ai_review_consent: true`; otherwise use human review with no penalty.
5. Approve the environment deployment only after checking the files, the SHA, publication permission, provider consent and expected cost. The script sends only bounded packet text, never images, executes nothing, follows no links and uses no model tools. One run makes at most one provider request, with a 60,000-character text budget, 2,200 output-token cap and 90-second timeout. This caps request size, not dollar cost; model pricing and repeat manual runs still matter.
6. Read the posted feedback critically. Invalid/refused/truncated output, invalid citations, a changed head or a missing credential fail closed without posting fabricated feedback. GitHub logs show generic errors, not raw provider output or student file contents.

Model name, prompt/rubric hash, commit and token usage are recorded with each review. To change models, rerun the evaluation and change only the protected environment variable after approval. Do not rewrite the rubric to make a candidate look good.

If API access is unavailable, use the trusted reviewer instructions for a human or an approved manual AI session with separately consented, sanitized text. Label manual/model feedback accurately; never present deterministic checks as AI review. The mock unit tests exercise request shape and output validation only.

Provider reference: https://developers.openai.com/api/docs/guides/structured-outputs

Responses storage setting: https://developers.openai.com/api/docs/guides/migrate-to-responses

## Product reviews and course completion

The individual product lives in each learner's own public repo, not this packet repository. The curriculum's project expectations and templates are at https://learn.labalicious.com/COURSE_PROJECT.html. Introduce it in Session 01, approve/kick off by Session 02, and review milestones throughout the course.

Record full product/PR URLs, exact reviewed SHAs, observed evidence and follow-up privately. This intake does not automatically follow external links, clone student repositories or execute applications. Review source separately and use isolated, credential-free environments for approved runtime inspection. Never expose instructor credentials to student code.

An optional Session 12 packet is a public-safe index/summary, not application code or a certificate request. It cannot replace the product review or presentation. A green packet check means neither product correctness nor completion.

Jared Cluff hears every individual final presentation and decides completion after ongoing review. Use RUBRIC.md for coaching and the project's agreed expectations for readiness. No numeric threshold, separate exam or surprise defense. Offer revisions and another review where needed. Fill and issue certificates only after Jared's private approval; never commit names, certificates or completion decisions. The academy provides an empty private-use certificate template, not an automated issuer.

## Operations checks

Before each cohort: run infrastructure CI on Mac/Linux/Windows; open a synthetic packet PR and verify the status and comment; test an incomplete packet and verify rejection; inspect branch/environment protections. Close synthetic test PRs without mixing them into student records. Verify no other organization repositories were exposed.

Initial live AI acceptance test remains required after credentials/model configuration. Mark AI unavailable until that real test passes. Review bot access and provider cost monthly. A site render or workflow definition alone is not a successful live review.
