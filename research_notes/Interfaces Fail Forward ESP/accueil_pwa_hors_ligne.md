# Accueil, installation PWA et hors-ligne — Fail Forward ESP

> Intended destination: `/tmp/claude-1000/-home-elhiann-Documents-codes-failforward/f4c0c2e6-1a81-4a44-b448-1d1e1c447850/scratchpad/research_notes/Interfaces Fail Forward ESP/accueil_pwa_hors_ligne.md`. Plan mode was active, which blocked writing there, so this copy is in the plan file.
> Research date: 2026-11-19. 16 tool calls in total. Each sourced claim links to its source. Proposed French copy and design recommendations are my own inferences and are labelled as such.

## Q1 — Nickname entry, random nickname generators and validation feedback (Kahoot, Mentimeter, Slido, Jackbox, Gartic Phone, Skribbl, Wooclap; NN/g on disabled buttons)

### Takeaway
Live-audience tools join anonymously by default and ask for one text field with no account. Kahoot's "Friendly nickname generator" (adjective + animal, about 800 combinations, up to 3 rerolls) is the best-documented model for a safe random pseudonym. NN/g says to use disabled buttons sparingly, keep them accessible, and always say why they are disabled. A disabled "Commencer" button is acceptable only with a visible reason next to it.

### Cited Findings
- Kahoot's Friendly Nickname Generator gives players a random two-word "friendly" nickname, built from an adjective and an animal (e.g. "kind tiger", "curious unicorn"). It is available in Classic mode, Team mode and student-paced challenges — [Kahoot blog](https://kahoot.com/blog/2017/11/09/generate-funny-nicknames-players-live-kahoots/)
- According to Kahoot support material, the list held 800 unique two-word combinations at the time and was due to grow. Players get **up to three tries** to spin a random nickname before joining — [Kahoot blog: tips to keep nicknames appropriate](https://kahoot.com/blog/2019/03/08/tips-keep-kahoot-nicknames-appropriate/)
- Kahoot also runs an automatic filter against a list of "universally inappropriate words". A matching name is changed automatically to a neutral word, and hosts can remove a nickname by hand — [Kahoot support: How to handle inappropriate nicknames](https://support.kahoot.com/hc/en-us/articles/115002201267)
- A GitHub project, `crazy_tiger` ("Generate harmless random nicknames"), is inspired by the Kahoot feature. It could serve as a reference for word-list structure, but I did not verify it — [awesome.ecosyste.ms entry](https://awesome.ecosyste.ms/projects/github.com%2Fjvamvas%2Fcrazy_tiger)
- **Slido**: questions and poll votes are anonymous by default unless the participant switches to their name. Quizzes are the exception and require names — [Slido community](https://community.slido.com/setting-up-a-slido-event-82/participant-privacy-set-anonymous-or-named-questions-and-poll-votes-by-default-1609)
- **Mentimeter**: "anonymous by default, identified by choice". Hosts can turn on required names, visible names or login for each session — [Mentimeter help](https://help.mentimeter.com/en/articles/10774022-choosing-participant-identity-settings-for-your-use-case)
- **Wooclap**: participation is anonymous by default. To identify respondents, the host must turn on pseudonyms or require a Wooclap login — [Wooclap docs](https://docs.wooclap.com/en/articles/674920-how-to-identify-participants)
- **Jackbox**: a 4-letter room code shows on the shared screen, and players type it at jackbox.tv in a mobile browser. **Gartic Phone**: one nickname field, no email or password. **Skribbl.io**: rooms are joined by full URL. All three come from secondary listicle sources of uneven reliability — [Mental Floss / gamebrief / dinogame listicles](https://www.gamebrief.net/blog/browser-games-to-play-with-friends-2026)
- NN/g video "Why Disabled Buttons Hurt UX (and How to Fix Them)", August 2025: disabled buttons confuse users because they look clickable but give "no response or feedback". Use them sparingly, make sure they are accessible, and explain why the button is disabled — [NN/g video](https://www.nngroup.com/videos/why-disabled-buttons-hurt-ux-and-how-to-fix-them/)
- NN/g "Button States": a Submit button may stay inactive until required fields are filled, and a disabled button gives no visual response when clicked. It should use a muted, lower-contrast style that stays legible. Use an ARIA attribute (`aria-disabled`) so the button stays tab-focusable while screen readers announce it as inactive — [NN/g Button States](https://www.nngroup.com/articles/button-states-communicate-interaction/)
- Smashing Magazine (2021) lists the usability pitfalls of disabled buttons and when disabling makes sense. A 2026 Vonage Vivid design-system article recommends "keep the button enabled. Validate on submission" — [Smashing](https://smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/); [Vivid](https://vivid.vonage.com/whats-new/why-disabled-buttons-often-lead-to-poor-ux/)

### Inferences
- The brief requires "Commencer" to stay disabled until the pseudonym is valid. The NN/g-compatible way to do that: use `aria-disabled="true"` rather than the native `disabled` attribute, so the button keeps focus and stays tappable. A tap then moves focus to the field and shows the reason, e.g. "Choisis un pseudo (3 à 20 caractères) pour commencer". Keep a persistent hint under the button that changes with state. This combines the brief's constraint with NN/g's "explain why".
- Inline live validation for the pseudonym field:
  - live counter `7/20`, shown with `aria-live="polite"` and throttled;
  - error shown on blur, or after the third character, never on the first keystroke;
  - a neutral message for the banned-word filter that does not repeat the word, e.g. "Ce pseudo n'est pas disponible, essaie-en un autre ou tire-en un au hasard". Kahoot's auto-replacement with a neutral word supports a "suggest instead" tone.
  - `autocomplete="off"`, `autocapitalize="off"`, `spellcheck="false"`, `enterkeyhint="done"`, and `font-size ≥ 16px` to avoid the iOS zoom on focus.
- French random pseudonym, adapting the Kahoot model: noun + adjective with gender agreement handled by storing the noun's gender, for example:
  - "Loutre Audacieuse", "Panda Têtu", "Hibou Curieux", "Pieuvre Zen", "Castor Intrépide", "Mouette Rêveuse";
  - a positive or "growth" theme fits the event: "Phénix Tenace", "Colibri Persévérant", "Lynx Imperturbable".
  - With about 40 nouns × 40 adjectives (1,600 combinations) and an optional 2-digit suffix, collisions among 500 students stay rare. Run the generated names through the banned-word filter too.
  - Unlike Kahoot (3 tries), let users reroll without limit. Only the scenario redraw is limited.
- The "pseudo aléatoire" button belongs inside or right next to the field (a dice icon plus the text label "Au hasard", with a ≥44 px target). It fills the field, which stays editable.

### Gaps
- No primary source found for nickname UX in Gartic Phone, Skribbl, Among Us or Jackbox (avatars, length limits, filters); official sites were not fetched. Among Us was not covered.
- No official French-language nickname word list found from any of the products. The French examples above are mine.
- Did not get the full NN/g video transcript; only the summary on the page.

## Q2 — Mode selection (segmented control vs big cards) and team play on a shared phone ("pass the phone")

### Takeaway
I found no authoritative source specific to this question within the call budget. The recommendations below rest on general principles and the Kahoot Team mode reference.

### Cited Findings
- Kahoot runs a distinct "Team mode" in which the nickname generator also works. In Kahoot this means one team name per device — [Kahoot blog](https://kahoot.com/blog/2017/11/09/generate-funny-nicknames-players-live-kahoots/)

### Inferences
- With only two options that carry different meanings ("Solo" vs "Équipe, 2–3 sur un téléphone"), two large radio cards stacked vertically, full width, each with a short subtitle, work better than a segmented control. A segmented control has no room for the explanation that Team mode means one shared phone.
- Build them as `<fieldset><legend>` with native `<input type="radio">` visually styled as cards. That gives keyboard and screen-reader support for free, and each card can be ≥ 56 px high.
- Preselect "Solo" so the CTA depends only on the pseudonym.
- For Team mode on one phone, a single team pseudonym is enough (as in Kahoot Team mode). Optionally add a "Passez le téléphone" interstitial between turns if the game takes turns: full screen, the name of whose turn it is, and a large "C'est à moi" button so the screen is not read by the wrong person. Write team copy in the plural/"vous" form ("Vous jouez à 2 ou 3 sur ce téléphone").

### Gaps
- No Mobbin or NN/g source found specifically on segmented control vs cards, or on "pass-and-play" patterns in mobile party games (e.g. Heads Up!, Psych!, Spyfall-style apps). This should be confirmed by other research or by a quick test.

## Q3 — Random scenario draw/reveal (card flip, shuffle, gacha) in pure CSS, respecting prefers-reduced-motion, with a single redraw

### Takeaway
A CSS 3D card flip (`transform: rotateY` with `backface-visibility`) under about 600 ms, wrapped in `@media (prefers-reduced-motion: no-preference)`, with a plain opacity cross-fade as the reduced-motion fallback, follows MDN guidance. The one-time redraw should be a secondary button that shows its remaining count.

### Cited Findings
- `prefers-reduced-motion: reduce` shows the user has asked the device to remove, reduce or replace motion animations. "Animations such as scaling or panning large objects can be vestibular motion triggers." — [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- MDN's example replaces a `transform: scale()` animation with an opacity-only `dissolve` animation under `@media (prefers-reduced-motion: reduce)`. It is described as "a more muted animation that is not a vestibular motion trigger" — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

### Inferences
- Suggested pattern, as one HTML+CSS component that works the same in the single-file fallback:
  1. A face-down card with a "?" and the text "Ton scénario".
  2. After the tap or on load, the card flips with `rotateY(180deg)`, 400–600 ms, `ease-out`.
  3. The face shows the scenario number and title, e.g. "Scénario 7/12 — …".
  - Under `reduce`: no rotation, `opacity` 0→1 in ≤200 ms, or nothing at all.
  - Avoid a "slot-machine" shuffle that cycles through 12 titles: it is fast, flashing, and hard to read with a screen reader.
  - A gacha-style "shine" is optional decoration and should be off under `reduce`.
- Announce the drawn scenario through an `aria-live="polite"` region, since the animation is not readable by assistive technology.
- Redraw only once: a secondary or text-style button "Tirer un autre scénario (1 restant)".
  - After use it does **not** disappear (that would shift the layout). It becomes `aria-disabled` with "Tu as déjà utilisé ton nouveau tirage".
  - The redraw must exclude the current scenario.
  - Store both the redraw flag and the drawn scenario in localStorage immediately, so a page refresh cannot be used to reroll for free and the resume feature works.
- Low-end Android: animate only `transform` and `opacity` (GPU-composited properties); add `will-change: transform` only during the animation.

### Gaps
- No specific source found on gacha/slot-machine UX or on card-flip performance on low-end Android. MDN text was truncated after 100k characters. No card-specific example in the MDN page.

## Q4 — Friendly privacy notice and psychologically safe welcome copy

### Takeaway
I found no dedicated authoritative source within the call budget. The useful evidence is indirect: anonymous by default is the norm in Slido, Mentimeter and Wooclap, and web.dev recommends action-based, jargon-free language.

### Cited Findings
- Slido, Mentimeter and Wooclap all default to anonymous participation; Mentimeter's phrasing is "anonymous by default, identified by choice" — [Mentimeter help](https://help.mentimeter.com/en/articles/10774022-choosing-participant-identity-settings-for-your-use-case); [Wooclap](https://docs.wooclap.com/en/articles/674920-how-to-identify-participants); [Slido](https://community.slido.com/setting-up-a-slido-event-82/participant-privacy-set-anonymous-or-named-questions-and-poll-votes-by-default-1609)
- For non-technical audiences, web.dev recommends avoiding jargon such as "offline" in favour of "action-based language that your audience can relate to" — [web.dev Offline UX guidelines](https://web.dev/articles/offline-ux-design-guidelines)

### Inferences
- Privacy notice: one or two short sentences right below the pseudonym field, with a lock or info icon plus text. No modal. Proposed copy:
  - « Pas de compte, rien n'est envoyé : tout reste sur ton téléphone. N'écris ni ton vrai nom ni d'info personnelle — ni dans ton pseudo, ni dans tes réponses. »
- Psychologically safe welcome copy, built on the tagline "Ici, rater fait partie du jeu":
  - use tu (or "vous" in team mode);
  - present failure as data ("Chaque échec te fait avancer");
  - no score shown on the home screen;
  - nothing implying a ranking or that the organisers can see your answers (true: localStorage only).
  - Example subtitle: « Ici, rater fait partie du jeu. Personne ne voit tes réponses. »

### Gaps
- No sources found on CNIL wording for informational notices in no-data apps, or on psychological-safety research (Edmondson) applied to UI copy. Neither was searched for, owing to the call budget.

## Q5 — PWA install UX in 2026 (Android beforeinstallprompt, iOS Add to Home Screen and iOS 26 changes, custom banner, "ready offline", offline banner, update prompts)

### Takeaway
On Android Chrome, capture `beforeinstallprompt` and show your own button (header or menu) that calls `prompt()` once. Listen for `appinstalled` and hide the button in `display-mode: standalone`. Since iOS/iPadOS 26, **every** site added to the Home Screen opens as a web app by default ("Open as Web App" toggle on), but there is still no programmatic prompt: iOS needs illustrated instructions (Share → Sur l'écran d'accueil). Show a "Prêt hors ligne" confirmation once precaching finishes. On event day, do **not** prompt for updates. Freeze the version before the event.

### Cited Findings
- **Android / Chromium**:
  - Pattern: listen for `beforeinstallprompt`, `preventDefault()`, store the event, show your own UI, then call `prompt()` and read `userChoice`.
  - "You can only call `prompt()` on the deferred event once." After a dismissal, wait for a new `beforeinstallprompt`.
  - Suggested placements: "a button in the header, an item in the navigation menu, or an item in your content feed". Example: Spotify's "Install App" button.
  - Use `appinstalled` to catch installs from any source, and `matchMedia('(display-mode: standalone)')` or the CSS `@media (display-mode: standalone)` to hide the install button once installed.
  - Source: [web.dev — Customize install](https://web.dev/articles/customize-install)
- **iOS/iPadOS 26 (Safari 26)**:
  - "By default, every website added to the Home Screen opens as a web app." Users can turn this off with the "Open as Web App" toggle.
  - Before this, a site needed the `meta` tag or the manifest `display` value.
  - Manifest icons are still used, and Service Worker offline support still applies. SVG icons are supported.
  - Source: [WebKit blog — News from WWDC25](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/)
- Secondary coverage confirms the change and the toggle in the Add to Home Screen dialog — [heise](https://heise.de/-10749652); [iDownloadBlog](https://www.idownloadblog.com/?p=1042117). One unverified source says iOS 27 (September 2026) brought no new Home Screen web app features — search result summary, not verified.
- **"Ready offline" confirmation**:
  - When the web app first loads, show whether it is ready for offline use, e.g. a brief snackbar at the bottom.
  - Examples: the Google I/O 2016 app and the Chrome Platform Status site (which adds storage information).
  - Source: [web.dev Offline UX design guidelines](https://web.dev/articles/offline-ux-design-guidelines)
- **Offline banner**:
  - Tell the user the state as soon as it changes and say what they can still do; say whether the problem is on your side or theirs.
  - Do not rely on colour alone, and do not grey everything out: users can no longer tell what works.
  - Pair icons with text. Avoid blocking network requests and full-screen loading modals.
  - Examples: Google I/O app (toast), Tailpiece (status message plus marking which sections work offline).
  - Source: [web.dev](https://web.dev/articles/offline-ux-design-guidelines)
- **Update-available prompts**:
  - A new service worker waits until all tabs are closed. You "may want to give the user a heads up" and offer reload via `messageSkipWaiting()` → `skipWaiting()`, then reload on `controlling`.
  - Use a non-blocking toast and let the user decide; "auto-save or persist transient state before triggering the reload".
  - Source: [Chrome Developers — Workbox: Handling service worker updates](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)
- **Storage on iOS**:
  - WebKit's 7-day cap applies to script-writable storage (localStorage, IndexedDB, SW registrations…) after 7 days of Safari use with no interaction with the site.
  - Home Screen web apps "are not part of Safari" and have their own days-of-use counter, so the timer matches actual app use.
  - Source: [The Register 2020, quoting WebKit's clarification](https://www.theregister.com/2020/03/26/apple_relax_were_not_totally/); [WebKit bug 237350](https://bugs.webkit.org/show_bug.cgi?id=237350)
  - Not confirmed: whether the Cache API is covered, and whether the 2020 policy still applies in 2026.

### Inferences
- **Direct risk for the "preload 1–2 weeks before" scenario**: an iOS student who only *visits* the site in Safari, without adding it to the Home Screen and without returning, could lose the localStorage data and possibly the service worker after 7 days of Safari use. Mitigations:
  - (a) push Home Screen installation hard for iOS users;
  - (b) send a reminder "rouvre l'app la veille" (via the event's communication channels);
  - (c) keep the .html fallback as plan B.
  - Verify against the current WebKit storage-policy documentation.
- **Install UX for Fail Forward**:
  - A dedicated block "Prépare ton téléphone" on the home screen, shown only in `display-mode: browser`.
  - Android: an "Installer l'app" button wired to `beforeinstallprompt`.
  - iOS (detect `navigator.standalone === false` + iOS UA): 3 illustrated steps:
    1. Touche le bouton Partager ⬆︎
    2. « Sur l'écran d'accueil »
    3. Laisse « Ouvrir comme app web » activé, puis « Ajouter »
  - Hide the block after `appinstalled` or in standalone mode.
- **Ready-offline indicator**: when the SW has finished precaching (`navigator.serviceWorker.ready` plus a message from the SW), show a persistent badge or pill in the header ("✓ Prête hors ligne", text plus icon) instead of a snackbar that disappears. A badge reassures students who check again on event day. Don't use the word "offline"; e.g. « Prête à jouer, même sans réseau ».
- **Offline banner in the amphitheatre**: because the app is 100 % local, *no* alarming offline banner is needed. At most, show a discreet info line « Pas de réseau ? Pas de souci, tout fonctionne. » Avoid red/error colours.
- **Updates on event day**:
  - Freeze the version (deploy at least 48 h before, then no deploys).
  - No reload prompt during a run: either never call `skipWaiting` automatically, or delay the toast to the home screen only, when no run is in progress.
  - The resume state (localStorage) must survive any update.
- Lighthouse 12+ removed the PWA category (Chrome's installability criteria were relaxed in 2024). Check this against Chrome docs if it matters — not verified in this session.

### Gaps
- No primary sources found for the named examples Squoosh, Starbucks PWA, Twitter Lite, Wordle and Excalidraw (the web.dev page cites only Spotify). Starbucks/Twitter Lite figures (e.g. "2× daily users") were not verified, so they are not reported.
- Not verified: the current state of the 2026 install heuristics (engagement criteria, Chrome's relaxed manifest requirements), or the WebKit 2023+ storage-policy updates.
- No source on iOS 26 detection of "Open as Web App" being turned off by the user.

## Q6 — Resume-run UX ("Reprendre votre parcours ?") and local history

### Takeaway
I found no specific source within the budget. The only relevant guidance is web.dev's advice on saving state, keeping saved content in an index, and not blocking the UI, plus Workbox's advice to persist state before any reload.

### Cited Findings
- Offer an "offline library or content index" so users see what is stored. Show a distinct "saved" state — [web.dev Offline UX](https://web.dev/articles/offline-ux-design-guidelines)
- "auto-save or persist transient state before triggering the reload" — [Chrome Workbox](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)

### Inferences
- When a run in progress is found in localStorage, the home screen shows a **priority card** above the form, not a modal:
  - « Reprendre ton parcours ? — Scénario 7 · étape 3/6 · pseudo Loutre Audacieuse · il y a 12 min »
  - Primary button « Reprendre »; secondary text link « Abandonner et recommencer », which asks for confirmation (a 2nd tap or a short dialog).
  - Do not auto-resume without asking: with a shared team phone, the next person may not be the same.
- Save after every step (`localStorage.setItem` on each choice), with a schema version (`ffesp:v1:run`) so a future update can migrate the data or ignore it cleanly.
- Local history:
  - a « Mes parcours » list, newest first;
  - each item shows date/time, pseudonym, Solo/Équipe mode, scenario title, and number of steps / "rebounds";
  - no global score or ranking (psychological safety).
  - « Effacer mon historique » with confirmation; mention "stocké uniquement sur ce téléphone".
- « Nouveau parcours »: prefill the last pseudonym in the field (editable) and offer « pseudo aléatoire »; reset the redraw flag for the new run.

### Gaps
- No specific source (Mobbin, NN/g) found on "resume session" or local history patterns in casual games or quiz apps.

## Q7 — Next.js static export + service worker (Serwist, next-pwa, manual SW) and single-file HTML build

### Takeaway
Serwist (successor to next-pwa) is the main option. Its recent docs describe an external build step after Next.js prerendering that precaches the prerendered routes automatically, which fits `output: "export"`. A community skill still recommends a manual SW for static export. For the single file, vite-plugin-singlefile inlines JS and CSS but not files in `public/`. Fonts must be base64-encoded in the CSS or, better, replaced with system fonts to stay under 500 KB.

### Cited Findings
- Serwist now offers an external build step: "the service worker is then built after Next.js has prerendered everything, allowing Serwist to automatically precache all prerendered routes". The classic setup with `withSerwist({ swSrc: "app/sw.ts", swDest: "public/sw.js" })` is still documented. A Turbopack package exists (`@serwist/turbopack`, `esbuild-wasm`) — [Serwist docs: config](https://serwist.pages.dev/docs/next/config); [Serwist: Turbopack](https://serwist.pages.dev/docs/next/turbo)
- Serwist presents itself as the next-pwa successor; v9 was released in March 2024 — [Serwist v9 blog](https://serwist.pages.dev/blog/2024/03/10/serwist-v9); [JavaScript in Plain English](https://javascript.plainenglish.io/building-a-progressive-web-app-pwa-in-next-js-with-serwist-next-pwa-successor-94e05cb418d7)
- A community Next.js PWA skill recommends a **manual SW** for static export (`output: "export"`). This is not official guidance — [skills.sh nextjs-pwa](https://www.skills.sh/jakerains/agentskills/nextjs-pwa)
- LogRocket (January 2026): "Build a Next.js 16 PWA with true offline support" — [LogRocket](https://blog.logrocket.com/nextjs-16-pwa-offline-support/)
- vite-plugin-singlefile "inline[s] all JavaScript and CSS resources directly into the final dist/index.html". Files in `public` (e.g. favicon) are **not** inlined — [vite-plugin-singlefile README](https://www.github.com/richardtallent/vite-plugin-singlefile)
- Embedding fonts in CSS as `url(data:application/font-woff2;base64,...)` lets the browser load them without network — [shkspr.mobi](https://shkspr.mobi/blog/2021/08/you-dont-need-external-assets-in-an-html-file/). `vite-plugin-webfont-dl` has an `embedFonts` option that inlines base64 fonts, targeting Google Fonts — [vite-plugin-webfont-dl README](https://cdn.jsdelivr.net/npm/vite-plugin-webfont-dl@3.12.0/readme.md)

### Inferences
- UI impact:
  - use a **system font stack** (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) for both the PWA and the single file: no font download, guaranteed accents, 0 KB;
  - if a display font is required for the title, subset it to Latin-1 + French accents, WOFF2, base64 inline, a few tens of KB;
  - put icons in inline SVG;
  - the 12 scenarios as inlined JSON.
- The single-file fallback has no service worker (`file://` or a WhatsApp attachment), so hide every install and offline UI there. Detect the context with `location.protocol === 'file:'` or the absence of `navigator.serviceWorker`. localStorage on `file://` is unreliable depending on the browser, so warn that history might not be kept.
- The manifest needs `display: standalone`, `lang: "fr"`, `start_url: "./"`, and 192/512 + maskable icons; `theme_color` and `background_color` match the splash screen.

### Gaps
- Not confirmed: whether Serwist's external build step officially supports `output: "export"`, the exact current Serwist version in November 2026, or the official status of `next-pwa` (archived? unmaintained?). I did not search these.
- Not verified: whether vite-plugin-singlefile inlines fonts referenced from imported CSS (assets under `assetsInlineLimit`) — check after a build by searching for `url(data:`.
- Not verified: localStorage behaviour on `file://` in Chrome Android / iOS Files.
