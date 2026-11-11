# Grading rubric

Every method AI Scale Dev covers gets 1 grade card. The card tells a reader, in under 10
seconds, how much to trust the method, whether it is proven, who it was tested on, what it
measurably changed and how fresh the information is. Every line on the card links to its
source.

The rubric borrows its core idea from medicine's GRADE system
(<https://www.gradeworkinggroup.org/>), which rates how sure we can be of a finding rather
than how exciting it is.

The site grades methods and claims, never products. A tool appears only as part of the
evidence for a method, named in the setting of a result.

## The grade card

| Line | What it says | Choices |
|---|---|---|
| **Evidence** | How strong the proof is | A, B, C, D, E |
| **Status** | Whether it is proven in practice, in a named setting | Proven, Frontier, Prediction |
| **Tested on** | Who it was measured on | Solo, Small team, Large company, Giant scale, or "Not tested" |
| **Who measured** | Whether the people measuring it gain from the result | Independent, Builder, Seller |
| **Results** | What happened, measured: a headline and 1 row per result | See "Results" |
| **Can you repeat it?** | Whether the method is described well enough to try | Yes, Partly, No |
| **Fits you if** | The scale and setting where the results apply | Words |
| **Checked** | When the sources were last read | A date, plus "Newer data exists" when it does |

The card answers 2 separate questions: how sure we are (the evidence grade) and what
happened (the results).

## Evidence: how strong the proof is

| Grade | Plain meaning | Example of what counts |
|---|---|---|
| **A** | Tested fairly against not using it | A randomized study: some tasks with the method, some without, picked by chance |
| **B** | Measured in real use, with numbers, by 2 or more separate groups | 2 companies each publish before-and-after numbers |
| **C** | Measured in real use, with numbers, by 1 group | 1 company's engineering post with before-and-after numbers |
| **D** | Described in practice, without numbers | A case study, talk or personal account of what happened |
| **E** | Claimed, not shown | A product announcement, a prediction or an opinion |

- The grade goes to the best evidence held, and the card links to it.
- Many D reports do not add up to a C. Numbers are what move a grade.
- A grade can drop. When newer, stronger evidence disagrees, the card changes and says
  what changed and when.
- The grade never moves because a name is famous, an effect is large or readers report
  success.

## Status: proven, frontier or prediction

- **Proven:** works in real use, measured by 2 or more separate groups, in the setting
  named on the card.
- **Frontier:** someone has done it, but too few have measured it to call it proven.
- **Prediction:** nobody has done it yet; someone expects it.

Status belongs to a method in a setting. The same idea can be proven at giant scale and
frontier for small teams.

## Tested on

- **Solo:** 1 developer.
- **Small team:** up to about 50 engineers.
- **Large company:** hundreds to thousands of engineers.
- **Giant scale:** the largest codebases in the world.
- **Not tested:** no measurement yet.

The key number is added when there is one, for example "about 10 merges a day".

## Who measured

- **Independent:** a group that neither built nor sells it.
- **Builder:** the team that built it, reporting on its own work.
- **Seller:** a company that profits if readers adopt it.

Builder and Seller results still count; the reader sees who is speaking.

## Results

**Headline:** Helped, No clear effect, Hurt or Mixed, with the 1 most important number.

**1 row per measured result:**

| Field | What it holds |
|---|---|
| **What was measured** | The measure, in 1 of 5 families: Speed, Quality, Cost, Scale, People |
| **Before, after, change** | The numbers as the source states them, with units, then the change as a percent or multiple |
| **Compared against** | A control group, the same team before, or nothing |
| **Sample** | How many people, tasks or repositories, over what period |
| **Who measured** | Independent, Builder or Seller |
| **Setting** | Scale, the tool or model version, and the date |
| **Range** | The uncertainty range, when the source gives one |

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
3. A result with no comparison says "No comparison".
4. Results that got worse are rows too. A card with a Speed row and no Quality row says
   "Quality: not measured".
5. No result and negative results are recorded the same way as wins.
6. When nobody has measured it, the card says "No measured results yet". It never
   guesses or fills in a number.
7. The evidence grade never moves because a result is large or exciting.

## Who gets a page

A method gets its own page when a notable first-hand source from a leading company or
person describes it. A measured number with a comparison is not needed for a page; the
grade card says honestly how well the method is proven, and a method that is described
but not yet measured shows Evidence D with the words "Described, not yet measured". The
source must pass all 4 page checks:

1. **First-hand:** a named company, lab or person reporting their own work.
2. **Real work:** used in production or on real tasks, or tested in a controlled study on
   real tasks. A demo or a benchmark score alone does not pass.
3. **Described:** enough detail to understand what they did and how it works.
4. **Dated and linked:** a primary source that was opened and read.

**Notable, leading source:** the source is a primary-tier source on the source list from a company or lab
on that list, or the person is on the leading-voices list.

- A famous name alone does not earn a page: the source must describe its own real work.
- A measured comparison still decides the grade, never whether a page exists.
- Independent studies count as evidence on the page of the method they measure, whether
  or not they ran in production, and negative results count.
- A company's report on its own work counts, labeled "Builder".
- The Watching list on the daily scan holds new items that are not first-hand, not yet
  described enough to understand, or known only from secondary reports: 1 line and a
  source link each, no page, no grade. Statements by leading voices that are not
  descriptions of real work, such as predictions, follow the leading-voices rules.

## New claims and First look

A new item is shown on the day it is found, labeled "First look" and marked as the
source's own claim, not yet checked. A First look item never shows a letter grade; it
carries a note in words on what kind of evidence it is, such as "1 company's own numbers".
The same status is stated plainly in the page's machine-readable data and plain-text copy.

## How a grade is computed

A grade comes from rules wherever a rule can decide, and from a model's judgment only where
it cannot. The same facts always give the same grade.

1. **Read (model, checked):** an agent pulls fixed facts from the source into a fact
   sheet: study design, whether there is a comparison, sample size, who measured, how many
   separate groups, scale, tool or model version, dates and the numbers. Every fact
   carries a pointer to the place in the source it came from. A second agent fills the
   same sheet on its own; any difference goes to the owner.
2. **Rule (code, no model):** a written rule table turns those facts into the evidence
   grade, the status, the "who measured" label and the pass or fail on the page checks.
3. **Judge (model, bounded):** only what a rule cannot decide: whether the method is
   described well enough to repeat, the headline, whether this is the same method as one
   already listed, how much it matters to readers, and whether a newer result replaces an
   older one. Each is a fixed yes-or-no or pick-1 question, asked of 2 separate judges.
   Disagreement goes to the owner.
4. **Approve (person):** the owner approves graded pages and settles disagreements.

Every grade stores its facts, the rule version and the judges' answers, so any grade can
be re-run and explained; each card offers "Why this grade". When a rule changes, every
affected grade is recomputed and the change is logged.

## How grading is checked

1. **A rule-based error catcher.** Code, not a model, rejects an agent's output when a
   number on the card does not appear in the source text, a source pointer does not hold
   the claimed fact, a link is dead or a date is impossible.
2. **A planted-error test.** Known mistakes are planted in test summaries (a changed
   number, a swapped name, a claim the source never makes), and the checker must catch
   them.
3. **Check hardest where risk is highest.** Each item gets a risk score from rules: it
   names a real person, a vendor measures its own product, the effect is very large, there
   is only 1 source, or a grade is about to drop. High-risk items get the full check and go
   to the owner.
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
visible in the method's timeline, marked "Replaced".

## Leading voices

A short list is kept of people who have provably been ahead of the field. What they say
about AI-era software engineering is included even when it is not a description of real
work, such as a prediction: their
predictions matter, and much of what they say rests on their own work. The owner
approves each name before it is added.

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
   (graded like any method), work they did themselves without numbers (grade D, labeled
   "First-hand, no numbers yet"), and predictions (labeled "Prediction by a leading
   voice", with what it is based on).
2. Every statement shows an evidence line: what evidence exists for it.
3. Being on the list earns inclusion, never a higher grade.
4. Words come only from the person's own post, paper or recorded talk. Notes taken by
   someone else are labeled as notes until the person or a recording confirms them. No
   invented or reworded quotes.

**Predictions and verdicts.** Each prediction records the date it was made, the exact
words and their source, and what would count as it coming true. It is checked later, and
an agent proposes a verdict: came true, not yet, or did not. The owner approves every
verdict. "Did not come true" needs positive evidence, never only the absence of news. A
prediction too vague to check is marked "Cannot be checked"; such cases are decided 1 by
1, and new rules are written from them. Verdicts on the site's own earlier grades are not
shown on the site to start.

## Tracking what happens next

A grade is a snapshot. A covered method's page keeps a timeline of what others do with
it, and every new event can change the card.

| Event | Plain meaning | Can change |
|---|---|---|
| **Origin** | Where the idea first appeared | Nothing; it starts the timeline |
| **Adopted** | Another team uses it as is | Tested on |
| **Confirmed** | Another group measures it and gets a similar result | Evidence, Status |
| **Extended** | Someone builds on it and adds something | Links to a new child method with its own card |
| **Changed** | Someone uses a different version and says why | Results, Tested on, sometimes a new child method |
| **Contradicted** | New evidence disagrees | Evidence, Status, Results; the card says what moved |
| **Dropped** | A team stops using it and says why | Results, Status |

Each event records who, when, what happened, its source and what it changed on the card.

- "What changed since we first covered this" sits at the top of a method page whenever the
  card has moved, in 1 or 2 lines.
- Methods link to what they built on and what built on them, so a reader can follow an idea
  from its origin to today.
- Agents watch for new papers, engineering posts and talks that cite a covered method's
  source or name the method, and propose timeline events. The owner approves any event
  that changes a grade.
- Every card change goes into the change log with its date, reason and source. Nothing is
  silently overwritten.

## Reader feedback

Every card ends with 3 invitations:

1. **"Tried this? Tell us what happened."** Reader reports are shown as reader reports
   (grade D unless they include numbers). They tell us where to look; they never raise a
   grade on their own.
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
