# Release pipeline: Claude → GitHub → Replit → live

GitHub `main` is the source of truth. A release runs without manual steps:

1. **Claude** commits to the working branch, runs `npm run build` and `npm run test:schedule`, and pushes.
2. **Claude** opens a pull request into `main` and merges it (GitHub connector).
3. **Claude** asks the Replit Agent (Replit connector) to run `bash site/scripts/replit-sync.sh`. The script:
   - commits any workspace changes Replit made, so nothing is lost;
   - merges GitHub `main` (never resets or force-pushes; aborts on conflict);
   - runs `npm ci`, `npm run build` (SEO gate) and `npm run test:schedule`;
   - pushes the merged result back to GitHub so both sides match.
4. **Claude** publishes through the Replit connector and polls until the deploy succeeds.
5. **Claude** asks the Replit Agent to run `bash site/scripts/verify-deploy.sh` against https://www.globalainews.in and reports the result.

The owner is only asked when:
- a merge conflict needs a human choice,
- the build or verification fails in a way Claude can't fix,
- or an editorial decision is needed (publisher identity, a named reviewer, what to publish).

Scheduled articles need no release: the production server rebuilds itself when a publish time passes.

**Rollback:** each sync leaves a `backup-before-sync` branch in Replit. To return to the previous live version, merge a revert commit on GitHub and run the pipeline again.
