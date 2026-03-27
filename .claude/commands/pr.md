# PR Commands

> Quick reference commands for Pull Request operations using GitHub CLI.

---

## Create PR

### Create PR with Full Template

```bash
gh pr create \
  --title "$(TITLE)" \
  --body "$(cat <<'EOF'
## Summary
<!-- What does this PR do? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Test Plan
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] Error handling implemented

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" \
  --reviewer @me \
  --assignee @me
```

### Create PR from Current Branch

```bash
# Standard PR
gh pr create --fill

# PR with labels
gh pr create --fill --label "feature" --label "needs-review"

# PR targeting specific branch
gh pr create --fill --base develop
```

### Create PR for Specific Branch

```bash
gh pr create \
  --head feature-branch-name \
  --title "feat(scope): description" \
  --body "PR description"
```

---

## View PR

### View PR Details

```bash
# View current branch PR
gh pr view

# View specific PR
gh pr view <pr-number>

# View PR in terminal with comments
gh pr view <pr-number> --comments

# View PR as JSON
gh pr view <pr-number> --json number,title,state,url,author
```

### View PR Diff

```bash
# View diff in terminal
gh pr diff <pr-number>

# View diff with patch format
gh pr diff <pr-number> --patch

# Compare two branches
gh pr diff main...feature-branch
```

### View PR Status

```bash
# View all PRs for current repo
gh pr status

# View PR checks status
gh pr checks <pr-number>

# View CI status
gh pr view <pr-number> --json status,statusCheckRollup
```

---

## List PRs

```bash
# List PRs assigned to you
gh pr list --assignee @me

# List PRs you need to review
gh pr list --review-requested @me

# List all open PRs
gh pr list --state open

# List recently closed PRs
gh pr list --state closed

# List merged PRs
gh pr list --state merged

# List PRs with specific label
gh pr list --label "bug" --label "priority"

# List PRs by author
gh pr list --author username

# List PRs with JSON output
gh pr list --json number,title,state,createdAt,author --limit 10
```

---

## Review PR

### Approve PR

```bash
# Approve with default message
gh pr review <pr-number> --approve

# Approve with custom comment
gh pr review <pr-number> --approve --body "LGTM! Great implementation."
```

### Request Changes

```bash
# Request changes with comment
gh pr review <pr-number> --request-changes --body "$(cat <<'EOF'
## Blocking Issues

1. **Security**: Missing input validation on line 45
2. **Tests**: Coverage below 80% threshold
3. **Style**: Function name should be more descriptive

Please address these before I can approve.
EOF
)"
```

### Add Review Comment

```bash
# Add general comment
gh pr review <pr-number> --comment --body "Nice refactor!"

# Comment on specific lines
gh pr diff <pr-number> | gh pr review <pr-number> --comment --body "Comment on diff"
```

---

## Merge PR

### Squash and Merge (Preferred)

```bash
# Squash and merge
gh pr merge <pr-number> --squash --delete-branch

# Squash with custom message
gh pr merge <pr-number> --squash --delete-branch --squash-title "feat(scope): Custom merge message"
```

### Merge (No Squash)

```bash
# Regular merge (preserves commits)
gh pr merge <pr-number> --admin --delete-branch
```

### Rebase and Merge

```bash
# Rebase and merge
gh pr merge <pr-number> --rebase --delete-branch
```

### Merge with Delay (for CI)

```bash
# Enable auto-delete after merge
gh pr merge <pr-number> --squash --delete-branch --auto

# Wait for checks before merge
gh pr merge <pr-number> --squash --subject "Custom subject"
```

---

## Close PR

```bash
# Close PR without merging
gh pr close <pr-number>

# Close PR and delete branch
gh pr close <pr-number> --delete-branch
```

---

## Manage Labels

### Add Labels

```bash
# Add single label
gh pr edit <pr-number> --add-label "feature"

# Add multiple labels
gh pr edit <pr-number> --add-label "feature,needs-review"
```

### Remove Labels

```bash
# Remove label
gh pr edit <pr-number> --remove-label "wip"
```

### List Available Labels

```bash
# List all repo labels
gh label list
```

---

## Manage Assignees

```bash
# Add assignee
gh pr edit <pr-number> --add-assignee username

# Add yourself
gh pr edit <pr-number> --add-assignee @me

# Remove assignee
gh pr edit <pr-number> --remove-assignee username
```

---

## Manage Reviewers

```bash
# Request review
gh pr edit <pr-number> --add-reviewer username

# Request review from team
gh pr edit <pr-number> --add-reviewer my-team

# Remove reviewer request
gh pr edit <pr-number> --remove-reviewer username
```

---

## PR Statistics

### View PR Timeline

```bash
# View PR events timeline
gh api repos/:owner/:repo/pulls/:number/timeline
```

### View Review Summary

```bash
# View all reviews for PR
gh api repos/:owner/:repo/pulls/:number/reviews --jq '.[] | {state, author, submittedAt}'
```

---

## Common Workflows

### Complete PR Workflow

```bash
# 1. Create PR
gh pr create --fill

# 2. Share with team
gh pr edit <pr-number> --add-reviewer @team

# 3. After approval, merge
gh pr merge <pr-number> --squash --delete-branch

# 4. Switch to main and cleanup
git checkout main && git pull origin main && git branch -d feature-branch
```

### Review Workflow

```bash
# 1. View PR details
gh pr view <pr-number> --comments

# 2. View diff
gh pr diff <pr-number>

# 3. Check CI status
gh pr checks <pr-number>

# 4. Add review
gh pr review <pr-number> --approve --body "LGTM!"

# OR request changes
gh pr review <pr-number> --request-changes --body "Please fix X before merge"

# 5. If approved, merge
gh pr merge <pr-number> --squash --delete-branch
```

### Fix PR Feedback

```bash
# 1. Make fixes on your branch
git checkout feature-branch
git add fixed-file.ts
git commit -m "fix: address review feedback"

# 2. Push changes
git push

# 3. Respond to review comment
gh api repos/:owner/:repo/issues/:number/comments --field body="Fixed as requested!" --field commit_id=$(git rev-parse HEAD)
```

---

## Branch Management

### Create Feature Branch

```bash
# From main
git checkout main && git pull origin main
git checkout -b feat/PROJ-123-description

# From specific branch
git checkout -b feat/PROJ-123-description develop
```

### Sync Feature Branch

```bash
# Fetch and rebase
git fetch origin
git rebase origin/main

# Or merge
git fetch origin
git merge origin/main
```

### Delete Merged Branches

```bash
# Delete local branch
git branch -d feature-branch

# Delete remote branch
git push origin --delete feature-branch

# Prune deleted remote branches
git remote prune origin
```

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Create PR | `gh pr create --fill` |
| View PR | `gh pr view` |
| View diff | `gh pr diff` |
| List PRs | `gh pr list --state open` |
| Approve | `gh pr review <num> --approve` |
| Request changes | `gh pr review <num> --request-changes` |
| Merge | `gh pr merge <num> --squash --delete-branch` |
| Close | `gh pr close <num>` |
| Add label | `gh pr edit <num> --add-label "feature"` |
| Add reviewer | `gh pr edit <num> --add-reviewer @me` |

---

## Notes

- All commands should be run from the project root `/Users/anthony/Desktop/Defo/`
- Ensure you have authenticated with GitHub: `gh auth login`
- Check current repo: `gh repo view --json name,owner`
- For help: `gh pr --help` or `gh pr <subcommand> --help`
