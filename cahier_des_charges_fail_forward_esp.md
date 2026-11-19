# Cahier des charges — Plateforme web « Fail Forward ESP »

Version 1.2 — 17 novembre 2026 — Statut : à valider par le comité d'organisation

## 1. Présentation du projet

### 1.1 Contexte

La Journée « Fail Forward » de l'ESP (École Supérieure Polytechnique) a pour but de dédramatiser l'échec et d'en faire un levier d'apprentissage. La plateforme web est l'outil numérique des deux temps forts de la journée :

- **Failure Lab** : une simulation interactive où chaque participant affronte un dilemme décisionnel, subit un échec inévitable au premier essai (principe *Design for Failure*), puis doit pivoter.
- **Failure Reflection** : un bilan personnalisé généré à partir de ses choix, suivi d'une courte réflexion guidée (AMDEC / 5 Pourquoi) qui alimente son *Failure Journal*.

### 1.2 Objectifs

| Objectif | Indicateur de réussite |
| --- | --- |
| Faire vivre un échec contrôlé et sans risque à chaque participant | Au moins 85 % des parcours démarrés sont terminés |
| Donner un bilan factuel et bienveillant, utilisable dans le Failure Journal | Bilan affiché en moins de 2 s pour 100 % des parcours |
| Tenir la charge de 400 à 500 participants simultanés | Aucune erreur technique visible, même sans Wi-Fi |
| Coût d'infrastructure nul | 0 FCFA facturé, 100 % offres gratuites |
| Alimenter le débriefing en plénière | Chaque participant repart avec un bilan exportable et une leçon à partager à l'oral |

### 1.3 Périmètre

**Inclus :** application web mobile-first en français, un lot de 12 scénarios générés par l'IA et tirés au sort, bilans rédigés avec l'IA avant l'événement et relus, module de réflexion, export du bilan, carte « Ma leçon » (optionnel).

**Exclus :** comptes utilisateurs et mots de passe, application mobile native, notation ou évaluation des étudiants, paiement, publicité, collecte de données personnelles réelles, base de données, serveur applicatif, IA en direct, écran organisateur et Mur des Apprentissages (décisions du 17 novembre : tout reste dans le téléphone, aucune dépendance au réseau le jour J).

### 1.4 Parties prenantes

| Rôle | Responsabilité |
| --- | --- |
| Comité d'organisation (commanditaire) | Valide le cahier des charges, les scénarios et le ton pédagogique |
| Étudiant développeur (seul, titulaire de tous les comptes) | Réalise, teste et gèle la plateforme avant l'événement ; peut être injoignable le jour J |
| Encadrant pédagogique | Relit les scénarios et les prompts, garant de la sécurité psychologique |
| Participants (400 à 500) | Utilisateurs finaux, toutes filières confondues |

### 1.5 Glossaire

- **Parcours** : une partie complète d'un scénario, du premier choix au bilan.
- **Pivot** : décision de changer de stratégie après l'échec.
- **Pseudo** : nom libre saisi par le participant, modifiable à chaque parcours.
- **Lot de scénarios** : les 12 scénarios générés par l'IA avant l'événement ; l'un d'eux est tiré au sort pour chaque parcours.
- **Bilan pré-généré** : texte de bilan rédigé à l'avance avec l'IA et relu, un par couple (choix, pivot).

## 2. Contraintes et hypothèses

**Contraintes**

- Budget d'infrastructure de 0 FCFA : uniquement des offres gratuites, sans carte bancaire si possible.
- Aucune authentification ni base de données : un pseudo suffit et tout reste dans le téléphone (localStorage).
- Usage strictement non commercial (condition du plan gratuit Vercel Hobby) : pas de billetterie payante ni de publicité sur la plateforme.
- Utilisation sur smartphone par 400 à 500 personnes dans un seul lieu. Le Wi-Fi de l'ESP n'est pas garanti : la plateforme doit fonctionner sans réseau le jour J.
- Un seul développeur, titulaire de tous les comptes, potentiellement injoignable le jour J : aucune intervention technique ne doit être nécessaire pendant l'événement.
- Les scénarios ne doivent avantager aucune filière.

**Hypothèses (à confirmer, voir section 14)**

- Date de l'événement : non fixée. L'équipe dispose largement du temps nécessaire ; les durées de la section 12 sont indicatives.
- 1 à 2 parcours par participant ; un téléphone n'appelle aucun serveur pendant un parcours.
- Durée cible d'un parcours : 8 à 12 minutes.
- Les quotas des offres gratuites (section 9) ne concernent que la génération des contenus avant l'événement et l'hébergement ; ils sont à revérifier avant la génération.

## 3. Utilisateurs

| Profil | Besoin | Conséquence de conception |
| --- | --- | --- |
| Participant | Jouer vite, sans compte, sans être jugé | Pseudo libre ou aléatoire, aucune donnée nominative |
| Participant en binôme | Débattre à deux sur un seul téléphone | Mode « Équipe » : un appareil, un pseudo d'équipe |
| Organisateur | Animer la séance et le débriefing, surveiller la plateforme | QR code d'accès et consignes ; aucun écran d'administration |
| Développeur | Livrer un site qui n'a besoin d'aucune intervention le jour J | Site statique gelé à J-3, miroir d'hébergement, aucun serveur à surveiller |

## 4. Exigences fonctionnelles

Priorités : **M** = indispensable, **S** = souhaitable, **C** = si le temps le permet.

| ID | Exigence | Priorité |
| --- | --- | --- |
| EF-01 | Saisie d'un pseudo (3 à 20 caractères) avant de démarrer, avec bouton « pseudo aléatoire » | M |
| EF-02 | Filtrage des pseudos (caractères autorisés, liste de mots interdits) | M |
| EF-03 | Choix du mode : Solo, ou Équipe (2 à 3 personnes sur un seul appareil, un pseudo d'équipe) | M |
| EF-04 | Scénario tiré au sort dans le lot de 12, avec un bouton « Tirer un autre scénario » (une fois par parcours) | M |
| EF-05 | Simulateur en 4 étapes : 3 choix à l'étape 1, 3 options de pivot à l'étape 3 | M |
| EF-06 | Échec contrôlé à l'étape 2, déterminé par le choix de l'étape 1 | M |
| EF-07 | Étape de pivot avec chronomètre silencieux du temps de décision | M |
| EF-08 | Zone de justification libre, optionnelle, limitée à 200 caractères (reste dans le téléphone) | S |
| EF-09 | Bilan en 4 blocs : résumé, point de bascule, analyse du rebond, leçon clé | M |
| EF-10 | Formulaire Failure Reflection (3 questions courtes) | M |
| EF-11 | Export du bilan : copie texte, et capture ou PDF généré côté navigateur | M |
| EF-12 | Bouton « Nouveau parcours » permettant de changer de pseudo en un clic | M |
| EF-13 | Historique local des parcours terminés sur l'appareil | S |
| EF-14 | Reprise automatique du parcours après rafraîchissement de la page | M |
| EF-15 | Contenus pré-générés : 12 scénarios et 108 bilans rédigés avec l'IA avant l'événement, relus, servis comme fichiers statiques | M |
| EF-16 | Version « fichier unique » de secours : un seul fichier .html qui contient tout, partageable par WhatsApp, Bluetooth ou clé USB | S |
| EF-17 | Carte « Ma leçon » exportable en image, sans pseudo, pour le partage oral en plénière | C |
| EF-18 | Aucune dépendance au réseau ni à un serveur pendant un parcours | M |
| EF-19 | Fonctionnement hors-ligne complet après un premier chargement ; installation possible à domicile avant l'événement | M |

## 5. Parcours utilisateur détaillé

### 5.1 Écran 1 — Accueil

Titre, une phrase de consigne (« Ici, rater fait partie du jeu »), champ pseudo, choix Solo ou Équipe, tirage au sort du scénario avec un bouton « Tirer un autre scénario », avertissement de confidentialité (ne saisir aucune information réelle sensible). Bouton « Commencer » inactif tant que le pseudo n'est pas valide.

### 5.2 Écran 2 — Simulateur (Failure Lab)

| Étape | Contenu | Origine |
| --- | --- | --- |
| 1. Situation | Contexte de 80 à 120 mots et 3 options d'action | Scénario tiré au sort dans le lot (JSON local) |
| 2. Échec contrôlé | Un aléa réaliste, lié au choix de l'étape 1, fait échouer l'hypothèse de départ ; bouton « Continuer » | Texte du scénario (JSON local) |
| 3. Pivot | Choix entre s'entêter, pivoter partiellement ou pivoter radicalement ; le temps de décision est mesuré | Texte du scénario (JSON local) |
| 4. Finalité | Conséquences concrètes : atténuation réussie ou aggravation | Bilan correspondant au couple (choix, pivot) |

Une barre de progression indique l'étape courante. Aucun texte ne doit culpabiliser le participant : l'échec est présenté comme une propriété du scénario, pas de la personne.

### 5.3 Écran 3 — Bilan et réflexion

Le bilan est composé de quatre blocs : (1) résumé chronologique des décisions, (2) point de bascule, (3) analyse du rebond avec qualification de l'échec (basique, complexe ou intelligent), (4) leçon clé. Sous le bilan, trois questions courtes : *Cause racine selon vous ? Quel aurait été l'impact réel ? Quelle sera votre prochaine action concrète ?* Puis les boutons « Exporter / Copier » et « Nouveau parcours ».

Le bilan s'affiche instantanément : c'est le texte pré-généré qui correspond au choix et au pivot du participant (EF-15). Aucun appel réseau n'est nécessaire.

### 5.4 Écran 4 — Carte « Ma leçon » (optionnel)

À la fin de la réflexion, le participant peut générer une carte image avec sa leçon clé, sans pseudo. Elle est créée dans le navigateur, sans aucun envoi vers un serveur. En plénière, l'animateur invite des volontaires à partager leur carte à l'oral ; rien n'est projeté automatiquement.

## 6. Contenu pédagogique

### 6.1 Scénarios

Prévoir un lot de 12 scénarios neutres, générés par l'IA avant l'événement. Chaque participant en reçoit un au hasard. Thèmes de départ :

- **Crise de lancement** : un prestataire clé fait défaut 48 h avant la livraison.
- **Conflit d'équipe pluridisciplinaire** : blocage de communication et retard sur un livrable.
- **Dilemme éthique et budgétaire** : un client presse de valider un livrable non testé.
- **Pivot d'urgence** : l'hypothèse de marché de départ s'avère fausse.
- **Panne en production** : un incident survient pendant une démonstration.
- **Ressources coupées** : le budget ou l'équipe est réduit en cours de projet.
- **Fuite d'information** : un document interne circule hors de l'équipe.
- **Concurrent plus rapide** : un projet quasi identique sort avant le vôtre.
- **Changement de règles** : une réglementation ou un cahier des charges change en cours de route.
- **Partenaire qui se désiste** : un lieu ou un fournisseur annule à la dernière minute.
- **Première démonstration ratée** : le retour du client est très négatif.
- **Surcharge** : trop de tâches en parallèle et un membre clé s'épuise.

### 6.2 Structure d'un scénario

Chaque scénario contient : 1 situation initiale, 3 choix, 3 événements d'échec (un par choix), 3 options de pivot et 9 bilans (3 choix x 3 pivots). Pour 12 scénarios, cela fait 108 bilans. Les scénarios et les bilans sont rédigés avec l'IA avant l'événement (section 7), puis relus par le développeur et, sur un échantillon, par l'encadrant.

### 6.3 Règles d'écriture

- Aucun jargon propre à une filière ; situations compréhensibles par tous.
- Toutes les options sont plausibles : il n'y a pas de « bonne » réponse évidente.
- L'échec est inévitable mais l'issue dépend de la qualité du pivot.
- Ton constructif, sans jugement ni ironie.

### 6.4 Typologie d'échec utilisée dans le bilan

- **Échec basique** : cause évitable (négligence, oubli).
- **Échec complexe** : plusieurs causes qui interagissent.
- **Échec intelligent** : résultat d'une expérimentation raisonnée dont on tire un apprentissage.

## 7. Rôle de l'intelligence artificielle

### 7.1 Principe de conception

L'IA travaille **avant** l'événement, jamais pendant. Trois contraintes l'imposent : 400 à 500 participants arriveraient au bilan presque en même temps (environ 100 demandes par minute, quand les offres gratuites en acceptent environ 26) ; le Wi-Fi de l'ESP n'est pas garanti ; et le développeur, seul, peut être injoignable le jour J. L'IA rédige donc un lot de scénarios et leurs bilans, relus à l'avance et embarqués dans l'application. Le jour J, le téléphone n'a besoin ni d'un serveur ni d'une IA : il tire un scénario au sort localement dans le lot.

### 7.2 Ce que l'IA génère

- Un lot de 12 scénarios neutres (thèmes en 6.1), chacun avec 1 situation, 3 choix, 3 événements d'échec et 3 options de pivot.
- 9 bilans par scénario, un par couple (choix de l'étape 1, option de pivot) : 12 x 9 = 108 bilans.
- Chaque bilan suit les 4 blocs de la section 5.3, avec 60 mots au maximum par bloc.

Deux voisins ont 1 chance sur 12 d'avoir le même scénario : cela limite la copie et renouvelle l'expérience d'un deuxième parcours.

### 7.3 Chaîne de génération

1. Écrire le prompt système (annexe B) et le tester sur 2 scénarios.
2. Générer les 12 scénarios avec Groq ou Google AI Studio, depuis l'ordinateur du développeur, en imposant un thème différent à chaque appel. Compter 12 à 25 appels et moins de 150 000 tokens au total, soit moins d'une journée de quota d'un seul modèle Groq.
3. Valider chaque fichier par un script : 3 choix, 3 événements d'échec, 3 pivots, 9 bilans, JSON valide, longueurs respectées.
4. Relire les 108 bilans : le développeur lit tout (environ 3 heures) ; l'encadrant relit au moins 20 % tirés au hasard (justesse, ton bienveillant, absence de jugement).
5. Corriger, puis geler le lot dans le dépôt GitHub, au plus tard à J-3.

### 7.4 Pourquoi pas de génération en direct

Générer un scénario pour chaque participant pendant le jeu est écarté, pour les trois raisons de la section 7.1 : les quotas gratuits seraient dépassés dès la première minute (500 générations simultanées contre environ 26 appels par minute sur Groq), il faudrait un réseau fiable et des clés API actives, et personne ne serait là pour réparer en cas de panne. Le tirage au sort dans un lot de 12 donne la même impression de variété sans aucun de ces risques. Si une offre payante devenait disponible plus tard, la génération en direct pourrait s'ajouter.

### 7.5 Attention à la confusion Grok / Groq

**Groq** (console.groq.com) propose un plan gratuit permanent sans carte bancaire. **Grok** (xAI, api.x.ai) est une API facturée au token, sans offre gratuite permanente : les crédits d'essai éventuels sont temporaires et conditionnés, à vérifier dans la console. La génération s'appuie sur Groq et Google AI Studio ; xAI n'est qu'un secours si des crédits actifs sont confirmés.

### 7.6 Contrat de prompt

- Prompt système fixe, sortie en JSON strict conforme au schéma de la section 8.6, validée par script.
- Un thème imposé par appel, pour éviter les doublons.
- Interdictions : juger la personne, évoquer une filière, produire du contenu sensible, citer des marques ou des personnes réelles.
- Les bilans restent factuels et bienveillants : l'échec est un fait du scénario, pas un défaut de la personne.

## 8. Architecture technique

### 8.1 Stack

- **Application :** Next.js (export statique) + Tailwind CSS. Aucun serveur applicatif.
- **Hébergement :** Vercel Hobby (0 FCFA), avec un miroir identique sur GitHub Pages.
- **Contenu :** un fichier JSON statique (12 scénarios, 108 bilans) dans le dépôt GitHub.
- **Stockage :** localStorage uniquement, aucune base de données.
- **Hors-ligne :** un service worker met l'application en cache ; après un premier chargement, elle fonctionne sans réseau et peut s'installer sur l'écran d'accueil.
- **IA :** utilisée uniquement avant l'événement, pour générer le contenu.

### 8.2 Schéma de flux

```
Avant l'événement (ordinateur du développeur)
IA (Groq ou Gemini) --> 12 scénarios + 108 bilans --> validation --> relecture --> JSON dans GitHub
GitHub --> Vercel (lien principal) + GitHub Pages (miroir)

Chez l'étudiant, avant ou pendant l'événement
Téléphone --> télécharge l'application une seule fois --> cache hors-ligne
Parcours : scénario tiré au sort, choix, pivot, bilan, réflexion --> tout en local (localStorage)
```

### 8.3 Aucun serveur, aucune clé

Le site est entièrement statique : pas de route serveur, pas de clé API, pas de variable d'environnement, aucun quota à surveiller le jour J. Les clés Groq ou Google AI Studio ne servent qu'à la génération, sur l'ordinateur du développeur, et ne sont jamais placées dans le dépôt.

### 8.4 Distribution et plan B réseau

Le Wi-Fi de l'amphi n'étant pas garanti, l'accès ne doit pas en dépendre :

1. **Précharge à domicile (recommandée) :** annoncer le lien et le QR code une à deux semaines avant ; chaque étudiant l'ouvre une fois avec ses propres données (environ 0,5 Mo) et installe l'application.
2. **Deux adresses :** le lien principal (Vercel) et le miroir (GitHub Pages), tous deux sur le QR code et sur les diapositives.
3. **Fichier unique de secours :** une version tout-en-un (.html) que les étudiants peuvent se transmettre par WhatsApp, Bluetooth ou clé USB si personne n'a de réseau.
4. **Affichage :** QR code imprimé et projeté en grand.

### 8.5 Stockage : localStorage uniquement

Tout le parcours (pseudo, scénario, choix, pivot, bilan, réflexion, historique) reste dans le localStorage du téléphone, à raison d'environ 4 Ko par parcours pour environ 5 Mo disponibles par navigateur.

- Rien n'est collecté côté serveur : anonymat total et aucune panne de base possible.
- Les données sont perdues en navigation privée, après un vidage du cache ou en changeant d'appareil : l'écran de fin rappelle d'exporter le bilan.
- Aucune statistique globale, et ce n'est pas un problème : le débriefing s'appuie sur les cartes « Ma leçon » et sur la parole des participants.

### 8.6 Modèle de données

Fichier de contenu : un scénario (le fichier en contient 12) et ses 9 bilans, dont la clé est « choix_pivot ».

```json
{
  "id": "crise_lancement_01",
  "theme": "Crise de lancement",
  "situation": "...",
  "choices": [
    { "id": "A", "label": "...", "failure_event": "..." },
    { "id": "B", "label": "...", "failure_event": "..." },
    { "id": "C", "label": "...", "failure_event": "..." }
  ],
  "pivots": [
    { "id": "1", "label": "Maintenir le cap" },
    { "id": "2", "label": "Ajuster partiellement" },
    { "id": "3", "label": "Changer radicalement" }
  ],
  "bilans": {
    "A_1": {
      "turning_point": "...",
      "pivot_evaluation": "...",
      "failure_type": "basique | complexe | intelligent",
      "outcome": "...",
      "key_takeaway": "..."
    }
  }
}
```

Parcours enregistré dans le téléphone (environ 4 Ko) :

```json
{
  "run_id": "uuid-v4",
  "pseudo": "PolyTech_42",
  "mode": "solo | team",
  "scenario_id": "crise_lancement_01",
  "started_at": "ISO-8601",
  "choice_id": "B",
  "pivot_id": "2",
  "pivot_decision_ms": 48200,
  "free_note": "",
  "bilan_id": "crise_lancement_01_B_2",
  "reflection": { "root_cause": "...", "impact": "...", "next_action": "..." }
}
```

## 9. Dimensionnement et quotas

### 9.1 Quotas des offres gratuites (à revérifier avant la génération des contenus)

| Service | Limites relevées | Point d'attention |
| --- | --- | --- |
| Vercel Hobby | 100 Go/mois de transfert, 1 M d'invocations, 4 h d'Active CPU, 300 s par fonction, logs conservés 1 h | Usage non commercial uniquement ; le projet est mis en pause (non facturé) si un plafond est atteint |
| Groq (plan gratuit) | Par modèle : 30 requêtes/min, 1 000 requêtes/jour, 8 000 tokens/min, 200 000 tokens/jour | Limites appliquées par organisation : plusieurs clés d'un même compte ne multiplient pas le quota |
| Google AI Studio | Variable selon le projet, à lire dans la console | Quotas parfois très bas sur certains modèles Flash ; les données du palier gratuit peuvent servir à améliorer les modèles |
| OpenRouter (:free) | 20 requêtes/min, 50 requêtes/jour sans achat de crédits | Saturation fréquente des hébergeurs tiers ; trop limité pour ce projet |

### 9.2 Estimation de charge

Le jour J, un parcours ne fait aucun appel serveur ni aucun appel IA. Les quotas de Groq et de Google AI Studio ne concernent que la génération des contenus, une seule fois, avant l'événement.

| Poste | Volume | Ordre de grandeur |
| --- | --- | --- |
| Génération : 12 scénarios et leurs 108 bilans | 12 à 25 appels IA | moins de 150 000 tokens |
| Jour J : appels IA ou serveur pendant un parcours | 0 | 0 |
| Téléchargement de l'application, par téléphone | 1 fois | environ 0,5 Mo |
| Transfert Vercel pour 500 téléphones | 500 téléchargements | environ 250 Mo, soit moins de 0,3 % du quota de 100 Go |

**Point critique : le réseau, pas les quotas.** Les 400 à 500 téléphones n'ont pas besoin d'être connectés en même temps si l'application est préchargée à domicile : le Wi-Fi de l'amphi n'est alors plus sollicité. Pour ceux qui arrivent sans l'application, la parade est le fichier unique de secours (section 8.4), qui se partage de téléphone à téléphone, plutôt qu'un téléchargement simultané par tout le monde.

## 10. Exigences non fonctionnelles

### 10.1 Performance et résilience

- Poids de la page initiale inférieur à 500 Ko, aucune image lourde.
- Changement d'étape en moins de 300 ms pour le contenu pré-écrit.
- Sauvegarde dans localStorage à chaque clic.
- Aucune page d'erreur brute : toute défaillance (réseau, stockage) aboutit à un message clair et à un mode dégradé.

### 10.2 Sécurité

- Aucune clé API dans le site ni dans le dépôt GitHub ; les clés de génération restent sur l'ordinateur du développeur.
- Site statique : pas de serveur, pas de base, aucune donnée utilisateur côté serveur, donc rien à attaquer ni à protéger de ce côté.
- Le pseudo et le texte libre ne quittent jamais le téléphone et sont affichés comme du texte, jamais interprétés comme du HTML.
- Authentification à deux facteurs sur les comptes GitHub et Vercel du développeur, seul titulaire des accès.

### 10.3 Confidentialité et sécurité psychologique

- Aucune donnée d'identité réelle demandée ; message d'avertissement à l'accueil.
- Aucune donnée ne quitte le téléphone : pas d'envoi vers un serveur ni vers un fournisseur d'IA pendant l'événement.
- Aucune évaluation individuelle ni classement des participants.

### 10.4 Ergonomie et accessibilité

- Mobile-first, police d'au moins 16 px, zones tactiles d'au moins 44 px.
- Contraste élevé, lisible sous les lumières de l'amphi ; mode sombre.
- Interface en français, vocabulaire simple.
- Compatibilité avec les deux dernières versions de Chrome, Safari, Firefox et Edge, sur Android et iOS.

## 11. Tests et recette

### 11.1 Plan de test

| Test | Méthode | Critère d'acceptation |
| --- | --- | --- |
| Fonctionnel | Parcours complet de chaque scénario sur les 9 trajectoires ; 100 tirages au sort | Aucun blocage, bilan correspondant au choix et au pivot, les 12 scénarios apparaissent |
| Contenu | Validation automatique des fichiers, relecture des 108 bilans (encadrant : au moins 20 %) | Tous valides, ton bienveillant |
| Hors-ligne | Charger l'application, couper le réseau, jouer 3 parcours complets | Aucune erreur, bilan affiché |
| Plan B réseau | Transmettre le fichier unique entre 3 téléphones (WhatsApp, Bluetooth) | Il s'ouvre et fonctionne sans réseau |
| Réseau réel | Essai dans l'amphi avec 30 à 50 volontaires : précharge à domicile, puis jeu sans réseau | Fonctionnement complet hors-ligne |
| Appareils | Android bas de gamme, iPhone, ordinateur | Affichage correct partout |
| Sécurité | Pseudo et note libre contenant du HTML ou des caractères spéciaux | Affichés comme du texte, aucune exécution |
| Pédagogique | Relecture par l'encadrant et 5 étudiants testeurs | Ton jugé bienveillant et scénarios compris |

### 11.2 Critères de recette

La plateforme est acceptée si tous les tests ci-dessus sont validés, si les exigences marquées M sont livrées, et si une répétition générale en conditions réelles s'est déroulée sans incident bloquant.

## 12. Planification

Calendrier indicatif : la date de l'événement n'étant pas fixée, l'équipe a largement le temps.

| Période | Livrables |
| --- | --- |
| Semaine 1 | Dépôt GitHub, déploiement Vercel et miroir GitHub Pages, prompt système, script de génération et de validation, premiers scénarios générés |
| Semaine 2 | Interface mobile complète, localStorage, tirage au sort, bilan, Failure Reflection, export, mode hors-ligne |
| Semaine 3 | Génération des 12 scénarios, relecture des 108 bilans, fichier unique de secours, carte « Ma leçon » (option) |
| Semaine 4 | Tests sur téléphones et en réseau réel, précharge à domicile avec des volontaires, corrections, gel du code et des contenus |
| J-14 à J-1 | Annonce du lien et du QR code, précharge à domicile par les participants |
| Jour J | Aucune intervention technique nécessaire : QR code projeté, fichier unique prêt |
| J+2 | Retour d'expérience |

**Répartition :** un seul développeur, qui assure aussi la génération des contenus. Prévoir un relecteur pédagogique (l'encadrant) et le président de la commission pédagogique et une autre personne, qui reçoivent une copie du dépôt et l'adresse du miroir, pour pouvoir redéployer si un compte pose problème le jour J.

## 13. Risques et plans de secours

| Risque | Probabilité | Impact | Parade |
| --- | --- | --- | --- |
| Wi-Fi absent ou saturé le jour J | Élevée | Élevé | Précharge à domicile, fonctionnement hors-ligne, fichier unique de secours, QR code et miroir |
| Développeur injoignable le jour J | Élevée | Moyen | Site statique sans serveur ni quota : aucune intervention nécessaire ; gel à J-3 ; copie du dépôt chez le président de la commission pédagogique et chez une autre personne |
| Compte unique bloqué ou suspendu (GitHub, Vercel) | Faible | Élevé | Miroir sur GitHub Pages, copie du dépôt, fichier unique de secours |
| Scénario ou bilan maladroit ou inadapté | Moyenne | Élevé | Validation automatique, relecture des 108 bilans, relecture par l'encadrant d'au moins 20 % |
| Scénarios trop proches les uns des autres | Moyenne | Faible | Un thème imposé par scénario, contrôle de la diversité avant le gel |
| Données perdues dans le téléphone (navigation privée, cache vidé) | Moyenne | Moyen | Avertissement, bouton d'export visible à la fin, sauvegarde à chaque clic |
| Pseudo ou texte libre inapproprié | Moyenne | Faible | Filtrage des pseudos ; rien n'est publié ni montré aux autres |
| Téléphone ou navigateur ancien | Moyenne | Moyen | Test sur Android bas de gamme, page légère, fichier unique de secours |
| Offre gratuite modifiée avant la génération | Faible | Faible | Génération faite tôt, avec un second fournisseur en secours |

## 14. Décisions à prendre avant de démarrer

Décisions prises le 17 novembre 2026 : 400 à 500 participants ; Solo et Équipe au choix ; scénarios tirés au sort dans un lot de 12 généré par l'IA avant l'événement, thèmes validés (liste de la section 6.1) ; aucun serveur, aucune base de données, aucune IA en direct, aucun écran organisateur ; aucune mesure ; un seul développeur, titulaire de tous les comptes ; le président de la commission pédagogique et une autre personne conservent une copie du projet ; date de l'événement non fixée, l'équipe ayant largement le temps.

À décider :

1. Qui relit au moins 20 % des bilans : le président de la commission pédagogique, ou une autre personne.
2. Le nom de la deuxième personne qui conserve une copie du projet.
3. Comment annoncer le lien et le QR code deux semaines avant (affiches, réseaux de l'ESP, e-mail).
4. Inclure la version « fichier unique » de secours dans le périmètre (recommandé).

## 15. Budget

| Poste | Coût |
| --- | --- |
| Hébergement Vercel Hobby | 0 FCFA |
| Aucune base de données (localStorage) | 0 FCFA |
| API IA (offres gratuites) | 0 FCFA |
| Nom de domaine personnalisé (optionnel, sinon sous-domaine vercel.app) | Hors budget |
| Coûts indirects à prévoir par l'ESP : forfait data des organisateurs, rallonge de test réseau, impression d'un QR code d'accès | À chiffrer par le comité |

## 16. Indicateurs de succès (à relever après l'événement)

La plateforme ne mesure rien, et ce n'est pas un problème : le succès se juge sur place.

- Les participants jouent sans blocage, avec ou sans Wi-Fi.
- Retours oraux au débriefing, et nombre de volontaires qui partagent leur leçon.
- Avis de l'encadrant sur la qualité des scénarios et des bilans.

## Annexe A — Checklist J-1 et Jour J

- Dernier déploiement vérifié sur les deux adresses (Vercel et miroir) ; contenu gelé depuis J-3.
- Application testée hors-ligne sur au moins 3 téléphones différents.
- Fichier unique de secours présent sur le téléphone de plusieurs personnes.
- QR code imprimé et projeté en grand, lisible du fond de l'amphi.
- Le président de la commission pédagogique et une autre personne disposent d'une copie du dépôt et de l'adresse du miroir.
- Rien à modifier ni à surveiller pendant l'événement.

## Annexe B — Trame du prompt système (à adapter)

```
Tu es un concepteur pédagogique bienveillant. Tu crées un scénario de simulation de décision
pour des étudiants d'une école polytechnique, toutes filières confondues.
Thème imposé : {theme}.
Règles :
- situation de 80 à 120 mots, sans jargon propre à une filière ;
- 3 choix plausibles, aucun n'est évidemment bon ;
- pour chaque choix, un événement d'échec réaliste et inévitable ;
- 3 options de pivot : maintenir le cap, ajuster partiellement, changer radicalement ;
- 9 bilans, un par couple (choix, pivot).
Chaque bilan contient : turning_point, pivot_evaluation, failure_type (basique | complexe | intelligent),
outcome, key_takeaway ; 60 mots maximum par champ.
Ton constructif, aucun jugement sur la personne, aucune référence à une filière,
aucune marque ni personne réelle, aucun contenu sensible.
Réponds uniquement avec un JSON conforme au schéma fourni.
```
