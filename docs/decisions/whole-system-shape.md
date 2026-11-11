---
node: high-level-design
---

# Decision: Whole-system shape

## Context

AI Scale Dev keeps a growing set of records: the sources it reads, each item a source
publishes, the methods it covers, their grade cards and measured results, timeline events,
leading voices and their predictions, pieces, corrections and the log of every agent run.
Agents write these records every day; the owner approves the ones that need approval; and
pages for people, plus copies for AI agents, are built from them.

Where those records live, and how agents and the owner change them, shapes every other
part of the design: the record layout, the approval flow, the dashboard, the page build
and how agent roles hand work to each other. Changing the shape after content exists
means moving every record and rewriting every part that touches them.

The system starts private. Its first slice is a daily scan and a dashboard used by 1
person, the owner, who has about 15 minutes a day for approvals. Agent runs use the
owner's Claude subscription; there is no other budget for running services. Daily volume
is unknown until the first private runs.

## Decision Elements

No gate eliminates an option in contention; the options differ only by degree.

Weighted criteria:

- **History and undo for every record** (major). Nothing on the site may change silently:
  every change keeps a dated trace with its reason, and any change can be undone.
- **Least built before the private scan proves itself** (major). The first slice exists to
  learn whether the daily scan is worth opening and whether its claims are right; work
  spent before that answer is at risk.
- **Readable by people and by agents** (major). Trust depends on records a person can open
  and read, and the site serves AI agents the same facts as people (tenet: *same facts for
  people and agents, shaped for people first*).
- **Agent roles that any tool can run** (moderate). Roles are written as instructions with
  file inputs and file outputs, so a role can move to another model or tool when it passes
  the same tests.
- **No new running costs or services to operate** (moderate). Usage of the Claude
  subscription is the only budget; a hosted service adds money and upkeep outside it.
- **Fast approval for the owner** (moderate). Approvals must fit about 15 minutes a day
  (tenet: *agent usage before the owner's minutes*).
- **Safe writes by several agents at once** (moderate). Several roles run on the same day
  and may touch related records.
- **Per-reader state** (minor). The public-launch slice adds comments and a newsletter;
  following a method and personal filters come later.
- **Volume headroom** (minor). Volume is unknown and starts at 1 owner and a daily scan.

## Options in the Domain

### Files and static pages

Every record is a small text file with a checked shape, kept in a git repository, so the
repository's history is the change log. Agent runs read files and write files, and propose
their changes as a change to the repository; the owner approves a change by accepting it.
Plain code steps (fetching feeds, dropping exact repeats, the grading rule table, the
error checks) are scripts the runs call. A build turns the files into static pages: a
private dashboard for the owner and, at public launch, the public site, each with a
Markdown copy per page and a data file per record for agents. Comments live in an outside
discussion service and newsletter subscribers in an outside email service, so neither
needs a database of its own.

- **History and undo:** strong. Git keeps every version, its date and its reason, and can
  restore any of them.
- **Least built first:** strong. The existing Astro site already builds pages from typed
  files; a malformed record fails the build.
- **Readable by people and agents:** strong. A record is a readable text file; the data
  file agents read is the record itself.
- **Roles any tool can run:** strong. File in and file out is the native interface.
- **No new running costs:** strong. Nothing runs between builds.
- **Fast approval:** partial. Accepting a proposed change is slower than pressing a
  button, unless the dashboard shows each change as the page it will become.
- **Safe concurrent writes:** partial. 2 runs editing the same file conflict; the record
  layout must keep writers apart.
- **Per-reader state:** weak in-house; outside services hold comments and subscribers.
- **Volume headroom:** partial. Build time and repository size grow with records.

### Database and web app

Records are rows in a hosted database. A web app with sign-in serves the dashboard and an
approval queue with buttons, and agents write through the app's interface. Public pages
and agent copies are exported from the database.

- **History and undo:** partial. Versions, the change log and undo must be designed and
  built for every table.
- **Least built first:** weak. The database, the app, sign-in and the agent interface come
  before the first useful dashboard, and the existing site is rebuilt around the app.
- **Readable by people and agents:** partial. Records are readable through the app and
  through exports, not as files.
- **Roles any tool can run:** partial. Each tool needs credentials and a client for the
  app's interface.
- **No new running costs:** weak. A hosted database and app host cost money from the first
  day and need upkeep.
- **Fast approval:** strong. Buttons from any device.
- **Safe concurrent writes:** strong. The database handles it.
- **Per-reader state:** strong.
- **Volume headroom:** strong.

### Split: files for the published record, a database for the working desk

The published record (methods, grade cards, results, timelines, pieces) stays in files
with free history. The working desk (scan items, the approval queue, run logs) lives in a
database with an app.

- **History and undo:** strong for the published record; partial for the desk.
- **Least built first:** weak. The first slice is mostly desk, so most of the app is built
  first, plus a sync between the 2 stores.
- **Readable by people and agents:** strong for the published record; partial for the
  desk.
- **Roles any tool can run:** partial. Roles work with files for some records and with the
  app for others.
- **No new running costs:** weak. Both kinds of cost at once.
- **Fast approval:** strong.
- **Safe concurrent writes:** strong on the desk; partial on the record.
- **Per-reader state:** strong.
- **Volume headroom:** strong on the desk.
- **Summary:** the likely shape of a much larger system, paid for before its size is known.

## Selection

**Files and static pages.** It is strong on all 3 major criteria: history and undo come
free, the first slice needs the least built, and records stay readable by people and by
agents. It also fits roles that any tool can run and adds no running cost. Its weak
points are fast approval and concurrent writes, which the design handles: the dashboard
shows each proposed change as the page it will become, and the record layout keeps
writers on separate files. Per-reader state is handled by outside services at launch. The
decision turns on the tenets *same facts for people and agents, shaped for people first*
and *agent usage before the owner's minutes*.

What it forecloses: per-reader features built in-house, and questions over the data that
cannot be answered when pages are built.

What it obligates downstream: the `records` design fixes the file layout, the ID scheme,
the version history and how writers are kept apart; the `approval-and-publishing` design
makes approving a change fast; the `dashboard` design shows proposed changes as pages.

A database is added beside the files, never in place of them for the published record,
when any 1 of these becomes true:

1. A feature must remember something per reader that an outside service cannot hold, such
   as following a method or personal filters.
2. Approving through the repository takes the owner longer than the time budget, and a
   button-driven queue would fix it.
3. The site build takes longer than 5 minutes, or the repository becomes too slow to copy.
4. Concurrent agent writes cause conflicts more than once a week.
5. The dashboard needs a question answered that cannot be worked out when pages are built,
   such as free search across every item.
6. An outside program needs live access to the records, such as a server agents can query
   (an MCP server).
