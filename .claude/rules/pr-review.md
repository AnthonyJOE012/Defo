# PR Review Specification

> This file extends [common/git-workflow.md](./git-workflow.md) with detailed PR creation and review processes.

## Overview

All changes to the codebase MUST go through a Pull Request (PR) review process. This ensures code quality, knowledge sharing, and reduces bugs in production.

---

## PR Creation Workflow

### 1. Before Creating PR

#### Branch Naming Convention

```
<type>/<ticket-id>-<short-description>

Examples:
feat/PROJ-123-add-user-authentication
fix/PROJ-456-login-redirect-loop
refactor/PROJ-789-simplify-checkout-flow
docs/PROJ-101-update-api-documentation
test/PROJ-102-add-checkout-tests
chore/PROJ-103-update-dependencies
```

#### Branch Creation

```bash
# Ensure on latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/PROJ-123-add-user-authentication

# Or for bug fixes
git checkout -b fix/PROJ-456-login-redirect-loop
```

#### Commit Guidelines

```bash
# Stage specific files (avoid git add -A)
git add src/auth/login.ts
git add src/auth/login.test.ts

# Commit with conventional format
git commit -m "$(cat <<'EOF'
feat(auth): add user login with email verification

- Add login form with email/password fields
- Implement JWT token generation on successful login
- Add session persistence with httpOnly cookies
- Include rate limiting (5 attempts per minute)

Closes #PROJ-123
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## PR Creation Process

### 2. Push Branch

```bash
# Push with upstream tracking
git push -u origin feat/PROJ-123-add-user-authentication

# Subsequent pushes
git push
```

### 3. Create PR via GitHub CLI

```bash
# Create PR
gh pr create \
  --title "feat(auth): add user login with email verification" \
  --body "$(cat <<'EOF'
## Summary

- Add user login with email/password authentication
- Implement JWT token generation and session management
- Add rate limiting for security (5 attempts per minute)

## Type of Change

- [ ] Bug fix (non-breaking change)
- [x] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## Test Plan

- [ ] Unit tests added/updated (80%+ coverage required)
- [ ] Integration tests added/updated
- [x] E2E tests added/updated (critical paths covered)
- [ ] Manual testing performed

## Screenshots (if UI changes)

| Before | After |
|--------|-------|
| Screenshot 1 | Screenshot 2 |

## Checklist

- [x] Code follows project style guidelines
- [x] Self-reviewed code
- [x] No hardcoded secrets
- [x] All inputs validated
- [x] Error handling implemented
- [x] Documentation updated (if needed)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" \
  --reviewer @me \
  --label "feature,auth" \
  --assignee @me
```

### 4. Alternative: Create PR via Web

1. Push branch to GitHub
2. Go to repository on GitHub
3. Click "Compare & pull request"
4. Fill in PR template
5. Add reviewers
6. Create pull request

---

## PR Title Format

```
<type>(<scope>): <description>

Types:
- feat:     New feature
- fix:      Bug fix
- refactor: Code refactoring
- docs:     Documentation changes
- test:     Test changes
- chore:    Maintenance tasks
- perf:     Performance improvements
- ci:       CI/CD changes

Examples:
- feat(auth): add OAuth2 login support
- fix(checkout): prevent duplicate order submission
- refactor(cart): simplify state management
- docs(api): update endpoint documentation
```

---

## Code Review Checklist

### Critical (Must Pass)

- [ ] **No hardcoded secrets** - No API keys, passwords, tokens in code
- [ ] **Input validation** - All user inputs validated before processing
- [ ] **SQL injection prevention** - Use parameterized queries
- [ ] **XSS prevention** - Sanitize user input in HTML contexts
- [ ] **Authentication/Authorization** - Proper checks in place
- [ ] **Error handling** - No unhandled exceptions, no silent failures
- [ ] **Test coverage** - 80%+ coverage for new code

### Security

- [ ] No secrets in environment variables (use secret manager)
- [ ] Rate limiting on public endpoints
- [ ] Proper CORS configuration
- [ ] HTTPS enforced for sensitive operations
- [ ] Session timeout configured appropriately

### Functionality

- [ ] Code compiles/builds successfully
- [ ] Tests pass (unit, integration, E2E)
- [ ] Feature works as described in PR
- [ ] Edge cases handled
- [ ] Error messages are user-friendly
- [ ] No console errors in browser

### Code Quality

- [ ] Follows project style guidelines
- [ ] No duplicate code (reuse existing utilities)
- [ ] Functions are small (< 50 lines)
- [ ] Files are focused (< 800 lines)
- [ ] No deep nesting (> 4 levels)
- [ ] Meaningful variable/function names
- [ ] Comments explain "why", not "what"

### Performance

- [ ] No N+1 queries
- [ ] Proper indexing on database queries
- [ ] No memory leaks
- [ ] Lazy loading where appropriate
- [ ] No unnecessary re-renders (React)

### Testing

- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Test isolation (no shared state)
- [ ] Mocks are correct and necessary

---

## Review Process

### For Authors

1. **Self-review first** - Review your own code before requesting review
2. **Keep PRs small** - < 400 lines changed is ideal
3. **One logical change per PR** - Easier to review, easier to revert
4. **Respond to feedback** - Address all comments within 24 hours
5. **Don't take feedback personally** - Code review is about the code, not you

### For Reviewers

1. **Review within 24 hours** - Respect author's time
2. **Be constructive** - Suggest improvements, don't just criticize
3. **Explain "why"** - Help author understand the reasoning
4. **Approve when ready** - Don't block unnecessarily
5. **Use conventional comments**:
   - `blocking:` - Must be fixed before merge
   - `nit:` - Minor suggestion, non-blocking
   - `question:` - Seeking clarification
   - `suggestion:` - Optional improvement

---

## Merge Conditions

### Ready to Merge When

- [ ] All CI checks pass
- [ ] At least 1 approval (2 for large changes)
- [ ] All blocking comments resolved
- [ ] Branch is up to date with target branch
- [ ] No merge conflicts

### Merge Strategy

```bash
# Squash and merge (preferred for single logical commit)
gh pr merge --squash --delete-branch

# Or via GitHub UI
# Select "Squash and merge" option
```

### After Merge

```bash
# Switch to main
git checkout main
git pull origin main

# Delete local branch
git branch -d feat/PROJ-123-add-user-authentication

# Clean up remote branches
git remote prune origin
```

---

## PR Size Guidelines

| Size | Lines Changed | Review Time | Recommendation |
|------|---------------|-------------|-----------------|
| XS | < 50 | 5 min | Ideal, always welcome |
| S | 50-200 | 15 min | Normal, preferred |
| M | 200-400 | 30 min | Acceptable, split if possible |
| L | 400-800 | 60 min | Split into multiple PRs |
| XL | > 800 | 90+ min | **Must split** |

### How to Split Large PRs

1. **Infrastructure first** - Create separate PR for infrastructure/setup
2. **Core logic separate** - Business logic in one PR, UI in another
3. **Independent features** - If features are independent, separate into different PRs

---

## Fast-Track Merges

For urgent production fixes, you may fast-track with:

1. Skip CI for trivial changes (docs, typos)
2. Get verbal approval from reviewer
3. Add `fast-track` label
4. Merge immediately
5. Document reason in PR comments

**Note**: Fast-track should be rare. Normal process exists for good reasons.

---

## Common PR Rejection Reasons

1. **Missing tests** - Tests below 80% coverage
2. **Hardcoded secrets** - API keys or passwords in code
3. **Breaking changes** - Without discussion or deprecation plan
4. **Code quality** - Deep nesting, long functions, poor naming
5. **Incomplete implementation** - TODO comments that aren't addressed
6. **Out of scope** - Changes beyond the original ticket
7. **Merge conflicts** - Not updated with target branch

---

## PR Templates

### Feature PR Template

```markdown
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
```

### Bug Fix PR Template

```markdown
## Bug Description
<!-- What bug does this fix? -->

## Root Cause
<!-- What was causing the bug? -->

## Fix
<!-- How does this PR fix the bug? -->

## Test Plan
- [ ] Unit tests added to prevent regression
- [ ] Tested fix manually
- [ ] Verified no side effects

## Screenshots
<!-- Before and after if UI fix -->
```

---

## Useful Commands

```bash
# View PR diff
gh pr diff

# View PR checks status
gh pr status
gh pr checks

# Review PR
gh pr review <pr-number> --approve
gh pr review <pr-number> --request-changes --body "Comments here"

# Merge PR
gh pr merge <pr-number> --squash --delete-branch

# Close PR
gh pr close <pr-number>

# View PR comments
gh pr view <pr-number> --comments
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| PRs reviewed within 24h | 100% |
| Average PR size | < 400 lines |
| First-time approval rate | > 70% |
| Rejection rate | < 20% |
| Average time to merge | < 2 days |
