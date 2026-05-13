---
name: feedback-no-coauthor
description: User does not want Claude co-author line in git commits
metadata:
  type: feedback
---

Never add `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` to git commit messages.

**Why:** User (Sameep Sawant) wants commits to only show their own name in git history.

**How to apply:** When creating any git commit, write the message as plain text only — no Co-Authored-By trailer.
