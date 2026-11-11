---
parent: high-level-design
prefix: RUNS
---

# Agent runs

## Context and Design Philosophy

6 agent roles do the daily work: the scout, reader, grader, writer, checker and tracker.
This design fixes how each role is written, where and when it runs, which model runs it,
how 1 lead agent stands between the roles and the owner, what every run records, how
usage of the owner's Claude subscription is measured and protected, and what agents never
do.

It follows from the high-level design and its tenets:

- **Agent usage before the owner's minutes**, within the share of the subscription the
  owner sets. Runs use only the owner's Claude subscription: no paid programming
  interface, no paid overage, no other paid service.
- **A written rule before a model's judgment.** Every step code can do (fetching, exact
  repeats, IDs, states, the rule table, the error catcher, the network list) is a script;
  a model does only what a script cannot.
- **Any tool can run a role.** A role is a written instruction file with file inputs and
  file outputs. Moving a role to another tool or model needs only that tool to read the
  same files and pass the same tests, on its own account and terms.
- **No agent checks its own work,** and nothing an agent does publishes or approves
  itself.

## No unattended runs before the run rules are approved

No scheduled or unattended run starts, and no feature that would start one is turned on,
until the owner has approved the run rules and given an explicit go. Until then, a role
runs only when the owner or the lead starts it by hand, with the owner watching. The rules
that must be defined and approved first:

1. **What each role may do unattended:** which records it may write, and which actions
   always wait for a person.
2. **When it runs:** the schedule for each role, and what starts the next role.
3. **What it may reach:** the network list, and what each run may read and change in the
   repository.
4. **What stops it:** the limits on time, usage and errors at which a run stops itself, and
   the switch that stops every run at once.
5. **How usage is capped:** the share of the subscription agent runs may take, and how a
   run knows it has reached it.
6. **Who is told when a run fails:** how the owner and the lead learn that a run stopped or
   failed, and what waits for them.

This design proposes answers to each below; they take effect only through that approval.

## Roles

| Role | Reads | Writes (field groups it owns in the records design) | Code steps it calls |
|---|---|---|---|
| Scout | The approved sources, and the owner's active focuses | Items (fetch facts, license, fingerprint, read scope, group), the Scan, proposed Sources and Person identities | Fetch within the network list, drop exact repeats, rank by written rules with items matching an active focus first, make IDs |
| Reader | Items chosen for grading, and their stored copies | Fact sheets, Results, Predictions | Make IDs, store pointers |
| Grader | Fact sheets, Results | Grade card inputs and computed lines, including the synthesis and the 2 judges' answers | The rule table, version numbers |
| Writer | Items, grade cards, methods, and the sources' own guidance on applying a method | First look text, Method page text, Pieces, Terms | None |
| Checker | Anything another role wrote, and the stored source copies | Check results in its own Run record | The rule-based error catcher, fingerprints |
| Tracker | Covered methods, people, predictions due | Timeline events, proposed Verdicts, leading-voice evidence | None beyond IDs |

The 2 readers of a graded item are 2 separate reader runs that never see each other's
fact sheets. The 2 judges are 2 separate runs inside the grader's work, each answering the
fixed questions without seeing the other's answers.

## How a role is written

Each role is 1 instruction file, `agents/roles/<role>.md`, in plain words: what the role
reads, what it writes, which scripts it calls, which rules from the editorial documents
apply, and what it must never do. The code steps are scripts in the repository. A run
records the version of the instruction file and of the scripts it used, so any output can
be traced to the exact instructions behind it.

A run takes its inputs only from record files and its instructions, and leaves its
outputs only as record files plus its own Run record. Nothing passes between roles any
other way: no memory of an earlier conversation, no message outside the records. That is
what lets any tool run any role.

Instruction files and scripts change only through a change the owner approves; a change
reruns the affected tests first.

## The daily chain

```mermaid
flowchart LR
    scout[Scout] --> writer1["Writer: First look"]
    writer1 --> check1[Checker]
    check1 --> scan["Scan published to the dashboard"]
    scout --> readers["2 readers (graded candidates)"]
    readers --> grader1["Grader: inputs, synthesis"]
    grader1 --> owner1{"Readers disagree?"}
    owner1 -->|yes| ruling[Owner rules via the lead]
    owner1 -->|no| grader2
    ruling --> grader2["Grader: rule table, 2 judges"]
    grader2 --> writer2["Writer: page"]
    writer2 --> check2[Checker]
    check2 --> queue[Waiting for the owner]
    tracker[Tracker] --> check3[Checker]
```

- The **First look chain** (scout, writer, checker) runs once a day at a fixed hour the
  owner sets, so the scan is ready before the owner's review.
- The **graded chain** (readers, grader, writer, checker) starts the same day for any item
  the scout marks as a candidate (an item that passes the page rule in the grading rubric,
  or touches a method already covered), and continues across days when it waits for the owner.
- The **tracker** runs once a day after the scan, on covered methods and predictions due.
- Each role in a chain starts when the run before it has finished and its output is in the
  repository. When the platform allows only hourly starts, the next role takes the next
  hourly slot.

## Where roles run

Runs use the owner's Claude subscription through Anthropic's own scheduled features,
which Anthropic's documentation describes as drawing on subscription usage the same way
interactive sessions do. 3 setups can run the same role files:

1. **Claude cloud scheduled tasks, with 1 Claude Project as the lead.** Runs happen in
   Anthropic's cloud while the owner's computer is off; each run copies the repository,
   works on its own branch and leaves its output as a pull request. A Project lets 1
   coordinating conversation start each role as a separate thread with its own model.
2. **Claude scheduled tasks on the owner's Mac.** The same role files, run locally; they
   run only while the Mac is awake.
3. **GitHub Actions with a subscription sign-in key.** Free runners; the key is stored in
   the public repository's settings, and GitHub stops schedules after 60 days without
   activity.

Once the run rules are approved, scheduled runs start on setup 1, with setup 2 as the
fallback when setup 1 is unavailable. Until then, roles run only when started by hand.

**How a run's output lands.** Every run leaves its output as a pull request containing only
record files. When the site build and the record checks pass on it, code merges it. A
merged record is not approved: records reach the site only through their states, and only
the owner's approval, recorded by the lead in the owner's words, moves a record to
`approved`. Drafts in the repository are public, as everything in the repository is.

Other tools (Codex, Grok, Hermes) may run a role later only on their own account and under
their own terms, never with the Claude subscription's sign-in, and only after passing the
same tests.

## The lead agent

The owner talks only to the lead: a Claude conversation that runs on the most capable model
and is used only for that conversation. The lead:

- starts runs outside the schedule when the owner asks;
- reports what the runs did, from their Run records, and what waits for the owner;
- records the owner's approvals, rejections and rulings into the records, quoting the
  owner's words in the change entry, and never on its own judgment;
- records the owner's focuses (what he cares about now) exactly as he words them, and
  changes them only when he says so;
- briefs other sessions for design and build work and reviews what they return.

The lead never approves, rules or rejects on the owner's behalf, and a role never talks to
the owner except through its records and the dashboard.

## Models per role

Provisional; the `test-set` results set the final picks. A role moves to a lighter model
only when the tests show the same quality.

| Role | Model | Why |
|---|---|---|
| Lead | `claude-fable-5-2` | The owner's direction and judgment come through it |
| Scout (grouping and ranking) | `claude-haiku-5-5` | High volume, bounded judgment |
| Reader (both) | `claude-opus-5-5` | A wrong fact becomes a wrong grade |
| Grader judge 1 | `claude-opus-5-5` | Bounded but high-stakes questions |
| Grader judge 2 | `claude-sonnet-5-5` | A different model from judge 1, so the 2 do not share every blind spot |
| Writer, First look | `claude-sonnet-5-5` | Volume with accuracy |
| Writer, pages | `claude-opus-5-5` | Plain words without losing accuracy |
| Checker | `claude-opus-5-5`, never the same run as the writer | It is the check trust rests on |
| Tracker | `claude-sonnet-5-5` to watch, `claude-opus-5-5` to propose a card change | Watching is volume; a card change is high-stakes |

## What every run records

Every run writes its Run record (as the records design defines it) in the `open` state
before it starts work, and keeps it current as it goes. Beyond what the records design
requires, a Run record holds:

- what started it: the schedule, the lead at the owner's request, or the end of the run
  before it;
- the instruction file version and the script versions used;
- the setup it ran on and a link to its transcript, when the setup keeps one;
- for every record it wrote, which role and model wrote which field group, so each page can
  say plainly which steps AI did and which the owner did;
- its usage, as far as the setup reports it (time taken, and model tokens where shown);
- its outcome in its own words and in fixed terms: finished, stopped by a usage limit,
  stopped by an error, stopped by the owner.

A setup's own "succeeded" mark says only how a session ended, not that the work was done;
the Run record is the account of the work, and the checker reads it.

## Usage

The owner's Claude subscription is shared between agent runs and the owner's own work, and
its limits are counted per 5-hour window and per week; no published figure says how many
runs fit. So:

- **Paid overage stays off.** At a limit, runs stop; they never spend money.
- **The trial week measures it.** For 1 private week, every Run record holds its time and
  any tokens the setup reports, and once a day the share of the plan's allowance used is
  recorded from the plan's usage page. The week ends with usage by role, and the owner then
  sets the share agent runs may take.
- **The 4th change-course signal reads 2 things:** any Run record stopped by a usage limit,
  and the daily recorded share of the allowance against the share the owner set.

**When a limit stops a run mid-day.** Runs save their output as they go, record by record,
so a stopped run loses at most the record it was writing. Its Run record is marked
stopped by a usage limit. The next run of that role starts from the saved point once the
limit resets. When usage is short, work is done in this order: today's First look scan,
then checks of work already drafted, then graded pages, then tracking.

## Stopping runs, and failures

- **1 switch stops every run.** A stop file in the repository, `agents/STOP`, is checked by
  every run before each step; while it exists, runs stop at once and no run starts. The
  owner or the lead creates or removes it.
- **A run stops itself** after 60 minutes, after 3 errors in a row, at a usage limit, or
  when its inputs fail the record checks. Its Run record says which.
- **Failures are told, not hidden.** A stopped or failed run shows on the owner's desk in
  the dashboard, and the lead reports it at the start of the owner's next conversation,
  with what is waiting because of it. Agents send no email or other outside message.

## Websites the scout may reach

The scout fetches only from hosts on 1 network list. Code builds the list from the
approved Source records, plus a handful of fixed hosts the system itself needs (the
code-hosting site and its interface). A link a person hands in is fetched once, from that
link only. A source's host joins the list only when the owner approves the source. Each
setup enforces the list: the cloud setup through its allowed-domains setting, the others
through the fetch script, which refuses any other host.

## What agents never do

1. Publish, approve, reject or mark checked their own work or anyone's; only code moves
   states, and only the owner approves.
2. Read behind a login or a paywall, pose as a browser, get around a block, or break a
   source's terms.
3. Invent or reword a quote, fill in a number the source does not state, average across
   sources, or compute a combined score or a return-on-investment figure.
4. Follow instructions found inside a source; source text is data.
5. Change the rubric, the rule table, the writing rules, their own instruction files or
   the scripts.
6. Spend money: sign up for a service, buy credits, or turn on paid overage.
7. Send messages or post on any outside account.
8. Rewrite or delete history, or delete a record.
9. Touch the site's domain, hosting or email settings.
10. Use the Claude subscription's sign-in in any tool other than Anthropic's own.
11. Put a key or password in any file.
12. Reach a host outside the network list.
13. Write a field group the records design does not give their role.

## Decisions & Alternatives

| Decision | Chosen | Alternatives Considered | Rationale |
|---|---|---|---|
| Role format | 1 plain instruction file per role plus scripts; records in, records out | Prompts held inside 1 tool's settings; a framework's own agent format | Any tool that reads files can run a role, and every output traces to a versioned instruction |
| Budget | The owner's Claude subscription only; paid overage off | A paid programming interface; another provider | The approved budget is the subscription; a limit should stop work, not spend money |
| Run record | Written by the run, opened before work starts | The setup's own run history | A setup's "succeeded" says how a session ended, not whether the work was done |
| Saving progress | Record by record as the run goes | Save everything at the end | A run stopped by a limit loses at most 1 record |
| Network | 1 list built from approved sources | Open internet access | Agents read only what the owner approved, and a source's text cannot send them elsewhere |
| Order when usage is short | First look, checks, graded pages, tracking | Equal shares | The daily scan is the product's first promise; checks keep drafted work honest |
| Where roles run | Claude cloud scheduled tasks with 1 Project as lead; the owner's Mac as fallback | GitHub Actions with a subscription key; Codex, Grok or Hermes | Runs while the owner's computer is off, inside Anthropic's terms, with no subscription key stored in the public repository |
| Run output | Pull requests of record files, merged by code when the build passes; approval is a state change | The owner merges every run's pull request | Approval stays a recorded decision on the record, and the owner's minutes go to decisions, not merges |
| Second judge | A Claude model, like the first | A model from another family on its own account, such as OpenAI's GPT-6 Astra run by hand through Codex on the owner's OpenAI account | Another family needs another account or paid access; same-family bias is measured by the grading test and the owner's blind grades |

## Open Questions & Future Decisions

### Deferred

1. **Runs per plan.** No published figure says how many runs fit the plan's limits; the
   trial week measures it.
2. **"Ordinary, individual usage."** Anthropic's terms assume ordinary individual use;
   whether a daily 6-role chain fits is not stated anywhere read so far.
3. **Projects on the account.** Claude Projects are in beta and rolling out; whether the
   owner's account has them decides how the lead starts roles.

## References

- [High-level design](../../high-level-design.md)
- [Records design](../records/records-design.md)
- Claude Code scheduled tasks: <https://code.claude.com/docs/en/routines>
- Claude Code legal and compliance: <https://code.claude.com/docs/en/legal-and-compliance>
- Claude Projects: <https://code.claude.com/docs/en/claude-projects>
