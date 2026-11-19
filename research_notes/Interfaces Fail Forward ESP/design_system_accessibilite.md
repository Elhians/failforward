# Design system & accessibilité — Fail Forward ESP (mobile, Tailwind v4, PWA hors-ligne)

> Notes de recherche (19 nov. 2026). Les mesures marquées « [mesuré] » ont été faites par le chercheur lui-même (curl sur jsDelivr/unpkg, contrastes calculés en Python avec les formules WCAG 2.x et APCA 0.0.98G à partir des valeurs OKLCH par défaut de Tailwind v4). Elles sont reproductibles mais ne proviennent pas d'une page publiée.

## Couleur : palette « échec sans danger », codage de l'étape d'échec, types d'échec, contraste, mode sombre, conditions d'éclairage

### Takeaway
Utiliser une base neutre chaude (stone) avec un primaire « croissance » sarcelle/vert (teal-700) et coder l'étape d'échec maîtrisé en ambre/orange (amber-700 pour le texte, amber-300/400 pour les fonds), jamais en rouge. Les trois types d'échec se distinguent par la couleur ET une icône et un libellé : basique = ambre, complexe = bleu ciel, intelligent = violet. Ce trio reste distinct pour les daltonismes rouge-vert. Viser AA WCAG 2.2 (4,5:1) partout, et APCA Lc ≥ 75 (idéalement 90) pour le texte courant, car l'amphi éclairé par le vidéoprojecteur et le plein soleil font chuter le contraste perçu.

### Cited Findings
- Duolingo fait de « Feather Green » #58CC02 sa couleur de marque (« lean in to green »). Couleurs secondaires citées : Eel #4B4B4B (texte), Macaw #1CB0F6 (bleu), streak orange #FF9600. Le guide officiel redirige désormais vers blog.duolingo.com/hub/design, les hexadécimaux viennent donc d'agrégateurs — [brandpalettes](https://brandpalettes.com/duolingo-colors/), [madegooddesigns](https://madegooddesigns.com/duolingo-brand-guidelines/), [open-design.ai](https://open-design.ai/systems/duolingo/). Un agrégateur prête à Duolingo un rouge #FF4B4B, non vérifié sur le site officiel — [ihatecolors](https://ihatecolors.pages.dev/palette/duolingo-green).
- Tailwind v4 définit toutes ses couleurs par défaut en OKLCH dans l'espace de noms `--color-*`, avec 11 crans de 50 à 950. Exemples : `amber-500 = oklch(76.9% 0.188 70.08)`, `emerald-600 = oklch(59.6% 0.145 163.225)`, `stone-900 = oklch(21.6% 0.006 56.043)`, `stone-950 = oklch(14.7% 0.004 49.25)`. Stone est un neutre chaud (teinte ≈ 56), slate un neutre froid (≈ 265) — [Tailwind Colors](https://tailwindcss.com/docs/colors)
- Personnalisation Tailwind v4 : `@theme { --color-x: … }` crée les utilitaires (`bg-x`, `text-x`). `--color-*: initial` vide la palette par défaut. `@theme inline { --color-canvas: var(--app-canvas); }` relie le thème à des variables redéfinies sous `[data-theme="dark"]`. `light-dark()` et `--alpha()` sont disponibles. Le variant `dark:` s'applique en mode sombre — [Tailwind Colors](https://tailwindcss.com/docs/colors)
- WCAG 2.2, SC 2.5.8 (AA) : cible ≥ 24×24 px CSS, avec une exception d'espacement (cercle de 24 px). SC 2.5.5 (AAA) : seuil de 44×44 px, à viser pour les contrôles importants — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- APCA : Lc 90 préféré pour le texte courant, Lc 75 minimum pour des colonnes de texte (≈ 18 px en graisse normale). Les tables taille × graisse divergent entre sources tierces (16 px regular = Lc 75 selon l'une, Lc 70 pour 18 px selon une autre). Seule la table officielle APCA-W3 fait foi, et APCA n'est pas une norme exigible (WCAG 3 reste un brouillon) — [Myndex WhyAPCA](https://www.github.com/Myndex/SAPC-APCA/blob/master/documentation/WhyAPCA.md), [ARC bronze](https://a11yreadtech.github.io/ARC/tests/bronze-simple-mode), [apca-w3](https://github.com/Myndex/apca-w3), [appcrib](https://appcrib.pages.dev/ratia/)
- Material (M2) Dark theme : surface de base #121212, pas de noir pur. L'élévation s'exprime par des surfaces plus claires (calque blanc semi-transparent : 1dp ≈ 5 %, 4dp ≈ 9 %), les ombres restant sombres. En sombre, utiliser les tons 200 (désaturés) du primaire, qui passent 4,5:1 à toutes les élévations. Surface « de marque » : 8 % de primaire sur #121212 — [Material dark theme](https://m2.material.io/design/color/dark-theme), [Google Design](https://design.google/library/material-design-dark-theme)
- Contrastes calculés pour des tokens candidats (hex = tokens Tailwind v4) [mesuré] :
  - stone-900 #1c1917 sur stone-50 #fafaf9 → 16,7:1 / Lc 101
  - stone-600 #57534d sur stone-50 → 7,3:1 / Lc 84 (texte secondaire OK AAA)
  - amber-700 #bb4d00 sur blanc → 5,03:1 / Lc 74 (AA texte ; limite APCA corps)
  - amber-600 #e17100 sur blanc → 3,20:1 / Lc 58 (**échoue AA texte** : réserver aux éléments non textuels ≥ 3:1)
  - teal-700 #00786f sur blanc → 5,36:1 / Lc 76 ; blanc sur teal-700 (bouton) → 5,36:1 / Lc −81,5
  - blanc sur amber-700 (bouton) → 5,03:1 / Lc −79
  - sky-700 #0069a8 sur blanc → 5,86:1 / Lc 79 ; violet-700 #7008e7 sur blanc → 7,30:1 / Lc 83
  - stone-950 sur amber-400 #ffb900 (badge plein) → 11,5:1 / Lc 73
  - Sombre : texte oklch(93% .01 80) #ebe7e1 sur fond oklch(18% .012 60) #16100c → 15,3:1 / Lc −92. Sur surface oklch(23% .012 60) #211c17 → 13,7:1 / Lc −91
  - Accents sombres sur #16100c : amber-300 #ffd230 13,0:1 / Lc −82 ; teal-300 #46ecd5 12,8:1 / Lc −81 ; sky-300 #74d4ff 11,3:1 / Lc −73 ; violet-300 #c4b4ff 10,2:1 / Lc −67 (OK WCAG, faible en APCA pour du texte courant : réserver aux badges ≥ 16 px gras)
- WCAG 1.4.1 (Use of Color) interdit que la couleur soit le seul moyen de transmettre une information. 1.4.11 exige 3:1 pour les composants d'interface et les éléments graphiques — [W3C Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [W3C Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

### Inferences
- **Pas de rouge pour l'échec.** Le rouge (red-600 #e7000b) code « erreur/danger » dans toutes les conventions d'interface. L'ambre/orange dit « détour, attention, apprentissage », ce qui colle au message « Ici, rater fait partie du jeu ». Le rouge reste réservé aux vraies erreurs système (formulaire invalide, hors-ligne), qui devraient d'ailleurs être rares.
- **Palette proposée (tokens sémantiques, clair / sombre)** :
  - `--bg` stone-50 / oklch(18% .012 60) ; `--surface` blanc / oklch(23% .012 60) ; `--text` stone-900 / oklch(93% .01 80) ; `--text-muted` stone-600 / stone-400.
  - `--primary` (progression, CTA) teal-700 / teal-300 (texte foncé stone-950 sur teal-300 en sombre : 11,8:1).
  - `--setback` (étape 2 « échec maîtrisé ») amber-700 en texte ou bordure, fond amber-50/100 en clair ; amber-300 / fond amber-950 en sombre.
  - `--pivot` (étape 3) sky-700 / sky-300 ; `--outcome` (étape 4) teal ou emerald.
  - Types d'échec : **basique** = ambre + icône « caillou/chemin » ; **complexe** = bleu ciel (sky) + icône « nœud/engrenages » ; **intelligent** = violet + icône « ampoule/fiole ». Ambre, bleu et violet se séparent sur l'axe bleu-jaune, que préservent la deutéranopie et la protanopie. Toujours doubler la couleur d'un libellé texte (1.4.1).
- **Amphi sous projecteur / soleil** : la lumière ambiante écrase le contraste et les écrans bas de gamme ont une luminosité max faible. Viser ≥ 7:1 (AAA) pour le texte courant, ce que permettent stone-900/stone-50 et le texte sombre proposé. Éviter le gris clair sur blanc (pas de stone-400 en texte en mode clair) et les aplats ambre-500/600 porteurs de texte blanc. Offrir le mode sombre via `prefers-color-scheme` et un bouton manuel : en salle sombre, un écran blanc ébloui et gêne les voisins.
- **Dark mode** : fond quasi noir légèrement chaud (pas #000, qui crée du « smearing » sur OLED et un contraste excessif), accents en tons 200–300 désaturés, élévation par surfaces plus claires plutôt que par ombres (transposition des règles Material).
- Implémentation Tailwind v4 : déclarer les tokens bruts dans `:root` et `[data-theme=dark]` (ou `@media (prefers-color-scheme: dark)`), puis les exposer via `@theme inline`. On peut vider la palette par défaut (`--color-*: initial`) pour réduire le CSS et forcer l'usage des tokens sémantiques.

### Gaps
- Pas pu lire la page couleur officielle de Duolingo (redirection), ni les design systems de Khan Academy (Wonder Blocks), Brilliant, Headspace, Kahoot et Notion : aucune donnée sourcée sur leur codage de l'erreur. Que Duolingo utilise le rouge pour « incorrect » est connu mais non vérifié ici.
- Aucune étude trouvée sur la lisibilité des smartphones sous vidéoprojecteur en amphi : les recommandations d'éclairage sont des inférences.
- Les valeurs de contraste sont calculées, non issues d'un outil officiel. À revérifier avec apcacontrast.com et un vérificateur WCAG avant de figer les tokens.

## Typographie : police système ou variable auto-hébergée, poids, lisibilité, mise en page, règles typographiques françaises

### Takeaway
Auto-héberger **une seule** police latine en woff2 avec font-display: swap reste peu coûteux (12–48 KB). Le meilleur rapport lisibilité/poids pour ce public est Atkinson Hyperlegible Next : environ 34 KB en variable 200–800 ou environ 25 KB pour deux graisses statiques. Une pile système est l'option « zéro octet » acceptable. Attention : aucun sous-ensemble « latin » Fontsource testé ne contient l'espace fine insécable U+202F.

### Cited Findings
- Tailles woff2 des sous-ensembles Fontsource « latin » (jsDelivr, nov. 2026) [mesuré] :

  | Police | Variable (axe wght, plage) | Statique 400 | Statique 700 |
  |---|---|---|---|
  | Atkinson Hyperlegible Next | 34,0 KB (200–800) | 12,1 KB | 12,7 KB |
  | Inter | 48,3 KB (100–900) | 23,7 KB | — |
  | Lexend | 39,7 KB (100–900) | 14,5 KB | — |
  | Nunito | 39,1 KB (200–1000) | 16,3 KB | — |
  | Outfit | 32,3 KB (100–900) | — | — |
  | Plus Jakarta Sans | 27,3 KB (200–800) | — | — |
  | Fraunces (titres, serif) | 36,6 KB | — | — |
  | latin-ext Atkinson Next (non nécessaire pour le français) | 19,1 KB | — | — |

- Couverture des glyphes français dans ces sous-ensembles latin [mesuré avec fontTools] : É, à, Ç, û, œ/Œ, « », ’, …, € et l'espace insécable U+00A0 sont présents dans les six polices. **U+202F (espace fine insécable) manque dans tous**, y compris latin-ext d'Atkinson et d'Inter. Le navigateur prend alors ce glyphe dans une police de secours système.
- Fontsource propose le paquet `@fontsource-variable/atkinson-hyperlegible-next` (wght 200–800). Fichier latin : `latin-wght-normal.woff2` — [Fontsource install](https://fontsource.org/fonts/atkinson-hyperlegible-next/install), [Fontsource CDN](https://fontsource.org/fonts/atkinson-hyperlegible-next/cdn)
- Atkinson Hyperlegible Next a été publiée par le Braille Institute le 10 févr. 2025 : plus de 150 langues (contre 27), 7 graisses (contre 2), versions variable et mono. Elle est gratuite (Google Fonts) et conçue pour maximiser la distinction des caractères pour les lecteurs malvoyants. Aucune étude évaluée par les pairs propre à « Next » n'a été trouvée : les gains revendiqués viennent de l'éditeur — [Wikipedia](https://en.wikipedia.org/wiki/Atkinson_Hyperlegible), [Ophthalmology Management](https://ophthalmologymanagement.com/news/2025/applied-design-and-braille-institute-partner-to-launch-typeface-for-making-reading-easier/), [All About Vision](https://www.allaboutvision.com/low-vision/atkinson-hyperlegible-typeface/)
- Règles françaises : une espace fine insécable (U+202F) précède « ; ! ? ». Devant « : » et à l'intérieur des guillemets « », on met une espace insécable (U+00A0 en usage courant ; l'Imprimerie nationale prévoit une espace mot insécable devant « : »). Repli admis : U+00A0 si U+202F n'est pas disponible dans la police. Le Québec (OQLF) ne met pas d'espace devant ; ! ?, la Suisse met une fine aussi devant « : » — [La langue française](https://www.lalanguefrancaise.com/articles/espace-insecable), [OQLF](https://vitrinelinguistique.oqlf.gouv.qc.ca/22039/la-typographie/espacement/espacement-avant-et-apres-les-signes-de-ponctuation-et-les-symboles), [OpenOffice wiki](https://wiki.openoffice.org/wiki/Non_Breaking_Spaces_Before_Punctuation_In_French_(espaces_insécables))

### Inferences
- **Recommandation** : Atkinson Hyperlegible Next en deux graisses statiques, 400 et 700 (≈ 25 KB au total), auto-hébergées et précachées par le service worker. Elle distingue nettement Il1 / O0, utile pour les codes et le jargon technique d'une école polytechnique. Alternative plus « chaleureuse » : Nunito (arrondie, ton Duolingo-like) à 16 KB par graisse. Inter (48 KB en variable) est la plus lourde pour un gain faible ici.
- Préférer **deux statiques plutôt qu'un variable** si l'on n'utilise que 2 graisses : 25 KB contre 34 KB, et rendu plus rapide sur les vieux GPU.
- Pile de secours : `font-family: "Atkinson Hyperlegible Next", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif;`. Ajouter `size-adjust` / `ascent-override` sur un @font-face de secours pour limiter le CLS au swap. `font-display: swap`, ou `optional` si la police est précachée.
- **Espaces insécables** : générer le texte avec U+00A0 devant « : ; ! ? » et dans « », plutôt que U+202F, car aucune police testée ne contient U+202F. Le glyphe de secours viendrait de Roboto ou de la police système, ce qui fonctionne mais avec une chasse incertaine. On peut aussi sous-ensembler soi-même la police complète avec pyftsubset, en vérifiant d'abord que la source contient U+202F. Faire la transformation au build, dans le contenu JSON/MDX, plutôt qu'à l'exécution.
- Texte courant ≥ 16 px (idéalement 17–18 px pour des passages de 80–120 mots), interligne 1,5–1,6, mesure ≈ 35–45 caractères par ligne sur un mobile de 360 px de large (max-width ≈ 65ch sur grand écran). Titres 1,25–1,5 rem en 700. Éviter le texte justifié (pas de césure fiable en français sans `hyphens: auto` + `lang="fr"`). Si l'on justifie, mettre `lang="fr"` sur `<html>`.

### Gaps
- Pas de source primaire consultée (WCAG 1.4.8, Baymard, NN/g) pour les chiffres de longueur de ligne et d'interligne : valeurs issues de la pratique typographique courante, à présenter comme telles.
- Je n'ai pas vérifié si le fichier source complet d'Atkinson Hyperlegible Next (Google Fonts, non sous-ensemblé) contient U+202F.

## Mouvement & micro-interactions : transitions CSS, retour « revers », haptique, reduced-motion, View Transitions

### Takeaway
Faire tout le mouvement en CSS, en n'animant que `transform` et `opacity`, en 150–250 ms : on tient le budget de 300 ms par étape. Les View Transitions same-document sont Baseline depuis oct. 2025 et s'utilisent en amélioration progressive. Le retour « revers » doit être doux (léger tilt/nudge + fondu ambre) plutôt qu'un shake agressif. L'haptique `navigator.vibrate` est Android seulement : iOS Safari ne l'implémente pas.

### Cited Findings
- View Transitions same-document : Chrome/Edge 111+, Safari et iOS Safari 18.0+, Firefox 144+, Samsung Internet 23+. Usage mondial ≈ 93 %. Baseline « newly available » depuis la sortie de Firefox 144 (oct. 2025). Les cross-document sont encore partielles dans Firefox, et les groupes imbriqués/transitions scopées ne sont pas supportés partout — [caniuse view-transitions](https://caniuse.com/view-transitions), [web.dev Baseline](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available?hl=en), [Chrome blog 2025](https://developer.chrome.com/blog/view-transitions-in-2025), [caniuse cross-document](https://caniuse.com/cross-document-view-transitions)
- `navigator.vibrate` : non supporté dans Safari iOS. Selon une source, la fonction existe mais renvoie false sans vibrer. Contournement documenté : un `<input type="checkbox" switch>` caché (Safari 17.4+), dont le basculement déclenche l'haptique système (bibliothèque web-haptics). Il s'agit d'un effet de bord, pas d'une API. Un signalement isolé (issue MDN BCD) affirme un support iOS, non confirmé — [web-haptics browser support](https://www.mintlify.com/lochie/web-haptics/advanced/browser-support), [bugnet](https://bugnet.io/blog/fix-web-game-vibrate-api-not-available-ios-safari), [MDN BCD issue #29166](https://github.com/mdn/browser-compat-data/issues/29166)
- `prefers-reduced-motion: reduce` signale le souhait de retirer tout mouvement non essentiel. Pour les personnes atteintes de troubles vestibulaires, réduire l'animation est une « medical necessity » (nausées, vertiges, migraines). Retirer le parallaxe et les animations décoratives ; le mouvement de feedback utile peut rester. Pattern : animations sous `@media (prefers-reduced-motion: no-preference)` — [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- WCAG 2.3.3 Animation from Interactions (AAA) : le mouvement déclenché par une interaction doit pouvoir être désactivé, sauf s'il est essentiel — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

### Inferences
- **Changement d'étape** : `document.startViewTransition?.(() => setStep(n))` avec un repli instantané si l'API est absente. Côté CSS : `::view-transition-old/new(root)` en fondu + translation de 16–24 px, 200 ms, `cubic-bezier(.2,.8,.2,1)`. Sous reduced-motion, fondu simple de 100 ms ou rien. Avec un export statique Next.js, c'est la même page (SPA), donc les transitions same-document suffisent.
- **Sélection d'un choix** : bordure 2 px + fond teinté + coche, transition `background-color, border-color` de 150 ms, avec un `scale(.98)` au `:active`.
- **Retour « revers » (étape 2)** : éviter le shake horizontal, qui code « faux/refusé » (pattern mot de passe erroné) et peut gêner. Préférer une petite rotation (-1,5°) ou un nudge vertical, 1 seule fois en 300 ms, et un fondu de la carte vers le ton ambre. Ajouter une icône « virage » et un micro-texte bienveillant (« Pas de panique, c'est ici qu'on apprend »). Désactivé sous reduced-motion, la couleur et le texte portent seuls le message.
- **Card flip** (« Ma leçon », debrief) : `transform: rotateY(180deg)` + `backface-visibility: hidden` + `perspective`. Sous reduced-motion, remplacer par un fondu croisé.
- **Haptique** : `navigator.vibrate?.(15)` sur Android uniquement, toujours derrière une détection de fonctionnalité et un réglage « vibrations » désactivable. Ne pas dépendre du hack iOS (fragile, non standard). En amphi, vibrations courtes ou désactivées par défaut.
- Durées : 150–250 ms pour les micro-interactions, 200–300 ms pour les changements d'écran (respecte l'exigence < 300 ms).

### Gaps
- Le support exact de la haptique iOS en 2026 reste contradictoire (un signalement unique non confirmé).
- Les versions caniuse « Chrome Android 157 / Firefox Android 160 » correspondent à la seule version mobile courante affichée par caniuse, pas à la première version supportée.

## Composants : stepper 4 étapes, cartes-choix, boutons, CTA collant, safe areas, 100dvh, badges, textarea, toasts

### Takeaway
Utiliser un stepper segmenté en 4 barres avec libellé texte (« Étape 2 sur 4 — Le revers ») et annoncer le changement d'étape en déplaçant le focus sur le titre de l'étape. Les choix sont des `<input type="radio">` natifs stylés en cartes de ≥ 44 px. Le CTA principal est collant en bas, avec `env(safe-area-inset-bottom)` et `100dvh` (repli `100vh`).

### Cited Findings
- Pattern radio APG : conteneur `role="radiogroup"` nommé (aria-labelledby). Tab entre et sort du groupe en ciblant l'option cochée ou la première. Les flèches déplacent le focus ET cochent, en boucle ; Espace coche. Un `<input type="radio">` natif fournit ce comportement gratuitement — [WAI-ARIA APG Radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- Les unités de viewport svh/lvh/dvh sont supportées par iOS Safari 15.4+, Firefox 101+, Samsung Internet 21+ et Chrome Android (version courante). Usage mondial ≈ 96 % — [caniuse viewport-unit-variants](https://caniuse.com/viewport-unit-variants)
- WCAG 2.2 SC 2.5.8 : cibles de 24 px minimum (AA), 44 px recommandé (2.5.5 AAA) — [W3C 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum, AA) : l'élément qui a le focus ne doit pas être entièrement masqué par du contenu de l'auteur, comme un pied de page collant — [W3C Understanding 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- Zone du pouce : la heat-map « thumb zone » couramment diffusée a été désavouée par Steven Hoober lui-même. La portée dépend de la prise en main et de la taille du téléphone. Les chiffres attribués à NN/g (96 % de précision en bas contre 61 % en haut) n'ont pas pu être retracés à une source primaire — [parachutedesign](https://parachutedesign.ca/blog/thumb-zone-ux/), [thisisglance](https://thisisglance.com/learning-centre/how-do-i-design-for-one-handed-phone-use)

### Inferences
- **Stepper** : `<ol>` de 4 segments (étiquettes Situation · Revers · Pivot · Résultat) avec `aria-current="step"` sur l'étape active, et un texte visible « Étape 2 sur 4 ». Ou bien `role="progressbar"` + `aria-valuemin=1 aria-valuemax=4 aria-valuenow=2 aria-valuetext="Étape 2 sur 4 : le revers"`. Choisir l'un ou l'autre, pas les deux. Au changement d'étape, mettre le focus sur le `<h2 tabindex="-1">` de l'étape : c'est plus fiable qu'un aria-live, qui peut doubler l'annonce. À défaut, une région `aria-live="polite"` invisible avec le texte « Étape 2 sur 4 ». Le segment « Revers » est ambre, mais rempli comme les autres, pour ne pas le présenter comme une régression.
- **Cartes-choix** : `<fieldset><legend>` + `<label>` englobant `<input type="radio" class="sr-only peer">` et la carte (`peer-checked:` / `has-[:checked]:` en Tailwind v4). Taille ≥ 56 px, focus visible (`focus-visible:outline-2 outline-offset-2`), état coché marqué par une bordure, une icône de coche et un fond, pas seulement par la couleur.
- **Boutons** : primaire plein teal-700 avec texte blanc (5,4:1), hauteur 48–52 px, rayon 12–16 px, pleine largeur sur mobile. Secondaire en contour 2 px ou ton sur ton. Pas d'ombres lourdes : une « ombre dure » de 0 3px 0 (style Duolingo « 3D ») coûte peu et paraît ludique.
- **CTA collant** : `position: sticky; bottom: 0` dans le flux, plutôt que `fixed` (meilleur avec le clavier virtuel), et `padding-bottom: max(1rem, env(safe-area-inset-bottom))`. Il faut `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Ajouter au contenu un `scroll-padding-bottom` égal à la hauteur du CTA (pour 2.4.11). Conteneur racine en `min-h-dvh` (Tailwind v4 fournit `h-dvh`/`min-h-dvh`), avec repli `min-height: 100vh` déclaré avant.
- **Badge type d'échec** : pastille icône + libellé (« Échec intelligent ») ≥ 16 px en 700, fond clair teinté + texte foncé du même ton (ex. violet-700 sur violet-50), et une info-bulle ou un texte d'explication d'une ligne. Ne jamais utiliser la couleur seule.
- **Textarea de réflexion** : `<label>` visible, `rows=4`, `font-size ≥ 16px` (sinon iOS zoome au focus). Compteur lié par `aria-describedby`, mis à jour visuellement en continu, et annoncé (`aria-live="polite"`) seulement aux seuils, par exemple 20 caractères restants. Utiliser `maxlength` doux (avertir plutôt que bloquer) et sauvegarder le brouillon en localStorage/IndexedDB (hors-ligne).
- **Toasts** : `role="status"` (polite) pour « Leçon enregistrée » ; durée ≥ 5 s ou fermeture manuelle ; position en haut ou au-dessus du CTA, sans le masquer. Pas de toast pour les erreurs bloquantes : les mettre en ligne, près du champ.
- **Carte « Ma leçon » partageable** : la générer en `<canvas>` → `toBlob` → `navigator.share({files})` (Web Share niveau 2), avec un repli « télécharger ». Polices déjà chargées, fond en dégradé CSS reproduit sur le canvas, donc aucune image lourde.

### Gaps
- Pas consulté le support exact de `navigator.share` avec fichiers ni de `canHaveFiles` sur les navigateurs Android Go/Firefox Android (à vérifier sur caniuse « web-share »).
- Pas de source NN/g primaire récupérée sur steppers ou CTA collants.

## Icônes & illustrations sous budget

### Takeaway
Les icônes SVG en ligne coûtent environ 0,35–0,7 KB chacune non compressées (moins en gzip) : 20 icônes ≈ 10 KB. Lucide et Heroicons sont les plus légers par icône, Phosphor le plus lourd. Les emoji comme illustration sont risqués (rendu variable selon l'OS, bug Android 15 rapporté) : préférer des SVG maison simples et des dégradés CSS.

### Cited Findings
- Taille brute d'un SVG d'icône (« ampoule ») [mesuré via unpkg] : Lucide `lightbulb` 451 o (`circle-check` 361 o), Heroicons `light-bulb` 465 o, Tabler `bulb` 514 o, Phosphor regular `lightbulb` 704 o.
- Emoji : Android utilise Noto Color Emoji (bitmap CBDT/CBLC), Windows des polices vectorielles COLR. Le rendu diffère donc selon la plateforme. Des emoji récents peuvent être absents sur de vieilles versions d'Android (tofu). Twemoji en images est le contournement classique, au prix d'une dépendance externe. Un utilisateur Qt rapporte des emoji invisibles sur Android 15 dans son application, non vérifié côté Android et propre à Qt. Sources de qualité moyenne — [emojifyi](https://emojifyi.com/stories/emoji-versioning-and-support/), [Mozilla bug 1760567](https://bugzilla.mozilla.org/show_bug.cgi?id=1760567), [Qt forum](https://forum.qt.io/post/817891)

### Inferences
- Importer les icônes par nom (`lucide-react` tree-shakable, ou copier les SVG statiques dans des composants) plutôt qu'en sprite complet. Prévoir 15–25 icônes (étapes, types d'échec, partage, retour, info, check, ampoule, boussole/pivot, drapeau/résultat). Garder le trait de 2 px et `currentColor` pour hériter des tokens.
- Si on utilise des emoji, se limiter à ceux d'Unicode ≤ 11 (2018), bien supportés, en décoratif uniquement (`aria-hidden="true"`), jamais porteurs de sens.
- Illustrations : formes SVG en ligne (< 2 KB chacune), « blobs » via `border-radius` asymétrique et dégradés `radial-gradient`. Pas d'image bitmap, sauf éventuellement une seule image d'accueil en AVIF/WebP < 30 KB.

### Gaps
- Je n'ai pas mesuré le coût JS de `lucide-react` par icône après bundling (wrapper React + SVG) : à vérifier avec l'analyseur de bundle Next.

## Performance sur Android d'entrée de gamme

### Takeaway
Bannir `backdrop-filter` (le flou recalcule chaque frame au défilement sur les GPU faibles), limiter les ombres à des ombres dures non animées, et n'animer que `transform` et `opacity`. Auto-héberger une police précachée, sans JS d'animation (pas de Framer Motion, ≈ dizaines de KB).

### Cited Findings
- Rapports Mozilla : `backdrop-filter: blur()` au-dessus d'un contenu qui défile reste très lent sur Android. Avec un header fixe flouté, tout est invalidé et redessiné à chaque frame ; les GPU Adreno 330 et Mali G710 sont cités. Les résultats sont mitigés sur des appareils plus récents — [Mozilla bug 1732817](https://bugzilla.mozilla.org/show_bug.cgi?id=1732817), [Mozilla bug 1779085](https://bugzilla.mozilla.org/show_bug.cgi?id=1779085)

### Inferences
- Règles : pas de `backdrop-filter`, `filter: blur` ni grandes `box-shadow` floues animées. `will-change` seulement pendant l'animation. `content-visibility: auto` + `contain-intrinsic-size` sur les blocs du debrief hors écran (gain réel seulement pour de longs contenus). Les 4 blocs du debrief sont courts, donc gain faible.
- Budget indicatif < 500 KB : HTML+CSS Tailwind purgé ≈ 15–30 KB, police 25–34 KB, JS Next (runtime + pages) ≈ 90–150 KB gz, icônes ≈ 10 KB, contenus JSON ≈ 10–30 KB. Il reste une marge large ; le JS du framework est le poste dominant.

### Gaps
- Aucune source web.dev officielle récupérée sur le coût de `box-shadow` ou de `backdrop-filter` : seulement des rapports de bugs.
- Le poids réel du runtime Next.js 15/16 en export statique n'a pas été mesuré.

## Contexte africain / sénégalais

### Takeaway
Le parc est dominé par des Android d'entrée de gamme (Transsion : Tecno, Infinix, itel ≈ 48 % des livraisons en Afrique en 2025 selon Omdia), et la donnée mobile coûte cher. Il faut donc un PWA très léger, entièrement hors-ligne après une première visite (idéalement via le Wi-Fi de l'école), testé sur Chrome Android et sur des écrans de faible luminosité et résolution.

### Cited Findings
- Omdia 2025 : Transsion représente 48 % des livraisons de smartphones en Afrique (40,5 M d'unités sur 84,4 M, +13 %). Canalys T2 2025 : 51 %. Counterpoint MEA T2 2025 : 26 %. Les méthodologies diffèrent — [Gizmochina/Omdia](https://www.gizmochina.com/2026/02/25/transsion-captures-48-as-africa-smartphone-market-grows-13-in-2025/), [Canalys](https://canalys.com/newsroom/africa-smartphone-market-q2-2025), [Techeconomy/Counterpoint](https://techeconomy.ng/tecno-infinix-itel-drive-transsion-to-26-mea-market-share-in-q2-2025)
- IDC : les appareils < 100 $ représentaient 49 % des livraisons africaines au T4 2024 (39 % en 2023). Omdia : le prix de vente moyen monte à 202 $ et les livraisons < 100 $ baissent de 34 %. Un recul de 23 % des livraisons est prévu en 2026 — (via synthèse de recherche) [Gizmochina](https://www.gizmochina.com/2026/02/25/transsion-captures-48-as-africa-smartphone-market-grows-13-in-2025/), [GSMA African Business](https://african.business/2026/01/long-reads/cheaper-smartphones-can-close-africas-digital-divide-says-gsma)
- GSMA : en Afrique subsaharienne, un appareil d'entrée de gamme coûte 76 % du revenu mensuel des 20 % les plus pauvres (fin 2025 ; un autre rapport dit 87 %). 1 Go de données dépasse souvent 7 % du revenu mensuel, contre une cible ONU de 2 %. GSMA et des opérateurs ont proposé fin 2025 des spécifications minimales pour des smartphones 4G à 30–40 $ — [GSMA handset affordability](https://www.gsma.com/wp-content/uploads/2025/09/Breaking-barriers-handset-affordability.pdf), [GSMA press release](https://www.gsma.com/newsroom/press-release/gsma-and-leading-african-operators-propose-minimum-requirements-for-affordable-4g-smartphones/), [Leadership.ng](https://leadership.ng/smartphones-cost-76-of-monthly-income-in-sub-saharan-africa/)

### Inferences
- Les étudiants d'une école d'ingénieurs dakaroise sont vraisemblablement mieux équipés que la moyenne régionale, mais le mix Tecno/Infinix/itel (souvent Android Go, 2–4 Go de RAM, écrans HD+ de 6,5", luminosité modeste) reste la cible de test. Tester sur Chrome Android et Samsung Internet en priorité, puis sur iOS Safari.
- Data : installation du PWA via le Wi-Fi ou un QR code en amphi. Le service worker précache tout (< 500 KB) et aucune requête réseau n'a lieu ensuite. Afficher le poids (« moins de 0,5 Mo ») pour rassurer.
- Vocabulaire : français simple, tutoiement ou vouvoiement cohérent (choisir selon la culture ESP ; le vouvoiement collectif « vous » est sûr en contexte universitaire sénégalais, mais le « tu » renforce le ton ludique). Éviter les références culturelles franco-françaises ; utiliser des prénoms et contextes sénégalais dans les scénarios. Format `Intl` en `fr-SN` pour les dates et nombres.
- Écrans larges de 6,5–6,8" en 720 px de large et densité 1,5–2× : tester à 360×800 CSS px (le viewport Android le plus courant) et à 320 px pour les plus petits.

### Gaps
- Aucune donnée spécifique au Sénégal ni aux étudiants de l'ESP (part iOS/Android, prix de la data Orange/Free/Expresso Sénégal 2026) n'a été trouvée dans le temps imparti.
- Les chiffres GSMA viennent en partie de couverture secondaire (76 % contre 87 % selon le rapport).
