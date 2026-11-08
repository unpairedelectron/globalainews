#!/usr/bin/env bash
# Run inside the Replit workspace. Brings GitHub `main` into Replit, builds,
# tests every scheduled publish date, then pushes the result back to GitHub so
# both sides stay identical. Never resets, rebases or force-pushes.
# Exit codes: 0 ok, 2 merge conflict (aborted, nothing changed), 3 build/test failed.
set -uo pipefail
export DANGEROUSLY_ALLOW_GIT=1
cd "$(git rev-parse --show-toplevel)"

echo "== 1. Save any uncommitted workspace changes"
git add -A && git commit -q -m "Replit workspace changes before sync" || echo "nothing to commit"

echo "== 2. Merge GitHub main"
git fetch -q origin main
git branch -f backup-before-sync HEAD
if ! git merge --no-ff -q origin/main -m "Sync GitHub main into Replit"; then
  echo "CONFLICT in:"; git diff --name-only --diff-filter=U
  git merge --abort
  echo "RESULT: CONFLICT (merge aborted, workspace unchanged; backup branch: backup-before-sync)"
  exit 2
fi
git log --oneline -3

echo "== 3. Build and test"
cd site
if ! (npm ci --no-audit --no-fund && npm run build && npm run test:schedule); then
  echo "RESULT: BUILD_OR_TEST_FAILED (not pushed)"
  exit 3
fi
cd ..

echo "== 4. Push to GitHub"
git push -q origin HEAD:main && echo "pushed" || { echo "RESULT: PUSH_FAILED (build OK)"; exit 4; }
echo "RESULT: SYNC_OK $(git rev-parse --short HEAD)"
