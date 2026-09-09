# Labalicious submissions

Submit evidence. Get feedback. Improve your reasoning.

Course: https://github.com/labalicious-learning/ai-quality-academy

Submission queue: https://github.com/labalicious-learning/lab-submissions/pulls

## Start here

1. Read [Public safety and permission](PUBLIC_SAFETY.md) **before uploading anything**. Your fork, commits, PR and feedback may all be public immediately. Session 00 readiness and private grades do not belong here.
2. Read [How to submit](SUBMITTING.md). Use one PR for one session, in a folder named `cohorts/COHORT/ALIAS/session-NN/` (sessions 01–12).
3. Copy [submission.md](templates/submission.md), [ai-use.md](templates/ai-use.md) and [submission.json](templates/submission.json). Add only synthetic evidence. Replace all template placeholders.
4. Run a local safety check **before publishing**: `node scripts/preflight.mjs path/to/your/session-folder`. This is a limited pattern check, not a privacy guarantee.
5. Open a draft PR; review the files yourself. Mark ready when complete. The bot posts completeness feedback. A peer reproduces one claim; an instructor makes the acceptance decision.

The bot never runs student code and never certifies that your result is correct. Upload code as `changes.patch` against the exact course commit. Instructors reproduce it separately in a disposable, secret-free environment.

## Review lanes

- Deterministic checks run automatically for PRs against `main` using trusted code from `main`.
- AI coaching is instructor-triggered, requires exact-commit approval and separate consent, and is off until an API key, evaluated model and protected environment are configured. See [Instructor operations](INSTRUCTOR.md).
- Peer and instructor [review templates](templates/review.md) keep feedback evidence-based. Final scores stay private.
- Accepted PRs become portfolio artifacts only after an instructor verifies privacy, permissions, authorship and evidence. No automatic merging or public rankings.

This repository is not a confidential inbox. For a private route, arrange direct transfer with your instructor in person or through the cohort's approved private channel **before** putting work on GitHub. Never put private data in an issue to request that route.

## Instructor materials

[Operations](INSTRUCTOR.md) · [Rubric](RUBRIC.md) · [Review security](SECURITY.md) · [Rights](COPYRIGHT.md) · [Offline review brief](reviewer/instructions.md)

© 2026 Jared Cluff for course infrastructure. Student submissions retain their respective authors' rights; see [Copyright](COPYRIGHT.md).
