## Topic 1 : Git Basics

---

**1. What is Git? What is a Version Control System (VCS)?**

Answer:
**Git** is a free and open-source **Distributed Version Control System (DVCS)** created by Linus Torvalds in 2005. It tracks changes in source code over time, allows multiple developers to collaborate, and lets you go back to any previous version of your code.

**Version Control System (VCS)** is a system that records changes to files over time so you can recall specific versions later. Three types:

```
1. Local VCS       — tracks changes only on YOUR machine (no collaboration)
2. Centralized VCS — one central server (SVN, CVS) — single point of failure
3. Distributed VCS — every developer has a FULL copy of repo (Git, Mercurial)
                     → no single point of failure, works offline
```

**Why Git specifically?**
- Every developer has full local copy → works offline
- Branching is fast and cheap (unlike older VCS)
- Industry standard — used by 90%+ of developers worldwide
- Free and open source

Note:
- Key Point: Git = Distributed VCS. Every clone is a full backup. The difference from centralized VCS is that there is NO single server dependency — you can commit, branch, and view history even without internet.
- Why Interviewer Asks: First Git question in every interview. They want to hear "Distributed" and understand you know the difference from SVN/centralized systems.

---

**2. What is the difference between Git and GitHub?**

Answer:

| Concept | Git | GitHub |
|---------|-----|--------|
| What is it | Version control **software** (tool) | **Hosting platform** for Git repositories |
| Where does it run | Locally on your machine | Cloud (website: github.com) |
| Who made it | Linus Torvalds (2005) | Microsoft acquired it (2018) |
| Can work without the other |  Git works without GitHub | ❌ GitHub needs Git |
| Features | Branching, committing, merging, history | Pull Requests, Issues, Actions (CI/CD), Pages |
| Alternatives | — | GitLab, Bitbucket, Azure DevOps |

```bash
# Git is the tool — installed on your machine
git init
git commit -m "message"

# GitHub is the remote host — where you push your code
git remote add origin https://github.com/Dev/my-project.git
git push origin main
```

Note:
- Key Point: Git = the tool (software). GitHub = the cloud service that hosts Git repos. You can use Git without GitHub (local only). GitHub without Git makes no sense. GitLab and Bitbucket are alternatives to GitHub.
- Why Interviewer Asks: Very commonly confused by beginners. Shows you understand the difference between the tool and the platform.

---

**3. What are the four main areas in Git's architecture?**

Answer:
Git has four distinct areas that files move through:

```
Working Directory → Staging Area (Index) → Local Repository → Remote Repository

[ Your files  ]    [ git add ]            [ git commit ]     [ git push ]
```

**1. Working Directory (Working Tree)**
- Where you actually edit files on your machine
- Changes here are "untracked" or "modified" — git knows about them but hasn't saved them

**2. Staging Area (Index / Cache)**
- A preparation zone — you choose WHICH changes to include in the next commit
- `git add` moves changes from working directory → staging area
- Lets you commit only specific files, not everything you changed

**3. Local Repository (`.git` folder)**
- The full history of your project stored on YOUR machine
- `git commit` saves staged changes permanently into local repo
- Contains all commits, branches, tags

**4. Remote Repository (GitHub/GitLab)**
- The shared repo hosted online (GitHub, GitLab, Bitbucket)
- `git push` sends your local commits → remote
- `git pull` / `git fetch` gets remote changes → local

```bash
# Track the journey of a file
git status          # see what's in working dir and staging
git add file.js     # working dir → staging area
git commit -m "msg" # staging area → local repo
git push            # local repo → remote repo
```

Note:
- Key Point: The staging area is what makes Git special — it lets you craft exactly what goes into a commit. You can modify 10 files but only stage and commit 3 of them. This is unlike other VCS that commit all changes at once.
- Why Interviewer Asks: Tests if you understand the Git workflow deeply. Many candidates know add/commit/push but don't understand WHY there's a staging area.

---

**4. What is the difference between `git pull` and `git fetch`?**

Answer:
Both bring changes from the remote repository — but they behave differently:

```bash
# git fetch — downloads changes but does NOT merge into your branch
git fetch origin
# Remote changes are now in origin/main (remote tracking branch)
# Your local main branch is UNTOUCHED
# You manually decide when/how to merge

# git pull — downloads AND immediately merges into current branch
git pull origin main
# Equivalent to: git fetch + git merge
```

```
git fetch:
Remote → origin/main (remote tracking branch)  ← stops here, you are safe
Your local main branch = unchanged

git pull:
Remote → origin/main → your local main (auto merged)  ← happens in one step
```

**When to use which:**
```bash
# Use fetch when you want to SEE what changed before merging
git fetch origin
git log origin/main   # review remote changes
git diff main origin/main  # see differences
git merge origin/main   # merge when ready

# Use pull when you trust the remote and just want to sync
git pull origin main
```

Note:
- Key Point: `fetch` = safe, downloads only, you review first. `pull` = fetch + merge in one command. In team projects, `fetch` first is safer — you can review changes before merging. `git pull --rebase` fetches and rebases instead of merging.
- Why Interviewer Asks: Very commonly asked. The key distinction is that `pull` auto-merges which can cause unexpected merge conflicts if you have local changes.

---

**5. What is Branching in Git? Why is it important?**

Answer:
A **branch** is an independent line of development — a lightweight movable pointer to a commit. Creating a branch lets you work on a feature or fix without touching the main (stable) code.

```bash
# ===== BRANCH COMMANDS =====

# See all branches
git branch          # local branches
git branch -a       # all branches (local + remote)
git branch -r       # remote branches only

# Create a new branch
git branch feature-login

# Switch to a branch (old way)
git checkout feature-login

# Create AND switch in one command (old way)
git checkout -b feature-login

# Modern way (Git 2.23+) — use switch
git switch feature-login           # switch to existing branch
git switch -c feature-payment      # create and switch

# Delete a branch
git branch -d feature-login        # safe delete (merged only)
git branch -D feature-login        # force delete (even if unmerged)

# Delete remote branch
git push origin --delete feature-login

# Rename current branch
git branch -m new-name
```

**Why branching matters:**
```
main ─────────────────────────────────── stable, production code
      \                               /
       feature/login ─── feature done, merged back
      \                    /
       bugfix/crash ── quick fix, merged back
```

Note:
- Key Point: Branches are just pointers to commits — creating a branch costs almost nothing in Git (unlike SVN). `HEAD` points to the current branch you are on. Main workflow: create branch → do work → commit → merge/PR → delete branch.
- Why Interviewer Asks: Branching is the foundation of every Git workflow. They want to see you know the commands AND understand the concept — parallel development without interference.

---

## Topic 2 : Core Git Commands

---

**6. What is the difference between `git merge` and `git rebase`?**

Answer:
Both integrate changes from one branch into another — but the history they create is different:

```bash
# Scenario: you are on feature branch, want to bring in main's changes

# ===== git merge — creates a MERGE COMMIT, preserves full history =====
git checkout feature
git merge main

# History looks like:
# main:    A → B → C → M (M = merge commit)
#               ↗
# feature: D → E

# Full history preserved — you can see exactly when branches diverged and merged
#  Safe — non-destructive, preserves context
# ❌ Creates extra merge commits that clutter history in active repos

# ===== git rebase — replays your commits ON TOP of main, LINEAR history =====
git checkout feature
git rebase main

# History looks like:
# main:    A → B → C → D' → E'
# (feature commits D,E are re-applied AFTER C as D', E')

# Linear history — looks like feature was always developed after C
#  Clean, linear history — easy to read with git log
# ❌ REWRITES commit history — NEVER rebase commits already pushed to shared remote!
```

**Golden Rule of Rebase:**
```bash
#  NEVER DO THIS — rebasing shared branch
git checkout main
git rebase feature   # ← rebases commits others have already pulled — causes chaos!

#  SAFE — only rebase your LOCAL feature branch
git checkout my-feature
git rebase main      # ← only affects your own local commits
```

Note:
- Key Point: Merge = preserves history with merge commits (safer for shared branches). Rebase = rewrites history for clean linear log (only for local branches never pushed). Rule: "Never rebase public branches." Interviewers love this rule.
- Why Interviewer Asks: merge vs rebase is one of the TOP Git interview questions. Shows you understand history manipulation and team collaboration rules.

---

**7. What is `git stash`? When do you use it?**

Answer:
`git stash` **temporarily saves your uncommitted changes** and restores your working directory to a clean state — without losing your work. Use it when you need to switch context quickly.

```bash
# ===== SCENARIO =====
# You're mid-feature when urgent bug fix needed on main branch
# You can't commit unfinished work — use stash!

git status   # shows modified files you don't want to commit yet

# Save changes temporarily
git stash                          # stash with default name
git stash save "login form WIP"    # stash with descriptive name

# Your working directory is now clean
git checkout main
# ... fix bug, commit, push ...
git checkout feature-login

# Bring your stashed work back
git stash pop          # apply last stash AND delete it from stash list
git stash apply        # apply last stash but KEEP it in stash list

# Work with multiple stashes
git stash list         # see all stashes: stash@{0}, stash@{1}...
git stash apply stash@{1}   # apply specific stash
git stash drop stash@{0}    # delete specific stash
git stash clear        # delete ALL stashes

# Stash including untracked files
git stash -u           # -u = --include-untracked

# See what's inside a stash
git stash show         # summary
git stash show -p      # full diff
```

Note:
- Key Point: Stash = clipboard for uncommitted changes. `pop` = apply + delete. `apply` = apply but keep. Common scenario: stash → switch branches → work → come back → unstash. Stash does NOT include untracked new files by default — use `-u` flag.
- Why Interviewer Asks: Very practical. They may describe a scenario: "You're working on a feature and suddenly need to fix an urgent bug — what do you do?" — Answer: `git stash`, fix bug, `git stash pop`.

---

**8. What is the difference between `git reset` and `git revert`?**

Answer:
Both undo changes — but in completely different ways:

```bash
# ===== git reset — MOVES the branch pointer backward (rewrites history) =====

# --soft: move HEAD back, keep changes STAGED
git reset --soft HEAD~1
# Use case: "I committed too early, want to recommit with changes"
# Result: last commit undone, changes still staged, ready to re-commit

# --mixed (DEFAULT): move HEAD back, keep changes in WORKING DIR (unstaged)
git reset HEAD~1         # same as git reset --mixed HEAD~1
# Use case: "I committed wrong files, want to re-stage selectively"
# Result: last commit undone, changes in working directory (unstaged)

# --hard: move HEAD back, DELETE all changes PERMANENTLY
git reset --hard HEAD~1
# Use case: "Throw away the last commit AND all changes completely"
# Result: last commit AND all changes are GONE — be careful!
# ❌ DATA LOSS RISK — changes cannot be recovered easily

# ===== git revert — creates a NEW commit that UNDOES a previous commit =====
git revert abc1234     # abc1234 = commit hash to undo
# Creates a NEW commit that is the opposite of abc1234
# Original commit still in history — history is PRESERVED
#  SAFE for shared/public branches — no history rewriting
```

**Decision guide:**
```
Need to undo a commit you haven't pushed?
→ git reset (any mode)

Need to undo a commit you ALREADY pushed to shared branch?
→ git revert (safe, preserves history)

reset --soft   = undo commit, keep staged changes
reset --mixed  = undo commit, keep unstaged changes (default)
reset --hard   = undo commit, DELETE all changes (destructive!)
```

Note:
- Key Point: reset = rewrites history (unsafe for pushed commits). revert = adds new undo commit (safe for public branches). For pushed commits — ALWAYS use `revert`. For local-only commits — can use `reset`. `--hard` loses your work permanently — use with caution.
- Why Interviewer Asks: Classic Git question. They WILL ask: "How do you undo a commit?" Make sure to ask "Has it been pushed?" first — your answer changes based on that.

---

**9. What is a Merge Conflict? How do you resolve it?**

Answer:
A **merge conflict** happens when two branches modify the **same line** in the same file and Git cannot automatically decide which change to keep. Git pauses the merge and asks YOU to resolve it.

```bash
# WHEN conflicts happen:
# Both main and feature-login modified the same line in app.js
git merge feature-login
# CONFLICT (content): Merge conflict in app.js
# Automatic merge failed; fix conflicts and then commit the result.

# ===== WHAT THE CONFLICT LOOKS LIKE IN THE FILE =====
<<<<<<< HEAD           ← your current branch (main)
const port = 3000;
=======                ← divider
const port = 5000;
>>>>>>> feature-login  ← incoming branch

# ===== HOW TO RESOLVE =====
# Step 1: Open the file, decide which version to keep (or combine both)

# Option A: Keep current branch (HEAD)
const port = 3000;

# Option B: Keep incoming branch
const port = 5000;

# Option C: Keep both (manual merge)
const port = process.env.PORT || 3000;

# Delete ALL the conflict markers: <<<<<<, =======, >>>>>>>

# Step 2: Stage the resolved file
git add app.js

# Step 3: Complete the merge
git commit    # Git auto-generates merge commit message

# ===== ABORT the merge if you want to start over =====
git merge --abort   # cancels merge and goes back to pre-merge state

# ===== USING VS CODE to resolve =====
# VS Code shows conflict markers with buttons:
# "Accept Current" / "Accept Incoming" / "Accept Both" / "Compare Changes"
```

Note:
- Key Point: Conflicts happen when same line is changed in both branches. Git marks conflicts with `<<<<<<<`, `=======`, `>>>>>>>`. You manually pick the correct version, remove ALL markers, then `git add` + `git commit`. Prevention: pull often, work in small focused branches, communicate with team.
- Why Interviewer Asks: Practical question every developer faces. They want to see the step-by-step resolution process. Mentioning VS Code's conflict resolution UI shows real-world experience.

---

**10. What is `.gitignore`? How does it work?**

Answer:
`.gitignore` is a file that tells Git which files and folders to **completely ignore** — they will never be tracked, staged, or committed.

```bash
# .gitignore file in project root

# Ignore node_modules folder (ALWAYS ignore this — huge, auto-generated)
node_modules/

# Ignore environment files (SECRET KEYS — NEVER commit these!)
.env
.env.local
.env.production

# Ignore build/dist folders (generated files)
dist/
build/
.next/

# Ignore OS files
.DS_Store      # macOS
Thumbs.db      # Windows

# Ignore log files
*.log
logs/

# Ignore coverage reports
coverage/

# Ignore IDE config folders
.vscode/
.idea/

# Ignore specific file type anywhere in project
*.tmp

# Ignore a specific file
secret.js

# EXCEPTION — track this even though *.log is ignored
!important.log
```

**What if you accidentally committed a file?**
```bash
# Already committed .env by mistake? Remove from tracking but keep the file:
git rm --cached .env        # removes from Git tracking only (file stays on disk)
git commit -m "Stop tracking .env"
# Now add .env to .gitignore so it stays ignored
```

Note:
- Key Point: `.gitignore` prevents accidental commits of `node_modules` (huge), `.env` (security), and `dist` (auto-generated). `git rm --cached filename` removes a file from tracking WITHOUT deleting it from disk. Global gitignore: `git config --global core.excludesfile ~/.gitignore_global` for OS-specific files.
- Why Interviewer Asks: Very practical. They may ask: "You accidentally committed your `.env` file with API keys — what do you do?" — `git rm --cached .env` + commit + add to .gitignore + rotate your API keys!

---

## Topic 3 : Branching Strategies & Workflows

---

**11. What is GitHub Flow? Explain the workflow.**

Answer:
**GitHub Flow** is a simple, lightweight branching strategy used by most teams. It has 6 steps:

```
1. main branch is ALWAYS deployable (production-ready)
2. Create a new branch for each feature/bugfix
3. Commit to that branch regularly
4. Open a Pull Request when ready for review
5. Team reviews code, approves, requests changes
6. Merge to main + deploy
```

```bash
# ===== GITHUB FLOW IN PRACTICE =====

# Step 1: Start from latest main
git checkout main
git pull origin main

# Step 2: Create a descriptive branch
git checkout -b feature/user-authentication
# naming: feature/..., bugfix/..., hotfix/..., chore/...

# Step 3: Work and commit frequently
git add .
git commit -m "feat: add login form validation"
git commit -m "feat: integrate JWT authentication"
git commit -m "test: add login unit tests"

# Step 4: Push branch to remote
git push origin feature/user-authentication

# Step 5: Open Pull Request on GitHub
# → Add description, link related issues
# → Request reviewers

# Step 6: After PR approved — merge and delete branch
git checkout main
git merge feature/user-authentication
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

Note:
- Key Point: GitHub Flow = simple. main is always deployable. Feature branches are short-lived. PRs are mandatory for review. Most modern companies use this flow. Git Flow (the alternative) is more complex with develop, release, hotfix branches — used for large projects with scheduled releases.
- Why Interviewer Asks: Shows you understand real-world team collaboration. Mentioning Pull Requests and code review shows professional mindset.

---

**12. What is a Pull Request (PR)? What is Code Review?**

Answer:
A **Pull Request (PR)** is a request to **merge your branch into another branch** (usually main). It is NOT a Git feature — it is a GitHub/GitLab feature. A PR creates a space for:
- Showing your changes
- Discussion and comments
- Code review by teammates
- Running automated tests (CI/CD)
- Final approval before merging

```
Developer:
1. Pushes feature branch to GitHub
2. Opens PR: "Merge feature/login → main"
3. Describes what changed and why

Reviewers:
4. Review code line by line
5. Leave comments: "This should use async/await" or "Looks good!"
6. Request changes or Approve

Developer:
7. Makes requested changes, pushes more commits
8. PR updates automatically

Final:
9. PR approved → Merge button → Branch merged into main
10. Delete feature branch
```

**PR best practices:**
```
 Small, focused PRs — easier to review
 Descriptive title and description
 Link related issues (#42)
 Self-review before requesting others
 Respond to review comments promptly
❌ Giant PRs with 100 file changes — hard to review
```

Note:
- Key Point: PR = GitHub/GitLab feature for code review before merge. Not a Git command. Good teams NEVER merge directly to main without a PR. PRs also trigger CI/CD pipelines (automated tests run on every PR). In GitLab it's called "Merge Request (MR)".
- Why Interviewer Asks: Shows you know team development practices. They'll ask: "How does code get reviewed in your team?" — PR workflow is the answer.

---

**13. What is `git cherry-pick`?**

Answer:
`git cherry-pick` lets you **apply a specific commit from one branch to another** — without merging the entire branch. You "pick" just one (or a few) commits.

```bash
# ===== SCENARIO =====
# You fixed a critical bug in feature branch (commit abc1234)
# You need that fix in main NOW without merging the whole feature branch

# Find the commit hash
git log feature-branch --oneline
# abc1234 fix: resolve crash on null user input  ← you want this one
# def5678 WIP: new payment form (not ready)
# ghi9012 Add new dashboard (not ready)

# Switch to target branch
git checkout main

# Cherry-pick just that one commit
git cherry-pick abc1234
# Creates a NEW commit on main with same changes as abc1234
# The original commit in feature branch is NOT affected

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678

# Cherry-pick a range
git cherry-pick abc1234..ghi9012   # from abc1234 to ghi9012 (exclusive of first)
git cherry-pick abc1234^..ghi9012  # inclusive of abc1234
```

Note:
- Key Point: cherry-pick = copy a specific commit to another branch. Creates a new commit with same changes but different hash. Used for hotfixes, backporting features. Avoid overusing — if you cherry-pick too many commits, it means you should have branched differently.
- Why Interviewer Asks: Tests advanced Git knowledge. Common scenario: "How do you apply a bug fix from your feature branch to main without merging the whole feature?" — cherry-pick.

---

## Topic 4 : Advanced Git Concepts

---

**14. What is `HEAD` in Git? What is a detached HEAD?**

Answer:
**`HEAD`** is a special pointer that always points to the **current commit you are looking at** — usually the tip (latest commit) of your current branch.

```bash
# HEAD normally points to current branch tip
git log --oneline
# abc1234 (HEAD → main) latest commit  ← HEAD points here
# def5678 previous commit
# ghi9012 older commit

# HEAD moves automatically when you commit
git commit -m "new commit"
# HEAD now points to the new commit

# ===== DETACHED HEAD STATE =====
# Happens when you checkout a specific commit hash directly
# instead of a branch name

git checkout abc1234   # checkout old commit directly
# You are in 'detached HEAD' state.
# HEAD → abc1234 (commit) — NOT pointing to any branch!

# ⚠️ In detached HEAD: you can look around, experiment
# But any commits you make are NOT on any branch
# If you switch away, those commits become "lost" (garbage collected)

# ===== FIX: Create a branch to save your work from detached HEAD =====
git switch -c new-branch-from-here   # creates branch at current detached position
# Now HEAD → new-branch-from-here 

# To get back to normal:
git checkout main   # returns HEAD to main branch
```

Note:
- Key Point: HEAD = "where you are right now" in Git history. Normally HEAD → branch → latest commit. Detached HEAD = HEAD → specific commit (no branch). Safe for exploring history. Dangerous for committing work — save it with a new branch immediately.
- Why Interviewer Asks: Tests deep understanding of Git internals. Many developers see "detached HEAD" and panic — knowing what it is and how to fix it shows experience.

---

**15. What is `git rebase --interactive` (interactive rebase)?**

Answer:
Interactive rebase (`git rebase -i`) lets you **edit, squash, reorder, or delete commits** before pushing them. It is used to clean up messy commit history.

```bash
# Edit last 3 commits interactively
git rebase -i HEAD~3

# This opens an editor showing last 3 commits:
# pick abc1234 WIP: started login
# pick def5678 fix typo
# pick ghi9012 fix another typo

# COMMANDS you can use (replace 'pick'):
# pick   = keep commit as-is
# reword = keep commit but edit the message
# edit   = keep commit but pause to amend it
# squash = merge this commit into PREVIOUS commit (keep message)
# fixup  = merge into previous commit (DISCARD this message)
# drop   = DELETE this commit entirely

# ===== SQUASH EXAMPLE — combine 3 messy commits into 1 clean commit =====
# Before rebase:
# pick abc1234 WIP: started login
# squash def5678 fix typo
# squash ghi9012 fix another typo

# After rebase: ONE clean commit
# abc1234 feat: add login functionality

# ===== REORDER EXAMPLE — swap commit order =====
# pick def5678 feat: add logout
# pick abc1234 feat: add login   ← just move lines up/down

# ⚠️ Only rebase commits NOT yet pushed to shared remote!
```

Note:
- Key Point: Interactive rebase = clean up commits before sharing. Squash WIP commits into one meaningful commit. Reorder commits logically. NEVER rebase commits already pushed to shared remote — it rewrites hashes and breaks teammates' history.
- Why Interviewer Asks: Shows professional Git habits. Good developers write clean commit history. Knowing interactive rebase shows you think about long-term maintainability.

---

**16. What is `git bisect`?**

Answer:
`git bisect` uses **binary search** to find which commit introduced a bug. Instead of checking every commit manually, Git cuts the search space in half each time.

```bash
# ===== SCENARIO: Bug exists now but not 2 weeks ago. Find which commit broke it =====

# Start bisect
git bisect start

# Tell Git: current state is BAD (has the bug)
git bisect bad                    # marks current commit as bad

# Tell Git: this old commit was GOOD (before bug)
git bisect good v1.0.0            # OR use commit hash: git bisect good abc1234

# Git now checks out a commit HALFWAY between good and bad
# Test if the bug exists, then tell Git:
git bisect good    # if this commit is fine
git bisect bad     # if this commit has the bug

# Git narrows down further (binary search)
# After ~10 steps (instead of testing 1000 commits manually!):
# abc1234 is the first bad commit
# Shows you: commit message, author, date → you found the bug-introducing commit!

# End bisect session
git bisect reset   # returns to original HEAD
```

Note:
- Key Point: bisect = binary search for bugs. For 1000 commits, you only need ~10 tests (log₂ 1000 ≈ 10). Tell Git bad/good after each checkout. At the end it points to the exact commit that introduced the bug. Can also be automated with a test script using `git bisect run`.
- Why Interviewer Asks: Tests advanced debugging knowledge. If you know bisect, it shows you can debug efficiently in large codebases. Rare knowledge that impresses interviewers.

---

## Topic 5 : Git Commit Best Practices

---

**17. What makes a good Git commit message? What is Conventional Commits?**

Answer:
A good commit message explains **what changed and WHY** — not HOW (the code shows that). **Conventional Commits** is a standard format for commit messages.

```bash
# ===== CONVENTIONAL COMMITS FORMAT =====
# <type>(<scope>): <short description>
#
# [optional body]
# [optional footer]

# TYPES:
# feat     — new feature
# fix      — bug fix
# docs     — documentation changes
# style    — formatting, missing semicolons (no logic change)
# refactor — code restructure (no feature/fix)
# test     — adding or fixing tests
# chore    — build process, dependency updates
# perf     — performance improvement
# ci       — CI/CD changes

# ===== GOOD EXAMPLES =====
git commit -m "feat(auth): add JWT refresh token support"
git commit -m "fix(login): resolve null pointer on empty email"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(api): extract validation to middleware"
git commit -m "chore: update express from 4.18 to 4.19"

# ===== BAD EXAMPLES (Never write these) =====
git commit -m "fix"              # ❌ What was fixed??
git commit -m "changes"          # ❌ What changes??
git commit -m "asdfgh"           # ❌ Meaningless
git commit -m "updated stuff"    # ❌ What stuff??
git commit -m "WIP"              # ❌ Squash before pushing!

# ===== COMMIT MESSAGE RULES =====
#  Use imperative mood: "add feature" NOT "added feature"
#  Keep subject line under 72 characters
#  Reference issues: "fix(auth): resolve login bug (closes #42)"
#  Explain WHY in the body, not just what
```

Note:
- Key Point: Conventional Commits = industry standard for commit messages. Format: `type(scope): description`. Benefits: auto-generate changelogs, trigger semantic versioning, easy to search history. `feat` triggers minor version bump, `fix` triggers patch, `feat!` or `BREAKING CHANGE` triggers major.
- Why Interviewer Asks: Shows professional habits. Companies use conventional commits with tools like Commitizen, semantic-release, and auto-changelog. Knowing this standard separates professional developers from hobbyists.

---

**18. What is `git tag`? Difference between lightweight and annotated tags?**

Answer:
**Tags** mark specific points in Git history as important — usually used for **release versions** (v1.0.0, v2.1.3).

```bash
# ===== LIGHTWEIGHT TAG — just a pointer to a commit (no extra info) =====
git tag v1.0.0                    # tag current commit
git tag v1.0.0 abc1234            # tag specific commit

# ===== ANNOTATED TAG — full object with tagger name, date, message =====
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git tag -a v1.0.0 abc1234 -m "Version 1.0.0"

# List all tags
git tag
git tag -l "v1.*"    # filter tags

# See tag details
git show v1.0.0

# Push tags to remote (tags are NOT pushed automatically!)
git push origin v1.0.0          # push specific tag
git push origin --tags          # push ALL tags

# Delete tag
git tag -d v1.0.0               # local
git push origin --delete v1.0.0 # remote

# Checkout a tag (enters detached HEAD)
git checkout v1.0.0
```

**Semantic Versioning (SemVer) with tags:**
```
v MAJOR . MINOR . PATCH
v  1    .  2    .  3

MAJOR = breaking changes (v1.0.0 → v2.0.0)
MINOR = new features, backward compatible (v1.0.0 → v1.1.0)
PATCH = bug fixes (v1.0.0 → v1.0.1)
```

Note:
- Key Point: Use annotated tags for releases (contains author, date, message). Lightweight tags for local bookmarks. Tags must be explicitly pushed to remote. Semantic versioning (MAJOR.MINOR.PATCH) is the standard for version numbers.
- Why Interviewer Asks: Shows knowledge of release management. Companies tag every production release. Understanding semver shows professional software development knowledge.

---

## Topic 6 : Tricky Scenario Questions

---

**19. You pushed sensitive data (API key in `.env`) to GitHub. What do you do?**

Answer:
This is a security emergency. Act immediately:

```bash
# ===== STEP 1: IMMEDIATELY revoke the exposed key =====
# Go to your API provider → revoke/regenerate the key
# This is the MOST important step — do this FIRST before anything else!

# ===== STEP 2: Remove from Git tracking =====
git rm --cached .env              # stop tracking (file stays on disk)
echo ".env" >> .gitignore         # add to gitignore
git add .gitignore
git commit -m "chore: remove .env from tracking, add to gitignore"

# ===== STEP 3: Remove from Git HISTORY =====
# The file is still visible in old commits! You need to purge it.

# Option A: git filter-branch (older method)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Option B: BFG Repo Cleaner (faster, recommended)
# Download bfg.jar
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# ===== STEP 4: Force push to remote =====
git push origin --force --all     # ⚠️ force push rewrites remote history
git push origin --force --tags

# ===== STEP 5: Notify team =====
# Anyone who pulled the repo should delete and re-clone
# GitHub also has a "secret scanning" feature that alerts on exposed secrets
```

Note:
- Key Point: Order matters — FIRST revoke the key, THEN clean Git history. Removing from Git does NOT help if the key is still active. After force pushing, old commits are gone from GitHub but may still be cached — treating the key as compromised forever is the safest approach.
- Why Interviewer Asks: Tests real-world security awareness and incident response. Shows you know the severity of the issue AND the correct remediation steps.

---

**20. What is the difference between `git clone`, `git fork`, and `git remote add`?**

Answer:

```bash
# ===== git clone — copy a repo to your local machine =====
git clone https://github.com/someuser/project.git
# Downloads entire repo history to your machine
# Sets up 'origin' remote automatically pointing to the cloned URL
# Use when: you have access to the repo and want to work on it

# ===== Fork — GitHub feature, copy repo to YOUR GitHub account =====
# Done on GitHub website (not a Git command)
# Creates YOUR own copy of someone else's repo on GitHub
# Changes: github.com/someuser/project → github.com/YOU/project
# Use when: contributing to open source — you don't have write access to original
# Workflow: Fork → Clone YOUR fork → make changes → Push to YOUR fork → Open PR to original

# ===== git remote add — connect your local repo to a remote =====
git remote add origin https://github.com/you/project.git
git remote add upstream https://github.com/original/project.git
# 'origin' = your fork (you have write access)
# 'upstream' = original repo (read only usually)

# Keep fork in sync with original:
git fetch upstream         # get changes from original
git merge upstream/main    # merge into your local main
git push origin main       # push to your fork

# See current remotes
git remote -v
```

Note:
- Key Point: clone = local copy. Fork = GitHub copy of someone else's repo under your account (enables PR to original). Remote = connection URL label. Standard open-source contribution: fork → clone fork → upstream remote → PR to original.
- Why Interviewer Asks: Tests understanding of open-source workflow. Very common question for developers who have contributed to or worked with external projects.

---

**21. Tricky: What happens when you run `git commit --amend`?**

Answer:
`git commit --amend` **modifies the most recent commit** — you can change the message, add forgotten files, or fix a typo in the last commit.

```bash
# ===== Scenario 1: Fix the last commit MESSAGE =====
git commit -m "feat: add user loign"    # typo — "loign" should be "login"
git commit --amend -m "feat: add user login"   #  fixed!

# ===== Scenario 2: Forgot to add a file to last commit =====
git add forgotten-file.js
git commit --amend --no-edit    # add file to last commit, keep same message

# ===== WHAT ACTUALLY HAPPENS BEHIND THE SCENES =====
# --amend does NOT "edit" the commit — it REPLACES it with a NEW commit
# The old commit is discarded, a new commit (different hash) is created

# BEFORE amend: abc1234 "feat: add user loign"
# AFTER  amend: xyz5678 "feat: add user login"  ← DIFFERENT hash!

# ⚠️ DANGER: Never amend a commit you already pushed to shared remote!
# It rewrites history → teammates' git pull will fail with conflict
git commit --amend    #  SAFE only on local unpushed commits

# If you MUST amend a pushed commit (use force carefully):
git push --force-with-lease   # safer than --force (fails if remote changed)
```

Note:
- Key Point: `amend` creates a completely NEW commit replacing the last one — different SHA hash. Safe only on unpushed commits. `--no-edit` keeps the original message. `--force-with-lease` is safer than `--force` for pushed amends — it refuses to force push if the remote has changed since your last fetch.
- Why Interviewer Asks: Practical question that tests understanding of commit mutability. Many developers use `amend` without realizing it creates a new commit hash — which matters when they've already pushed.

---

## Quick Revision — Most Important Git Questions

| # | Question | One-Line Answer |
|---|----------|----------------|
| 1 | What is Git | Distributed VCS that tracks code changes. Every clone = full backup |
| 2 | Git vs GitHub | Git = tool. GitHub = cloud hosting platform for Git repos |
| 3 | Four Git areas | Working Dir → Staging (add) → Local Repo (commit) → Remote (push) |
| 4 | git pull vs fetch | fetch = download only. pull = fetch + merge |
| 5 | git merge vs rebase | merge = preserves history with merge commit. rebase = rewrites linear history |
| 6 | git stash | Temporarily saves uncommitted work, cleans working dir |
| 7 | git reset --soft | Undo commit, keep changes staged |
| 8 | git reset --mixed | Undo commit, keep changes unstaged (default) |
| 9 | git reset --hard | Undo commit AND delete all changes (destructive!) |
| 10 | git revert | Creates NEW undo commit, preserves history. Safe for shared branches |
| 11 | Merge conflict | Same line changed in both branches. Resolve markers, git add, git commit |
| 12 | .gitignore | File telling Git what to ignore. node_modules, .env, dist must always be ignored |
| 13 | HEAD | Pointer to current commit. Detached HEAD = pointing at commit, not branch |
| 14 | git cherry-pick | Apply specific commit from one branch to another |
| 15 | Interactive rebase | Edit/squash/reorder local commits before pushing |
| 16 | git bisect | Binary search to find bug-introducing commit |
| 17 | PR/Pull Request | GitHub feature for code review before merging. NOT a Git command |
| 18 | GitHub Flow | main always deployable. Feature branches. PRs mandatory |
| 19 | Fork | GitHub copy of repo under your account. For open source contribution |
| 20 | Conventional Commits | feat/fix/docs/chore: description. Industry standard commit format |
| 21 | git tag | Mark specific commits. Annotated tags for releases. Semver for versioning |
| 22 | git commit --amend | Replaces last commit (new hash). Only on unpushed commits! |
| 23 | Exposed .env | 1. Revoke key FIRST 2. git rm --cached 3. Clean history 4. Force push |
| 24 | git remote | Connection URL label. origin = your repo. upstream = original repo |
| 25 | Golden Rule | Never rebase/amend commits already pushed to shared remote |