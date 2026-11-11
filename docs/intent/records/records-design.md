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
- **Nothing changes silently.** Every change keeps a dated reason inside the record, and a
  grade card is never edited, only replaced by a new version.
- **Any tool can run a role.** Roles read record files and write record files; nothing
  depends on a particular agent tool or model.
- **Built in public.** Every record, drafts and working records included, lives in the
  public repository. Keys and passwords are never in a record.
- **Show it now, labeled honestly.** A new claim can be recorded and shown at once, marked
  as the source's own claim and not yet checked; a letter grade changes only after the
  evidence behind it is checked.

## Record kinds

15 kinds. Each has a short ID prefix used in its IDs.

| Kind | Prefix | What 1 record is | Written by |
|---|---|---|---|
| Source | `src` | A place the agents read: a blog, a feed, a paper archive, a channel, a person's public account | Scout proposes; the owner approves |
| Item | `itm` | 1 thing a source published: a post, paper, talk, release, changelog entry or statement, with its First look text | Scout, writer |
| Scan | `scn` | 1 day's ranked list, skip reasons, Watching list and coverage counts | Scout |
| Method | `mth` | A named way of working that can be tried and measured; its page carries the grade card | Writer, grader |
| Fact sheet | `fct` | The fixed facts 1 reader pulled from 1 item about 1 method, each with a pointer into the source | Reader |
| Result | `res` | 1 measured result, as 1 row of a grade card's results | Reader proposes; grader confirms |
| Grade card | `grd` | 1 version of a method's grade card, with everything it was computed from | Grader |
| Timeline event | `evt` | Something that happened to a covered method, and what it changed on the card | Tracker |
| Person | `per` | Someone named on the site, and for a leading voice the route that listed them | Scout, tracker; the owner approves leading voices |
| Prediction | `prd` | A dated statement about the future, in the person's own words | Reader, tracker |
| Verdict | `vrd` | A dated ruling on a prediction, or on how an earlier grade card held up | Tracker proposes; the owner approves |
| Piece | `pce` | An authored article, such as an explainer | Writer |
| Correction or reply | `cor` | A request to correct a page or add context, and what was done | Recorded by an agent; the owner decides |
| Term | `trm` | 1 glossary entry | Writer |
| Run | `run` | 1 agent run: role, tool, model, inputs, outputs, usage, outcome | The run itself |

Synthesis, the combining of what all of a method's sources say into 1 picture, is held
inside the grade card version it feeds, not as a kind of its own. Check results are held
in the checker's Run record. Other detailed designs may add kinds or fields through this
design.

## IDs

An ID is the kind's prefix, an underscore and 8 random characters from a 32-character
alphabet that leaves out easily confused letters, for example `mth_4f9k2c7q`. Code makes
every ID; a model never does. Before an ID is used, code checks that no record already
has it. An ID never changes, is never reused and carries no meaning, so a record can be
renamed, merged or moved without breaking a link to it.

A page address (readable words, such as `/methods/just-in-time-tests`) is separate from
the ID and is owned by the `site-pages` design. A record stores its address once it is
first published, so the address can be frozen and an old address forwarded.

## Files and folders

Records live in a top-level `records/` folder, 1 folder per kind:

```
records/
  sources/src_xxxxxxxx.json
  methods/mth_xxxxxxxx.json
  items/2026-11/itm_xxxxxxxx.json
  scans/2026-11/scn_xxxxxxxx.json
  runs/2026-11/run_xxxxxxxx.json
  pieces/pce_xxxxxxxx.md
  terms/trm_xxxxxxxx.md
  ...
```

- **Format.** Data records are JSON: strict, the same for every tool, read directly by the
  site build, and served as-is to agents. Prose records (Piece, Term) are Markdown with
  the same fields at the top, so their text reads naturally.
- **High-volume kinds** (Item, Scan, Fact sheet, Run) sit in a subfolder for the month the
  record was created, so no folder grows past a few thousand files. Other kinds sit in 1
  flat folder. Code builds an index from ID to file path at each build.
- **Shape is checked.** Each kind has a written schema; a record that does not match its
  schema fails the build and is rejected when an agent proposes it.
- **Schema version.** Every record carries the version of its kind's schema. When a
  schema changes, a script updates every record of that kind in 1 change, and the change
  is logged.

## Fields every record has

| Field | Meaning |
|---|---|
| `id` | The permanent ID |
| `kind` | The record kind |
| `schema` | The schema version the record follows |
| `state` | Where the record is on its path (see "States") |
| `created` | When the record was created, and by which run or by the owner |
| `changes` | The record's change list (see "History") |
| `last_meaningful_change` | The date of the last change that alters what a reader would understand; a re-check, a rebuild or a wording fix does not move it |

Dates are kept apart by meaning and never stand in for each other: when something
happened, when the source published it, when we found it, when we first published it, its
last meaningful change, and when its sources were last checked.

## History

Every record keeps its own change list. Each change adds 1 entry: the date, who made it
(a run ID, or the owner), what fields changed, the reason in 1 line, and the source that
justifies it when there is one. Entries are only ever added, never edited or removed.
Git keeps every earlier full copy of the file as well, but the change list is what the
change log page, the dashboard's "What moved" and agents read, so it survives however the
repository's history is merged.

A grade card is never edited. A new version is a new Grade card record, and the method
points to its current version. Earlier versions stay, so any card can be re-run and
explained, and readers can see what moved.

A record is never deleted. A record that should no longer appear is moved to the
`withdrawn` state with a reason. The only exception is private information or a legal
requirement, where the content is removed, the record stays with a "Removed" entry and
the date.

## States

Records the owner approves move along 1 path:

| State | Meaning |
|---|---|
| `draft` | Written by an agent; not checked |
| `checked` | The checker passed it: every claim matched the stored copy of its source, and the rule-based error catcher found nothing |
| `waiting` | Checked and waiting for the owner |
| `approved` | The owner approved it |
| `published` | It is on the site |
| `replaced` | A newer version took its place; it stays visible in history |
| `withdrawn` | Taken out of view, with a reason |

A record that fails a check returns to `draft` with the failures listed in the checker's
Run. Records that need no approval (an Item with its First look text, a Scan, a Run) skip
`waiting` and `approved`. How a record moves between states, and what
may publish without approval, is set in `approval-and-publishing`; that the path can
never publish without approval or get stuck is modeled in TLA+ in `test-set`.

Separately, every claim carries a claim status: `source's claim, not checked` or
`checked`. A new result can appear at once with the first status; a letter grade is
computed only from results with the second.

## What each kind holds

Key fields only; each kind's full schema is fixed in its requirement lines.

**Source.** Name; address; channel type; read route (feed, sitemap, official interface,
paid interface, or hand-in only); tier (primary, pointer, watch only); language and
region; active or dropped, with the reason; the owner's approval.

**Item.** Source; address; title; authors (Person IDs); kind; language, and whether a
translation was used; when the source published it and when it was found; the license the
source states for reuse, or "unknown", which means link and never copy; a fingerprint of
the exact text read; which parts of it were read (all, or named sections), so no sentence
claims more than was read; the group of items reporting the same news, and whether this
item is the primary one; and its First look text: a 1-line summary, an "affects you if"
line, its topic area, a note in words on what kind of evidence it is, and the claim status.

**Scan.** Date; the ranked entries (Item ID, rank, the rule or judgment that placed it);
skipped items with a 1-line reason each; the Watching list; coverage counts (sources
scanned, items read, items skipped by reason).

**Method.** Name; topic area; the methods it builds on and the methods built on it; the
1-line answer and 1-paragraph summary; the current grade card version; its address once
published; charts used on its page.

**Fact sheet.** The item and the method; which reader run filled it; the fixed facts from
the grading rubric (study design, comparison, sample, who measured, how many separate
groups, scale, tool or model version, dates, the numbers); each fact with a pointer to its
place in the source: the section, and the exact words it rests on. The 2 readers on a
graded item write 2 separate fact sheets, so they never write the same file.

**Result.** The method and the item; the measure and its family (Speed, Quality, Cost,
Scale, People); before, after and change, with units, as the source states them; what it
was compared against; the sample; who measured; the setting: scale, the tool or model and
its version, and the month it was measured; the uncertainty range when given; "Reported
feeling" when it is a feeling, not a measurement; the claim status; the result it replaced,
if any.

**Grade card.** The method; the version number; when it was computed; the rule table
version; the fact sheets and results it was computed from; the synthesis (each result side
by side with its setting, and each agreement and disagreement named); both judges'
answers, with which model answered; the computed lines (evidence letter, status, tested
on, who measured, headline, can you repeat it, fits you if); when the sources were last
checked, and whether newer data exists; its state.

**Timeline event.** The method; the event type (Origin, Adopted, Confirmed, Extended,
Changed, Contradicted, Dropped); who, when and what; the source item; the grade card
version before and after, when it changed the card.

**Person.** Name as they publish it; their public accounts and addresses, used to check
that a reply really comes from them; for a leading voice, the route that listed them
(track record or peer recognition) with its sourced evidence, their place on the list
(candidate, listed, removed) and the owner's approval; which of their channels can be read
within their terms.

**Prediction.** The person; the item holding their words; the exact words; when it was
made; what would count as it coming true, and by when; when it is due to be checked.

**Verdict.** What it rules on (a prediction, or an earlier grade card version); the ruling;
the evidence items; the run that proposed it and the owner's approval; whether it is shown
on the site.

**Piece.** Kind (explainer to start); title; body; the methods and items it draws on;
charts used.

**Correction or reply.** The page and record it concerns; who sent it (a Person ID) and how
that was checked; whether it is a correction, added context or a reply; what was done,
with the owner's decision.

**Term.** The plain-words explanation; the real name; the pages that use it.

**Run.** Role; tool and model; instruction version; start and finish; usage; the records it
read and wrote; outcome, including each check passed or failed and why; why it stopped,
when it stopped early.

**Charts on a page** (Method or Piece). For each chart: the source item, its license,
whether it is copied with credit or redrawn from its numbers, and the credit line.

## Where records go

- **In the public repository:** every record, in every state.
- **On the site:** only records in the `published` state, each with its data file at a
  permanent address. Which addresses, and the plain-text copies, are set in `site-pages`
  and `agent-readers`.
- **Outside the repository:** full copies of other people's articles, kept so any claim can
  be re-checked after a source changes or disappears. The Item keeps the fingerprint and a
  pointer to the copy.
- **Reader contact details** (email addresses of subscribers, commenters and people who
  write in) are not held in these records; where they are kept is set in
  `comments-and-newsletter` and `people-and-replies`.

## Decisions & Alternatives

| Decision | Chosen | Alternatives Considered | Rationale |
|---|---|---|---|
| File format | JSON for data records; Markdown with fields at the top for prose records | YAML for all; Markdown with fields for all | JSON is strict and the same in every tool, and the file served to agents is the record itself; YAML reads more easily but guesses types (a value like `no` can turn into false); prose reads better as Markdown |
| ID scheme | Kind prefix plus 8 random characters, made by code, checked for clashes | Numbers in sequence; IDs from titles | Several agents create records at once without clashing, and an ID survives any rename |
| History | A change list inside each record, plus git | Git history alone | Merging and tidying a repository's history can fold many changes into 1; the change list keeps every change's date and reason in the data the site and agents read |
| Grade card changes | Each version is a new, never-edited record | Edit the card in place | Any card can be re-run and explained, and "what moved" is a comparison of 2 versions |
| Synthesis | Held inside the grade card version | Its own record kind | It is computed for exactly 1 card version and read only with it |
| Check results | Held in the checker's Run record | A Check record kind; a field on the checked record | The checker never writes another role's file, and every check is tied to the run that made it |
| 2 readers | 2 separate Fact sheet records | 1 shared fact sheet | The readers never see or overwrite each other's answers |
| Folder layout | 1 folder per kind; month subfolders for high-volume kinds | 1 flat folder per kind; folders by ID | Folders stay small enough to browse, and a build-time index finds any ID |
| Deleting | Never; records are withdrawn with a reason | Delete records no longer needed | Nothing changes silently, and links to a record keep working |

## Open Questions & Future Decisions

### Deferred

1. **Where full source copies live.** Proposed: outside the repository, because they are
   other people's work; the place is not yet chosen.
2. **Facts proposed by the grading research.** The research on how other fields grade
   evidence proposes grading each result row on its own, a tools line that shows the tools'
   age, fixed tags for surveys, benchmarks and seller-picked results, recording who counts
   as a separate group, and logging each prediction's terms in advance. Each needs facts
   stored in these records; the rules that use them belong to `grading`.
3. **Daily volume.** How many items, fact sheets and runs a day; it decides whether month
   subfolders are enough.

## References

- [High-level design](../../high-level-design.md)
- [Whole-system decision](../../decisions/whole-system-shape.md)
- [Grading rubric](../../editorial/grading-rubric.md)
- [Writing rules](../../editorial/writing-rules.md)
