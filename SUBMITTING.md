# Submit one lab

## Prepare privately first

Session 00 is a private demonstration to your instructor, not a public readiness card. For sessions 01–12, obtain a cohort code and alias privately from your instructor. An alias does not hide your GitHub profile or commit metadata. Do not include a real student name, email, school, face or production record in the packet.

The course's ignored `submissions/` folder is scratch space, not the submission destination. This separate repository accepts finished, public-safe packets. Keep drafts in `scratch/` (ignored) or outside the repository until inspected. A local preflight is not a substitute for reading every file and checking every screenshot.

## Packet layout

```text
cohorts/2026-fall/learner-042/session-06/
  submission.json
  submission.md
  ai-use.md
  evidence/
    result.txt
    screenshot.png
  changes.patch       # Optional; code is reviewed as text, not executed
```

Allowed evidence: `.md`, `.txt`, `.json`, `.csv`, `.patch`, `.png`, `.jpg`, `.jpeg`. No HTML/SVG, executables, archives, spreadsheets with macros, videos or full browser profiles. Export spreadsheets to CSV and documents to Markdown/text; use small synthetic screenshots. Maximum 30 changed files, 150 KB per text file, 2 MB per image and 6 MB per packet. Images require human privacy review; AI does not inspect them in this first version.

Use exact lowercase path components. The packet folder and manifest must match. Use a full 40-character course commit SHA from the academy repository's commit page. Declare all sessions' deliverables in `submission.md`; use [the course templates](https://github.com/labalicious-learning/ai-quality-academy/tree/main/templates) where relevant. Do not upload the entire course or answer key.

## Browser route: Mac, Linux or Windows

1. Fork https://github.com/labalicious-learning/lab-submissions into your personal account. The fork is public: do not upload unfinished private material.
2. Create a branch such as `session-06`. Copy the templates locally, edit them in a UTF-8 text editor and inspect the packet.
3. For a preflight, download/extract the trusted submission repository and run `node scripts/preflight.mjs "path/to/session-06"` from its root. Node 22+ works on all three operating systems. Windows PowerShell can use `npm.cmd` for npm commands. For a blocked installation, have an instructor check the packet before uploading.
4. In your fork, choose Add file → Create new file. Enter the full `cohorts/.../session-06/submission.md` path. Add the other inspected files at that same folder using Add file / Upload files.
5. Choose Contribute → Open pull request, with base `labalicious-learning/lab-submissions:main`. Fill the checklist and use an alias, not your real name, in the title. Start as draft if needed.
6. Read the bot's comments and the Files changed tab. Fix problems on the **same branch**, then mark ready for review. Each update gets an exact-commit check; old AI feedback does not approve a new commit.

## Git route (optional)

Clone your own fork, create a branch, copy the packet under `cohorts/`, and inspect `git diff --cached` before pushing. Stage only the packet path, not your whole home/work directory. Run the trusted preflight before your first push. Then open the PR in the browser as above. Git CLI is optional; GitHub Desktop is supported on Mac/Windows, not officially on Linux.

## Feedback and revisions

The automatic check asks whether a packet is complete and plausibly safe to inspect; it does not grade the work. A failed privacy check means stop and contact the instructor privately. Removing a public file does not remove copies or history; rotate leaked credentials immediately.

Ask a peer to reproduce one claim using [the review template](templates/review.md). For group work, include each contributor's alias, role and individual reflection. Each person can answer a short instructor question without reading the AI chat.

An instructor accepts, requests revision or records a private blocker. Once accepted, the PR may be merged. The bot allows new packets only: do not edit someone else's or an already accepted packet. For later corrections, ask the instructor for an amendment PR rather than silently rewriting accepted evidence.

Your work may be public and the answer keys already are. Cite collaboration and sources. The goal is explaining and reproducing your decisions, not hiding that you used AI.
