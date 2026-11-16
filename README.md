# Jalon

Appli de révision des cours de JavaScript et React : sept journées thématiques, avec une à deux notions par journée, et un parcours gamifié. Elle propose des exercices variés (QCM, vrai/faux, phrases à trous, remise en ordre, saisie libre, paires), une mémoire espacée qui fait revenir ce qu'on oublie, et une couche de jeu (série, cœurs, quêtes, ligue simulée, succès).

À l'origine, tout tenait dans un seul fichier `Jalon.html`. Ce dépôt en est la conversion en Next.js + TypeScript, découpée par responsabilité. Le comportement et le rendu sont les mêmes ; la sauvegarde utilise la même clé `localStorage` (`jalon-v1`).

## Lancer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
npm run lint
```

## Organisation

```
src/
  app/          layout (polices, CSS), page, icône
  data/         contenu pédagogique : unités, lexique, QCM, vrai/faux, phrases à trous, ordres,
                et texte complet extrait des supports PDF
  lib/          outils sans état de jeu : dates, texte, hasard, index du contenu,
                génération et correction des exercices, sons et confettis
  game/         état de jeu et règles
    state.ts      sauvegarde localStorage
    store.ts      état d'interface, séance en cours, abonnement React (useSyncExternalStore)
    actions.ts    tout ce que déclenche l'utilisateur
    keyboard.ts   raccourcis clavier
    memory.ts     mémoire espacée (demi-vie)
    progress.ts   série, cœurs, XP
    quests.ts · league.ts · achievements.ts · path.ts
  components/
    shell/      navigation, compteurs, colonne de résumé
    pages/      Apprendre, S'entraîner, Flashcards, Lexique, Ligue, Quêtes, Profil, Boutique, accueil
    lesson/     séance : en-tête, un composant par type d'exercice, correction, écrans de fin
    overlays/   modales, toasts, canvas des confettis
    ui/         icônes, mascotte, écusson, compteur animé
  styles/       CSS d'origine, découpé par zone (tokens, coque, parcours, leçon…)
```

L'état reste un objet mutable, comme dans la version d'origine : les actions le modifient puis appellent `commit()`, qui sauvegarde et redessine. L'appli est rendue côté navigateur uniquement (`ClientApp`), puisqu'elle dépend de `localStorage` et de l'heure locale.

## Contenu

Les questions et définitions sont tirées des supports JavaScript et React du dossier de formation. Le texte complet des 23 PDF est disponible dans « Lexique » > « Cours complets » et dans `src/data/course-content.ts`. La banque contient aussi des questions contextualisées générées à partir des notions repérées dans ces supports, dans `src/data/course-qcm.ts`. Pour ajouter un support, il suffit d'ajouter son texte et ses questions à `src/data/` : les index, leçons et révisions se recalculent seuls.
