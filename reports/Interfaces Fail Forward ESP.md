# Concevoir des écrans où rater rassure

> Rapport de synthèse : interfaces de la plateforme Fail Forward ESP. Il s'appuie sur le cahier des charges v1.2 du 17 novembre 2026 et sur quatre carnets de recherche datés du 19 novembre 2026 (accueil et PWA, simulateur, bilan et partage, design system). Destination prévue : `/tmp/claude-1000/-home-elhiann-Documents-codes-failforward/f4c0c2e6-1a81-4a44-b448-1d1e1c447850/scratchpad/reports/Interfaces Fail Forward ESP.md`. Le mode plan étant actif, ce fichier a été écrit ici à la place.

Sur le plan technique, le cahier des charges de Fail Forward ESP est sain. Le site est 100 % statique, l'IA ne sert qu'avant l'événement, aucune donnée ne quitte le téléphone et le contenu est gelé à J-3. En revanche, il contient **une quinzaine d'incohérences qui pèsent directement sur les interfaces**, et **trois d'entre elles contredisent son propre principe de non-culpabilisation** :

- l'échec « basique » est défini par la « négligence » ;
- les libellés de pivot sont génériques et finissent par désigner une « bonne réponse » récurrente ;
- un chronomètre silencieux mesure le temps de décision sans que la mesure serve à rien.

Le benchmark montre que le bon modèle n'est pas la simulation de gestion lourde. C'est le **newsgame textuel court**, du type FT *Uber Game*, BBC *Syrian Journey* ou *Bad News* : des écrans plein format, des choix présentés en cartes, des conséquences racontées par le monde plutôt que rendues comme un verdict, et une fin sans score. Pour la réflexion, le rapport emprunte aux **post-mortems sans reproche de Google SRE** et au rituel de **Failure:Lab**, où le public écrit lui-même la leçon.

Le design system proposé repose sur :

- un neutre chaud (stone) et un primaire sarcelle (teal-700, 5,4:1) ;
- **l'ambre pour l'imprévu, jamais le rouge** ;
- la police Atkinson Hyperlegible Next en deux graisses statiques, environ 25 Ko ;
- un mouvement entièrement en CSS, de 150 à 300 ms, désactivable.

L'application complète tient vraisemblablement dans **200 à 300 Ko compressés**. Côté technique, la carte « Ma leçon » doit être dessinée en Canvas (0 Ko de bibliothèque) et la copie texte doit être l'export principal, sans jsPDF. Il faut **deux QR codes distincts**, car un QR code ne porte qu'une URL. Enfin, il faut pousser l'installation sur l'écran d'accueil iOS, faute de quoi Safari peut effacer le cache d'une précharge faite à J-14. Le rapport se termine sur **quinze amendements priorisés**, dont **sept à trancher avant le développement**.

## Un cahier solide sur l'infrastructure, fragile sur la pédagogie de l'interface

### Ce qui est déjà juste et qu'il faut protéger

Le choix structurant du cahier est de **faire travailler l'IA avant l'événement, jamais pendant**. C'est le bon choix. Il élimine à la fois le goulot des quotas (environ 100 demandes par minute au moment du bilan, contre environ 26 acceptées par les offres gratuites, selon le §7.1), la dépendance au Wi-Fi et la nécessité d'avoir un développeur présent le jour J. L'interface y gagne aussi : un bilan servi depuis un JSON local s'affiche instantanément. Le critère « bilan en moins de 2 s » est donc acquis par construction, et l'interface n'a besoin ni d'écran de chargement, ni d'état d'attente, ni de message d'erreur réseau.

Sur le plan pédagogique, la séquence est la bonne : agir (étape 1), rencontrer un manque (étape 2), consolider (étapes 3-4 et bilan). C'est l'ordre du *Productive Failure*. Une méta-analyse de **53 études et 166 comparaisons** le trouve supérieur à l'ordre inverse, avec **g = 0,36**, et **g = 0,87** après correction du biais de publication. L'effet est plus fort quand le dispositif suit fidèlement les principes du *Productive Failure* ([X-MOL, Sinha & Kapur 2021](https://www.x-mol.com/paper/1406031499744456704) ; [Phys.org](https://phys.org/news/2021-09-productively-wiser.html)). Le cahier exclut aussi notation et classement (§10.3). Il évite ainsi le piège décrit par Westera : quand un jeu sérieux récompense la performance par un score, les joueurs **adoptent des stratégies d'évitement de l'erreur** et perdent l'occasion d'apprendre ([Open Universiteit, Westera 2022](https://research.ou.nl/en/publications/examining-the-productiveness-of-failure-in-serious-gaming/)).

Enfin, le cahier fait les bons choix d'anonymat et de légèreté : un pseudo libre, aucun compte, une page de moins de 500 Ko et un fonctionnement hors-ligne. Ce sont les conventions des outils d'amphi les plus utilisés. Mentimeter résume sa posture par « anonymous by default, identified by choice », et Slido comme Wooclap sont anonymes par défaut ([Mentimeter](https://help.mentimeter.com/en/articles/10774022-choosing-participant-identity-settings-for-your-use-case) ; [Wooclap](https://docs.wooclap.com/en/articles/674920-how-to-identify-participants) ; [Slido](https://community.slido.com/setting-up-a-slido-event-82/participant-privacy-set-anonymous-or-named-questions-and-poll-votes-by-default-1609)).

### Quinze incohérences, vérifiées section par section

Le tableau ci-dessous reprend les douze points signalés par le coordinateur et ajoute trois incohérences trouvées en relisant le cahier à la lumière des carnets. Chaque ligne indique où se trouve l'incohérence, ce qu'elle casse dans l'interface et la correction proposée.

| # | Incohérence | Où dans le cahier | Effet sur l'interface et risque | Correction proposée |
|---|---|---|---|---|
| 1 | L'indicateur « 85 % des parcours démarrés sont terminés » n'est pas mesurable | §1.2, contre §14 (« aucune mesure ») et §16 (« la plateforme ne mesure rien ») | Un objectif ne peut pas être vérifié. Pour le mesurer, il faudrait de la télémétrie, que le cahier exclut. | Remplacer par un indicateur observable en salle : un relevé à main levée en plénière (« qui a vu son bilan ? »), ou un compteur affiché sur le téléphone et lu à voix haute. Sinon, supprimer l'indicateur. |
| 2 | Le bilan a 4 blocs, mais le JSON n'a pas de champ `summary` et en a 5 autres | §5.3 et EF-09 (résumé, point de bascule, rebond, leçon), contre §8.6 (`turning_point`, `pivot_evaluation`, `failure_type`, `outcome`, `key_takeaway`) | Le bloc 1 « résumé chronologique » n'a pas de source, et `outcome` n'est rattaché à aucun bloc. Le « 60 mots par bloc » du §7.2 devient « 60 mots par champ » dans l'annexe B. | Générer le bloc 1 **localement** à partir du parcours (libellé du choix, `failure_event`, libellé du pivot), ce qui ne coûte aucun appel IA. Afficher `outcome` à l'étape 4. Harmoniser la règle à « 60 mots par champ ». |
| 3 | Le chronomètre silencieux est stocké mais ne sert à rien | EF-07, `pivot_decision_ms` au §8.6. Aucune mention au bilan ni au débriefing. | On mesure sans dire pourquoi : les participants peuvent se sentir surveillés, sans aucun bénéfice. | L'afficher au bilan comme un repère neutre et le mentionner dans l'avertissement d'accueil, ou supprimer EF-07 (voir la section 3). |
| 4 | « Échec basique : cause évitable (négligence, oubli) » | §6.4, contre §5.2, §6.3 et §7.6 (« l'échec est une propriété du scénario, pas de la personne ») | Le mot « négligence » désigne un défaut de la personne, et ce badge s'afficherait au bilan. C'est aussi une contradiction logique : un échec **inévitable** par construction (§6.3) ne peut pas être « évitable ». | Redéfinir l'échec basique en décrivant le système, pas la personne. Écrire l'imprévu de l'étape 2 uniquement comme un échec complexe ou intelligent (voir la section 3). |
| 5 | Les libellés de pivot sont génériques et identiques dans les 12 scénarios | §8.6 et annexe B (« Maintenir le cap / Ajuster partiellement / Changer radicalement ») ; §5.2 parle de « s'entêter » | Les options n'expliquent pas l'action concrète. Dès le deuxième parcours, le joueur repère « l'option qui marche ». Le terme « s'entêter » est péjoratif. | Écrire des libellés concrets par scénario, et idéalement par choix (3 × 3 libellés, toujours 9 bilans), accompagnés d'une étiquette de catégorie. Faire varier la meilleure trajectoire d'un scénario à l'autre. |
| 6 | La note libre fausse le chronomètre | EF-08 (justification de 200 caractères) n'est pas située ; si elle est à l'étape 3, le temps de frappe s'ajoute au temps mesuré | `pivot_decision_ms` mesure alors la vitesse d'écriture et non le temps de décision. | Arrêter le chronomètre au **premier tap** sur une option, et ne proposer la note qu'**après** le choix, repliée. |
| 7 | Le mode Équipe ne change rien | EF-03 et §3 : seul le pseudo change. `mode` est stocké mais n'est jamais lu. | Une option « Équipe » qui ne change rien entretient de faux espoirs et complique l'accueil sans contrepartie. | Différencier le mode à faible coût : vouvoiement, invitation à débattre aux étapes 1 et 3, écran « Passez le téléphone ». Sinon, fusionner Solo et Équipe. |
| 8 | Éviction des données par Safari iOS au bout de 7 jours, contre une précharge à J-14 | §8.4 et §12 (« J-14 à J-1 ») | Safari plafonne le stockage écrit par script, y compris les enregistrements de service worker, après 7 jours d'utilisation de Safari sans visite du site. Un étudiant iOS qui précharge à J-14 sans installer l'app peut arriver sans cache. | Faire de l'installation sur l'écran d'accueil iOS la priorité, envoyer un rappel « rouvre l'app la veille » et resserrer la fenêtre d'annonce (sources plus bas). |
| 9 | Le « fichier unique » .html n'est pas produit par l'export Next | EF-16, §8.4.3 et §14.4 | `next export` produit une page et des fragments JS séparés. Il faut un second build dédié, et localStorage n'est pas fiable en `file://`. | Prévoir un build séparé (Vite + singlefile) avec une interface sans installation ni historique, et le tester sur iOS. Sinon, assumer que ce fichier ne sert que sur Android. |
| 10 | Un QR code ne contient qu'une URL | §8.4.2 (« tous deux sur le QR code ») | C'est impossible tel quel. De plus, Vercel et GitHub Pages sont **deux origines distinctes** : cache, historique et installation ne sont pas partagés. | Imprimer deux QR codes étiquetés « Principal » et « Secours », et donner la consigne « garde l'adresse que tu as installée ». Afficher dans l'app la version utilisée. |
| 11 | Les quotas des fonctions Vercel n'ont pas d'objet | §9.1 (1 M d'invocations, 4 h d'Active CPU, 300 s par fonction) | Un site statique n'a aucune fonction, donc ces quotas ne s'appliquent pas. Ils brouillent la lecture du risque. | Ne garder que le transfert (100 Go par mois) et la clause « non commercial ». |
| 12 | Le budget de poids est ambigu | §10.1 (« page initiale < 500 Ko ») et §8.4 (« environ 0,5 Mo » au total) | On ne sait pas s'il s'agit de la taille compressée ou brute, de la page initiale ou de tout le précache. Le contenu JSON est probablement sous-estimé (voir la section 4). | Définir « total précaché < 500 Ko transférés (brotli/gzip) » et interdire les bibliothèques lourdes (jsPDF, html2canvas). |
| 13 | La carte « Ma leçon » est en priorité C alors que le débriefing en dépend | EF-17 (C), contre §1.2 et §8.5 (« le débriefing s'appuie sur les cartes Ma leçon ») | Si l'option est coupée faute de temps, la plénière perd son support. | Passer la **leçon en texte** en M et la carte image en S. |
| 14 | La leçon de la carte est rédigée par l'IA, pas par le participant | §5.4 (« sa leçon clé ») et `key_takeaway` | Deux voisins sur le même scénario et la même trajectoire montrent la même carte. C'est contraire au rituel Failure:Lab, où le public écrit sa propre leçon. | Faire écrire au participant sa leçon en une phrase, puis afficher la leçon proposée. La carte reprend la phrase du participant, avec la leçon proposée en repli. |
| 15 | Le registre change d'une section à l'autre | §5.3 (« selon vous ») contre l'accueil (« Ici, rater… ») | Tutoiement et vouvoiement non décidés, ce qui casse le ton. | Tutoiement en Solo, vouvoiement en Équipe, à valider par le comité. |

### Les trois contradictions pédagogiques sont les plus graves

**La « négligence » contredit le principe fondateur.** Edmondson a observé que les dirigeants jugent seulement **2 à 5 %** des échecs réellement blâmables, mais en traitent **70 à 90 %** comme tels ([résumé PsychSafety, Edmondson 2011](https://explore.psychsafety.com/n/edmondson-2011/) ; [texte HBR](https://static1.squarespace.com/static/53761774e4b0e8c9b2acd2a4/t/629fcc85185ef04c9d2549bc/1654639749195/Strategies+for+Learning+from+Failure.pdf)). Afficher « négligence » sur l'écran d'un étudiant qui vient de vivre un échec **imposé par le scénario** reproduit exactement ce biais. Dans la typologie d'Edmondson, l'échec basique se produit en terrain connu, a une cause unique et est évitable, souvent par un écart de processus. L'échec complexe naît de plusieurs facteurs qui interagissent. L'échec intelligent vient d'une expérimentation réfléchie en terrain neuf ([IMD](https://www.imd.org/ibyimd/innovation/right-kind-of-wrong-why-failure-is-a-powerful-tool-for-progress-and-innovation/) ; [Big Think](https://bigthink.com/?p=477067)).

Le carnet « simulateur » en tire une règle simple : écrire l'imprévu de l'étape 2 **toujours** comme un échec complexe ou intelligent, causé par l'incertitude du scénario. La catégorie « basique » ne sert alors qu'à qualifier la trajectoire, et sa définition décrit le système (« un garde-fou simple, comme une checklist, l'aurait arrêté ») plutôt que la personne. La théorie de l'attribution explique ce choix : un retour **interne, stable et global** (« tu es mauvais, toujours, partout ») est celui qui alimente le plus l'impuissance apprise ([Oregon State Ecampus, résumé de Juul](https://blogs.oregonstate.edu/inspire/?p=3275)). Juul rappelle en outre que, dans un jeu, l'échec signale d'ordinaire l'insuffisance **du joueur**, et c'est précisément l'attribution que Fail Forward doit déjouer ([MIT CMS, Juul](https://cms.mit.edu/jesper-juul-the-pain-of-playing-video-games)).

**Des pivots génériques fabriquent une « bonne réponse ».** inkle observe que les joueurs sautent le texte pour aller directement aux options. Les libellés doivent donc expliquer eux-mêmes l'action proposée ([Emily Short, GDC 2015](https://emshort.blog/2015/04/02/interactive-narrative-gdc-talks-part-1/)). « Maintenir le cap », « Ajuster partiellement » et « Changer radicalement » ne disent rien de l'action. Si ces trois libellés reviennent dans les 12 scénarios, et que le §6.3 fait dépendre l'issue « de la qualité du pivot », le joueur apprend dès son deuxième parcours qu'« ajuster » fonctionne. C'est le comportement d'évitement de l'erreur décrit par Westera, réintroduit sans score. Le §5.2 aggrave le problème avec le mot « s'entêter ». Il y a une solution peu coûteuse : écrire 3 libellés de pivot concrets **par choix**, soit 9 libellés par scénario. Le nombre de bilans ne change pas (toujours 9 couples par scénario), mais l'IA doit produire un pivot qui répond à l'imprévu réellement vécu.

**Le chronomètre silencieux mesure sans servir.** Le carnet « simulateur » n'a trouvé **aucun jeu de référence qui mesure en silence** le temps de décision, ni aucune étude sur un temps mesuré sans limite en contexte éducatif. C'est une vraie lacune de la littérature. La seule donnée empirique disponible porte sur des enfants confrontés à des minuteurs **avec limite** : un minuteur visible y réduisait l'anxiété d'anticipation, et un minuteur invisible sous contrainte de temps dégradait la performance ([PMC12731990](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12731990/)). Ce cas ne s'applique pas directement à Fail Forward. Le risque réel ici est la **surveillance perçue**, et une mesure que personne n'utilise n'a aucun bénéfice pour la compenser. La recommandation est donc binaire. Soit on rend la mesure transparente et non évaluative : au bilan, « Ton temps de réflexion au pivot : 12 s — ni bon ni mauvais, c'est un repère », plus une mention dans l'avertissement d'accueil. Soit on supprime EF-07. Garder la mesure silencieuse et inutilisée est la pire des options.

### Les contradictions techniques se règlent dans l'interface

**Éviction iOS.** Depuis Safari 13.1 (2020), WebKit plafonne à 7 jours tout le stockage écrit par script : IndexedDB, localStorage et enregistrements de service worker. Le compteur démarre après 7 jours d'utilisation de Safari sans interaction avec le site ([Security Boulevard citant WebKit](https://securityboulevard.com/2020/03/apple-turns-the-anti-ad-thumbscrews-with-safari-cookie-blocking/) ; [mjtsai](https://mjtsai.com/blog/2020/03/26/safari-13-1-third-party-cookie-blocking-and-7-day-script-writeable-storage/)). Les web apps de l'écran d'accueil ne font pas partie de Safari et ont leur propre compteur ([The Register](https://www.theregister.com/2020/03/26/apple_relax_were_not_totally/) ; [WebKit bug 237350](https://bugs.webkit.org/show_bug.cgi?id=237350)). Des développeurs signalent pourtant une persistance inégale en pratique ([Apple Developer Forums 710157](https://developer.apple.com/forums/thread/710157)). Il y a une bonne nouvelle : depuis iOS/iPadOS 26, **tout site ajouté à l'écran d'accueil s'ouvre par défaut comme une web app** ([WebKit, WWDC25](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/)). L'interface doit donc présenter l'ajout à l'écran d'accueil comme **la** façon de précharger sur iPhone, et pas comme une option. Reste une incertitude : on ne sait pas si la Cache API est couverte par le plafond, ni si la politique de 2020 s'applique toujours en 2026. Le test du §11 doit inclure un iPhone qui a préchargé dix jours avant.

**Deux adresses, deux origines.** Un QR code n'encode qu'une seule URL. Et comme Vercel et GitHub Pages sont deux origines différentes, chacune a son propre service worker, son propre localStorage et sa propre installation. Un étudiant qui a installé l'app depuis Vercel puis scanne le QR « miroir » le jour J se retrouve **sans cache et sans historique**. L'interface doit afficher discrètement la version utilisée (« Version principale » ou « Version de secours ») et la consigne imprimée doit dire « Garde l'adresse que tu as installée ».

**Fichier unique.** L'export statique de Next.js ne produit pas un fichier autonome. `vite-plugin-singlefile` sait intégrer tout le JS et le CSS dans un `index.html`, mais pas les fichiers de `public/` ([README vite-plugin-singlefile](https://www.github.com/richardtallent/vite-plugin-singlefile)). Les polices doivent alors être intégrées en base64 dans le CSS ([shkspr.mobi](https://shkspr.mobi/blog/2021/08/you-dont-need-external-assets-in-an-html-file/)). En `file://`, il n'y a pas de service worker et localStorage n'est pas fiable. Le comportement réel sur Chrome Android et dans l'app Fichiers d'iOS **n'a pas été vérifié** par la recherche. Ce fichier est donc une autre application, avec une autre interface : pas d'installation, pas d'historique, et un avertissement « copie ton bilan avant de fermer ».

## Les newsgames textuels battent les simulations lourdes

Le benchmark compare quatre familles de projets : les simulations de décision à embranchements, les formats sur l'échec, les outils d'amphi et les écrans de bilan et de partage. Les projets les plus proches de Fail Forward sont des récits interactifs courts, centrés sur le texte et construits sur Ink. C'est le cas du FT *Uber Game*, que l'équipe a réalisé avec inkjs et **moins de 90 lignes de JS** pour la navigation, environ 700 lignes de SCSS et anime.js pour les transitions. Le jeu a été prototypé avec des références à des jeux mobiles casual et dans un style visuel volontairement « abstrait » ([OpenNews Source](https://source.opennews.org/articles/how-and-why-financial-times-made-uber-game/)). C'est la preuve qu'une expérience très lue peut tenir dans une enveloppe compatible avec 500 Ko. Le jeu est devenu l'un des contenus les plus lus du FT en 2017 et a été repris comme fiche de cours ([Robin Kwong](https://robinkwong.com/uber-game-reflections/)).

| Projet (statut au 19/11/2026) | Ce qu'il fait bien | À emprunter pour Fail Forward | À éviter |
|---|---|---|---|
| **FT Uber Game** (en ligne) | Écrans plein format (intro, avertissements, récit), interstitiels « le temps passe », bandeau de statistiques persistant ([source de la page](https://ig.ft.com/uber-game/)) | Un écran par étape, un bandeau d'étapes persistant, et un écran « contexte » montré une seule fois | Le verrouillage en paysage et la comparaison « % des autres joueurs », impossible hors-ligne |
| **BBC Syrian Journey** (en ligne) | 7 décisions à embranchements, fondées sur des récits réels ([YES! Magazine](https://www.yesmagazine.org/education/2017/05/11/syrian-journey-choose-your-own-escape-route)) | Des choix qui arbitrent entre deux valeurs, sans bonne réponse évidente | Le ton : le jeu a été critiqué pour avoir « banalisé » un vécu ([Boing Boing](https://boingboing.net/2015/04/06/the-bbc-made-a-controversial.html)). Les scénarios ne doivent pas toucher à des drames réels. |
| **Bad News / Harmony Square** (en ligne) | Deux jauges, 6 badges qui servent de chapitres, une partie d'environ 15 min ([Cambridge](https://www.cam.ac.uk/research/news/fake-news-vaccine-works-pre-bunk-game-reduces-susceptibility-to-disinformation)) | Une progression **ancrée dans le récit** (étapes nommées), et non un pourcentage | Des jauges chiffrées qui montent ou baissent et se lisent comme un score |
| **MIT Moral Machine** (en ligne) | Dilemme binaire par écran, 13 items, résumé des choix seulement à la fin ([Nature 2018](https://cdn.vanderbilt.edu/vu-my/wp-content/uploads/sites/2688/2020/01/11235711/The_Moral_Machine_experiment.pdf)) | Un résumé chronologique des décisions en fin de parcours (bloc 1) | La comparaison sociale |
| **Reigns** (en ligne) | Une carte à la fois. Un glisser lent montre **quelle** jauge bouge mais pas **dans quel sens** ([AppSpy](https://www.appspy.com/features/tinder-disasterpeace-and-epic-binary-choices-why-reigns-should-be-your-next-ios-game/)). L'échec est ludique, et on peut toujours rejouer ([Game Developer](https://www.gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-)). | Le ton léger face à l'échec et l'idée qu'il y a toujours une suite | Le balayage : il ne gère que 2 options et pose problème en accessibilité, alors qu'il y en a 3 ici |
| **HBP / Forio Change Management** | Un panneau « News » qui rapporte l'impact dans le monde du jeu, un historique des décisions ([guide Baylor](https://business.baylor.edu/Dawn_Carlson/ob/modules/module-6/ChgMgmt_V2_How_to_Play.pdf)) | L'étape 2 présentée comme une **dépêche** du monde du jeu, pas comme un verdict | Le tableau de bord dense, conçu pour des sessions de 1 à 3 h |
| **inkle (80 Days, Ink)** | « L'interface, c'est le jeu ». Les joueurs sautent le texte, il faut donc des passages brefs ([Vice](https://vice.com/en/article/the-makers-of-mobile-hit-80-days-on-the-importance-of-amazing-ui-852)) | Un enjeu en gras en tête de situation, 2 ou 3 paragraphes courts, des libellés de choix explicites | Les blocs de 120 mots non découpés |
| **Failure:Lab** (site en 404) | Récits **sans morale** sur scène : le public a 90 s pour écrire sa propre leçon ([Fortune](https://fortune.com/2015/01/05/failure-michigan-success/)) | Faire écrire la leçon par le participant **avant** de montrer la leçon proposée, et la mettre sur la carte | Que l'animateur ou l'IA impose la morale |
| **Telltale** | Notification « X s'en souviendra » et % des joueurs à la fin de l'épisode ([GamesBeat](https://gamesbeat.com/the-illusion-of-player-choice-in-the-walking-dead/)) | Rien de directement utile | Les promesses de conséquences jugées trompeuses par la critique ([Game Informer](https://www.gameinformer.com/b/features/archive/2015/02/03/why-your-choices-dont-matter-in-telltale-games.aspx)) |
| **Kahoot** | Pseudos « amicaux » générés en adjectif + animal (environ 800 combinaisons, 3 tirages) ([Kahoot](https://kahoot.com/blog/2019/03/08/tips-keep-kahoot-nicknames-appropriate/)), filtrage automatique, mode Équipe | Le générateur de pseudos (en français, avec accord en genre) et un pseudo d'équipe par appareil | Le podium des 3 premiers ([Kahoot support](https://support.kahoot.com/hc/en-us/articles/42321615442707)), qui est un classement |
| **Duolingo** (fin de leçon) | Écran de célébration puis métriques (XP, précision, vitesse) et un seul bouton d'action ([ScreensDesign](https://screensdesign.com/apps/duolingo-language-lessons/?via=growthgems)) | La hiérarchie : en-tête, faits saillants, un seul bouton principal | XP, précision et vitesse, qui sont des métriques de performance |
| **Spotify Wrapped** | Couleur et grande typographie, cartes « stories » à faire défiler ([Active Theory](https://medium.com/active-theory/spotify-wrapped-2018-technical-case-study-5b7cfb7e9d3a)) | Une révélation progressive des blocs, sans lecteur de stories | La typographie écrasée de 2021, jugée illisible ([Creative Bloq](https://www.creativebloq.com/news/spotify-wrapped-font)) |
| **Wordle** | Grille d'emoji copiée en texte, devenue virale sans image ([Game Developer](https://gamedeveloper.com/gdc2022/josh-wardle-reflects-on-the-the-unconventional-road-to-wordle-s-success)) | **La copie texte comme export principal** | Des emoji porteurs de sens, lus un par un par les lecteurs d'écran ([Opensource.com](https://opensource.com/article/22/1/open-source-accessibility-wordle)) |
| **Google SRE, post-mortem sans reproche** | Déroulé « ce qui s'est passé → impact → atténuation → causes → actions », sans incriminer personne ([SRE Book ch. 15](https://sre.google/sre-book/postmortem-culture/)) | Les trois questions de réflexion correspondent presque terme à terme à cause racine, impact et action | — |
| **GOV.UK « une chose par page »** | Validé en test utilisateur, et bien reçu en 2024 ([GDS](https://gds.blog.gov.uk/2024/01/12/how-were-making-it-easier-to-access-government-forms-online/)) | Une question par carte, avec un libellé visible et une aide | Les accordéons, abandonnés par le GDS ([GDS 2015](https://userresearch.blog.gov.uk/2015/08/13/no-more-accordions-how-to-choose-a-form-structure/)) |

Ces projets convergent vers une règle : **la conséquence est racontée par le monde, la progression est nommée dans le récit et la fin décrit sans noter**. Les recommandations de conception de jeux sérieux vont dans le même sens. Il faut rendre la cause de l'échec évidente tout de suite, montrer jusqu'où le joueur est allé et donner un retour d'échec « positif » qui préserve le sentiment de contrôle ([Learning Guild, Sparks 2019](https://www.learningguild.com/articles/metafocus-well-designed-failure-in-serious-games)). Plusieurs références n'ont pas pu être vérifiées. *Spent* est hors ligne, *Factitious* renvoyait une erreur 403 et le site de FailCon n'est plus maintenu. Les interfaces de Choices, Episode et Duolingo Stories n'ont pas été vérifiées et ne servent donc pas d'appui.

## Écran par écran : quatre moments, un même ton

Les maquettes ASCII ci-dessous visent un viewport de **360 × 800 px CSS**, le plus courant sur Android, et doivent rester lisibles à 320 px. Le tutoiement est utilisé par défaut (mode Solo) et le vouvoiement en mode Équipe. Les textes entre guillemets sont des propositions de microcopie, à faire relire par l'encadrant.

### Écran 1 — Accueil : un champ, un choix, un tirage

L'accueil doit tenir en un seul écran sans défilement pour le cas nominal. Il s'organise de haut en bas : titre et promesse, pseudo, mode, puis bouton d'action. Selon le contexte, deux cartes viennent s'insérer en tête : « Reprendre » si un parcours est en cours, « Prépare ton téléphone » si l'app est ouverte dans le navigateur et pas encore installée.

```
┌────────────────────────────────────┐
│ FAIL FORWARD · ESP   [✓ Prête]  ◐  │  ← pastille hors-ligne + thème
│                                    │
│  Ici, rater fait partie du jeu.    │  h1 28px/700
│  Personne ne voit tes réponses.    │  18px, muted
│                                    │
│ ┌ Reprendre ton parcours ? ──────┐ │  (si parcours en cours)
│ │ Crise de lancement · étape 3/4 │ │
│ │ Loutre Audacieuse · il y a 12 min│
│ │ [   Reprendre   ]  Recommencer › │ │
│ └────────────────────────────────┘ │
│                                    │
│ Ton pseudo                         │  label visible
│ ┌──────────────────────┐┌───────┐  │
│ │ Loutre Audacieuse    ││🎲 Au  │  │  ≥48px, bouton ≥44px
│ └──────────────────────┘│hasard │  │
│ 17/20                   └───────┘  │
│ 🔒 Pas de compte, rien n'est envoyé.│  info, pas de modale
│ N'écris ni ton vrai nom ni d'info  │
│ personnelle.                       │
│                                    │
│ Tu joues…                          │  fieldset/legend
│ ┌ (●) Solo ──────────────────────┐ │  carte radio ≥56px
│ │ Seul·e sur ton téléphone       │ │
│ └────────────────────────────────┘ │
│ ┌ ( ) En équipe ─────────────────┐ │
│ │ 2 ou 3 sur un seul téléphone   │ │
│ └────────────────────────────────┘ │
│                                    │
│ [        Commencer  →          ]   │  CTA collant, safe-area
│ Choisis un pseudo (3 à 20 car.)    │  raison visible si inactif
└────────────────────────────────────┘
```

**Pseudo.** Le générateur s'inspire de celui de Kahoot, qui associe un adjectif et un animal ([Kahoot blog](https://kahoot.com/blog/2017/11/09/generate-funny-nicknames-players-live-kahoots/)), avec l'accord en genre stocké avec le nom : « Loutre Audacieuse », « Phénix Tenace », « Colibri Persévérant », « Hibou Curieux ». Environ 40 noms et 40 adjectifs donnent 1 600 combinaisons, auxquelles on peut ajouter un suffixe à deux chiffres. Les tirages sont illimités, et les noms générés passent eux aussi par le filtre. Si un mot interdit est détecté, le message est neutre et ne répète pas le mot : « Ce pseudo n'est pas disponible. Essaie-en un autre ou tire-en un au hasard. » Le champ porte `autocomplete="off"`, `autocapitalize="off"`, `spellcheck="false"`, `enterkeyhint="done"` et une taille de police d'au moins 16 px, pour éviter le zoom d'iOS au focus. L'erreur s'affiche quand le champ perd le focus ou à partir du 3e caractère, jamais à la première frappe.

**Bouton « Commencer » inactif.** Le cahier exige que ce bouton reste inactif tant que le pseudo n'est pas valide. NN/g recommande d'utiliser les boutons désactivés avec parcimonie, de les garder accessibles et **de toujours expliquer pourquoi ils le sont** ([NN/g, vidéo 2025](https://www.nngroup.com/videos/why-disabled-buttons-hurt-ux-and-how-to-fix-them/)). Il faut aussi préférer `aria-disabled` à l'attribut natif `disabled` pour que le bouton reste atteignable au focus ([NN/g Button States](https://www.nngroup.com/articles/button-states-communicate-interaction/)). Concrètement, un tap sur le bouton inactif ramène le focus dans le champ et affiche la raison.

**Mode.** Il y a deux grandes cartes radio empilées, construites avec des `<input type="radio">` natifs dans un `fieldset`. Solo est présélectionné, si bien que le bouton ne dépend que du pseudo. Un contrôle segmenté n'aurait pas la place d'expliquer « un seul téléphone ». Cette recommandation est une inférence : le carnet n'a pas trouvé de source spécifique sur ce choix.

**Tirage du scénario.** Une fois le pseudo validé, une carte face cachée (« ? Ton scénario ») se retourne en `rotateY(180deg)` en 400 à 600 ms, ce qui reste sous les 300 ms par changement d'étape exigés pour le simulateur, puisqu'il s'agit ici de l'accueil. La face montre « Scénario 7/12 — Crise de lancement ». Sous `prefers-reduced-motion`, la carte apparaît par un simple fondu de 200 ms au plus, comme dans le motif MDN, qui remplace le mouvement par l'opacité ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)). Le titre tiré est annoncé dans une région `aria-live="polite"`. Le bouton secondaire « Tirer un autre scénario (1 restant) » exclut le scénario courant et **ne disparaît pas** après usage, pour ne pas décaler la mise en page. Il devient `aria-disabled` avec « Tu as déjà utilisé ton nouveau tirage ». Le tirage et l'indicateur de nouveau tirage sont enregistrés immédiatement dans localStorage, pour qu'un rafraîchissement ne permette pas de retirer gratuitement. Il faut éviter l'effet machine à sous, qui fait défiler les 12 titres : il clignote, se lit mal et n'est pas accessible.

**Reprise (EF-14).** Si un parcours en cours est trouvé, une carte prioritaire s'affiche au-dessus du formulaire, sans modale. La reprise n'est jamais automatique : sur un téléphone d'équipe, la personne suivante n'est pas forcément la même. « Recommencer » demande une confirmation. Les données sont versionnées (clé `ffesp:v1:run`) pour qu'une mise à jour puisse les migrer ou les ignorer proprement. web.dev et Workbox recommandent tous deux de rendre visibles les contenus sauvegardés et d'enregistrer l'état avant tout rechargement ([web.dev](https://web.dev/articles/offline-ux-design-guidelines) ; [Workbox](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)).

**Installation et hors-ligne.** Un bloc « Prépare ton téléphone » n'apparaît qu'en `display-mode: browser`, c'est-à-dire tant que l'app n'est pas installée. Sur Android, un bouton « Installer l'app » déclenche l'événement `beforeinstallprompt` capturé plus tôt. `prompt()` ne peut être appelé qu'une fois, et le bloc se masque après `appinstalled` ([web.dev Customize install](https://web.dev/articles/customize-install)). Sur iOS, il n'existe pas d'invite programmable, d'où trois étapes illustrées : « 1. Touche Partager ⬆︎ · 2. “Sur l'écran d'accueil” · 3. Laisse “Ouvrir comme app web” activé, puis “Ajouter” ». Une pastille persistante « ✓ Prête à jouer, même sans réseau » remplace le message éphémère suggéré par web.dev ([web.dev](https://web.dev/articles/offline-ux-design-guidelines)). web.dev conseille aussi d'éviter le mot « hors-ligne ». **Il ne faut pas de bandeau d'erreur réseau** : tout est local. Au plus, une ligne discrète : « Pas de réseau ? Pas de souci, tout fonctionne. » Le jour J, aucune invite de mise à jour ne doit apparaître (voir la section 5).

**Mode Équipe.** Pour donner au mode Équipe une différence réelle sans écrire de contenu supplémentaire, trois changements suffisent. Les textes passent au vouvoiement (« Vous jouez à 2 ou 3 sur ce téléphone »). Le générateur produit des noms d'équipe au pluriel (« Les Loutres Audacieuses »). Aux étapes 1 et 3, un bandeau invite à débattre : « Prenez une minute pour en parler avant de valider. » En option, un écran « Passez le téléphone » sépare la réflexion des trois questions. Cette dernière proposition est une inférence non sourcée.

### Écran 2 — Simulateur : quatre étapes nommées, un seul geste par écran

Un **stepper segmenté en 4 barres libellées** (Situation · Imprévu · Pivot · Résultat) remplace une barre continue. Pour un parcours de moins de 4 étapes, les guides de design systems jugent un indicateur léger suffisant ([Visa Design System](https://design.visa.com/patterns/wizard/usage/) ; [SAP Fiori](https://www.sap.com/design-system/fiori-design-ios/v26-1/components/progress-indicators/step-progress-indicator/usage)). Les jeux de référence nomment d'ailleurs leurs étapes dans le récit, comme les badges de *Bad News*. L'étape 2 est libellée **« Imprévu »** et non « Échec », pour que la barre de progression n'annonce pas l'échec avant même qu'il arrive. Son segment est ambre, mais **rempli comme les autres** : il ne doit pas ressembler à un recul. À chaque changement d'étape, le focus passe sur le `<h2 tabindex="-1">` de l'étape, ce qui est plus fiable qu'une région `aria-live` qui peut doubler l'annonce.

**Étape 1 — Situation.** Une situation de 80 à 120 mots se lit en 25 à 40 s. On la découpe en 2 ou 3 paragraphes, sous une phrase d'enjeu en gras, parce que les joueurs sautent aux options ([Emily Short](https://emshort.blog/2015/04/02/interactive-narrative-gdc-talks-part-1/)).

```
┌────────────────────────────────────┐
│ ▰▰▱▱▱▱▱▱  Étape 1 sur 4 · Situation│  stepper 4 segments
│ Situation · Imprévu · Pivot · Rés. │
│                                    │
│ ◆ CRISE DE LANCEMENT               │  icône SVG + thème
│ **Ton prestataire clé lâche à 48 h │  enjeu en gras 20px
│ de la livraison.**                 │
│                                    │
│ Le client attend la démo lundi.    │  18px, interligne 1.55
│ L'équipe a déjà travaillé tout le  │  2–3 paragraphes courts
│ week-end…                          │
│                                    │
│ Que fais-tu ?                      │  legend
│ ┌ A ─────────────────────────────┐ │
│ │ Appeler un autre prestataire   │ │  verbe d'abord, ≥56–64px
│ │ Plus cher, mais disponible     │ │  sous-titre 16px muted
│ └────────────────────────────────┘ │
│ ┌ B ──────────────────────── ✓ ──┐ │  sélectionnée : bordure 2px
│ │ Négocier un report avec le     │ │  + fond teinté + coche
│ │ client                         │ │
│ └────────────────────────────────┘ │
│ ┌ C ─────────────────────────────┐ │
│ │ Livrer une version réduite     │ │
│ └────────────────────────────────┘ │
│ [      Valider ce choix  →     ]   │  apparaît après sélection
└────────────────────────────────────┘
```

Aucun des jeux de référence ne demande de confirmation par fenêtre modale. Pour éviter les erreurs de doigt sans modale, le parcours se fait en **deux taps** : le premier sélectionne une carte, puis le bouton collant « Valider ce choix » apparaît ([carnet simulateur, d'après Reigns, Uber Game et Moral Machine](https://www.appspy.com/features/tinder-disasterpeace-and-epic-binary-choices-why-reigns-should-be-your-next-ios-game/)). Les cartes sont des radios natives : le motif radio de l'APG gère gratuitement les flèches, l'espace et la tabulation ([WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)).

**Étape 2 — Imprévu.** C'est l'écran où la plateforme a le plus à perdre. On y combine trois idées : la conséquence racontée par le monde, comme le panneau News de HBP ([guide Baylor](https://business.baylor.edu/Dawn_Carlson/ob/modules/module-6/ChgMgmt_V2_How_to_Play.pdf)), une **cause rendue immédiatement évidente** ([Learning Guild](https://www.learningguild.com/articles/metafocus-well-designed-failure-in-serious-games)) et une attribution **externe, instable et spécifique**.

```
┌────────────────────────────────────┐
│ ▰▰▰▰▱▱▱▱  Étape 2 sur 4 · Imprévu  │  segment ambre, rempli
│                                    │
│ ┌──────────────────────────────── ┐│  carte « dépêche »
│ │ ⚡ REBONDISSEMENT                ││  fond amber-50, bord amber-700
│ │                                 ││
│ │ Le client refuse le report :    ││  sujet = le monde,
│ │ son propre comité se réunit     ││  jamais « tu as… »
│ │ mardi et il doit montrer        ││
│ │ quelque chose.                  ││
│ │                                 ││
│ │ Lié à ton option B : négocier   ││  lien causal d'une ligne
│ │ un report.                      ││
│ └─────────────────────────────────┘│
│                                    │
│ C'était prévu : chaque scénario    │  micro-texte rassurant,
│ contient un imprévu. La suite      │  16px muted
│ dépend de ton rebond.              │
│                                    │
│ [   Voyons comment rebondir  →  ]  │
└────────────────────────────────────┘
```

Pas de rouge, pas de ❌, pas de son d'échec, pas de baisse de score. Pas de secousse horizontale non plus : ce geste signifie « refusé », comme un mot de passe erroné. On le remplace par un léger basculement (-1,5°) ou un petit déplacement vertical, joué une seule fois en 300 ms, et un fondu vers l'ambre. Sous `reduced-motion`, la couleur et le texte portent seuls le message ([web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)). Il n'existe aucune étude contrôlée comparant « échec » et « rebondissement » dans un jeu sérieux. Ce choix de vocabulaire vient de la théorie de l'attribution et n'a pas été testé.

**Étape 3 — Pivot.** Les trois cartes affichent **des actions concrètes, propres au choix fait**, et en petit une étiquette de catégorie (Maintenir · Ajuster · Changer). L'étiquette garde la typologie du cahier sans en faire le libellé principal.

```
┌────────────────────────────────────┐
│ ▰▰▰▰▰▰▱▱  Étape 3 sur 4 · Pivot    │
│                                    │
│ Et maintenant ?                    │  h2
│ Le client veut voir quelque chose  │  rappel d'une ligne
│ mardi.                             │
│                                    │
│ ┌──────────────────── MAINTENIR ─┐ │  étiquette 14px→16px min
│ │ Tenir le report et préparer    │ │  (≥16px imposé)
│ │ une note écrite pour le comité │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────── AJUSTER ─┐ │
│ │ Montrer une maquette cliquable │ │
│ │ mardi, la vraie démo lundi     │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────── CHANGER ─┐ │
│ │ Livrer mardi le module le plus │ │
│ │ avancé, abandonner le reste    │ │
│ └────────────────────────────────┘ │
│ + Ajouter une justification        │  replié, APRÈS sélection,
│   (facultatif, reste sur ton tél.) │  200 car. max
│ [       Valider mon rebond  →   ]  │
└────────────────────────────────────┘
```

Aucun compte à rebours, aucune animation qui pulse, aucun texte pressant. Le chronomètre démarre au premier affichage des options (`performance.now()` après `requestAnimationFrame`) et **s'arrête au premier tap**. Il se met en pause pendant les `visibilitychange`, et les valeurs aberrantes sont écrêtées. Le champ de justification ne se déplie qu'après la sélection, ce qui règle l'incohérence n° 6.

**Étape 4 — Résultat.** Cette étape affiche le champ `outcome`. Son en-tête est neutre (« Voici ce qui se passe ensuite ») et l'écran ne porte **aucune étiquette « réussite » ou « aggravation »**. Pour échapper au piège de Westera, les issues doivent différer par leur nature, pas par leur rang ([Open Universiteit](https://research.ou.nl/en/publications/examining-the-productiveness-of-failure-in-serious-gaming/)). Le bouton « Voir mon bilan » termine l'étape. Chaque transition entre étapes utilise `document.startViewTransition?.()` : un fondu avec une translation de 16 à 24 px en 200 ms, et un repli instantané si l'API n'est pas disponible. Les View Transitions au sein d'un même document sont Baseline depuis Firefox 144, en octobre 2025, et couvrent environ 93 % des utilisateurs ([caniuse](https://caniuse.com/view-transitions) ; [web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available?hl=en)).

### Écran 3 — Bilan, réflexion, export : décrire, faire écrire, faire copier

Le bilan suit l'ordre en-tête, faits clés, analyse, puis bouton d'action, emprunté aux écrans de fin de session. Il n'y a **ni score ni podium** : les cases chiffrées à la Duolingo (XP, précision) sont remplacées par des faits descriptifs ([ScreensDesign Duolingo](https://screensdesign.com/apps/duolingo-language-lessons/?via=growthgems)). Les blocs apparaissent en fondu, l'un après l'autre (250 ms au plus chacun, décalés de 80 ms), sur une page qui défile. Un lecteur façon *stories* alourdirait le code et cacherait le contenu à qui veut survoler.

```
┌────────────────────────────────────┐
│ Ton bilan                          │  h1, pas de score
│ Crise de lancement                 │
│ [3 décisions] [1 imprévu] [1 rebond]│ chips descriptives
│                                    │
│ ① TON PARCOURS                     │  bloc 1 = assemblé localement
│  ● Choix : négocier un report      │  frise verticale
│  ⚡ Imprévu : le client refuse      │
│  ↻ Rebond : maquette mardi         │
│  ⚑ Résultat : démo tenue, périmètre│
│     réduit                         │
│                                    │
│ ② LE TOURNANT                      │  turning_point
│ ┃ Le moment où le comité du client │  bordure accent
│ ┃ est apparu…                      │
│                                    │
│ ③ TON REBOND                       │  pivot_evaluation
│  Type d'échec                      │
│  [basique][■ complexe ■][intellig.]│  échelle 3 segments
│  ⛓ Plusieurs facteurs se sont      │  icône + phrase neutre
│  combinés ; des signaux existaient.│
│  Temps de réflexion au pivot : 12 s│  si EF-07 conservé
│  — un repère, pas une note.        │
│                                    │
│ ④ TA LEÇON                         │
│  Ta leçon en une phrase :          │  Failure:Lab : d'abord la
│  ┌──────────────────────────────┐  │  sienne…
│  │                              │  │
│  └──────────────────────────────┘  │
│  › Voir la leçon proposée          │  …puis key_takeaway,
│  « Négocier, c'est aussi montrer   │  22–24px, citation
│    quelque chose tôt. »            │
└────────────────────────────────────┘
```

**Le badge de type d'échec se présente sur une échelle, pas comme un verdict.** Les trois types apparaissent côte à côte, celui de l'utilisateur est mis en avant, et une phrase neutre l'accompagne. Les formulations proposées reprennent les règles des post-mortems SRE : décrire la décision et le contexte, jamais la personne ([SRE Book](https://sre.google/sre-book/postmortem-culture/)).

- Basique : « Une cause unique dans un terrain connu : un garde-fou simple (checklist, vérification) l'aurait arrêtée. »
- Complexe : « Plusieurs facteurs se sont combinés ; des signaux faibles existaient. »
- Intelligent : « Un essai réfléchi en terrain inconnu : c'est l'échec qui fait avancer. »

Il reste une tension à signaler honnêtement. Une échelle lue de gauche à droite suggère une hiérarchie, et Edmondson présente bien les échecs intelligents comme ceux qu'il faut rechercher. Les phrases neutres, l'absence de vert, rouge ou orange et des icônes non évaluatives atténuent cet effet sans le supprimer. Un test avec les 5 étudiants testeurs du §11 doit trancher.

**La réflexion compte trois cartes-questions sur la même page.** Elles correspondent aux post-mortems SRE : cause racine, impact, actions de suivi.

```
┌────────────────────────────────────┐
│ À toi de creuser                   │  h2
│ Inspiré des post-mortems sans      │  crédibilité, 16px muted
│ reproche et des « 5 pourquoi ».    │
│                                    │
│ 1. Selon toi, quelle est la cause  │  label visible
│    profonde ?                      │
│ Astuce : demande-toi « pourquoi ? »│  aide = consigne réelle
│ plusieurs fois.                    │
│ ┌──────────────────────────────┐   │  rows=4, auto-grow, 16px+
│ │ Ex. : on a promis sans       │   │  placeholder = exemple seul
│ │ vérifier…                    │   │
│ └──────────────────────────────┘   │
│ › Creuser avec 5 pourquoi          │  replié par défaut
│                                    │
│ 2. Quel aurait été l'impact réel ? │
│ 3. Quelle sera ta prochaine action │
│    concrète ?                      │
│                                    │
│ ✓ Enregistré sur cet appareil      │  aria-live=polite
└────────────────────────────────────┘
```

GOV.UK recommande de commencer par « une chose par page » ([GOV.UK Service Manual](https://www.gov.uk/service-manual/design/form-structure)). Mais avec trois questions courtes, en fin de séance et avec un export à faire juste après, **trois cartes empilées sur une même page** se défendent : chaque carte reste « une chose ». Si les tests montrent que les étudiants sautent les questions, on bascule vers un mini-assistant « Question 1 sur 3 » avec les boutons « Passer » et « Suivant ». Les réponses sont facultatives : une réflexion obligatoire sous pression produit du remplissage. Le compteur reste doux (« ~2 phrases suffisent ») et n'apparaît qu'au-delà de 80 % de la limite. Il n'y a jamais de compteur rouge. La sauvegarde se fait à chaque saisie, avec un délai d'environ 500 ms. Le placeholder ne contient qu'un exemple, la vraie consigne est dans le texte d'aide. Cette dernière règle est une inférence du carnet, qui n'en a pas trouvé la source.

**Export.** Une seule ligne d'information, honnête et neutre, est placée **juste au-dessus des boutons**. Il n'y a pas de modale et pas de couleur d'alerte. La copie texte est le bouton principal.

```
┌────────────────────────────────────┐
│ ⓘ Tes réponses restent uniquement  │  bandeau info, ≥4,5:1
│ sur ce téléphone et peuvent        │
│ disparaître (surtout en navigation │
│ privée). Garde une copie :         │
│                                    │
│ [   📋 Copier mon bilan (texte)  ] │  primaire
│ [   🖼 Enregistrer l'image       ] │  secondaire
│ [   🖨 Imprimer / PDF            ] │  masqué en PWA iOS
│ [   ✦ Créer ma carte « Ma leçon »] │
│                                    │
│ [        Nouveau parcours        ] │
└────────────────────────────────────┘
        ↓ si « Nouveau parcours » sans export
┌────────────────────────────────────┐
│ Garder une copie avant de          │  bottom sheet, une seule fois
│ recommencer ?                      │
│ [ Copier d'abord ] [ Continuer ]   │  deux choix de même poids
└────────────────────────────────────┘
```

Ces règles évitent le *confirmshaming*, le motif trompeur qui pousse à agir par la culpabilité, et la boîte `beforeunload`, peu fiable sur mobile et ressentie comme hostile ([deceptive.design](https://deceptive.design/types/confirmshaming/)). Après une copie, un toast `role="status"` confirme : « Copié ✓ — colle-le dans tes notes ou envoie-le-toi par message. » Le texte copié reprend le modèle de Wordle : du texte brut, lisible partout et accessible.

```
Fail Forward ESP — Mon bilan
Scénario : Crise de lancement
1. Mon choix : négocier un report
2. L'imprévu : le client refuse le report
3. Mon rebond : maquette cliquable mardi (ajuster)
Type d'échec : complexe
Le tournant : …
Ma leçon : …
Cause racine : … / Impact réel : … / Prochaine action : …
```

Si l'écriture dans localStorage échoue (le test se fait dans un try/catch), le message devient plus appuyé, sans culpabiliser : « Le stockage local est désactivé : pense à copier ton bilan avant de quitter. » Pour l'historique (EF-13), une liste « Mes parcours » classe les parcours du plus récent au plus ancien, avec la date, le pseudo, le mode et le scénario, **sans aucun score**. Un bouton « Effacer mon historique » demande confirmation.

### Écran 4 — Carte « Ma leçon » : une citation, pas un pseudo

```
 Canvas 1080 × 1350 (4:5)            Écran téléphone
┌──────────────────────────┐        ┌────────────────────────┐
│ FAIL FORWARD · ESP        │        │ Ta carte est prête     │
│                          │        │ [aperçu 4:5]           │
│ MA LEÇON                 │        │                        │
│                          │        │ [ ⤴ Partager l'image ] │ Web Share files
│ « Montrer quelque chose  │        │ [ ⬇ Enregistrer ]      │ repli <a download>
│   tôt, même imparfait,   │  64px  │ [ ⛶ Montrer en grand ] │ plein écran pour
│   vaut mieux qu'une      │  700   │                        │ la plénière
│   promesse parfaite. »   │        │ Format Story (9:16) ›  │ option
│                          │        │                        │
│ [⛓ Échec complexe]       │        │ Aucun pseudo sur la    │
│                          │        │ carte. Rien n'est      │
│ Journée Fail Forward 2026│        │ envoyé.                │
└──────────────────────────┘        └────────────────────────┘
```

La carte reprend **la phrase écrite par le participant**, et `key_takeaway` seulement si le champ est vide. Elle affiche aussi le mot-symbole de l'événement, la pastille de type d'échec (icône et libellé) et la date. Elle ne montre **ni pseudo ni score**. Le format 1080 × 1350 (4:5) est le format par défaut des publications Instagram, et le 9:16 celui des stories ([Linearity 2026](https://www.linearity.io/blog/instagram-size-guide/)). Les chiffres de zone de sécurité pour les stories divergent selon les sources et ne sont pas confirmés par Meta. Le texte doit donc rester dans une zone centrale prudente. Comme rien n'est projeté en plénière (§5.4), le mode **« Montrer en grand »** est l'outil le plus utile le jour J : la leçon s'affiche en plein écran, en très gros, en contraste maximal, et le participant tourne son téléphone vers ses voisins. Une version texte de la carte est fournie aux lecteurs d'écran, comme l'a montré la leçon d'accessibilité de Wordle ([MacStories](https://www.macstories.net/ios/wordlebot-1-1-now-fully-accessible-with-native-emoji-to-image-conversion/)).

## Un design system sobre qui tient dans 300 Ko

### Couleur : un neutre chaud, la sarcelle pour avancer, l'ambre pour l'imprévu

Tailwind v4 définit ses couleurs en OKLCH sous l'espace de noms `--color-*` et permet de relier le thème à des variables redéfinies en mode sombre via `@theme inline` ([Tailwind Colors](https://tailwindcss.com/docs/colors)). Les ratios du tableau ont été **calculés par le chercheur** avec les formules WCAG 2.x et APCA 0.0.98G. Ils ne viennent pas d'un outil officiel et doivent être revérifiés avant de figer les tokens.

| Token sémantique | Clair | Sombre | Usage | Contraste mesuré |
|---|---|---|---|---|
| `--bg` | stone-50 `#fafaf9` | `oklch(18% .012 60)` ≈ `#16100c` | fond | — |
| `--surface` | `#ffffff` | `oklch(23% .012 60)` ≈ `#211c17` | cartes | — |
| `--text` | stone-900 `#1c1917` | `oklch(93% .01 80)` ≈ `#ebe7e1` | texte courant | 16,7:1 / Lc 101 ; sombre 15,3:1 / Lc −92 |
| `--text-muted` | stone-600 `#57534d` | stone-400 | texte secondaire | 7,3:1 / Lc 84 en clair |
| `--primary` | teal-700 `#00786f` | teal-300 `#46ecd5` (texte stone-950) | bouton principal, progression | blanc sur teal-700 5,36:1 ; sombre 11,8:1 |
| `--setback` | amber-700 `#bb4d00` (texte, bordure), fond amber-50 | amber-300 `#ffd230`, fond amber-950 | étape « Imprévu » | 5,03:1 / Lc 74 ; sombre 13,0:1 |
| `--pivot` | sky-700 `#0069a8` | sky-300 `#74d4ff` | étape « Pivot », type « complexe » | 5,86:1 ; sombre 11,3:1 |
| `--intelligent` | violet-700 `#7008e7` | violet-300 `#c4b4ff` | type « intelligent » | 7,30:1 ; sombre 10,2:1 mais Lc −67, à réserver aux badges ≥ 16 px en gras |
| `--basic` | amber-700, fond amber-400 `#ffb900` + texte stone-950 | amber-300 | type « basique » | badge plein 11,5:1 |

Ces valeurs entraînent trois règles strictes. **amber-600 `#e17100` échoue au niveau AA pour du texte (3,20:1)** : il est réservé aux éléments non textuels, qui doivent atteindre au moins 3:1 selon le critère 1.4.11 ([W3C 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). **Le rouge est réservé aux vraies erreurs système**, qui doivent rester rares. Et **aucune information ne passe par la seule couleur**, conformément au critère 1.4.1 ([W3C 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). Le trio ambre, bleu ciel et violet se distingue sur l'axe bleu-jaune, que la deutéranopie et la protanopie préservent. Les deux carnets ne s'accordaient pas sur la couleur de l'échec basique. Celui du bilan déconseillait l'ambre, qui évoque une alerte. Celui du design system le choisissait. Ce rapport retient l'ambre, parce qu'il code déjà « détour, apprentissage » à l'étape 2, à condition de toujours l'accompagner d'une icône et d'un libellé.

En amphi, sous la lumière du vidéoprojecteur ou au soleil, le contraste perçu chute et les écrans bon marché ont une luminosité maximale faible. Il faut donc viser **au moins 7:1 (AAA)** pour le texte courant, ce que permet le couple stone-900 sur stone-50. Le mode sombre suit les règles Material : pas de noir pur, une élévation exprimée par des surfaces plus claires, des accents désaturés dans les tons 200 à 300 ([Material Dark theme](https://m2.material.io/design/color/dark-theme)). Il suit `prefers-color-scheme` et dispose d'un **bouton manuel**, car dans un amphi sombre, un écran blanc éblouit l'utilisateur et gêne ses voisins. Aucune étude sur la lisibilité des smartphones sous vidéoprojecteur n'a été trouvée : cette recommandation reste une inférence.

### Typographie : Atkinson Hyperlegible Next, deux graisses, 25 Ko

Le chercheur a mesuré la taille des sous-ensembles « latin » de Fontsource. Atkinson Hyperlegible Next pèse **12,1 Ko en 400 et 12,7 Ko en 700** en statique, soit 24,8 Ko pour les deux, ou 34 Ko en variable 200–800. À titre de comparaison, Inter pèse 48,3 Ko en variable, Nunito 16,3 Ko par graisse et Lexend 14,5 Ko. La police a été publiée par le Braille Institute en février 2025 pour maximiser la distinction des caractères. Elle sépare nettement Il1 et O0, ce qui sert dans une école d'ingénieurs ([Wikipedia](https://en.wikipedia.org/wiki/Atkinson_Hyperlegible)). Aucune étude évaluée par les pairs ne porte spécifiquement sur la version « Next » : les bénéfices annoncés viennent de l'éditeur. **Mesure importante : aucun sous-ensemble latin testé ne contient l'espace fine insécable U+202F.** Il faut donc insérer **U+00A0** devant « : ; ! ? » et à l'intérieur des guillemets « », au moment du build et dans le JSON, ce qui est un repli admis ([La langue française](https://www.lalanguefrancaise.com/articles/espace-insecable)). Si la police est indisponible, la pile système (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`) coûte 0 Ko et affiche tous les accents.

| Rôle | Taille | Graisse | Interligne |
|---|---|---|---|
| Titre d'écran (h1) | 28 px (1,75 rem) | 700 | 1,2 |
| Titre d'étape (h2) | 22 px | 700 | 1,25 |
| Enjeu de la situation | 20 px | 700 | 1,35 |
| Texte courant (situation, bilan) | **18 px** (minimum absolu 16 px) | 400 | 1,55 |
| Libellé de carte-choix | 18 px | 700 | 1,35 |
| Texte secondaire, aide, étiquettes | 16 px | 400 ou 700 | 1,5 |
| Leçon (citation) | 22–24 px, largeur normale, jamais condensée | 700 | 1,35 |

Les lignes font de 35 à 45 caractères sur 360 px de large, avec une largeur maximale de 65ch. Le texte n'est pas justifié et `lang="fr"` est posé sur `<html>`. Ces valeurs de longueur de ligne et d'interligne viennent de la pratique typographique courante, pas d'une source primaire.

### Mouvement : CSS seulement, de 150 à 300 ms, désactivable

| Token | Durée | Usage | Sous `reduced-motion` |
|---|---|---|---|
| `--dur-micro` | 150 ms | appui (`scale(.98)`), sélection de carte (bordure et fond) | identique (pas de déplacement) |
| `--dur-step` | 200 ms | transition d'étape (fondu + translation de 16 à 24 px) | fondu de 100 ms ou rien |
| `--dur-reveal` | 250 ms, décalage de 80 ms | apparition des blocs du bilan | apparition directe |
| `--dur-setback` | 300 ms, une seule fois | basculement de -1,5° ou déplacement vertical, virage vers l'ambre | couleur et texte seuls |
| `--dur-flip` | 450 ms | retournement de la carte de tirage (accueil uniquement) | fondu de 200 ms |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | toutes les animations | — |

Les animations ne portent que sur `transform` et `opacity`. `backface-visibility` sert au retournement. `will-change` n'est posé que pendant l'animation. **Pas de `backdrop-filter`** : un en-tête flouté redessine tout à chaque frame sur les GPU faibles ([Mozilla bug 1732817](https://bugzilla.mozilla.org/show_bug.cgi?id=1732817)). Pas de bibliothèque d'animation JS non plus. Le retour haptique `navigator.vibrate?.(15)` ne fonctionne que sur Android, car Safari iOS ne l'implémente pas ([web-haptics](https://www.mintlify.com/lochie/web-haptics/advanced/browser-support)). Il est **désactivé par défaut** en amphi. Le critère WCAG 2.3.3 demande que tout mouvement déclenché par une interaction puisse être désactivé ([W3C 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)).

### Composants et extrait Tailwind v4

| Composant | Règles clés |
|---|---|
| `Stepper` | `<ol>` de 4 segments, `aria-current="step"` sur l'étape active, texte visible « Étape 2 sur 4 · Imprévu », focus sur le h2 à chaque changement |
| `ChoiceCard` | `<label>` qui englobe un `<input type="radio" class="sr-only peer">`, hauteur ≥ 56 px, écart ≥ 8 px, sélection marquée par une bordure 2 px + fond + coche, `focus-visible:outline-2` |
| `Button` | Principal : plein teal-700, 48 à 52 px de haut, rayon de 12 à 16 px, pleine largeur, ombre dure `0 3px 0` façon Duolingo. Secondaire : contour 2 px. Inactif : `aria-disabled` avec la raison affichée. |
| `StickyCTA` | `position: sticky; bottom: 0`, `padding-bottom: max(1rem, env(safe-area-inset-bottom))`, `viewport-fit=cover`, `scroll-padding-bottom` pour respecter le critère 2.4.11 ([W3C 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)), `min-h-dvh` avec repli en `100vh` ([caniuse dvh](https://caniuse.com/viewport-unit-variants)) |
| `SetbackCard` | Fond amber-50, bordure amber-700, icône ⚡ en SVG, titre « Rebondissement », sujet grammatical = le monde |
| `FailureTypeScale` | 3 segments, icône + libellé + phrase neutre, jamais la couleur seule |
| `ReflectionField` | Libellé visible, aide, placeholder d'exemple, `rows=4` qui grandit avec le texte, 16 px minimum, `aria-describedby` pour le compteur, annonce seulement aux seuils |
| `Toast` | `role="status"`, affiché 5 s au moins ou fermé à la main, au-dessus du bouton collant sans le masquer ; jamais pour une erreur bloquante |
| `InstallCard`, `ResumeCard`, `ReadyPill`, `ExportPanel`, `ShareSheet` | Voir la section 3 |

Les icônes sont des SVG en ligne, de **0,36 à 0,7 Ko** chacune : Lucide `lightbulb` fait 451 octets, Phosphor 704 ([mesuré via unpkg]). Une vingtaine d'icônes représente environ 10 Ko. Les emoji ne servent jamais à porter du sens, parce que leur rendu varie selon l'OS ([Mozilla bug 1760567](https://bugzilla.mozilla.org/show_bug.cgi?id=1760567)). Dans les maquettes ci-dessus, ils remplacent seulement des icônes SVG.

```css
/* app.css — Tailwind v4 */
@import "tailwindcss";
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@font-face { font-family: "Atkinson Hyperlegible Next"; font-weight: 400;
  font-display: swap; src: url("/fonts/ahn-latin-400.woff2") format("woff2"); }
@font-face { font-family: "Atkinson Hyperlegible Next"; font-weight: 700;
  font-display: swap; src: url("/fonts/ahn-latin-700.woff2") format("woff2"); }

:root {
  --app-bg: #fafaf9;        --app-surface: #ffffff;
  --app-text: #1c1917;      --app-muted: #57534d;
  --app-primary: #00786f;   --app-on-primary: #ffffff;
  --app-setback: #bb4d00;   --app-setback-bg: var(--color-amber-50);
  --app-pivot: #0069a8;     --app-intelligent: #7008e7;
}
[data-theme="dark"] {
  --app-bg: oklch(18% .012 60);   --app-surface: oklch(23% .012 60);
  --app-text: oklch(93% .01 80);  --app-muted: var(--color-stone-400);
  --app-primary: #46ecd5;         --app-on-primary: #0c0a09;
  --app-setback: #ffd230;         --app-setback-bg: var(--color-amber-950);
  --app-pivot: #74d4ff;           --app-intelligent: #c4b4ff;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* mêmes valeurs que [data-theme="dark"] */ }
}

@theme inline {
  --color-bg: var(--app-bg);           --color-surface: var(--app-surface);
  --color-ink: var(--app-text);        --color-muted: var(--app-muted);
  --color-primary: var(--app-primary); --color-on-primary: var(--app-on-primary);
  --color-setback: var(--app-setback); --color-setback-bg: var(--app-setback-bg);
  --color-pivot: var(--app-pivot);     --color-intelligent: var(--app-intelligent);
}
@theme {
  --font-sans: "Atkinson Hyperlegible Next", system-ui, -apple-system,
               "Segoe UI", Roboto, "Noto Sans", sans-serif;
  --text-base: 1.125rem; --text-base--line-height: 1.55;   /* 18 px */
  --ease-out-soft: cubic-bezier(.2,.8,.2,1);
}

@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root) { animation: 200ms var(--ease-out-soft) both ff-out; }
  ::view-transition-new(root) { animation: 200ms var(--ease-out-soft) both ff-in; }
  .setback-enter { animation: ff-nudge 300ms var(--ease-out-soft) 1; }
}
@keyframes ff-out   { to   { opacity: 0; transform: translateY(-16px); } }
@keyframes ff-in    { from { opacity: 0; transform: translateY(16px); } }
@keyframes ff-nudge { 40%  { transform: rotate(-1.5deg); } }
```

Une carte-choix s'écrit alors en Tailwind v4 :

```html
<label class="flex min-h-14 gap-3 rounded-2xl border-2 border-muted/30 bg-surface p-4
              has-[:checked]:border-primary has-[:checked]:bg-primary/10
              has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
  <input type="radio" name="choice" value="B" class="peer sr-only">
  <span class="font-bold">Négocier un report</span>
  <svg class="ml-auto hidden size-6 peer-checked:block" aria-hidden="true">…</svg>
</label>
```

Les valeurs hexadécimales des tokens Tailwind non mesurés dans le carnet (amber-50, amber-950, stone-400) sont référencées par leur nom de variable, pour ne pas introduire de chiffres non vérifiés.

### Budget de poids : le framework domine, le contenu est sous-estimé

| Poste | Estimation (compressé) | Source |
|---|---|---|
| HTML + CSS Tailwind purgé | 15–30 Ko | carnet design system |
| Police (2 graisses statiques) | ≈ 25 Ko | mesuré |
| JS Next.js (runtime + page) | 90–150 Ko | estimation non mesurée |
| Icônes SVG (environ 20) | ≈ 10 Ko | mesuré par icône |
| **Contenu JSON (12 scénarios, 108 bilans)** | **≈ 60–90 Ko** | calcul de ce rapport, ci-dessous |
| Capture DOM (modern-screenshot), chargée à la demande, facultative | 9,5 Ko | [bundlephobia](https://bundlephobia.com/package/modern-screenshot) |
| **Total précaché** | **≈ 200–300 Ko** | sous les 500 Ko |

Le carnet estimait le contenu JSON à 10–30 Ko, ce qui est trop bas. Au plafond prévu par l'annexe B, un scénario compte 9 bilans × 5 champs × 60 mots, soit environ 2 700 mots, plus environ 400 mots de situation, de choix et d'imprévus. Cela fait **environ 37 000 mots pour les 12 scénarios, soit autour de 250 Ko bruts**, et de l'ordre de 60 à 90 Ko une fois compressés. C'est une estimation de l'auteur, à mesurer sur le vrai fichier. Le budget tient quand même. En revanche, les bibliothèques à proscrire le feraient exploser : jsPDF pèse **126,7 Ko**, pdf-lib **173,3 Ko**, html2canvas **45,4 Ko** et satori **659 Ko** compressés ([bundlephobia jspdf](https://bundlephobia.com/package/jspdf) ; [bundlephobia satori](https://bundlephobia.com/package/satori)).

## Export, partage et PWA : cinq décisions techniques visibles à l'écran

**1. Dessiner la carte en Canvas 2D, sans bibliothèque.** Une carte de texte fixe dessinée avec l'API Canvas ne coûte **0 Ko** de bibliothèque. Elle évite les incohérences de rendu du SVG `foreignObject`, utilisé par html-to-image et modern-screenshot, que certains signalent « surtout dans Firefox et Safari » ([DEV comparatif](https://dev.to/shaishav_patel_271fdcd61a/html2canvas-vs-dom-to-image-vs-html-to-image-browser-screenshot-library-comparison-4h5c)). Il faut attendre `document.fonts.load('700 64px "Atkinson Hyperlegible Next"')` avant de dessiner, faire le retour à la ligne à la main avec `measureText` et réduire la taille de police au-delà de N lignes. Une toile de 1080 × 1350 occupe environ 5,8 Mo de mémoire RGBA, ce qui reste supportable sur un Android bas de gamme. Une capture DOM de toute la page à `scale: 3`, en revanche, peut épuiser la mémoire. Cette dernière remarque est une inférence, non mesurée.

**2. Générer l'image avant le tap pour contourner Safari.** WebKit exige depuis longtemps un geste utilisateur « vivant » pour `navigator.share`. Attendre un traitement asynchrone, comme un `toBlob`, avant d'appeler `share` peut provoquer une erreur `NotAllowedError` ([WebKit bug 197779](https://bugs.webkit.org/show_bug.cgi?id=197779) ; [Apple Forums 662629](https://developer.apple.com/forums/thread/662629)). L'image est donc générée **dès l'ouverture de l'écran « Ma leçon »** et gardée en mémoire. Au tap, le code vérifie `navigator.canShare({files})` puis appelle `navigator.share`. Si le partage n'est pas possible, il propose un téléchargement `<a download>`. Une annulation par l'utilisateur (`AbortError`) n'est pas une erreur. Le partage Web couvre environ 94 % des utilisateurs, sauf Firefox sur ordinateur ([caniuse web-share](https://caniuse.com/web-share)). `canShare` n'est pas encore Baseline ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)), et aucun tableau de support par version n'existe pour le partage de **fichiers** en 2026. Il faut donc tester sur de vrais appareils.

**3. Faire de la copie texte l'export principal, et du PDF une option.** `navigator.clipboard.writeText` fonctionne partout et reste accessible. `ClipboardItem` pour une image PNG est Baseline 2024 ([MDN Clipboard.write](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write)). Pour le PDF, une feuille `@media print` et `window.print()` suffisent, sans jsPDF. Un vieux fil Apple signale que l'impression ne fonctionne pas depuis une web app lancée depuis l'écran d'accueil ([Apple Forums 22911](https://developer.apple.com/forums/thread/22911)), et rien ne confirme la situation sous iOS 18 à 26. Le bouton « Imprimer / PDF » est donc **masqué en mode standalone sur iOS**.

**4. Geler la version et ne jamais proposer de mise à jour pendant un parcours.** Un nouveau service worker attend la fermeture de tous les onglets avant de s'activer. Workbox recommande de proposer un rechargement par un toast non bloquant, et d'**enregistrer l'état avant** ([Workbox](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)). Pour Fail Forward, le dernier déploiement a lieu au plus tard à J-3 (c'est le gel prévu). L'app n'appelle jamais `skipWaiting` automatiquement, et une éventuelle invite de mise à jour ne s'affiche que sur l'accueil, quand aucun parcours n'est en cours. Le manifeste déclare `display: standalone`, `lang: "fr"`, `start_url: "./"` et des icônes 192, 512 et maskable. Pour le service worker, Serwist, successeur de next-pwa, propose une étape de build externe qui précache toutes les routes prérendues ([Serwist](https://serwist.pages.dev/docs/next/config)). Son support officiel de `output: "export"` **n'a pas été confirmé**. Un service worker écrit à la main reste le repli sûr.

**5. Prévoir une interface distincte pour chaque contexte d'exécution.** L'app détecte `location.protocol === 'file:'` ou l'absence de `navigator.serviceWorker`. En mode fichier unique, elle masque l'installation, la pastille « Prête » et l'historique, et affiche « Version de secours : copie ton bilan avant de fermer ». Dans la version miroir, une mention discrète « Version de secours (miroir) » apparaît en pied de page. Les deux QR codes portent chacun leur étiquette. Un appel facultatif à `navigator.storage?.persist?.()` après le premier parcours ne coûte rien. Il fonctionne sous Chromium, son effet est incertain sous iOS, et l'app ne doit jamais en dépendre ([Apple Forums 710157](https://developer.apple.com/forums/thread/710157)).

Le contexte matériel justifie cette sobriété. **Transsion (Tecno, Infinix, itel) représente 48 % des livraisons de smartphones en Afrique en 2025** selon Omdia, ou 51 % selon Canalys au T2 2025 ([Gizmochina/Omdia](https://www.gizmochina.com/2026/02/25/transsion-captures-48-as-africa-smartphone-market-grows-13-in-2025/) ; [Canalys](https://canalys.com/newsroom/africa-smartphone-market-q2-2025)). En Afrique subsaharienne, 1 Go de données dépasse souvent 7 % du revenu mensuel, alors que la cible de l'ONU est de 2 % ([GSMA](https://www.gsma.com/wp-content/uploads/2025/09/Breaking-barriers-handset-affordability.pdf)). Les tests doivent donc porter en priorité sur Chrome Android et Samsung Internet, à 360 puis 320 px, avec une luminosité faible. Afficher « moins de 0,5 Mo » sur la carte d'installation rassure ceux qui paient leurs données. Aucune donnée propre au Sénégal ou aux étudiants de l'ESP (part iOS et Android, prix des données mobiles) n'a été trouvée.

## Quinze amendements à soumettre au comité, par ordre d'urgence

Les amendements P0 modifient le contenu à générer ou le sens pédagogique : ils doivent être tranchés **avant** l'écriture du prompt système (semaine 1). Les P1 modifient le périmètre ou les tests. Les P2 sont des ajustements de rédaction et de recette.

| Rang | Priorité | Amendement | Sections touchées | Justification |
|---|---|---|---|---|
| 1 | **P0** | Redéfinir l'échec « basique » sans le mot « négligence » ; écrire l'imprévu de l'étape 2 seulement comme un échec complexe ou intelligent ; adopter des phrases-types neutres pour le badge | §6.4, §7.6, annexe B | Contradiction avec §5.2 et §6.3 ; écart d'Edmondson entre 2–5 % d'échecs blâmables et 70–90 % traités comme tels |
| 2 | **P0** | Pivots concrets **par choix** (9 libellés par scénario, toujours 9 bilans), étiquette de catégorie en secondaire, meilleure trajectoire variable d'un scénario à l'autre ; retirer « s'entêter » | §5.2, §6.2, §8.6, annexe B | Les joueurs sautent aux options (inkle) ; sinon, le second parcours apprend « l'option qui marche » (Westera) |
| 3 | **P0** | Aligner les 4 blocs du bilan sur le schéma : bloc 1 assemblé localement, `outcome` affiché à l'étape 4, règle de « 60 mots par champ » | §5.3, §7.2, §8.6, EF-09 | Aucun champ ne correspond au résumé ; `outcome` n'est rattaché à aucun bloc |
| 4 | **P0** | Chronomètre : soit l'afficher au bilan comme repère neutre et l'annoncer à l'accueil, soit supprimer EF-07 ; dans tous les cas, l'arrêter au premier tap et placer la note libre après le choix | EF-07, EF-08, §8.6, §10.3 | Mesure sans usage, surveillance perçue, temps de frappe compté dans la mesure |
| 5 | **P0** | Ajouter un champ « Ta leçon en une phrase », écrit avant l'affichage de `key_takeaway`, qui alimente la carte ; passer la leçon en texte en M et la carte image en S | EF-10, EF-17, §5.4 | Rituel Failure:Lab ; le débriefing dépend des cartes (§8.5) |
| 6 | **P0** | Remplacer l'indicateur « 85 % » par un indicateur observable en salle, ou le supprimer | §1.2, §16 | La plateforme ne mesure rien (§14, §16) |
| 7 | **P0** | Imprimer deux QR codes distincts et étiquetés, avec la consigne « garde l'adresse installée » ; afficher la version utilisée dans l'app | §8.4, annexe A | Un QR code ne contient qu'une URL ; deux origines = deux caches |
| 8 | P1 | Stratégie iOS : installation sur l'écran d'accueil présentée comme la façon de précharger, rappel « rouvre l'app la veille », annonce resserrée (J-7 → J-1) ; ajouter au test du §11 un iPhone préchargé à J-10 | §8.4, §12, §11 | Plafond WebKit de 7 jours ; exemption des web apps installées, mais persistance inégale en pratique |
| 9 | P1 | Fichier unique : soit un build Vite séparé avec une interface dédiée et un test iOS obligatoire, soit le cantonner explicitement à Android ; trancher la décision §14.4 | EF-16, §8.4, §14 | L'export Next ne produit pas ce fichier ; `file://` non vérifié |
| 10 | P1 | Mode Équipe différencié (vouvoiement, invitation à débattre, noms d'équipe) ou fusionné avec Solo | EF-03, §3 | Aujourd'hui, une option sans effet |
| 11 | P1 | Définir le budget comme « total précaché < 500 Ko transférés compressés » ; interdire jsPDF, pdf-lib, html2canvas et satori ; mesurer le JSON réel | §10.1, §9.2 | Ambiguïté entre compressé et brut ; contenu sous-estimé |
| 12 | P1 | Export : copie texte en principal, image Canvas, PDF via `window.print` masqué en PWA iOS ; une seule invite douce avant « Nouveau parcours » | EF-11, §8.5 | Coût en poids des bibliothèques PDF ; impression incertaine en PWA iOS ; *confirmshaming* à éviter |
| 13 | P2 | Retirer de §9.1 les quotas des fonctions Vercel ; ajouter une règle « aucune invite de mise à jour pendant un parcours » | §9.1, §8.1 | Sans objet pour un site statique ; risque de rechargement en plein parcours |
| 14 | P2 | Charte rédactionnelle : tutoiement en Solo et vouvoiement en Équipe, « Imprévu » au lieu de « Échec contrôlé » dans l'interface, issues sans « aggravation », U+00A0 avant la ponctuation haute et dans les guillemets | §5, §6.3, annexe B | Cohérence du ton ; aucune police testée ne contient U+202F |
| 15 | P2 | Ajouter au §11 des critères d'acceptation d'interface : contraste ≥ 7:1 pour le texte courant, cibles ≥ 44 px, `reduced-motion` vérifié, 360 et 320 px, un appareil Transsion, mode sombre en salle obscure, lecteur d'écran sur le bilan | §10.4, §11 | Aujourd'hui « Affichage correct partout » n'est pas vérifiable |

## Conclusion

Le principal enseignement de cette étude est que **le risque de Fail Forward n'est pas technique mais rédactionnel et visuel**. L'architecture statique a déjà réglé la question des quotas et du réseau. En revanche, trois mots (« négligence », « s'entêter », « aggravation »), trois libellés de pivot identiques dans tous les scénarios et un chronomètre muet suffiraient à transformer une simulation qui dédramatise en simulation qui juge. Or ces choix sont figés **dans le prompt et dans le JSON** avant la première ligne d'interface. Les amendements P0 doivent donc être votés avant la génération des 108 bilans, pas après la recette.

Le second enseignement est une question d'équilibre. Les projets qui ont marqué, de l'*Uber Game* à Wordle, ont réussi avec très peu : du texte, des cartes, une copie en texte brut. Pour Fail Forward, ce minimalisme est la seule façon de tenir à la fois la contrainte des 500 Ko, celle de l'Android bas de gamme et celle de l'absence d'intervention le jour J. Restent des inconnues qui ne se lèveront que sur le terrain : le partage de fichiers et l'impression en PWA iOS, `localStorage` en `file://`, la durée réelle de survie d'une précharge sur iPhone, et l'effet d'une échelle de types d'échec sur des étudiants qui viennent d'échouer. La répétition avec 30 à 50 volontaires prévue au §11 doit être conçue pour répondre à ces questions précises, et pas seulement pour vérifier que « ça marche ».
