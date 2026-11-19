# UI/UX patterns: debrief, guided reflection and shareable result cards (Fail Forward ESP, "Bilan et réflexion" / "Ma leçon")

Note on location: plan mode was active during this research, so writing to the requested scratchpad path (`.../scratchpad/research_notes/Interfaces Fail Forward ESP/bilan_reflexion_partage.md`) was blocked. These notes are stored in this plan file instead. Copy them to that path once plan mode ends.

## Q1. How do well-known apps present end-of-session summaries (layout, hierarchy, colour, progressive reveal)?

### Takeaway
The proven patterns are: (1) a short celebratory or acknowledging header, (2) a handful of big, scannable "stat tiles" or headline facts, (3) one main call to action (continue or claim), and (4) a separate, optional share step. Spotify Wrapped shows that tap-through, story-format progressive reveal built mainly on colour and big type works for personalised recaps, but it also shows that heavy, squashed typography hurts readability. I found little official design documentation. Most evidence comes from galleries and third-party write-ups.

### Cited Findings
- **Duolingo lesson end.** Gallery captures describe a "Lesson complete!" celebration screen with a large mascot and confetti-style visuals on a bright background, then a screen of performance metrics (total XP, accuracy, speed) with a single "Claim XP" button — [ScreensDesign: Duolingo](https://screensdesign.com/apps/duolingo-language-lessons/?via=growthgems); [Lazyweb Duolingo flows](https://lazyweb.com/canvas/flows/duolingo/start-lesson). This is a description of screenshots, not official design documentation.
- Duolingo's blog covers the home-screen path redesign and the year-in-review share cards. I found no official post about the lesson-complete screen — [Duolingo blog: new home screen](https://blog.duolingo.com/new-duolingo-home-screen-design); [Duolingo 2020 year in review](https://blog.duolingo.com/duolingo-2020-year-in-review).
- **Spotify Wrapped.** The 2018 campaign was "centered around two things, color and typography", with type sized to fill the screen and motion that gives a "title sequence" feel — [Active Theory case study](https://medium.com/active-theory/spotify-wrapped-2018-technical-case-study-5b7cfb7e9d3a).
- Wrapped content is shown on "Instagram Story like cards" that the user taps through, each brought to life with motion — [Active Theory](https://medium.com/active-theory/spotify-wrapped-2018-technical-case-study-5b7cfb7e9d3a). One commentator says the format is designed to be screenshotted and shared without cropping — [DesirabilityLab](https://desirabilitylab.com/backfill/backfill-2023-192-spotify-wrapped-campaign).
- The 2022 Wrapped identity was built on monograms drawn on a 16×16 grid, with a toolkit of about 250 pages for local markets — [It's Nice That](https://itsnicethat.com/features/spotify-wrapped-campaign-identity-2022-graphic-design-301122).
- Critics said the 2021 Wrapped typography was squashed and hard to read and that the design "tried to do too much". Commentary on 2024 credits its success to simple colours and simple typography — [Creative Bloq](https://www.creativebloq.com/news/spotify-wrapped-font); [Yello](https://yello.substack.com/p/how-bad-is-spotifys-2021-wrapped); [Alex Jimenez](https://alexjimenezdesign.substack.com/p/three-design-elements-that-made-spotify).
- A third-party account says Wrapped 2025 was built in Rive, with reusable story-card components filled with personalised data — [Rive blog](https://rive.app/blog/spotify-used-rive-for-spotify-wrapped-2025).
- **Kahoot.** The game ends on a podium of the top 3 players, shown automatically in Classic mode. From that screen the host can start another game or send a feedback survey — [Kahoot support](https://support.kahoot.com/hc/en-us/articles/42321615442707); [Kahoot hosting tips](https://support.kahoot.com/hc/en-us/articles/360039900153). This is a ranking pattern, which this project explicitly excludes.
- **Strava.** "Sticker Stats" (spring 2025) lets users share activity stats as an overlay on Instagram. Third-party tools describe layouts that put a few stat cards over a photo or map — [BikeRadar](https://www.bikeradar.com/news/strava-sticker-stats-spring-2025-updates); [Stamptivity](https://stamptivity.pages.dev/blog/activity-stats-card-social-media). The claim that the map takes the top ~40% with stats below comes from an unverified third-party site — [imagetotable.ai](https://imagetotable.ai/extract/strava-activity-screenshot).

### Inferences
- **Order of the 4 blocks.** Map the debrief onto the "header → key facts → insight → CTA" order:
  - Header: "Ton bilan", with no score.
  - Block 1 "Ton parcours": a vertical timeline of decisions (numbered steps, one line per decision, a neutral icon per step).
  - Block 2 "Le tournant": a highlighted card with an accent border and a pivot icon.
  - Block 3 "Ton rebond": the failure-type badge plus a short explanation.
  - Block 4 "Ta leçon clé": the visually largest element, styled as a pull quote. This text also feeds the "Ma leçon" card.
- **Progressive reveal without a story player.** Use a light Wrapped-style reveal: blocks fade or slide in one after another on first view (≤ 300 ms each, disabled under `prefers-reduced-motion`), or a "Voir la suite" step between blocks 2 and 3. A full tap-through story player adds code weight and hides content from users who want to skim. A scrollable page with sequenced entrance animation is the better fit for the < 500 KB budget and for accessibility.
- **Avoid ranking.** Kahoot-style podiums and Duolingo-style XP and accuracy figures are performance metrics. Fail Forward forbids ranking, so replace stat tiles with descriptive facts, for example "4 décisions", "1 tournant", "Type d'échec : complexe". Do not use scores.
- **Typography lesson from Wrapped.** Big type works, but keep the lesson text in a regular-width font at ≥ 20–24 px on screen. Do not use condensed or squashed display type for running sentences.

### Gaps
- I did not retrieve official or primary design documentation for Headspace/Calm session-end screens, Google Fit, Notion/Linear year-in-review, or Duolingo's lesson-complete screen. The Mobbin and Page Flows galleries require login.
- I found no quantitative data (engagement, readability) comparing story-format reveal with a single-scroll summary.

## Q2. Patterns for reflection and journaling forms (one question per screen or all at once, counters, placeholders, autosave)

### Takeaway
GOV.UK's research-backed "one thing per page" pattern and the journaling apps' "one question at a time, short, low-friction" approach both favour asking one question at a time. With only 3 short questions under a debrief, though, a stepped mini-wizard (one card per question, with a "1/3" indicator) or a single page of 3 clearly separated cards are both defensible. The deciding factors are the end-of-session time pressure and the need to export all answers at the end.

### Cited Findings
- The GOV.UK Service Manual advises starting with "one thing per page" (one piece of information, one decision or one question) and merging pages only when user research supports it — [GOV.UK: form structure](https://www.gov.uk/service-manual/design/form-structure).
- GDS researched the pattern in depth on Register to Vote and GOV.UK Verify and recommended that teams start with it. Error validation is easier because users do not have to scroll to find errors — [GDS Design Notes: One thing per page (2015)](https://designnotes.blog.gov.uk/2015/07/03/one-thing-per-page/).
- GDS no longer recommends accordion forms because they are harder to build and harder to use than one-question-per-page forms — [GDS user research blog (2015)](https://userresearch.blog.gov.uk/2015/08/13/no-more-accordions-how-to-choose-a-form-structure/).
- In 2024 testing of GOV.UK online forms, users said one question per page was welcome and made the form easier to complete — [GDS blog 2024](https://gds.blog.gov.uk/2024/01/12/how-were-making-it-easier-to-access-government-forms-online/).
- The GOV.UK Design System "Question pages" pattern says one question per page helps users understand what is being asked, and that a progress indicator should be added only if research shows it helps — [GOV.UK Design System: Question pages](https://design-system.service.gov.uk/patterns/question-pages).
- **Journaling apps.** Products such as Reflectly and the "one question a day" apps present one question, then a follow-up prompt on the next screen. They pitch low friction ("one question, one answer, one minute"). Sequenced prompts are described as removing "blank-page syndrome" — [Appcues GoodUX: Reflectly](https://goodux.appcues.com/blog/reflectlys-easygoing-daily-journaling); [MyLifeNote guide](https://guide.mylifenote.ai/en/essentials/daily-practice-and-rituals). These are vendor or marketing sources, not independent research.

### Inferences
- **Recommended pattern for "Bilan et réflexion".** Show 3 stacked question cards on the same page as the debrief, each with:
  - a visible label phrased as an open question in "tu" form, for example "Selon toi, quelle est la cause profonde ?", "Quel a été l'impact réel ?" and "Quelle action concrète la prochaine fois ?";
  - a one-line helper hint that names the method lightly, for example "Astuce : demande-toi « pourquoi ? » plusieurs fois";
  - an example placeholder in grey, for example "Ex. : j'ai voulu aller trop vite sans vérifier…". Placeholders disappear on input and often have low contrast, so the real instruction belongs in the helper text and the example in the placeholder only. This follows the general GOV.UK hint-text approach, but I did not fetch a source for the placeholder guidance itself.
- **Wizard alternative.** If testing shows students skip the questions, switch to a stepped mini-wizard of 3 screens with "Question 1 sur 3", "Passer" and "Suivant" buttons. A wizard puts each answer at risk for longer, so autosave per keystroke is required either way.
- **Character guidance.** Use a soft counter ("~2 phrases suffisent", or "120/280" shown only after 80 % of the limit) rather than a hard minimum. Make answers optional, because mandatory reflection under time pressure produces filler. Do not use a red counter or error states for "too short".
- **Autosave.** Save to localStorage on `input` (debounced about 500 ms). Show a discreet status line, "Enregistré sur cet appareil ✓", with `aria-live="polite"`. The words "sur cet appareil" also carry the data-loss message (see Q5).
- **Textarea size and zoom.** Start textareas at 3–4 rows and let them auto-grow. Set font-size ≥ 16 px, which also prevents iOS Safari from zooming on focus. Use `enterkeyhint="next"` and `autocapitalize="sentences"`, and keep `spellcheck` on.

### Gaps
- No primary sources were retrieved for Daylio, Stoic, Day One, How We Feel, Rosebud or the Five Minute Journal. Their screen-level behaviour (counters, autosave indicators) could not be verified, so those names are not cited above.
- I found no study on the optimal number of reflection prompts or the use of character counters in learning debriefs.

## Q3. How retrospective and post-mortem tools present root cause, and how to show a "failure type" badge without judgement

### Takeaway
Google SRE's blameless postmortem structure (what happened → impact → mitigation → root/contributing causes → follow-up actions) maps almost one-to-one onto the 3 Fail Forward questions. Its core wording rule is to describe the system and the situation, not the person. Edmondson's three types (basic, complex, intelligent) should be shown as descriptive categories on a spectrum, not as grades.

### Cited Findings
- **Google SRE purpose and spirit.** A postmortem documents the incident, understands all contributing root causes, and puts "effective preventive actions" in place. It focuses on causes "without indicting any individual or team for bad or inappropriate behavior". It assumes everyone acted reasonably with the information they had, and fixes systems rather than people — [Google SRE Book, ch. 15 Postmortem Culture](https://sre.google/sre-book/postmortem-culture/).
- **SRE core content.** The core fields are the incident record (what happened), impact, mitigation and resolution, root cause(s), and follow-up actions. The review checklist asks whether the root-cause analysis was "sufficiently deep" and the action plan appropriate — [Google SRE Book](https://sre.google/sre-book/postmortem-culture/).
- SRE notes that a blame culture leads people to hide issues, and that removing blame "gives people the confidence to escalate issues without fear" — [Google SRE Book](https://sre.google/sre-book/postmortem-culture/).
- **Edmondson's typology.** Summaries of *Right Kind of Wrong* (2023) define the three types as follows:
  - Basic failures happen in known territory where the know-how exists. They usually have a single cause, often a deviation from a process, and are preventable.
  - Complex failures come from several interacting factors and are often preceded by warning signals.
  - Intelligent failures happen when exploring new territory with a thoughtful hypothesis. Edmondson calls them the "right kind of wrong".

  Sources: [Kevin Coldiron summary](https://kevincoldiron.substack.com/p/the-right-kind-of-wrong); [IMD](https://www.imd.org/ibyimd/innovation/right-kind-of-wrong-why-failure-is-a-powerful-tool-for-progress-and-innovation/); [Michigan Ross Positive Orgs](https://positiveorgs.bus.umich.edu/books/right-kind-of-wrong-the-science-of-failing-well/). These are secondary summaries, and the exact wording should be checked against the book.
- The HBR article "Strategies for Learning from Failure" (2011) notes that executives tend to believe all failure is bad, and that the managers studied "were thinking about failure the wrong way" — [HBR 2011](https://hbr.org/2011/04/strategies-for-learning-from-failure). The full typology text was behind a paywall and could not be retrieved.
- **Confirmshaming.** Guilt- or shame-based wording is catalogued as a deceptive pattern — [deceptive.design: Confirmshaming](https://deceptive.design/types/confirmshaming/).

### Inferences
- **Map to the 3 questions.** SRE "root cause" maps to Q1 "Cause racine ?". SRE "impact" maps to Q2 "Impact réel ?". SRE "follow-up actions" maps to Q3 "Prochaine action concrète ?". For credibility with management students, label the section "Inspiré des post-mortems sans reproche (Google SRE) et des 5 pourquoi".
- **Show the badge on a spectrum, not as a verdict.** Display the three types as a 3-segment horizontal scale ("basique · complexe · intelligent") with the user's type highlighted, plus a single neutral sentence. For example:
  - basique: "Une erreur évitable dans un terrain connu : une checklist aurait suffi."
  - complexe: "Plusieurs facteurs se sont combinés ; des signaux faibles existaient."
  - intelligent: "Un essai réfléchi en terrain inconnu : c'est l'échec qui fait avancer."

  The scale shows that every type is a normal category, which avoids a stamp that feels like a grade.
- **Colour.** Do not use red, amber and green for the types, because that encodes good and bad. Use one neutral accent hue at different tints, or three non-evaluative hues such as blue, violet and teal. Always pair the colour with an icon and a text label (WCAG 1.4.1, use of colour). Suggested icons: a wrench or checklist for basique, nodes or a network for complexe, a flask or compass for intelligent.
- **Wording rules from SRE.** Describe the decision and the context, not the person. Prefer "La décision X a été prise avec peu d'informations" to "Tu as mal décidé". Prefer "Ce que tu peux essayer" to "Ce que tu aurais dû faire". Do not use words like "erreur grave", "mauvais" or "raté".
- **5 Whys helper.** Under Q1, an optional "Creuser avec 5 pourquoi" expander could add up to 5 one-line inputs ("Pourquoi ? → …"). Keep it collapsed by default so the default form stays at 3 fields.

### Gaps
- The Atlassian Team Playbook "5 Whys" page could not be fetched because the content was truncated, so its exact steps and wording are not cited.
- No primary source was found for visual best practice for "failure type" badges specifically. The badge recommendations above are inferences from general accessibility and blameless principles.

## Q4. Shareable card design and client-side image/PDF generation (formats, libraries, sizes, iOS and Android quirks)

### Takeaway
For a fixed, text-only "Ma leçon" card, drawing it by hand with the Canvas 2D API adds 0 KB and is the most predictable option across low-end Android and iOS. If a DOM-to-image library is preferred, `modern-screenshot` (about 9.5 KB gzipped) or `html-to-image` (about 5.1 KB gzipped) are tiny. `html2canvas` (about 45 KB), `jspdf` (about 127 KB), `pdf-lib` (about 173 KB) and `satori` (about 659 KB) are heavy. Satori only makes sense at build time. For sharing, use `navigator.canShare({files})` and then `navigator.share`, with a download link as fallback. The blob must be generated before the tap because of Safari's user-gesture rules.

### Cited Findings: formats
- Instagram feed posts default to 1080×1350 (4:5). Stories and Reels use 1080×1920 (9:16). Some guides add 1080×1440 (3:4) for the newer grid preview — [Linearity size guide 2026](https://www.linearity.io/blog/instagram-size-guide/); [PostSyncer](https://postsyncer.com/tips/instagram-image-sizes-complete-guide).
- One source advises a 250 px safe zone at the top and bottom of Stories. Others give different safe-zone figures (for example a central area of about 1080×1420), so the figure is unconfirmed by Meta — [Stellar Digital](https://stellardigital.com.au/instagram-size-guide-2025/); [growthscribe](https://growthscribe.com/instagram-size-post/).

### Cited Findings: library bundle sizes (bundlephobia API, queried 2026-11-19)

| Library | Version | Minified | Gzipped | Source |
|---|---|---|---|---|
| html-to-image | 1.11.13 | 13.1 KB | 5.1 KB | [bundlephobia](https://bundlephobia.com/package/html-to-image) |
| modern-screenshot | 4.7.0 | 25.1 KB | 9.5 KB | [bundlephobia](https://bundlephobia.com/package/modern-screenshot) |
| dom-to-image-more | 3.11.0 | 28.2 KB | 9.9 KB | [bundlephobia](https://bundlephobia.com/package/dom-to-image-more) |
| html2canvas | 1.4.1 | 194.8 KB | 45.4 KB | [bundlephobia](https://bundlephobia.com/package/html2canvas) |
| html2canvas-pro | 2.6.4 | 213.8 KB | 65.0 KB | [bundlephobia](https://bundlephobia.com/package/html2canvas-pro) |
| @zumer/snapdom | 3.8.1 | 321.9 KB | 109.1 KB | [bundlephobia](https://bundlephobia.com/package/@zumer/snapdom) |
| jspdf | 4.2.1 | 394.3 KB | 126.7 KB | [bundlephobia](https://bundlephobia.com/package/jspdf) |
| pdf-lib | 1.17.1 | 419.0 KB | 173.3 KB | [bundlephobia](https://bundlephobia.com/package/pdf-lib) |
| satori | 0.63.2 | 1737.1 KB | 659.1 KB | [bundlephobia](https://bundlephobia.com/package/satori) |
| qrcode (for reference) | 1.5.4 | 23.0 KB | 8.6 KB | [bundlephobia](https://bundlephobia.com/package/qrcode) |

Bundlephobia measures the whole package entry point. With tree-shaking the real cost can be lower. Snapdom's figure may include optional plugins.

### Cited Findings: how the libraries work and their quirks
- `modern-screenshot` is a maintained fork of html-to-image. Its API includes `domToPng`, `domToBlob`, `domToCanvas`, `domToJpeg` and `domToWebp`. A `createContext` call with a web worker allows faster repeated captures. Known limits: it cannot clone CSS counters, and cross-origin assets fail because of CORS — [GitHub qq15725/modern-screenshot](https://github.com/qq15725/modern-screenshot).
- html-to-image and modern-screenshot render through SVG `foreignObject`. One source reports cross-browser inconsistencies with this approach, "particularly in Firefox and Safari". Web fonts must be preloaded or embedded, and external assets need CORS — [DEV: html2canvas vs dom-to-image vs html-to-image](https://dev.to/shaishav_patel_271fdcd61a/html2canvas-vs-dom-to-image-vs-html-to-image-browser-screenshot-library-comparison-4h5c); [portalzine 2025](https://portalzine.de/best-html-to-canvas-solutions-in-2025/).
- html2canvas re-implements CSS rendering on a canvas instead of using foreignObject. That makes it heavier, and modern CSS (for example `color()`/`oklch`, which Tailwind v4 uses) is a known reason the `html2canvas-pro` fork exists — [html2canvas-pro README](https://cdn.jsdelivr.net/npm/html2canvas-pro@2.5.2/README.md). The oklch detail is from my own knowledge of the README and should be verified.

### Cited Findings: Web Share API
- **Base support.** caniuse lists support in Chrome Android, Safari iOS (12.2+), Firefox Android, Samsung Internet (8.2+), desktop Chrome 128+ (partial in 89–127), Edge 95+ and desktop Safari 12.1+. Desktop Firefox is not supported. Global usage is about 94 % — [caniuse: web-share](https://caniuse.com/web-share).
- **File sharing.** Check `navigator.canShare({ files })` first, then call `navigator.share({ files, title, text })`. The share must be triggered by a user gesture, not on load. The page must be served over HTTPS. Only "certain types of audio, image, pdf, video, and text files" can be shared (Chromium keeps an allow-list). web.dev lists `canShare` support as Chrome 128, Edge 93 and Safari 14, with Firefox behind a flag — [web.dev: Web Share](https://web.dev/articles/web-share).
- MDN marks `canShare()` as "Limited availability" (not Baseline). It returns false if file sharing is unsupported or the `web-share` Permissions-Policy is not granted — [MDN canShare](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare).
- **Safari user-gesture quirk.** WebKit historically required a live user gesture for `navigator.share` rather than spec-style transient activation, and awaiting async work such as fetch first could cause `NotAllowedError` — [WebKit bug 197779](https://bugs.webkit.org/show_bug.cgi?id=197779); [WebKit bug 225559](https://bugs.webkit.org/show_bug.cgi?id=225559). Developers also reported `NotAllowedError` and "only works once per page load" on iOS 14 — [Apple Developer Forums 662629](https://developer.apple.com/forums/thread/662629); [Stack Overflow mirror](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/64648956/web-share-api-only-works-a-single-time-in-ios-safari).
- **Workaround for the same problem with the clipboard.** Pre-generating the canvas blob before the click fixed iOS clipboard writes — [Stack Overflow mirror 76797478](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/76797478/copy-canvas-content-to-clipboard-in-javascript-in-ios).

### Cited Findings: Clipboard
- **Clipboard API.** `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])` is supported for text, HTML and PNG. It requires a secure context and rejects with `NotAllowedError` if writing is not allowed. MDN marks it Baseline 2024 ("Newly available" since June 2024) — [MDN Clipboard.write](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write).
- **Safari pattern.** Passing a Promise<Blob> into `ClipboardItem` lets `write()` be called synchronously inside the gesture. This came from the fetch tool's general knowledge, not from the MDN page itself, so treat it as unverified.

### Cited Findings: printing and PDF
- **window.print in iOS standalone mode.** A long-standing Apple forum thread reports that printing does not work from a full-screen or home-screen web app, with no fix found (iOS 9 era) — [Apple Developer Forums 22911](https://developer.apple.com/forums/thread/22911). Separately, WebKit tracked missing APIs in Home Screen web apps, such as Picture-in-Picture and Wake Lock (fixed in iOS 18.4) — [WebKit bug 268643](https://bugs.webkit.org/show_bug.cgi?id=268643). I found no current confirmation of whether `window.print` works in iOS 18–26 standalone mode.

### Cited Findings: Wordle and accessibility
- **Wordle share grid.** Players invented the emoji grid by typing it out by hand on Twitter before Wardle built it in, so it shows that a plain-text, copyable artefact can go viral without any image — [Game Developer GDC 2022](https://gamedeveloper.com/gdc2022/josh-wardle-reflects-on-the-the-unconventional-road-to-wordle-s-success).
- Screen readers read every emoji square aloud, which makes the grid inaccessible. Image export with alt text (WordleBot) and text conversion (wa11y) were the fixes — [Opensource.com](https://opensource.com/article/22/1/open-source-accessibility-wordle); [MacStories WordleBot 1.1](https://www.macstories.net/ios/wordlebot-1-1-now-fully-accessible-with-native-emoji-to-image-conversion/).

### Inferences: recommended technical stack within the 500 KB budget
- **"Ma leçon" card: hand-drawn Canvas.** Draw the card with the Canvas 2D API at 1080×1350 (4:5). This suits both projection or showing on a phone in the plenary and Instagram feed. It avoids foreignObject quirks on iOS and needs no library.
  - Wait for `await document.fonts.load('700 64px "YourFont"')` and `document.fonts.ready` before drawing.
  - Wrap text manually with `measureText` and shrink the font size if the lesson exceeds N lines.
  - Self-host the font (woff2, about 20–40 KB per weight, subset to Latin plus French accents) so it works offline and avoids CORS. A system-font stack is a fallback with no font cost.
  - Content: event logo or wordmark, "Ma leçon" label, the lesson quote in large type, the failure-type chip, and the date or event name. Do not show a pseudonym or any score.
  - Optionally offer 1080×1920 (9:16) as a second format for Stories. Keep text inside a central safe area of about 1080×1420.
- **Debrief screenshot: modern-screenshot.** If a screenshot of the whole debrief is wanted, use `modern-screenshot` (about 9.5 KB gzipped), loaded with `import()` only when the button is tapped. Capture a dedicated, fixed-width (e.g. 1080 px) off-screen export layout, not the live responsive page.
- **PDF: browser print with print CSS.** Avoid jsPDF and pdf-lib in the main bundle; at about 127–173 KB gzipped they take a large share of the budget. Prefer an `@media print` stylesheet and `window.print()`. Android Chrome offers "Enregistrer au format PDF", and iOS Safari offers print, then pinch or share to PDF.
  - Because `window.print` may be unreliable in iOS standalone PWA mode, hide the "PDF" button when `matchMedia('(display-mode: standalone)')` matches on iOS, or label it "Imprimer / PDF (navigateur)" and keep image and text export as the primary paths.
  - If a real PDF file is mandatory, lazy-load jsPDF only on that click.
- **Share flow.** Generate the PNG blob when the "Ma leçon" screen mounts, or right after the user finishes the reflection, and keep it in memory. On tap:

  ```js
  const file = new File([blob], 'ma-lecon-failforward.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Ma leçon' });
  } else {
    // fallback: <a download> with URL.createObjectURL(blob)
  }
  ```

  - Treat `AbortError` (the user cancelled) as a non-error.
  - Some targets drop `text` when `files` are present, so do not rely on text accompanying the image. This is an unverified inference.
- **"Copier" path.** Make text the primary copy action through `navigator.clipboard.writeText(markdownLikeSummary)`. Format it as a Wordle-style plain-text block (a title line, 4 short sections, the 3 answers, the lesson). It can be pasted into Notes, WhatsApp or an e-mail, works everywhere, and is accessible. Image copy is secondary.
- **Image quality and memory.** Use `canvas.toBlob(cb, 'image/png')`; JPEG at 0.9 gives smaller files if photos are ever added. A 1080×1350 canvas is about 5.8 MB of RGBA memory, which is fine on low-end Android. Avoid `scale: 3` on DOM capture of a full page, which can exhaust memory on cheap devices. This is an inference, not measured.

### Gaps
- I found no authoritative 2026 per-version table for **file** sharing (Web Share Level 2) on iOS Safari or Android Chrome, beyond web.dev's canShare versions and anecdotal reports. Test on real devices: a recent iPhone (Safari and home-screen PWA) and a low-end Android device (Chrome and Samsung Internet).
- I found no measured benchmarks of html-to-image or modern-screenshot reliability on low-end Android, or of iOS font embedding in foreignObject.
- I found no confirmation of the current state of `window.print()` in iOS 18/26 standalone PWAs.

## Q5. Best-practice UX for "export before you lose it" reminders without nagging

### Takeaway
The data-loss risk is real. Safari can wipe script-writable storage, including localStorage, after 7 days without interaction, home-screen web apps have a separate policy, and private browsing discards everything. The non-nagging approach is one honest, contextual line at the moment of value (right after the debrief), an always-visible saved-state indicator, and an export button placed where the eye lands, rather than modals or guilt-based copy.

### Cited Findings
- WebKit ITP (Safari 13.1, 2020) introduced a 7-day cap on all script-writable storage (IndexedDB, localStorage, sessionStorage, service-worker registrations, and so on), triggered after 7 days of Safari use without interaction on the site — [Security Boulevard quoting WebKit](https://securityboulevard.com/2020/03/apple-turns-the-anti-ad-thumbscrews-with-safari-cookie-blocking/); [mjtsai](https://mjtsai.com/blog/2020/03/26/safari-13-1-third-party-cookie-blocking-and-7-day-script-writeable-storage/).
- A later WebKit post, "Home Screen Web Application Domain Exempt From ITP", exempts home-screen web apps — [WebKit bug 237350](https://bugs.webkit.org/show_bug.cgi?id=237350). Developers report inconsistent persistence in practice — [Apple Developer Forums 710157](https://developer.apple.com/forums/thread/710157).
- One third-party page claims `navigator.storage.persist()` is always denied on iOS. This is unverified and contradicted by a forum reply — [swoff docs](https://swoff.netlify.app/docs/concepts/ios-safari-limitations); [Apple forums 710157](https://developer.apple.com/forums/thread/710157).
- Confirmshaming, meaning guilt or shame wording used to push an action, is a recognised deceptive pattern — [deceptive.design](https://deceptive.design/types/confirmshaming/); [LogRocket](https://blog.logrocket.com/ux-design/negative-effects-confirmshaming/).

### Inferences
- **The event-day risk is session loss, not the 7-day cap.** During a 2–3 hour event, ITP's 7-day cap will not trigger. The real risks are private browsing (storage discarded when the tab closes), the user clearing tabs, switching phones, or the browser killing the tab under memory pressure.
- **Contextual notice, not a modal.** Place one short info banner directly above the export buttons. Use an info icon and a neutral tone, not a warning colour: "Tes réponses restent uniquement sur ce téléphone et peuvent disparaître à la fermeture (surtout en navigation privée). Garde une copie :". Follow it with the buttons "Copier le texte" (primary), "Enregistrer l'image" and "PDF".
- **Persistent status.** Show "Enregistré sur cet appareil" near the reflection fields (from Q2) so the local-only nature is visible without alarming the user.
- **Single gentle exit nudge.** Show a nudge only if the user taps "Nouveau parcours" without having exported. Use a bottom sheet with two equal-weight choices, "Copier d'abord" and "Continuer sans copier", and neutral wording with no "Tu vas tout perdre !". Do not use `beforeunload` dialogs: they are unreliable on mobile and feel hostile. Do not repeat the nudge once the user has exported or dismissed it.
- **Detect, don't guess.** Try a localStorage write in try/catch; Safari private mode historically threw on `setItem` in old versions and now allows it but clears storage on close. When storage is unavailable, show a stronger, still non-guilty line: "Le stockage local est désactivé : pense à copier ton bilan avant de quitter".
- **Optional persistence request.** Optionally call `navigator.storage?.persist?.()` after the first completed game. This works on Chromium and has uncertain effect on iOS. It is low cost, but never depend on it.
- **Copy-friendly export.** After copying, show a toast "Copié ✓ — colle-le dans tes notes ou envoie-le-toi par message" so users know what to do next.
- **Accessibility constraints (from the brief) on all these surfaces.**
  - Buttons ≥ 44×44 px and text ≥ 16 px.
  - Banner contrast ≥ 4.5:1 in both light and dark mode.
  - Toasts in an `aria-live="polite"` region.
  - The failure-type chip carries its meaning in text, not only colour.
  - The shared PNG is offered with a text version of the same content for screen-reader users, as the Wordle accessibility lesson shows.

### Gaps
- No NN/g article on "save/export reminders" was retrieved. The non-nagging guidance above is inferred from the confirmshaming literature and the general pattern principles cited.
- No current (2026) WebKit documentation on private-browsing localStorage lifetime or `storage.persist()` on iOS was retrieved directly.
