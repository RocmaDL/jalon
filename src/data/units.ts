// Parcours regroupé à partir des supports de cours JavaScript et React.
import type { Topic, Unit } from "./types";

export const UNITS: Unit[] = [
  {
    "d": 1,
    "n": "Fondamentaux JavaScript",
    "ideas": [
      "JavaScript est un langage exécuté dans le navigateur et dans d'autres environnements comme Node.js.",
      "ECMAScript est le standard qui définit les évolutions du langage JavaScript.",
      "const ne peut pas être réassigné, tandis que let peut l'être dans sa portée de bloc.",
      "JavaScript distingue les valeurs primitives des objets manipulés par référence.",
      "Le === compare la valeur et le type sans conversion implicite.",
      "Les valeurs truthy, falsy, nullish et l'optional chaining évitent des conditions fragiles.",
      "Comprendre les types et la portée rend les bugs plus faciles à repérer."
    ]
  },
  {
    "d": 2,
    "n": "Fonctions et manipulation des données",
    "ideas": [
      "Une fonction regroupe une logique réutilisable avec des paramètres et une valeur de retour.",
      "Une fonction fléchée possède un this lexical et une syntaxe concise.",
      "Une closure conserve l'accès aux variables de sa portée lexicale.",
      "Une Promise représente le résultat futur d'une opération asynchrone.",
      "async et await rendent les chaînes de Promises plus lisibles.",
      "map transforme, filter sélectionne et reduce agrège une collection.",
      "La déstructuration et le spread favorisent les transformations immuables."
    ]
  },
  {
    "d": 3,
    "n": "Composants React",
    "ideas": [
      "React construit des interfaces déclaratives à partir de composants réutilisables.",
      "Un composant fonctionnel retourne une description de l'interface.",
      "JSX ressemble au HTML mais utilise les propriétés et expressions JavaScript.",
      "En JSX, class devient className et les attributs sont généralement en camelCase.",
      "Les fragments regroupent des éléments sans ajouter de nœud DOM.",
      "Une liste rendue avec map doit fournir une key stable.",
      "Les props descendent du parent vers l'enfant et restent en lecture seule."
    ]
  },
  {
    "d": 4,
    "n": "État, événements et APIs",
    "ideas": [
      "useState ajoute une donnée locale et sa fonction de mise à jour.",
      "Une mise à jour d'état déclenche un nouveau rendu du composant concerné.",
      "Le lifting state up remonte un état vers un parent partagé.",
      "Les handlers React comme onClick relient une interaction à une fonction.",
      "Les hooks se placent au niveau supérieur d'un composant ou d'un hook personnalisé.",
      "useEffect synchronise le composant avec un système extérieur.",
      "Les formulaires contrôlés et fetch nécessitent validation, chargement, succès et erreur."
    ]
  },
  {
    "d": 5,
    "n": "Navigation et architecture front-end",
    "ideas": [
      "Une route associe un chemin d'URL à un écran de l'application.",
      "La navigation côté client change de vue sans rechargement complet.",
      "Les paramètres dynamiques permettent de charger une ressource depuis son identifiant.",
      "L'état global doit être réservé aux données réellement partagées.",
      "Atomic Design organise l'interface des éléments simples aux compositions complexes.",
      "Feature-Sliced Design regroupe le code par domaine fonctionnel.",
      "Une architecture claire limite les dépendances et facilite les évolutions."
    ]
  },
  {
    "d": 6,
    "n": "Qualité, TypeScript et intégration continue",
    "ideas": [
      "TypeScript ajoute un typage statique qui documente les contrats du code.",
      "KISS invite à choisir la solution la plus simple qui répond au besoin.",
      "Un composant pur retourne le même résultat pour les mêmes entrées.",
      "Les tests ciblés rendent les refactorings et les corrections plus sûrs.",
      "Une pipeline CI vérifie automatiquement le code à chaque changement.",
      "Le déploiement continu rapproche la validation et la mise en production.",
      "Un projet fiable combine qualité du code, automatisation et retours rapides."
    ]
  },
  {
    "d": 7,
    "n": "Performances et veille React",
    "ideas": [
      "Les Web Vitals mesurent la vitesse perçue, la stabilité et la réactivité.",
      "Le code splitting et le lazy loading réduisent le coût du chargement initial.",
      "React.memo, useMemo et useCallback s'utilisent après identification d'un vrai coût.",
      "useDeferredValue et startTransition peuvent préserver la fluidité d'une interaction.",
      "Les images doivent être dimensionnées, compressées et chargées au bon moment.",
      "Le rendu statique, serveur ou client se choisit selon les besoins de l'écran.",
      "La veille sur l'écosystème aide à choisir des pratiques, outils et architectures adaptés."
    ]
  }
];

export const TOPICS: Topic[] = [
  {"id":"js-fondamentaux","d":1,"n":"Fondamentaux JS"},
  {"id":"types-operateurs","d":1,"n":"Types et opérateurs"},
  {"id":"fonctions","d":2,"n":"Fonctions"},
  {"id":"tableaux-objets","d":2,"n":"Tableaux et objets"},
  {"id":"react-components","d":3,"n":"Composants et JSX"},
  {"id":"props-state","d":3,"n":"Props et état"},
  {"id":"events-hooks","d":4,"n":"Événements et hooks"},
  {"id":"forms-api","d":4,"n":"Formulaires et APIs"},
  {"id":"router","d":5,"n":"React Router"},
  {"id":"quality","d":6,"n":"Qualité du code"},
  {"id":"performance","d":7,"n":"Performances"},
];
