---
parent: high-level-design
prefix: REC
---

# Records

## Context and Design Philosophy

Everything AI Scale Dev knows is held in records: the sources it reads, the items they
publish, each day's scan, the methods it covers, what each source says about a method,
the grade cards computed from that, what happens next, the people it quotes, the pieces
it publishes, the replies it receives, its glossary and the log of every agent run. Every
other part of the system reads and writes records, so their shape is the most expensive
thing to change once content exists.

The design follows from the whole-system decision ([files and static
pages](../../decisions/whole-system-shape.md)) and from the project's tenets:

- **A record is a file a person can read.** Trust depends on anyone being able to open a
  record and see what it says, where each fact came from and how it changed.
- **The record is the data file agents read.** The file served to agents is the record
  itself, so people and agents always get the same facts.
- **Nothing changes silently.** Every change keeps a dated entry inside the record, a
  grade card's computed content is never edited, and nothing is deleted.
- **Any tool can run a role.** Roles read record files and write record files; nothing
  depends on a particular agent tool or model.
- **Built in public.** Every record, drafts and working records included, lives in the
  public repository. Keys and passwords are never in a record. Full copies of other
  people's articles are the 1 thing kept outside it.
- **Show it now, labeled honestly.** A new claim can be recorded and shown at once,
  marked as the source's claim and not yet checked; a letter grade is computed only from
  verified results.
- **Code moves records, models write content.** IDs, version numbers, states, change
  entries and checks of a record's shape and links are written by code, never by a model.

## Record kinds

15 kinds. Each has a short ID prefix used in its IDs.

| Kind | Prefix | What 1 record is |
|---|---|---|
| Source | `src` | A place the agents read: a blog, a feed, a paper archive, a channel, a person's public account |
| Item | `itm` | 1 thing a source published: a post, paper, talk, release, changelog entry or statement, with its First look text |
| Scan | `scn` | 1 day's ranked list, skip reasons, Watching list and coverage counts |
| Method | `mth` | A named way of working that can be tried and measured; its page carries the grade card |
| Fact sheet | `fct` | The fixed facts 1 reader pulled from 1 item about 1 method, each with a pointer into the source |
| Result | `res` | 1 measured result, as 1 row of a grade card's results |
| Grade card | `grd` | 1 version of a method's grade card, with everything it was computed from |
| Timeline event | `evt` | Something that happened to a covered method, and what it changed on the card |
| Person | `per` | Someone named on the site, and for a leading voice the route that listed them |
| Prediction | `prd` | A dated statement about the future, in the person's own words |
| Verdict | `vrd` | A dated ruling on a prediction, or on how an earlier grade card held up |
| Piece | `pce` | An authored article, such as an explainer |
| Correction or reply | `cor` | A request to correct a page or add context, and what was done |
| Term | `trm` | 1 glossary entry |
| Run | `run` | 1 agent run: role, tool, model, inputs, outputs, usage, outcome |

Synthesis, the combining of what all of a method's sources say into 1 picture, is held
inside the grade card version it feeds. Check results are held in the checker's Run
record. Other detailed designs add kinds or fields through this design.

## IDs

An ID is the kind's prefix, an underscore and 8 characters drawn at random from 32
lowercase characters: the digits 0 to 9 and the letters `a b c d e f g h j k m n p q r s t
v w x y z` (no `i`, `l`, `o` or `u`, which are easily confused). Example: `mth_4f9k2c7q`.
IDs are lowercase only, so 2 IDs can never land on the same file on a disk that ignores
case.

Code makes every ID; a model never does. Before an ID is used, code checks it against
every record on the main branch and every record the run has already made. A clash with a
record made at the same time on another branch is caught when the build runs on the
merged result: the build fails on any duplicate ID, and the record not yet merged gets a
new ID before it is merged.

An ID never changes, is never reused and carries no meaning, so a record can be renamed,
merged or moved without breaking a link to it.

A page address (readable words, such as `/methods/just-in-time-tests`) is separate from
the ID and is owned by the `site-pages` design. Kinds with pages (Method, Person, Piece,
Term, Source) store their address once first published, and every earlier address in a
list of past addresses, so old addresses can keep forwarding.

## Files and folders

Records live in a top-level `records/` folder, 1 folder per kind:

```
records/
  sources/src_xxxxxxxx.json
  methods/mth_xxxxxxxx.json
  items/2026-11/itm_xxxxxxxx.json
  factsheets/2026-11/fct_xxxxxxxx.json
  scans/2026-11/scn_xxxxxxxx.json
  runs/2026-11/run_xxxxxxxx.json
  pieces/pce_xxxxxxxx.md
  terms/trm_xxxxxxxx.md
  ...
```

- **Data records are JSON.** Strict, the same in every tool, read directly by the site
  build, and served as-is to agents.
- **Prose records (Piece, Term) are Markdown** with a block of fields at the top in YAML.
  Every value in that block is a quoted string, a number, or a list or map made only of
  these, written in block form with no YAML anchors or references, so nothing is guessed: a value like `no` stays text and never turns into "false". The
  block is checked against the same schema as JSON records.
- **High-volume kinds** (Item, Fact sheet, Scan, Run) sit in a subfolder named for the
  UTC month the record was created; the build fails when a record sits in a month folder
  that does not match its creation date. Other kinds sit in 1 flat folder.
- **Finding a record by ID.** Every file is named by its ID, so a search for the file name
  within the kind's folder finds it. The build also writes an index from ID to path into
  its output; the index is not kept in the repository.
- **Shape is checked.** Each kind has a written schema. A record that does not follow its
  kind's current schema fails the build, and an agent's proposed record that does not
  match is rejected.

## Dates

A date is written as a full time in UTC (`2026-11-11T20:41:40Z`), a day (`2026-11-11`), a
month (`2026-11`), a year (`2026`) or the word `unknown`. A day, month or year is kept as
the source gives it, without converting it to UTC. Sources often give only a month or
nothing; the record keeps exactly the precision the source gives.

Dates are kept apart by meaning and never stand in for each other: when something
happened, when the source published it, when we found it, when we first published it, its
last meaningful change, and when its sources were last checked.

## Fields every record has

| Field | Meaning |
|---|---|
| `id` | The permanent ID |
| `kind` | The record kind |
| `schema` | The schema version the record follows |
| `state` | Where the record is on its path (see "States") |
| `created` | When the record was created, and by which run or by the owner |
| `changes` | The record's change list (see "History") |
| `last_meaningful_change` | The date of the last meaningful change (see "History") |
| `merged_into` | Empty, or the ID of the record this one was merged into |
| `replaced_by` | Empty, or the ID of the record that replaced this one |

## Who writes which fields

Each kind's fields are split into groups, and each group has 1 owning role. A role writes
only the groups it owns. Code writes the common fields above, every state, every change
entry, every ID and version number, every claim status, every page address, every
pending block's state and every content fingerprint.

| Kind | Field groups and their owner |
|---|---|
| Source | Everything: scout proposes, the owner approves |
| Item | Fetch facts, license, fingerprint, read scope, group: scout. First look text: writer |
| Scan | Everything: scout |
| Method | Name, topic area, family links, page text: writer. Current grade card pointer: code |
| Fact sheet | Everything: the 1 reader run that fills it |
| Result | Everything: reader. Claim status: code |
| Grade card | Inputs and computed lines: grader. Owner rulings: the owner |
| Timeline event | Everything: tracker |
| Person | Identity and accounts: scout. Leading-voice route and evidence: tracker. List place: the owner |
| Prediction | Everything: reader or tracker |
| Verdict | Ruling and evidence: tracker. Approval: the owner |
| Piece | Everything: writer |
| Correction or reply | Request and sender check: the recording agent. Decision: the owner. The sender is named as a Person only when it is a person shown on the site replying about their own work; any other sender is "a reader", with no name or contact detail |
| Term | Everything: writer |
| Run | Everything: the run itself |

Every write starts from a copy of the record. If the file changed since that copy was
taken, the agent re-reads the latest copy and redoes its work on it, never copying its
earlier values over newer ones; if it still clashes after 3 tries, that write is
abandoned, the failure is recorded in the run, and the run goes on with its other
records. Schema updates and agent runs never overlap: an update waits until no run is
open, and no run starts during an update. A Run record left open past the run time limit
set in `agent-runs` is marked stopped by code.

## History

Every record keeps its own change list. Each event adds 1 entry (so an edit that also
changes the state adds 2), and entries are only ever added, never edited or removed; a
schema update never rewrites them. An entry holds:

| Field | Meaning |
|---|---|
| `at` | When, in UTC |
| `by` | The run ID, or `owner` |
| `event` | `created`, `edited`, `state`, `schema-update`, `merged` or `removed` |
| `fields` | Each changed field with its old and new value |
| `reason` | 1 line |
| `source` | The item ID or address that justifies the change, when there is one |
| `meaningful` | Yes or no, set by code |

Creation, every edit, every state change, every schema update and every merge each add an
entry. Git keeps every earlier full copy of the file as well, but the change list is what
the change log page, the dashboard's "What moved" and agents read, so it survives however
the repository's history is merged.

**Meaningful changes.** A change is meaningful when the record is published, replaced or
withdrawn, or when an edit to a published record changes a field shown to readers. An
edit the owner marks "wording only" is not meaningful (only the owner may set that mark), and code rejects that mark if the
edit changes any number, date, name, grade line or link. Changes to drafts, re-checks,
rebuilds and schema updates are never meaningful. `last_meaningful_change` moves only
with a meaningful change, so a sitemap date built from it moves only when a page's meaning
changes.

**Grade cards.** A grade card is written in 2 steps by the grader. First its inputs: the
fact sheets, the results, the synthesis, and any disagreements between the 2 readers.
Then, once the owner has ruled on every disagreement (the rulings are stored on the card
beside the 2 fact sheets, and the rule table reads the ruled values), the computed lines,
from the inputs as they stand at that moment; a disagreement found later goes into a new
version. Once the computed lines are written, the card's content is frozen: only its
state, its change list, its `replaced_by` and its approval change afterward, apart from a
removal of private information. A new version is a new Grade card record. Code numbers
versions per method (the highest number so far plus 1), checks them for clashes like IDs,
and never reuses a number, even for a rejected version. The method's current-card pointer
always points at its highest-numbered published version: publishing a newer version moves
the earlier one to `replaced`, and withdrawing the current one moves the pointer back to
the highest remaining published version, or to none.

**Schema updates.** When a kind's schema changes, a script updates every record of that
kind in 1 change, each with a `schema-update` entry. On a grade card the update may change
only how a value is written, never the value. Every earlier schema is kept in the
repository, so an old card can still be read and re-run.

**Merges.** When 2 records turn out to be the same method, person or source, the losing
record gets `merged_into` set to the winner and moves to `withdrawn` with the reason
"merged"; the winner takes the loser's addresses into its past addresses.

**Nothing is deleted.** A record that should no longer appear moves to `withdrawn` with a
reason. The 1 exception is private information or content a legal request covers: the
owner alone removes it from the record and its change list, from every other record that
quotes it (fact sheet quotes and run records included), from the public repository's
history, from the source-copies repository and from the built site, overriding the locks
on grade cards and predictions. The record keeps a `removed` entry with the date and no
content. Agents never rewrite history.

## States

| State | Meaning |
|---|---|
| `draft` | Written by an agent; not checked |
| `checked` | The checker passed exactly this content |
| `waiting` | Checked and waiting for the owner |
| `approved` | The owner approved it |
| `published` | On the site |
| `rejected` | The owner turned it down, with a reason; it stays as a record |
| `replaced` | A newer version took its place |
| `withdrawn` | Taken out of view, with a reason |

States each kind may take:

| Kind | States |
|---|---|
| Item, Scan | draft, checked, published, withdrawn |
| Result | draft, checked, published, replaced, withdrawn |
| Fact sheet | draft, checked, published, rejected, replaced, withdrawn |
| Source, Method, Grade card, Timeline event, Person, Prediction, Verdict, Piece, Correction or reply, Term | draft, checked, waiting, approved, published, rejected, replaced, withdrawn |
| Run | open, finished, stopped (a run is never on the site as a page; its record is public in the repository) |

A record's state alone decides whether the site shows it: `published` and `replaced`
records are shown, and a `withdrawn` record is shown as a notice only if it was published
before; a record withdrawn because it was merged is not shown, and its address forwards to
the record it was merged into. Other status fields in a kind (a source being active or
dropped, a person's place on the leading-voices list) never decide that.

**Moves between states.** Code makes every move, and only these: `draft` to `checked`
(citing a passing checker run); `checked` to `waiting`; `waiting` to `approved` or
`rejected` (recording the owner's decision); `approved` to `published`; `published` to
`replaced`; any state to `withdrawn` (on the owner's decision, or on a merge); and back
from `withdrawn` on the owner's decision. Item, Scan, Result and Fact sheet records go
from `checked` straight to `published`, with no owner approval. Every other kind reaches
`published` only from `approved`. When an approval may later be relaxed is set in
`approval-and-publishing`. The record path is modeled in TLA+ in `test-set`, to show it
can never publish without the approvals it needs and never gets stuck.

**What makes a record checked.** Every run writes its Run record, in the `open` state,
before it starts work. The checker's Run lists each record it checked with a fingerprint
of its content and pass or fail with reasons. Content means every field except the ones
code keeps for bookkeeping: the common fields, claim status, the pending block, approval,
page addresses, the method's current-card pointer and the date sources were last
checked. Code moves a record to `checked` only by citing that Run, only while the record's
current fingerprint matches the one checked, and only for records written by another run.
Any later change to the content moves the record back to `draft`; a schema update does not
count as a change of content.

**Changes to a published record.** A published record keeps its published content until
a change has passed the same path the record itself needed. The proposed new content sits
in a `pending` block inside the record, with its own state, checked against its own
fingerprint and, for kinds that need approval, approved by the owner; the record holds at
most 1 pending block, and a second proposal replaces it and resets it to `draft`. When the
pending block is published, code moves it into the record in 1 change. Grade card, Fact
sheet and Result records never take a pending block: they change only through a new record
that replaces them. Changes code makes to bookkeeping fields apply directly.

**Leaving `rejected` and `withdrawn`.** A rejected record stays rejected; a new attempt is
a new record or a new version. Only the owner can bring a withdrawn record back, with a
reason. It returns to the state it had before only if its content still matches its last
passing check, and otherwise to `draft`; bringing back a merged record clears its
`merged_into` and takes its addresses back from the record it was merged into.

**Claim status.** Separately from its state, every Item's First look text and every Result
carries a claim status: `source's claim, not yet checked` or `verified against source`.
Code sets `verified against source` when a checker run, separate from the run that wrote
the claim, records that it compared the claim with the stored copy of its source and found
it matches. An Item or Result may be published while still the source's
claim, and the site shows that label beside it. A letter grade is computed only from
results verified against their source, in the `checked` or `published` state.

## Links between records

Every ID a record points to must belong to an existing record. A record in `published`
state may point only to records that are `published`, `replaced`, or withdrawn after being
published, with these exceptions: Run, Source and Person records, which a published record
may name before they have pages of their own, and the skipped-item list of a Scan, which
names items never shown. The build fails when either rule is broken. On the site, a link
to a record the site does not show appears as plain text. These rules cover a record's
fields, not the `by` and `source` values inside its change list.

## What each kind holds

Key fields beyond the common ones; each kind's full schema is fixed in its requirement
lines and its code.

**Source.** Name; address; channel type; read route (feed, sitemap, official interface,
paid interface, or hand-in only); tier (primary, pointer, watch only); language and
region; active or dropped, with the reason.

**Item.** Source; address; title; authors (Person IDs); kind; language, and whether a
translation was used; when the source published it and when it was found; the license the
source states for reuse, or `unknown`, which means link and never copy anything beyond
short quotes; a fingerprint of the exact text read and where the full copy is kept; which
parts were read (all, or named sections), so no sentence claims more than was read; and
its First look text with its claim status: a 1-line summary, an "affects you if" line, its
topic area and a note in words on what kind of evidence it is. A group of items reporting
the same news has exactly 1 primary item, and the group's member list is kept on that
primary item only; when the primary item is withdrawn, the earliest-found remaining
member becomes primary.

**Scan.** Date; the ranked entries (Item ID, rank, the rule or judgment that placed it);
skipped items with a 1-line reason each; the Watching list; coverage counts (sources
scanned, items read, items skipped by reason).

**Method.** Name; topic area; the methods it builds on and the methods built on it; the
1-line answer and 1-paragraph summary; the current grade card pointer; its address and
past addresses; charts used on its page.

**Fact sheet.** The item and the method; the reader run that filled it; the facts the
grading rubric asks for (study design, comparison, sample, who measured, how many separate
groups, scale, tool or model version, dates, the numbers); and the facts needed by
grading rules still under consideration: whether the study was randomized or registered
in advance, whether an uncertainty range was given, the identity of each group that
measured (authors, employers, funders, vendors), and tags for the kind of number
(self-reported, survey, benchmark, possibly in a model's training data, results picked by
the seller). Each fact has a pointer to its place in the source: the section, a short
exact quote of at most 25 words (code rejects a longer one), and the link.

**Result.** The method and the item; the measure and its family (Speed, Quality, Cost,
Scale, People); before, after and change, with units, as the source states them; what it
was compared against; the sample; who measured; the setting: scale, the tool or model and
its version, and the month it was measured; the uncertainty range when given; the tags for
the kind of number; "Reported feeling" when it is a feeling; the claim status; the result
it replaced, if any.

**Grade card.** The method; the version number; its inputs (fact sheets, results, the
synthesis with each agreement and disagreement named, the readers' disagreements and the
owner's rulings); the rule table version; both judges' answers, each with the model and
model family that answered and whether it was sure; the computed lines (evidence letter,
status, tested on, who measured, headline, can you repeat it, fits you if); when the
sources were last checked, and whether newer data exists.

**Timeline event.** The method; the event type (Origin, Adopted, Confirmed, Extended,
Changed, Contradicted, Dropped); who, when and what; the source item; the grade card
versions before and after, when it changed the card.

**Person.** Name as they publish it; their public web accounts and addresses (never an
email address), used to check
that a reply really comes from them; for a leading voice, the route that listed them
(track record or peer recognition) with its sourced evidence and their place on the list
(candidate, listed, removed); which of their channels can be read within their terms;
address and past addresses.

**Prediction.** The person; the item holding their words; the exact words; when it was
made; what would happen, by when, and what source would settle it, recorded when the
prediction is logged and fixed once it is published; when it is due to be checked.

**Verdict.** What it rules on (a prediction, or an earlier grade card version); the ruling;
the evidence items; the run that proposed it and the owner's approval. A verdict on the
site's own earlier grade card stays `approved` and is not published until the owner
decides such verdicts are shown.

**Piece.** Kind (explainer to start); title; body; the methods and items it draws on;
charts used; address and past addresses.

**Correction or reply.** The page and record it concerns; who sent it (a Person ID) and how
that was checked; whether it is a correction, added context or a reply; what was done,
with the owner's decision.

**Term.** The plain-words explanation; the real name; the pages that use it; address and
past addresses.

**Run.** Role; tool, model and model family; instruction version; start and finish; usage;
the records it read and wrote, each with its content fingerprint; outcome, including each
check passed or failed and why; why it stopped, when it stopped early.

**Charts on a page** (Method or Piece). For each chart: the source item, its license,
whether it is copied with credit or redrawn from its numbers, and the credit line.

## Where records go

- **In the public repository:** every record, in every state.
- **On the site:** records in the `published` and `replaced` states, and records withdrawn
  after being published, each at a
  permanent address with its data file. A replaced record is labeled "Replaced by" with a
  link to what replaced it; a withdrawn record shows a short notice saying when and why it
  was withdrawn. The page shapes and plain-text copies are set in `site-pages` and
  `agent-readers`.
- **In a separate private repository that holds only source copies:** the full copy of
  every article read, kept so any claim can be re-checked after a source changes or
  disappears. Each Item keeps the fingerprint and the copy's path there. The repository is
  created when the first agent run needs it.
- **Not in these records:** reader contact details (email addresses of subscribers,
  commenters and people who write in); where they are kept is set in
  `comments-and-newsletter` and `people-and-replies`.

## Decisions & Alternatives

| Decision | Chosen | Alternatives Considered | Rationale |
|---|---|---|---|
| File format | JSON for data records; Markdown with a quoted-value YAML block for prose records | YAML for all; Markdown for all | JSON is strict and the same in every tool, and the file served to agents is the record itself; quoting every value in the prose records' YAML block removes YAML's type guessing |
| ID scheme | Kind prefix plus 8 random lowercase characters, made by code, checked for clashes | Numbers in sequence; IDs from titles | Several agents create records at once without clashing, and an ID survives any rename |
| History | A change list inside each record with old and new values, plus git | Git history alone | Squash merges fold many changes into 1; the change list keeps every change's date and reason in the data the site and agents read |
| Grade card changes | Computed content frozen; each version a new record | Edit the card in place | Any card can be re-run and explained, and "what moved" is a comparison of 2 versions |
| Synthesis | Held inside the grade card version | Its own record kind | It is computed for exactly 1 card version and read only with it |
| Check results | Held in the checker's Run record, tied to content fingerprints | A Check record kind; a field on the checked record | The checker never writes another role's file, and a pass counts only for the exact content checked |
| 2 readers | 2 separate Fact sheet records; owner rulings on the grade card | 1 shared fact sheet | The readers never see or overwrite each other's answers |
| Folder layout | 1 folder per kind; UTC-month subfolders for high-volume kinds | 1 flat folder per kind; folders by ID | Folders stay small enough to browse, and file names alone find any ID |
| Deleting | Never; withdrawn with a reason; only the owner removes private information, history included | Delete records no longer needed; remove from the site only | Nothing changes silently, links keep working, and private information left in public history is still public |
| Changes to published records | A pending block inside the record | Edit in place; a draft copy as a second file | Readers keep seeing approved content, and the change waits in the same file with its own state |
| Source copies | A separate private repository holding only the copies | The public repository; cloud file storage | The copies are other people's work, so they are never republished, while any run with access can reach them with history kept |
| Facts for proposed grading rules | Stored now, rules decided in `grading` | Store only what the current rubric uses | Recording extra facts while reading is cheap; re-reading every source later is not |
| Quotes in fact sheets | Short exact quotes with a link, for every source | A location pointer only when the license is unknown | The checker needs the exact words to catch a wrong claim, and short linked quotes are already allowed by the writing rules |

## Open Questions & Future Decisions

### Deferred

1. **Daily volume.** How many items, fact sheets and runs a day; it decides whether month
   subfolders are enough.
2. **The source-copies repository.** Its name, access and layout are set when the first
   agent run needs it.

## References

- [High-level design](../../high-level-design.md)
- [Whole-system decision](../../decisions/whole-system-shape.md)
- [Grading rubric](../../editorial/grading-rubric.md)
- [Writing rules](../../editorial/writing-rules.md)
