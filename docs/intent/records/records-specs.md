# Records requirements

Requirement lines for [the records design](records-design.md). "A record" means a record
of any of the 15 kinds that design names, stored under `records/`. `[ ]` marks a
requirement not yet built.

## Kinds and files

- [ ] **REC-KIND-001**: The system shall store every record as exactly 1 file under the `records/` folder, in the folder for its kind.
- [ ] **REC-KIND-002**: The system shall support exactly these record kinds and ID prefixes: Source `src`, Item `itm`, Scan `scn`, Method `mth`, Fact sheet `fct`, Result `res`, Grade card `grd`, Timeline event `evt`, Person `per`, Prediction `prd`, Verdict `vrd`, Piece `pce`, Correction or reply `cor`, Term `trm`, Run `run`.
- [ ] **REC-FILE-001**: The system shall store records of every kind except Piece and Term as JSON files.
- [ ] **REC-FILE-002**: The system shall store Piece and Term records as Markdown files whose top block of fields is YAML in which every value is a quoted string, a number or a fully written list.
- [ ] **REC-FILE-003**: The system shall store Item, Fact sheet, Scan and Run records in a subfolder of their kind's folder named for the UTC month (`YYYY-MM`) in which the record was created, and records of all other kinds directly in their kind's folder.
- [ ] **REC-FILE-004**: If an Item, Fact sheet, Scan or Run record sits in a month subfolder that does not match the UTC month of its creation date, then the site build shall fail and name the record.
- [ ] **REC-FILE-005**: The system shall name every record file by the record's ID followed by `.json` or `.md`.
- [ ] **REC-FILE-006**: When the site build runs, the system shall write an index that maps every record ID to its file path.
- [ ] **REC-FILE-007**: The system shall keep a written schema for each record kind, and each record shall state the schema version it follows.
- [ ] **REC-FILE-008**: If a record does not match the schema version it states, then the site build shall fail and name the record and the mismatch.
- [ ] **REC-FILE-009**: If an agent proposes a record that does not match its kind's current schema, then the system shall reject the proposal and record the reason in that agent's Run record.
- [ ] **REC-FILE-010**: The system shall include in each record kind's schema at least the fields the records design lists for that kind under "What each kind holds".

## IDs

- [ ] **REC-ID-001**: The system shall form every record ID as the kind's prefix, an underscore and 8 characters drawn at random from `0123456789abcdefghjkmnpqrstvwxyz`.
- [ ] **REC-ID-002**: The system shall create record IDs in code, never from a model's output.
- [ ] **REC-ID-003**: Before a new record ID is used, the system shall confirm that no record on the main branch and no record already created by the same run has that ID, and shall draw a new ID if one does.
- [ ] **REC-ID-004**: If 2 records anywhere under `records/` share an ID, then the site build shall fail and name both files.
- [ ] **REC-ID-005**: The system shall never change a record's ID after the record is merged into the main branch, and shall never assign an ID that any record has held.
- [ ] **REC-ID-006**: Where a record kind has pages (Method, Person, Piece, Term, Source), the system shall store the record's page address when it is first published and keep every earlier address in a list of past addresses.

## Dates

- [ ] **REC-DATE-001**: The system shall write every date in a record in UTC, in exactly 1 of these forms: a full time (`2026-11-11T20:41:40Z`), a day (`2026-11-11`), a month (`2026-11`), a year (`2026`) or the word `unknown`.
- [ ] **REC-DATE-002**: When a source gives a date with less precision than a day, the system shall record it with exactly the precision the source gives and never add a day or time.
- [ ] **REC-DATE-003**: The system shall keep the date something happened, the date the source published it, the date it was found, the date it was first published on the site, its last meaningful change and the date its sources were last checked as separate fields, and shall never copy 1 into another.

## Common fields and writers

- [ ] **REC-FIELD-001**: The system shall give every record the fields `id`, `kind`, `schema`, `state`, `created`, `changes`, `last_meaningful_change` and `merged_into`.
- [ ] **REC-WRITE-001**: The system shall write every record's `id`, `state`, `changes`, `last_meaningful_change`, `merged_into`, grade card version numbers and the Method current-card pointer in code, never from a model's output.
- [ ] **REC-WRITE-002**: The system shall allow an agent role to write only the field groups that the records design assigns to that role for that record kind, and shall reject any other write.
- [ ] **REC-WRITE-003**: When an agent writes a record that has changed since the agent read it, the system shall redo the write from the latest copy of the record.
- [ ] **REC-WRITE-004**: If a write to a record still clashes after 3 attempts, then the system shall abandon that write and record the failure in the writing agent's Run record.
- [ ] **REC-WRITE-005**: While any agent run is open, the system shall not start a schema update.

## History

- [ ] **REC-HIST-001**: When a record is created, edited, changes state, is updated to a new schema version, is merged or has content removed, the system shall add 1 entry to that record's change list.
- [ ] **REC-HIST-002**: The system shall give every change-list entry the fields `at` (UTC time), `by` (a Run ID or `owner`), `event` (`created`, `edited`, `state`, `schema-update`, `merged` or `removed`), `fields` (each changed field with its old and new value), `reason` (1 line), `source` (the item ID or address that justifies the change, or empty) and `meaningful` (yes or no).
- [ ] **REC-HIST-003**: The system shall only add entries to a record's change list and shall never edit or remove an existing entry, except when the owner removes private or legally restricted content under REC-REMOVE-001.
- [ ] **REC-HIST-004**: The system shall mark a change-list entry meaningful when the change moves the record to `published`, `replaced` or `withdrawn`, or when it edits a field shown to readers on a record in the `published` state and is not marked "wording only".
- [ ] **REC-HIST-005**: If an edit marked "wording only" changes any number, date, name, grade line or link, then the system shall reject the "wording only" mark and treat the edit as meaningful.
- [ ] **REC-HIST-006**: The system shall mark as not meaningful every edit made while a record is not in the `published` state, every state change other than a move to `published`, `replaced` or `withdrawn`, every re-check, every rebuild and every schema update.
- [ ] **REC-HIST-007**: When a meaningful change-list entry is added to a record, the system shall set that record's `last_meaningful_change` to the entry's time, and shall change `last_meaningful_change` at no other time.

## Grade cards

- [ ] **REC-CARD-001**: The system shall write a Grade card record in 2 steps: first its inputs (fact sheets, results, synthesis and reader disagreements), then its computed lines.
- [ ] **REC-CARD-002**: When 2 Fact sheet records for the same item and method disagree on a fact, the system shall store the owner's ruling on that fact on the Grade card record beside both fact sheets, and the rule table shall read the ruled value.
- [ ] **REC-CARD-003**: Once a Grade card record's computed lines are written, the system shall reject any change to its content and allow changes only to its state, change list and approval.
- [ ] **REC-CARD-004**: The system shall number each method's Grade card versions in code as 1 more than the highest version number that method has had, and shall never reuse a version number, including a number held by a rejected version.
- [ ] **REC-CARD-005**: If 2 Grade card records for the same method hold the same version number, then the site build shall fail and name both records.
- [ ] **REC-CARD-006**: The system shall move a Method record's current-card pointer only when a Grade card version for that method is published.
- [ ] **REC-CARD-007**: The system shall store, for each judge answer on a Grade card record, the answer, the model and model family that gave it, and whether the judge was sure.

## Schema updates

- [ ] **REC-SCHEMA-001**: When a record kind's schema changes, the system shall update every record of that kind to the new schema version in 1 change, adding a `schema-update` entry to each record.
- [ ] **REC-SCHEMA-002**: When a schema update touches a Grade card record, the system shall change only how its values are written, never a value.
- [ ] **REC-SCHEMA-003**: The system shall keep every earlier schema version of every record kind in the repository.

## Merges, withdrawal and removal

- [ ] **REC-MERGE-001**: When 2 records of the same kind are found to describe the same method, person or source, the system shall set the losing record's `merged_into` to the winning record's ID, move the losing record to `withdrawn` with the reason "merged", and add the losing record's addresses to the winning record's past addresses.
- [ ] **REC-DEL-001**: The system shall never delete a record file; a record that should no longer appear shall move to the `withdrawn` state with a reason.
- [ ] **REC-REMOVE-001**: When the owner removes private information or content a legal request covers, the system shall remove that content from the record, from its change list and from the repository's history, and add a `removed` entry with the date and no removed content.
- [ ] **REC-REMOVE-002**: The system shall allow only the owner to remove content under REC-REMOVE-001, and shall never let an agent rewrite the repository's history.

## States

- [ ] **REC-STATE-001**: The system shall allow Source, Method, Grade card, Timeline event, Person, Prediction, Verdict, Piece, Correction or reply and Term records these states: `draft`, `checked`, `waiting`, `approved`, `published`, `rejected`, `replaced`, `withdrawn`.
- [ ] **REC-STATE-002**: The system shall allow Item and Scan records only the states `draft`, `checked`, `published` and `withdrawn`; Result records only `draft`, `checked`, `published`, `replaced` and `withdrawn`; and Fact sheet records only `draft`, `checked`, `published`, `rejected`, `replaced` and `withdrawn`.
- [ ] **REC-STATE-003**: The system shall allow Run records only the states `open`, `finished` and `stopped`.
- [ ] **REC-STATE-004**: The system shall show a record on the site if and only if its state is `published`, `replaced` or `withdrawn`, whatever its other status fields say.
- [ ] **REC-STATE-005**: The system shall keep a `rejected` record in the `rejected` state; a new attempt shall be a new record or a new version.
- [ ] **REC-STATE-006**: When the owner restores a `withdrawn` record, the system shall return it to the state it held before it was withdrawn and record the owner's reason.
- [ ] **REC-STATE-007**: The system shall allow only the owner to restore a `withdrawn` record.
- [ ] **REC-STATE-008**: While a Verdict record rules on the site's own earlier grade card, the system shall keep it out of the `published` state until the owner decides such verdicts are shown.

## Checks

- [ ] **REC-CHECK-001**: When an agent run starts, the system shall write its Run record in the `open` state before the run does any other work.
- [ ] **REC-CHECK-002**: The system shall record, in the checker's Run record, every record the checker checked with a fingerprint of its content (all fields except state, change list and approval) and a pass or fail with reasons.
- [ ] **REC-CHECK-003**: The system shall move a record to `checked` only by citing a checker Run that passed it and only while the record's current content fingerprint equals the fingerprint that Run checked.
- [ ] **REC-CHECK-004**: When the content of a record in `checked`, `waiting` or `approved` changes, the system shall move the record back to `draft`.

## Changes to published records

- [ ] **REC-PEND-001**: When a change is proposed to a published Method, Person, Piece, Term or Source record, the system shall keep the published content unchanged and hold the proposed content in a single `pending` block inside the record, with its own state.
- [ ] **REC-PEND-002**: When a second change is proposed to a record that already holds a `pending` block, the system shall replace the pending content and reset the pending block's state to `draft`.
- [ ] **REC-PEND-003**: When a `pending` block is approved and published, the system shall move its content into the record in 1 change and remove the `pending` block.

## Claim status

- [ ] **REC-CLAIM-001**: The system shall give every Item's First look text and every Result a claim status of either `source's claim, not yet checked` or `verified against source`, starting at `source's claim, not yet checked`.
- [ ] **REC-CLAIM-002**: The system shall set a claim status to `verified against source` only in code, and only when a checker Run confirms the claim against the stored copy of its source.
- [ ] **REC-CLAIM-003**: The system shall compute a Grade card's evidence letter only from Result records whose claim status is `verified against source`.

## Links between records

- [ ] **REC-LINK-001**: If any record points to an ID that belongs to no record, then the site build shall fail and name both.
- [ ] **REC-LINK-002**: If a record in the `published` state points to a record that is not `published` or `replaced`, then the site build shall fail and name both, except for links to Run, Source and Person records and the skipped-item list of a Scan record.

## What each kind holds

- [ ] **REC-ITEM-001**: The system shall store on every Item record the license the source states for reuse, or `unknown`.
- [ ] **REC-ITEM-002**: The system shall store on every Item record a fingerprint of the exact text read, the path of its full copy in the source-copies repository, and which parts of the source were read (all, or named sections).
- [ ] **REC-ITEM-003**: The system shall give each group of Item records reporting the same news exactly 1 primary item, and shall keep the group's member list on the primary item only.
- [ ] **REC-FACT-001**: The system shall store each fact in a Fact sheet record with a pointer to its place in the source: the section, an exact quote of at most 25 words, and the link.
- [ ] **REC-FACT-002**: The system shall store on every Fact sheet record whether the study was randomized or registered in advance, whether it gave an uncertainty range, the identity of each group that measured (authors, employers, funders, vendors), and tags for the kind of number (self-reported, survey, benchmark, possibly in a model's training data, results picked by the seller).
- [ ] **REC-RES-001**: The system shall store on every Result record the tool or model and its version, and the month the result was measured.
- [ ] **REC-RES-002**: The system shall store every Result record's numbers exactly as the source states them, with their units, and never a value computed by the system.
- [ ] **REC-PRED-001**: When a Prediction record is created, the system shall store what would happen, by when, and which source would settle it, and shall not change those terms afterward.
- [ ] **REC-PERSON-001**: The system shall store on every Person record the public accounts and addresses used to confirm that a reply comes from that person, and which of their channels can be read within their terms.
- [ ] **REC-RUN-001**: The system shall store on every Run record its role, tool, model and model family, instruction version, start and finish times, usage, the records it read and wrote with their content fingerprints, its outcome, and why it stopped when it stopped early.
- [ ] **REC-CHART-001**: The system shall store, for each chart on a Method or Piece record, its source item, its license, whether it is copied with credit or redrawn from its numbers, and its credit line.

## Where records go

- [ ] **REC-PLACE-001**: The system shall keep every record, in every state, in the public repository.
- [ ] **REC-PLACE-002**: The system shall never store a key, password or reader email address in a record.
- [ ] **REC-PLACE-003**: The system shall keep the full copy of every article read in a separate private repository that holds only source copies, and never in the public repository.
- [ ] **REC-PLACE-004**: The system shall label every `replaced` record shown on the site "Replaced by" with a link to the record that replaced it, and show every `withdrawn` record as a notice of when and why it was withdrawn.
