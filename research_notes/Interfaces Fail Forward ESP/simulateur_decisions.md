# Simulator screen UI/UX patterns: decision games, branching simulations, learning-from-failure formats (for Fail Forward ESP)

> Intended destination: `/tmp/claude-1000/-home-elhiann-Documents-codes-failforward/f4c0c2e6-1a81-4a44-b448-1d1e1c447850/scratchpad/research_notes/Interfaces Fail Forward ESP/simulateur_decisions.md`. Plan mode was active, so the notes were saved here instead.
> Research date: 2026-11-19. I checked URL liveness myself with HTTP requests that day; those checks are marked "(checked 2026-11-19)".

## Q1. Which existing projects are closest, and which still exist?

### Takeaway
The closest analogues are short, text-first branching newsgames built on Ink: the **FT "Uber Game"** (live) and the **BBC "Syrian Journey"** (live). Next come inoculation games with meters, **Bad News** and **Harmony Square** (both live), and the binary-dilemma format of **MIT Moral Machine** (live). **Reigns** is the reference for one-card-at-a-time mobile choices. The live "failure" event formats (Failure:Lab, FailCon) supply framing ideas, not UI. Several famous titles are offline or unverifiable: Spent is offline, Factitious could not be verified, and the FailCon site is unmaintained.

### Cited Findings
**FT – The Uber Game (2017). Live at https://ig.ft.com/uber-game/ (checked 2026-11-19)**
- It is a text adventure whose narrative "relies on rather restrictive multiple choices". The player only picks from a predetermined list — [OpenNews Source](https://source.opennews.org/articles/how-and-why-financial-times-made-uber-game/); [Critical Video Game Studies](https://criticalvideogamestudies.com/procedural-rhetoric-in-the-uber-game/)
- Tech stack: an Ink script run with **inkjs** inside the FT's interactive scaffold. Navigation for the whole game took **under 90 lines of JS**. **anime.js** handled transitions, and **about 700 lines of SCSS** turned the FT page into an "app-like" look. The team prototyped in Framer, referencing casual mobile games and old-school text adventures, and deliberately chose an "abstract" visual style — [OpenNews Source](https://source.opennews.org/articles/how-and-why-financial-times-made-uber-game/)
- Live page markup (inspected 2026-11-19) shows separate full-screen "screens": `screen--intro`, `screen--caveats`, `screen--story` and `screen--landscape` (a rotate-device prompt). It also has a `time-passing` interstitial (image + dashboard + earnings) and a persistent `stats-container` with `__time`, `__rides` and `__ride-goal` — [ig.ft.com/uber-game](https://ig.ft.com/uber-game/) (page source)
- The ending screen compares the player's choices with **the % of other players who chose the same**. It became one of the FT's most-read pieces of 2017, mostly by non-subscribers because it sat outside the paywall, and Next Gen Personal Finance reused it as a classroom worksheet — [Robin Kwong, Reflections one year on](https://robinkwong.com/uber-game-reflections/)
- The scenarios were built from real driver anecdotes collected by the journalist (Leslie Hook) — [OpenNews Source](https://source.opennews.org/articles/how-and-why-financial-times-made-uber-game/)

**BBC – Syrian Journey: Choose your own escape route (2015). Page live (checked 2026-11-19)**
- The player picks a character, then makes a series of route decisions that trade safety against money or self against family. "Success" means getting through all **seven scenarios**. Routes and outcomes were based on real stories gathered by BBC Arabic — [YES! Magazine](https://www.yesmagazine.org/education/2017/05/11/syrian-journey-choose-your-own-escape-route); [journalismgames.org](https://www.journalismgames.org/game.php?PID=140)
- It was criticised for "trivialising" refugees' experience. The BBC later appended survivors' real stories — [Boing Boing](https://boingboing.net/2015/04/06/the-bbc-made-a-controversial.html); [YES! Magazine](https://www.yesmagazine.org/education/2017/05/11/syrian-journey-choose-your-own-escape-route)

**Bad News (Cambridge / DROG / Gusmanson, 2018). Live at getbadnews.com; sibling Harmony Square live at harmonysquare.getbadnews.com (checked 2026-11-19)**
- Two persistent meters, **followers** and **credibility**, plus **6 badges** (impersonation, emotion, polarization, conspiracy, discredit, trolling) that act as chapter markers. One play lasts about 15 minutes, and the published study reports a "moderate" inoculation effect — [Cambridge](https://www.cam.ac.uk/research/news/fake-news-vaccine-works-pre-bunk-game-reduces-susceptibility-to-disinformation); [Bad News infosheet](https://propagandacritic.com/wp-content/uploads/2018/08/bad-news-infosheet.pdf)

**MIT Moral Machine. Live at moralmachine.net (checked 2026-11-19)**
- Each screen poses a binary dilemma with two illustrated outcomes. A session has **13 scenarios** and ends with a **summary of your choices** compared with others. It collected about 40 M decisions from 233 countries — [Moral Machine experiment (Nature 2018 PDF)](https://cdn.vanderbilt.edu/vu-my/wp-content/uploads/sites/2688/2020/01/11235711/The_Moral_Machine_experiment.pdf); [CU Boulder](https://www.colorado.edu/project/imagine-ai/moral-machine)

**Reigns (Nerial / Devolver, 2016+). reignsgame.com live (checked 2026-11-19)**
- One card at a time, answered by swiping left or right in a Tinder-like gesture. Four "pillars" are shown: church, people, army and money — [Game Developer deep dive](https://www.gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-); [PC Gamer](https://pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work)

**Harvard Business Publishing / Forio "Change Management: Power and Influence". Catalog page live at forio.com/catalog/harvard-change-management-simulation (checked 2026-11-19)**
- The loop is decide, submit, analyze. After submitting, the player returns to a Dashboard, where a "News" panel reports the impact on the organisation, targets and the player's **credibility**. A **Decision History** screen is always available. A session takes 1–3 h including debrief. Source is a 2013 how-to guide, so the current UI may differ — [Baylor how-to PDF](https://business.baylor.edu/Dawn_Carlson/ob/modules/module-6/ChgMgmt_V2_How_to_Play.pdf); [Forio](https://forio.com/store/harvard-change-management-simulation)

**inkle (80 Days, Ink). Ink is live at inklestudios.com/ink; Twine is live at twinery.org (checked 2026-11-19)**
- Jon Ingold, in his GDC 2015 talk "Adventures in Text", covered usable text lengths and choice design. He notes that players often jump to the options without reading the text before them, so writing must stay brief and must explain the choices on offer. He also says the UI "is the game" — [Emily Short, GDC talks](https://emshort.blog/2015/04/02/interactive-narrative-gdc-talks-part-1/); [Vice](https://vice.com/en/article/the-makers-of-mobile-hit-80-days-on-the-importance-of-amazing-ui-852); [Game Developer](https://www.gamedeveloper.com/design/how-to-remove-the-frustration-of-reading-in-games)

**Failure-themed live formats**
- **Failure:Lab** (Grand Rapids, 2012). A show has about 6 storytellers at about 10 minutes each, with **no lesson stated on stage**. After each story the audience gets **90 seconds** to write down or tweet their own lesson. The format was licensable for $1,500. Some speakers still slipped in lessons — [Fortune](https://fortune.com/2015/01/05/failure-michigan-success/); [MPR News](https://www.mprnews.org/story/2014/05/25/michigan-men-finding-success-in-failure-talks); [Faith & Leadership](https://faithandleadership.com/jonathan-williams-sharing-stories-failure-can-give-people-the-power-succeed). failure-lab.com returned 404 (checked 2026-11-19).
- **FailCon**, a startup conference "to learn from and prepare for failure". thefailcon.com still resolves but looks unmaintained: its content is stale and spam links have been injected (observed 2026-11-19) — [thefailcon.com](https://thefailcon.com/)

**Offline or unverified**
- **Spent** (Urban Ministries of Durham / McKinney): playspent.org showed a "Site Offline – disabled for technical reasons" page (checked 2026-11-19).
- **Factitious** (American University Game Lab): factitious.augamestudio.com and factitious-pandemic.augamestudio.com returned HTTP 403 to my request (checked 2026-11-19). This could be bot-blocking, so their status is unverified.

### Inferences
- The Uber Game is the best architectural match. It is static, Ink-driven, needs very little JS, uses full-screen "screens" with a persistent stats strip and "time passing" interstitials, and ends with a social comparison. Its stack (inkjs + CSS transitions) is easily under 500 KB and fits a Next.js static export.
- Failure:Lab's rule of "story with no moral, audience writes the lesson" maps directly onto step 4. The Outcome screen can ask the student to write or pick their own takeaway instead of showing one, which is also consistent with Kapur's "activate" mechanism (Q7).
- The HBP/Forio "News" panel is a good model for step 2. It reports consequences as an in-world news item, not as a grade.

### Gaps
- I could not access live screenshots of the HBP/Forio UIs or of Factitious. The Harvard interface description dates from 2013.
- I found no primary sources for the UIs of Choices/Episode (Pixelberry/Episode Interactive), Kahoot or Duolingo Stories. From general knowledge, which I could not verify here: Choices and Episode stack full-width rounded choice buttons at the bottom over character art, and Duolingo Stories uses inline comprehension questions with 2–3 tap options and immediate colour feedback. Treat these descriptions as unverified.
- NYT/BBC "you decide" pieces other than Syrian Journey were not researched for lack of budget.

## Q2. How do they present situation text on mobile (typography, length, chunking, illustrations, reading time)?

### Takeaway
The successful examples keep text short and conversational and put it on a dedicated full-screen view. A persistent status strip carries context, so the prose doesn't have to. Abstract, light visuals are preferred over heavy illustration.

### Cited Findings
- inkle: players skip text to reach the choices, so passages must be brief and must explain the options. The text itself should be pleasant to look at — [Emily Short](https://emshort.blog/2015/04/02/interactive-narrative-gdc-talks-part-1/); [Vice](https://vice.com/en/article/the-makers-of-mobile-hit-80-days-on-the-importance-of-amazing-ui-852)
- The Uber Game used a deliberately "abstract" visual style and an app-like full-screen layout, prototyped against casual mobile games — [OpenNews Source](https://source.opennews.org/articles/how-and-why-financial-times-made-uber-game/)
- The Uber Game splits into intro, caveats (methodology), story and "time passing" screens, and keeps a stats bar showing time, rides and goal — [ig.ft.com page source](https://ig.ft.com/uber-game/)
- In Reigns, the card's natural movement "removes any need to have a tutorial" — [AppSpy](https://www.appspy.com/features/tinder-disasterpeace-and-epic-binary-choices-why-reigns-should-be-your-next-ios-game/)

### Inferences
- An 80–120 word situation reads in about 25–40 s at typical silent-reading speeds. Splitting it into 2–3 short paragraphs, with a bold one-line "stake" at the top (e.g. « Ta startup doit lever 200 k€ en 3 semaines »), helps students who skim to the choices, as inkle observed.
- Use one emoji or a small inline SVG icon per scenario instead of illustrations to keep the page well under 500 KB. Use body text ≥ 16 px (ideally 17–18 px), line-height about 1.5 and max-width about 60ch. Avoid the Uber Game's landscape-lock; stay portrait.
- A "caveats" or context screen like the FT's can appear once per session, not per step.

### Gaps
- I found no empirical source on optimal word counts for mobile scenario text in serious games.

## Q3. How do they present 2–4 choices, confirmation before committing, and feedback after a choice?

### Takeaway
The patterns fall into three families. Swipe-binary (Reigns) gives a partial preview while dragging. A tappable list of options (Ink/Twine, Uber Game, Syrian Journey) commits immediately with no confirmation. Side-by-side illustrated dilemmas (Moral Machine) work for two options. Feedback is usually delayed into the narrative or a dashboard, and social comparison appears at the end.

### Cited Findings
- Reigns: a slow drag reveals **which** of the 4 attributes will be affected (a dot above the gauge) but **not the direction** (+/−). The ambiguity forces the player to reason it out. Card physics took considerable tuning to feel right under the thumb — [AppSpy](https://www.appspy.com/features/tinder-disasterpeace-and-epic-binary-choices-why-reigns-should-be-your-next-ios-game/); [PC Gamer](https://pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work)
- Reigns' limits: binary choices leave little nuance, and reviewers complained of repetition — [Guardian review via inkl](https://www.inkl.com/news/reigns-review-the-medieval-strategy-game-based-on-tinder)
- Moral Machine shows two outcomes per screen, and the summary of choices comes only at the end — [Nature 2018 PDF](https://cdn.vanderbilt.edu/vu-my/wp-content/uploads/sites/2688/2020/01/11235711/The_Moral_Machine_experiment.pdf)
- Telltale shows "X will remember that" notifications right after a key choice, and end-of-episode screens give the % of players who chose the same. Sean Vanaman says the notification was meant to remind players that the save file mattered between episodes, and that most players did not react to it with frustration. Critics call the prompts misleading — [GamesBeat](https://gamesbeat.com/the-illusion-of-player-choice-in-the-walking-dead/); [TechRadar](https://techradar.com/features/telltales-the-walking-dead-only-came-alive-when-i-played-it-with-friends); [Game Informer](https://www.gameinformer.com/b/features/archive/2015/02/03/why-your-choices-dont-matter-in-telltale-games.aspx)
- The Uber Game ends with a comparison of your choices against other players' — [Robin Kwong](https://robinkwong.com/uber-game-reflections/)
- In Bad News, each choice immediately moves the followers and credibility meters — [Cambridge](https://www.cam.ac.uk/research/news/fake-news-vaccine-works-pre-bunk-game-reduces-susceptibility-to-disinformation)

### Inferences
- For 3 options on step 1, use full-width stacked **cards or buttons** (min height 56–64 px, ≥ 8 px gap, label A/B/C plus a short verb-first title plus an optional one-line subtitle). Swipe doesn't scale beyond 2 options and is less accessible in a crowded amphitheatre.
- **Confirmation**: none of the reference games ask for a confirmation dialog. A lightweight alternative is two taps: the first tap selects (highlight + "Valider ce choix" button appears), the second commits. This prevents fat-finger errors without a modal. Note that a two-tap flow changes what "decision time" measures on step 3; time-to-first-tap is the cleaner metric.
- Immediate micro-feedback after commit: a 150–250 ms press state, then a cross-fade to the next step. The Uber Game's anime.js transitions can be done with plain CSS `transition`/`@keyframes`, respecting `prefers-reduced-motion`.
- Telltale-style "% of others chose this" works offline only with precomputed or seeded figures, or with event-wide sync if the app goes online after the event. The live amphitheatre context could instead show the comparison on the presenter screen.

### Gaps
- I found no published A/B data on confirm-step vs one-tap commit in educational choice UIs.

## Q4. How do they show consequences and setbacks without a punishing tone?

### Takeaway
Non-punishing consequence design relies on four things. Consequences are delivered in the voice of the world (news items, a narrator, time passing), not as a verdict on the player. Tone is playful or matter-of-fact. Status meters move instead of "wrong" stamps appearing. The cause is made clear and an immediate path forward is offered.

### Cited Findings
- Reigns: "Things generally go awry pretty quickly and you end up dying in gruesome and colorful ways." The designer credits the "weird tone" and "playfulness" for making failure part of the fun, and the core loop lets the player always swipe again and carry on — [Game Developer](https://www.gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-); [PC Gamer](https://pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work)
- HBP Change Management: impact is reported through an in-world **News** feed and dashboard (organisation, targets, credibility), not as right/wrong — [Baylor PDF](https://business.baylor.edu/Dawn_Carlson/ob/modules/module-6/ChgMgmt_V2_How_to_Play.pdf)
- The Uber Game uses a "time passing" interstitial with earnings to show cumulative consequences — [ig.ft.com page source](https://ig.ft.com/uber-game/)
- Serious-game design guidance (practitioner source) recommends:
  - make the **cause of failure obvious immediately**;
  - show how far the player got;
  - use entertaining fail sequences;
  - give "positive failure feedback" that preserves a sense of control (McGonigal 2011);
  - keep failure low-risk with a retry.

  It also cites Ravaja et al. (2006): negative game events "may elicit positive emotional responses" — [Learning Guild, Sparks 2019](https://www.learningguild.com/articles/metafocus-well-designed-failure-in-serious-games)
- Attribution: feedback that is **internal + stable + global** ("you are bad at this, always, everywhere") most strongly promotes learned helplessness. Setbacks are perceived as unstable when multiple attempts exist (Weiner via Juul) — [Oregon State Ecampus summary of Juul](https://blogs.oregonstate.edu/inspire/?p=3275)
- Juul argues that in games a failure usually signals that **the player**, not the character, is inadequate. This is exactly the attribution Fail Forward must avoid — [MIT CMS / Juul](https://cms.mit.edu/jesper-juul-the-pain-of-playing-video-games)

### Inferences
- Frame step 2 as an **external, unstable, specific** event: « Imprévu », « Rebondissement » or « Le terrain réagit » rather than « Erreur » or « Échec ». Grammatical subject = the world (« Le fournisseur annule la commande… »), never « Tu as… ». Add a one-line causal link to the chosen option (« Conséquence directe de l'option B : … ») to satisfy "cause obvious immediately" without blame.
- Visual tone: avoid red/❌. Use an amber or neutral "weather change" accent, a short shake or slide-in (≤ 300 ms, disabled under reduced motion) and an icon like ⚡ or 🌧️. Never use a score drop or fail sound.
- End step 2 with a forward-looking CTA (« Continuer » → « Voyons comment rebondir »). This mirrors Reigns' "always swipe again" loop.
- An in-world "news ticker" card (the HBP pattern) is a cheap way to deliver the setback in pure HTML/CSS.

### Gaps
- I found no controlled study comparing wording variants ("failure" vs "plot twist") in serious games. Wording advice here is inferred from attribution theory, not tested.

## Q5. How do they handle progress indication for short multi-step flows (stepper vs bar vs dots)?

### Takeaway
Games tend to show **in-world progress** (Bad News badges, Syrian Journey's 7 scenarios, Moral Machine's 13 items, the Uber Game's ride goal) rather than a generic bar. Design-system guidance treats 2–4 steps as a "short flow" where a lightweight indicator suffices.

### Cited Findings
- Visa Design System: multi-page wizards suit flows of **4+ steps** with complex fields, and simpler flows (< 4 steps) fit lighter patterns — [Visa Design System](https://design.visa.com/patterns/wizard/usage/)
- SAP Fiori step indicator: minimum 2 steps, with a "short flow" variant that stretches to full width — [SAP Fiori](https://www.sap.com/design-system/fiori-design-ios/v26-1/components/progress-indicators/step-progress-indicator/usage)
- Progress indicators implement Nielsen's "visibility of system status": steps completed, current position and steps remaining — [SSW Rules](https://www.ssw.com.au/rules-legacy/do-you-visually-indicate-the-step-where-users-are-up-to-in-the-wizard/)
- Bad News uses 6 badges as visible chapter progress. Moral Machine uses a fixed count of 13 — [Bad News infosheet](https://propagandacritic.com/wp-content/uploads/2018/08/bad-news-infosheet.pdf); [Nature PDF](https://cdn.vanderbilt.edu/vu-my/wp-content/uploads/sites/2688/2020/01/11235711/The_Moral_Machine_experiment.pdf)

### Inferences
- For exactly 4 fixed steps, a **4-segment bar with labels** works better than a continuous bar: Situation · Imprévu · Pivot · Bilan. Each segment fills on completion, and the current one is highlighted with `aria-current="step"`. It costs about 1 KB of CSS, gives exact position, and lets the "failure" step be named neutrally. Dots alone hide the meaning of each step, and a continuous bar implies a time estimate.
- Label step 2 neutrally (« Imprévu ») so the progress bar does not announce "Échec" before the student even sees it.

### Gaps
- I found no NN/g article specifically on progress indicators for 3–5-step flows, despite searching.

## Q6. How should timed decisions appear when the timer must stay invisible and non-stressful?

### Takeaway
None of the reference games silently measure decision time. The only empirical evidence found concerns children and **visible vs invisible timers under a time limit**, which is a different situation from untimed silent measurement. The safe pattern is no limit, no countdown, no hurry cue, and transparent disclosure that time is recorded.

### Cited Findings
- Hallez & Vallier (2025), 44 children aged 7–9: a visible Time-Timer **lowered anticipatory anxiety** and inattentive behaviour, with no significant performance difference. A reviewer noted the anxiety measure may reflect the instructions rather than the timer — [PMC12731990](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12731990/); [MDPI review report](https://www.mdpi.com/2254-9625/15/12/243/review_report)
- A related study with children found worse performance under a time constraint when the timer was **not visible**. This shows that hidden time *limits* can hurt — [PMC12731990 (related work cited)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12731990/)
- Evidence on adult or university-student decision making under visible countdowns was thin in the results — [MDPI](https://www.mdpi.com/2254-9625/15/12/243)

### Inferences
- Fail Forward measures time **without a limit**, so the "hidden constraint" harm above does not directly apply. The risk is perceived surveillance, not time pressure. Recommended:
  - no countdown, spinner, pulsing element or "hurry" copy on step 3;
  - start timing on first paint of the choices (e.g. `performance.now()` after `requestAnimationFrame`) and stop at first tap;
  - clip outliers (e.g. app backgrounded, using `visibilitychange`) and pause the clock when the tab is hidden;
  - disclose in the outcome or debrief screen (« Ton temps de décision : 12 s — ni bon ni mauvais, c'est un repère ») so measurement is transparent but non-evaluative. This avoids Juul's internal-stable-global attribution.
- Avoid presenting decision time as a score or rank, because Westera's finding (Q7) suggests performance metrics drive error-avoidance.

### Gaps
- I found no study on silently measured (unlimited) response time in educational games, nor on disclosure effects. This is a genuine evidence gap.

## Q7. What research evidence shows what makes failure in simulations feel safe and instructive?

### Takeaway
Productive Failure has meta-analytic support: problem-solving before instruction beats the reverse order, with a moderate-to-strong effect. Edmondson's typology legitimises "intelligent failure" in new territory. Game research warns that score-driven designs push learners to avoid errors and that the player-blaming attribution of failure breeds helplessness.

### Cited Findings
- **Sinha & Kapur (2021), *Review of Educational Research***: meta-analysis of 53 studies and 166 comparisons.
  - PS-I (problem solving → instruction) beat I-PS with **g = 0.36** [0.20, 0.51], or **g = 0.87** after correcting for publication bias.
  - The effect was larger when designs closely followed Productive Failure principles (g 0.37–0.58).
  - For 2nd–5th graders and for domain-general skills, the effect favoured I-PS.
  - Proposed mechanisms are the "4 As": activation, awareness of knowledge gaps, affect, assembly.
  - [X-MOL abstract](https://www.x-mol.com/paper/1406031499744456704); [Phys.org](https://phys.org/news/2021-09-productively-wiser.html)
- In an ETH Zurich linear algebra course, students who "productively failed" on voluntary pre-lecture problems had a 20% higher success rate. This is press-reported and observational — [Swissinfo](https://www.swissinfo.ch/eng/eth-zurich-researchers-pin-down-top-learning-strategy/46921118)
- Loibl & Rummel (2014): productive failure works by making learners aware of gaps in their understanding. Source is a secondary, partially garbled extract — [CMU ETC Press doc](https://press4.etc.cmu.edu/file/download/2130/176dd2ef-43d2-4f19-bc91-69d709132e95)
- **Edmondson, *Right Kind of Wrong* (2023)** sorts failures into three types:
  - **basic**: known territory, a single cause, preventable;
  - **complex**: multiple causes, a "perfect storm";
  - **intelligent**: new territory, in pursuit of a goal, "the results of an experiment". These are the ones to seek.

  The book won the FT Business Book of the Year 2023 — [Big Think](https://bigthink.com/?p=477067); [IMD](https://www.imd.org/ibyimd/innovation/right-kind-of-wrong-why-failure-is-a-powerful-tool-for-progress-and-innovation/); [Simon & Schuster](https://www.simonandschuster.ca/books/Right-Kind-of-Wrong/Amy-C-Edmondson/9781982195069)
- **Edmondson (HBR 2011), "Strategies for Learning from Failure"**: lays out a spectrum from blameworthy causes (deviance, inattention) to praiseworthy ones (uncertainty, thoughtful experimentation). Executives estimate only **2–5%** of failures are truly blameworthy, yet **70–90%** are treated as such — [PsychSafety summary](https://explore.psychsafety.com/n/edmondson-2011/); [HBR text PDF](https://static1.squarespace.com/static/53761774e4b0e8c9b2acd2a4/t/629fcc85185ef04c9d2549bc/1654639749195/Strategies+for+Learning+from+Failure.pdf)
- **Westera (2022)**: because most serious games reward correct performance with scores, players adopt **error-avoiding strategies** and lose the chance to learn from mistakes. Performance metrics overestimate learning early and underestimate it later. The model was validated against game data — [Open Universiteit](https://research.ou.nl/en/publications/examining-the-productiveness-of-failure-in-serious-gaming/)
- **Juul, *The Art of Failure* (MIT Press 2013)**: game failure implies the player's inadequacy, and escaping it by improving is central to enjoyment. Maynard & Herron dispute how universal this "paradox" is — [MIT CMS](https://cms.mit.edu/jesper-juul-the-pain-of-playing-video-games); [CMU ETC Press chapter](https://press.etc.cmu.edu/file/download/1046/d580d47c-d777-4982-bd49-f3fcfcc30835)

### Inferences
- Fail Forward's design is close to the PF sequence: the student acts first in step 1, meets a gap in step 2, and gets consolidation or debrief in step 4. Kapur's "affect" mechanism argues for keeping the step 2 emotional tone safe.
- Write every controlled failure as an **Edmondson "intelligent" or "complex" failure** caused by uncertainty or several factors in the scenario, never as a "basic" failure (a preventable error). This is the scenario-level guarantee that failure is "a property of the scenario, not of the person".
- **No score, no right answer**, so Westera's error-avoidance trap doesn't apply. Outcomes should differ in kind (different trajectories), not in rank.
- Step 4 can borrow Failure:Lab's ritual: ask "What would you keep from this?" (1 tap among 3 reflections, or free text) before showing any authored takeaway.

### Gaps
- I found no study directly measuring *psychological safety* inside a serious game. The "safe failure" literature found here is about design features (lives, retries), not measured safety.
- Edmondson's four criteria for intelligent failure were not retrieved verbatim from a primary source.
- A search snippet described a quasi-experiment by Gould et al. (*Journal of Applied Instructional Design*) on a geography serious game. Giving players fewer chances (lives) raised their frustration, especially for those less familiar with games. I did not retrieve the primary article or its URL, so this is unverified.
