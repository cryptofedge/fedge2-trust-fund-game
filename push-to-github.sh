#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# FEDGE 2.O — GitHub Repo Setup Script
# Run this script once on your local machine to create the GitHub repo & push.
#
# Prerequisites:
#   - git installed
#   - GitHub CLI (gh) installed: https://cli.github.com
#   - Run: gh auth login   (first time only)
# ─────────────────────────────────────────────────────────────────────────────

set -e

REPO_NAME="fedge2-trust-fund-game"
DESCRIPTION="FEDGE 2.O — A mobile strategy game where you grow your trust fund empire"

echo ""
echo "🏦  FEDGE 2.O — GitHub Repo Setup"
echo "────────────────────────────────────"

# 1. Initialize git if not already a repo
if [ ! -d ".git" ]; then
  echo "📦 Initializing git repository..."
  git init
  git branch -M main
fi

# 2. Stage all files
echo "📂 Staging all files..."
git add .

# 3. Initial commit
echo "💾 Creating initial commit..."
git commit -m "🏦 Initial commit: FEDGE 2.O Trust Fund Game

- React Native (Expo) mobile app
- Turn-based strategy game engine
- Asset simulation: stocks, crypto, real estate, ventures
- Random market events system
- Node.js + Express + MongoDB backend
- JWT authentication
- Global leaderboard API"

# 4. Create GitHub repo
echo "🐙 Creating GitHub repository..."
gh repo create "$REPO_NAME" \
  --public \
  --description "$DESCRIPTION" \
  --source=. \
  --remote=origin \
  --push

echo ""
echo "✅  Done! Your repo is live at:"
echo "    https://github.com/$(gh api user --jq .login)/$REPO_NAME"
echo ""
echo "Next steps:"
echo "  cd client && npm install && npx expo start"
echo "  cd server && npm install && cp .env.example .env && npm run dev"
