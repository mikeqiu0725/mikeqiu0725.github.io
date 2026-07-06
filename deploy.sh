#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/mikeqiu0725/mikeqiu0725.github.io.git}"
BRANCH="${BRANCH:-main}"
DEPLOY_DIR="${DEPLOY_DIR:-.deploy/mikeqiu0725.github.io}"
MESSAGE="${1:-Update portfolio site}"

mkdir -p "$(dirname "$DEPLOY_DIR")"

if [ ! -d "$DEPLOY_DIR/.git" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$DEPLOY_DIR"
else
  git -C "$DEPLOY_DIR" fetch origin "$BRANCH"
  git -C "$DEPLOY_DIR" checkout "$BRANCH"
  git -C "$DEPLOY_DIR" pull --ff-only origin "$BRANCH"
fi

rsync -av --delete \
  --exclude ".git/" \
  --exclude ".deploy/" \
  --exclude ".superpowers/" \
  --exclude ".DS_Store" \
  --exclude "tests/" \
  --exclude "docs/" \
  ./ "$DEPLOY_DIR"/

git -C "$DEPLOY_DIR" add -A

if git -C "$DEPLOY_DIR" diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git -C "$DEPLOY_DIR" commit -m "$MESSAGE"
git -C "$DEPLOY_DIR" push origin "$BRANCH"
echo "Deployed to https://mikeqiu0725.github.io/"
