# outils.mathro.fr

Petits outils de gestion de classe, en Svelte 5 / SvelteKit, publiés en site
statique (mode SPA, `adapter-static`).

Les données saisies sont enregistrées dans le `localStorage` du navigateur :
elles restent sur l'ordinateur utilisé et sont retrouvées à la réouverture.
Vider les données du site dans le navigateur les efface.

## Outils

- **Plan de classe** (`/plan-de-classe`) : 4 rangées de 4 tables à deux places,
  une liste d'élèves par classe (onglets), placement par glisser-déposer,
  clic sur une place pour afficher le nom complet, miroirs horizontal et
  vertical (boutons discrets en bas à droite) pour la projection.

Ajouter un outil : une entrée dans `src/lib/outils.ts` (carte de l'accueil) et
une route `src/routes/<slug>/`.

## Développement

Node ≥ 20.19 requis (Vite 8) — cf. `.nvmrc`.

```sh
npm install
npm run dev      # serveur de développement
npm test         # tests unitaires (vitest)
npm run check    # vérification des types
npm run build    # site statique dans build/
```

## Déploiement

Sur le serveur : `./deploy.sh` (git pull, tests, build, rsync vers
`/var/www/outils`, vhost nginx + certificat au premier passage).
