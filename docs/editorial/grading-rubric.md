# Grading rubric

Every method AI Method covers gets 1 grade card. The card tells a reader, in under 10
seconds, how much to trust the method, whether it is proven, where it was used, what it
measurably changed and when we last read its sources. Every line on the card links to its
source, and every grade links to this page.

The rubric borrows its core idea from medicine's GRADE system
(<https://www.gradeworkinggroup.org/>), which rates how sure we can be of a finding rather
than how exciting it is.

The site grades methods and claims, never products. A tool appears only as part of the
evidence for a method, named in the setting of a result.

We read what each source says. We cannot see inside a company, so we cannot verify its
internal numbers. The card therefore never calls a claim checked, unchecked or confirmed
by us. It shows who measured each result and how strong the evidence is, and the evidence
letter rises when separate groups get the same result.

## The grade card

| Line | What it says | Choices |
|---|---|---|
| **Evidence** | How strong the proof is | A, B, C, D, E |
| **Status** | Whether it is proven in practice, in a named setting | Proven, Frontier, Prediction |
| **Tested on** | The scale of the real use each source reports | Solo, Small team, Large company, Giant scale, Size not stated |
| **Who measured** | Whether the people measuring it gain from the result | Independent, Builder, Seller |
| **Results** | What happened, measured: a headline and 1 row per result | See "Results" |
| **Can you repeat it?** | Whether the method is described well enough to try | Yes, Partly, No |
| **Fits you if** | The scales and settings where the results apply | Words |
| **Last read** | The day we last compared the page with its sources | A date, plus "Newer data exists" when it does |

The card answers 2 separate questions: how sure we are (the evidence letter) and what
happened (the results).

## 1 method, 1 card

- A method is what its page's 1-line answer says to do. A page has 1 card and 1 evidence
  letter.
- "Who shared it" lists every first-hand source the page rests on, by date published,
  oldest first. No source is ranked above another.
- When sources differ on Tested on, Who measured or Can you repeat it?, the line names
  each source's value, for example "Giant scale (company 1); Size not stated (company 2)".
- When 2 groups reach the same goal by different techniques, the page shows each
  technique's results side by side, named by technique. They do not confirm each other:
  a confirmation needs a separate group using the same technique (see "Separate groups").

## Evidence: how strong the proof is

A comparison means the same team before and after the method, or a group working without
the method at the same time.

| Grade | Plain meaning | Example of what counts |
|---|---|---|
| **A** | Tested fairly against not using it, on real tasks | A randomized study: some tasks with the method, some without, picked by chance |
| **B** | Measured in real use against a comparison, by 2 or more separate groups using the same technique | 2 companies each publish before-and-after numbers for the same technique |
| **C** | Measured in real use against a comparison, by 1 group | 1 company's engineering post with before-and-after numbers |
| **D** | Used in real work, with no measured comparison | A case study or talk with no numbers, or numbers with nothing to compare them against, such as a count of fixes applied |
| **E** | Claimed, not shown | A product announcement, a prediction or an opinion |

- The letter goes to the best evidence held that measures the method as its page names
  it, and the card links to that evidence.
- Only results that measure this method set the letter. Numbers that show the size of the
  problem, such as how fast check volume grew, and results for related work are shown on
  the page, marked "Related work", and never set the letter.
- Simulations and benchmarks never set or raise the letter. They are shown as result rows
  marked "Simulation" or "Benchmark".
- Many D reports do not add up to a C. A measured comparison is what moves a letter.
- The letter rises when a separate group confirms a result with the same technique.
- A letter can drop. When newer, equally strong or stronger evidence disagrees, the card
  changes and says what changed and when.
- A letter moves only on a source we have read ourselves, after every number behind the
  move matches the source's own words, and after the owner approves the new card. A
  summary of a source, or a report about it, never moves a letter.
- The letter never moves because a name is famous, an effect is large or readers report
  success.
- A method page always rests on real work, so a card's letter is A to D. E describes
  statements, such as a prediction.

## Separate groups

2 groups are separate when they work for different organizations, share no authors and
neither paid for the other's work. A team repeating its own study is 1 group.

## Status: proven, frontier or prediction

- **Proven:** works in real use, measured against a comparison by 2 or more separate
  groups, in the setting named on the card.
- **Frontier:** someone has done it, but too few have measured it to call it proven.
- **Prediction:** nobody has done it yet; someone expects it.

Status belongs to a method in a setting. The same idea can be proven at giant scale and
frontier for small teams.

## Tested on

- **Solo:** 1 developer.
- **Small team:** up to about 50 engineers.
- **Large company:** hundreds to thousands of engineers.
- **Giant scale:** the largest codebases in the world.
- **Size not stated:** the source does not say how many engineers or how large the
  codebase is. We never estimate a size from other sources.

The line names the scale of the real use each source reports, measured or not; the
evidence letter says whether it was measured. 1 setting gets the same value on every page.
The key number is added when there is one, for example "about 10 merges a day".

## Who measured

- **Independent:** a group that neither built nor sells it.
- **Builder:** the team that built it, reporting on its own work.
- **Seller:** a company that profits if readers adopt it.

Builder and Seller results still count; the reader sees who is speaking.

## Results

**Headline:** 1 of these, plus the 1 most important number as the source states it, when
there is one.

| Headline | When |
|---|---|
| **Helped**, **No clear effect**, **Hurt** or **Mixed** | At least 1 result compares with and without the method. The headline's number comes from a compared result |
| **Measured, no comparison** | There are numbers, but none compares with and without the method |
| **Described, not yet measured** | Real use is described, with no numbers |

**1 row per result.** Every row has these fields:

| Field | What it holds |
|---|---|
| **What was measured** | The measure, in 1 of 5 families: Speed, Quality, Cost, Scale, People |
| **Numbers** | Before, after and change, as the source states them, with units; or the single number when there is no comparison |
| **Compared against** | A control group, the same team before, or "No comparison" |
| **Sample** | How many people, tasks, changes or repositories, over what period, or "Not stated" |
| **Who measured** | Independent, Builder or Seller |
| **Setting** | Who, the scale, the tool or model version when stated, and the date or period |

A row also shows the uncertainty **Range** when the source gives one, and is marked
"Related work", "Simulation" or "Benchmark" when it does not set the letter. A field that is
the same for every row may be stated once above the rows.

The 5 families:

- **Speed:** time to finish a task, time from change to live, changes shipped.
- **Quality:** defects, incidents, security flaws, rework.
- **Cost:** computing, money, people-hours.
- **Scale:** how much volume the method handled.
- **People:** review load, learning, satisfaction.

Rules:

1. Numbers appear as the source states them. No combined score, no averages across
   sources, no return-on-investment figure computed by us.
2. What people felt is labeled "Reported feeling", never a measurement. In METR's 2025
   study (<https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/>),
   developers felt faster and measured slower.
3. Results that got worse are rows too. A card with a Speed row and no Quality row says
   "Quality: not measured".
4. No result and negative results are recorded the same way as wins.
5. A card never guesses or fills in a number.
6. The evidence letter never moves because a result is large or exciting.
7. Numbers on how many teams use a method are not a result of the method. They appear
   under "Fits you if", with their source.

## Fits you if

The scales and settings the sources measured, and, said plainly, the ones no source
measured: "No source measures teams under 15 developers." It describes what the sources
show, never 1 reader's own team.

## Last read

The day we last compared the page with its sources. Before a page goes out, we compare
every number on it with the source's own words. That catches our own copying mistakes; it
says nothing about whether the source's numbers are right. "Newer data exists" appears
when a newer source holds data the card does not yet include.

## Who gets a page

A method gets its own page when a notable first-hand source from a leading company or
person describes it. A measured comparison is not needed for a page; the grade card says
honestly how well the method is proven, and a method that is described but not yet
measured shows Evidence D with the headline "Described, not yet measured". The source must
pass all 4 page checks:

1. **First-hand:** a named company, lab or person reporting their own work.
2. **Real work:** used in production or on real tasks, or tested in a controlled study on
   real tasks. A demo, a simulation or a benchmark score alone does not pass.
3. **Described:** enough detail to understand what they did and how it works.
4. **Dated and linked:** a primary source we have opened and read.

**Notable, leading source:** the source is a primary-tier source on the source list from a
company or lab on that list, or the person is on the leading-voices list.

- A famous name alone does not earn a page: the source must describe its own real work.
- A measured comparison decides the grade, never whether a page exists.
- Independent studies count as evidence on the page of the method they measure, whether
  or not they ran in production, and negative results count.
- A company's report on its own work counts, labeled "Builder".
- The Watching list on the daily scan holds new items that are not first-hand, not yet
  described enough to understand, or known only from secondary reports: 1 line and a
  source link each, no page, no grade. Statements by leading voices that are not
  descriptions of real work, such as predictions, follow the leading-voices rules.

## Sources and their claims

- Every source a page lists is labeled "Read" or "Not read yet", with its date published.
- A source we have read shows its main claim, in our words, under the source, unless a
  method page already tells it; then the row links to that page.
- A claim shown under a source names who is speaking (Builder, Seller or Independent) and
  the kind of evidence, in 1 of these words: Randomized study; Numbers with a comparison;
  Numbers, no comparison; Simulation; Benchmark; Described, no numbers; Opinion;
  Prediction; Proposal. It never shows a letter.
- A source not read yet shows its title, publisher, date and link, and no claim. It never
  sets a letter and never appears in a method's history.
- Items on the daily scan follow the same rules.
- The page's machine-readable data and plain-text copy say the same as the visible text.

## How a grade is computed

A grade comes from rules wherever a rule can decide, and from a model's judgment only where
it cannot. The same facts always give the same grade.

1. **Read (model):** an agent pulls fixed facts from the source into a fact sheet: study
   design, whether there is a comparison, sample size, who measured, how many separate
   groups, scale, tool or model version, dates and the numbers. Every fact carries a
   pointer to the place in the source it came from. A second agent fills the same sheet on
   its own; any difference goes to the owner.
2. **Rule (code, no model):** a written rule table turns those facts into the evidence
   letter, the status, the "who measured" label and the pass or fail on the page checks.
3. **Judge (model, bounded):** only what a rule cannot decide: whether the method is
   described well enough to repeat, the headline, whether this is the same method and the
   same technique as one already listed, whether a result measures this method or related
   work, how much it matters to readers, and whether a newer result replaces an older
   one. Each is a fixed yes-or-no or pick-1 question, asked of 2 separate judges.
   Disagreement goes to the owner.
4. **Approve (person):** the owner approves graded pages and settles disagreements.

Every grade stores its facts, the rule version and the judges' answers, so any grade can
be re-run and explained; each card offers "Why this grade". When a rule changes, every
affected grade is recomputed and the change is logged.

## How we catch our own mistakes

1. **A rule-based error catcher.** Code, not a model, rejects an agent's output when a
   number on the card does not appear in the stored copy of the source text, a source
   pointer does not hold the claimed fact, a link is dead or a date is impossible.
2. **A planted-error test.** Known mistakes are planted in test summaries (a changed
   number, a swapped name, a claim the source never makes), and the error catcher must
   catch them.
3. **Look hardest where risk is highest.** Each item gets a risk score from rules: it
   names a real person, a vendor measures its own product, the effect is very large, there
   is only 1 source, or a grade is about to drop. High-risk items get the full review and
   go to the owner.
4. **The owner on the loop, in stages.** At first the owner approves every graded page.
   Once the grading test and a random sample of approved pages show errors below a set
   bar, and only on the owner's explicit yes, the owner moves to setting the rules,
   watching the totals, reviewing a random sample and deciding the cases sent up. Pages
   about people and any downgrade always go to the owner.
5. **Measure the escalations.** Track how many cases sent to the owner really needed a
   change, and how many reader-reported errors were real, so the bar can be tuned.

## When a newer result replaces an older one

A newer result replaces an older one on the card only when it measures the same thing at
least as well, on the same or newer tools; otherwise both stand. A replaced result stays
visible in the method's history, marked "Replaced".

## Leading voices

A short list is kept of people who have provably been ahead of the field. What they say
about AI-era software engineering is included even when it is not a description of real
work, such as a prediction: their predictions matter, and much of what they say rests on
their own work. The owner approves each name before it is added.

**Who is on the list.** Only the very top of the field. A person joins by 1 of 2 routes,
and their page says which:

- **Track record:** they pass all 3 tests.
  - **Early and right, on record:** a dated source shows them stating an idea years
    before it became standard practice.
  - **Built something widely used:** a language, tool, system or method used well beyond
    their own team.
  - **First-hand today:** they build or research with AI now and publish how, not only
    comment on it.
- **Peer recognition:** others already at that level widely treat them as being at that
  level, such as people on the list or leading teams citing and building on their work.
  Follower counts and general fame do not count. The evidence of recognition is recorded
  with sources, and the owner decides.

The list starts at about 20 to 30 people, is reviewed on a set schedule, and includes
people outside the United States.

**How statements are shown.**

1. Each statement is sorted into 1 of 3 kinds: work they did themselves with numbers
   (graded like any method), work they did themselves without numbers (labeled
   "Described, not yet measured"), and predictions (labeled "Prediction by a leading
   voice", with what it is based on).
2. Every statement shows an evidence line: what evidence exists for it.
3. Being on the list earns inclusion, never a higher grade.
4. Words come only from the person's own post, paper or recorded talk. Notes taken by
   someone else are labeled as notes until the person or a recording confirms them. No
   invented or reworded quotes.

**Predictions and verdicts.** Each prediction records the date it was made, the exact
words and their source, and what would count as it coming true. When it falls due, an
agent proposes a verdict: came true, not yet, or did not. The owner approves every
verdict. "Did not come true" needs positive evidence, never only the absence of news. A
prediction too vague to judge is marked "Cannot be checked"; such cases are decided 1 by
1, and new rules are written from them. Verdicts on the site's own earlier grades are not
shown on the site to start.

## A method's history

A grade is a snapshot. A covered method's page keeps a history of what others do with it,
shown as "Who else", and every new event can change the card.

| Event | Plain meaning | Can change |
|---|---|---|
| **Origin** | Where the idea first appeared | Nothing; it starts the history |
| **Adopted** | Another team uses it as is | Tested on |
| **Confirmed** | A separate group, using the same technique, measures it and gets a similar result | Evidence, Status |
| **Extended** | Someone builds on it and adds something | Links to a new child method with its own card |
| **Changed** | Someone uses a different version or only part of it, and says what differs | Results, Tested on, sometimes a new child method |
| **Contradicted** | New evidence or a first-hand position disagrees with all or part of it | Evidence, Status, Results; the card says what moved |
| **Dropped** | A team stops using it and says why | Results, Status |

Each event records who, when, what happened, its source and what it changed on the card.

- These 7 labels are the only ones. A label never carries "in part" or other words; the
  event's line says which part it concerns.
- Every event rests on a source we have read. A source not read yet stays in the sources
  list only.
- Adopted and Changed say that a team uses the method, not that it learned the method
  from the origin. Events are listed by date.
- What a method builds on is not an event. The page links to it as "Built on", and the
  earlier method's page links back as "Extended".
- Numbers on how many teams use a method go under "Fits you if", not in the history.
- "What changed since we first covered this" sits at the top of a method page whenever the
  card has moved, in 1 or 2 lines.
- Agents watch for new papers, engineering posts and talks that cite a covered method's
  source or name the method, and propose events. The owner approves any event that
  changes a grade.
- Every card change goes into the change log with its date, reason and source. Nothing is
  silently overwritten.

## Reader feedback

Every card ends with 3 invitations:

1. **"Tried this? Tell us what happened."** Reader reports are shown as reader reports.
   They tell us where to look; they never set or raise a grade on their own.
2. **"Know a better source?"** Readers suggest primary sources. Anything that changes a
   grade is credited to the reader who found it.
3. **"Think this grade is wrong?"** Readers can challenge any line. Every change is logged
   with its date and reason.

## Sources and plain words

- Every line on the card links to the source behind it.
- Primary sources first: the paper, the engineering post, the talk. Summaries only point
  toward primary work.
- Every unfamiliar term is explained in plain words first, with its real name after, and
  links to the glossary.
