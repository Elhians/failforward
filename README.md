# Fail Forward ESP

Plateforme web mobile-first de la Journée « Fail Forward » de l'ESP : une simulation de décision en 4 étapes (situation → imprévu → pivot → résultat), un bilan en 4 blocs, une réflexion guidée et une carte « Ma leçon ».
Site 100 % statique, hors-ligne après le premier chargement, sans compte ni serveur : tout reste dans le téléphone (localStorage).

- Cahier des charges : [cahier_des_charges_fail_forward_esp.md](cahier_des_charges_fail_forward_esp.md)
- Étude des interfaces (recherche, maquettes, design system, amendements) : [reports/Interfaces Fail Forward ESP.md](reports/Interfaces%20Fail%20Forward%20ESP.md)

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Développement sur http://localhost:3000 (sans service worker) |
| `npm run build` | Export statique dans `out/`, fichier de secours `out/fail-forward-secours.html`, `out/sw.js`, contrôle des budgets de poids |
| `npm start` | Sert `out/` localement pour tester l'installation et le hors-ligne |
| `npm test` | Tests unitaires (pseudo, tirage, 108 trajectoires, stockage, export texte) |
| `npm run validate` | Validation des 12 scénarios (cahier §7.3) |
| `npm run generate -- --help` | Génération de scénarios par l'IA (Groq ou Google AI Studio) |
| `npm run lint` | ESLint |
| `npm run icons` | Régénère les icônes PWA (Python + Pillow) |

## Contenu : 12 scénarios, 108 bilans

Un fichier par scénario dans [src/content/scenarios/](src/content/scenarios/), importé par [src/content/index.ts](src/content/index.ts). Le schéma suit le cahier (§8.6), avec deux champs en plus :

- `stake` : phrase d'enjeu affichée en gras au-dessus de la situation ;
- `pivots_by_choice` : 3 rebonds concrets par choix (maintenir, ajuster, changer). Les pivots génériques `pivots` restent en repli.

Le contenu actuel a été rédigé avec l'IA et validé par le script. **Il doit être relu** : en entier par le développeur, et au moins 20 % par l'encadrant (§7.3, étape 4).

Pour modifier un scénario : éditer son fichier JSON, puis `npm run validate`. Le validateur vérifie la structure, les longueurs, les 12 thèmes, la variété des types d'échec, la répartition des « bons » rebonds, et signale le vocabulaire qui juge la personne.

### Générer de nouveaux scénarios

```bash
# Clé dans .env.local (jamais commitée) : GROQ_API_KEY=... ou GEMINI_API_KEY=...
npm run generate -- --provider groq --theme "Surcharge"
npm run generate -- --provider gemini --all
npm run generate -- --dry-run --theme "Surcharge"   # affiche la requête, sans appel
```

Le prompt système est dans [scripts/prompt-systeme.md](scripts/prompt-systeme.md). Les fichiers produits arrivent dans `src/content/generated/` (ignoré par git) et sont validés automatiquement, avec 2 nouvelles tentatives si la réponse est invalide. Après relecture, copier un fichier dans `src/content/scenarios/` (même nom que l'`id`).

## Version de secours (fichier unique)

`npm run build` produit `out/fail-forward-secours.html` (environ 430 Ko) : toute l'application dans un seul fichier, qui fonctionne sans réseau une fois ouvert dans Chrome, Firefox ou Safari. Il se partage par WhatsApp, Bluetooth ou clé USB, et se télécharge depuis le pied de page de l'accueil. Dans ce mode, rien n'est garanti d'être conservé après fermeture : l'application le dit et invite à copier le bilan.

## Déployer

1. **Dépôt GitHub** : le dossier est un dépôt git (branche `main`). Créer le dépôt sur GitHub, puis `git remote add origin …` et pousser.
2. **Vercel (adresse principale)** : importer le dépôt dans Vercel. [vercel.json](vercel.json) fixe la commande de build et le dossier `out/`. Plan Hobby, usage non commercial.
3. **GitHub Pages (miroir)** : dans *Settings → Pages*, choisir la source « GitHub Actions ». Le workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) teste, valide, puis publie le site sous `/<nom-du-dépôt>/` à chaque push sur `main`.
4. **QR codes** : un QR code ne contient qu'une adresse. Imprimer **deux** QR codes étiquetés « Principal » (Vercel) et « Secours » (GitHub Pages), avec la consigne « garde l'adresse que tu as installée » : les deux adresses ne partagent ni le cache ni l'historique.
5. **Gel** : dernier déploiement au plus tard à J-3, puis plus aucune modification (le service worker ne force jamais de mise à jour en plein parcours).

## Structure

```
src/
  app/            layout, page unique, globals.css (tokens du design system)
  components/
    App.tsx       machine d'états de l'application (une seule route)
    screens/      Home, Simulator, Debrief, LessonCard
    ui/           Button, Icon, Stepper, Sheet, Toast, ThemeToggle
  content/        index.ts + scenarios/*.json (12 scénarios)
  lib/            types, contenu, parcours (reducer), stockage, pseudo, tirage, export, microcopie
  single.tsx      point d'entrée du fichier de secours
public/           manifest, icônes, sw.js (modèle complété au build)
scripts/          build-sw, build-single, validate-content, generate-scenarios, prompt-systeme.md, make-icons
```

## Recette déjà faite (en local, Chrome)

- Parcours complets sur plusieurs scénarios, reprise après rafraîchissement, historique, copie du bilan, carte « Ma leçon ».
- Hors-ligne après premier chargement ; miroir servi sous un sous-chemin ; fichier de secours ouvert en `file://` sans réseau.
- Audit axe-core (WCAG 2.2 AA) : aucune violation sur tous les écrans, en clair et en sombre, à 360 et 320 px.
- CPU ralenti ×6 : changement d'étape en moins de 30 ms (exigence : 300 ms).

## Reste à faire avant l'événement

- Relecture des 108 bilans (développeur) et d'au moins 20 % par l'encadrant.
- Tests sur vrais téléphones : iPhone installé et non installé, Android bas de gamme, partage de l'image, fichier de secours reçu par WhatsApp (en particulier sur iPhone).
- Répétition avec 30 à 50 volontaires (§11) ; création des comptes, déploiement, QR codes.
