// Contenu tiré des supports « Management de projets » (M1, O. Blumberg).
import type { Topic, Unit } from "./types";

export const UNITS: Unit[] = [
  {
    "d": 1,
    "n": "De la demande au cadrage",
    "ideas": [
      "Un projet est temporaire, unique et incertain. On ne le pilote pas comme une activité récurrente.",
      "Coût, délai, qualité : les trois sont liés. Votre rôle n'est pas de tout tenir, c'est de rendre visible le prix de chaque décision.",
      "Un client exprime des solutions. Votre travail est de remonter au besoin sans le contredire frontalement.",
      "Un objectif qu'on ne peut pas mesurer le jour de la livraison n'est pas un objectif.",
      "Un projet meurt d'une partie prenante oubliée, pas d'un problème technique.",
      "Le hors-périmètre est la rubrique la plus utile de la note de cadrage.",
      "Plus une décision est prise tard, plus elle coûte cher. C'est toute la raison d'être du cadrage."
    ]
  },
  {
    "d": 2,
    "n": "Planifier et sécuriser",
    "ideas": [
      "Le planning est une conséquence, pas une intention : on découpe, on ordonne, on estime, et seulement ensuite on date.",
      "Une tâche sans condition de fin restera « à 90 % » pendant trois semaines.",
      "La charge n'est pas la durée. Trois jours de travail ne font pas trois jours de calendrier.",
      "Le chemin critique est la seule partie du planning où un jour perdu est un jour perdu pour le projet entier.",
      "Personne n'est disponible à 100 %. Un planning bâti sur cette hypothèse est faux dès sa première semaine.",
      "Les risques qui font le plus de dégâts ne sont pas techniques : ils sont organisationnels.",
      "Un risque anticipé et écrit coûte une réunion. Le même risque découvert le jour J coûte un jalon."
    ]
  },
  {
    "d": 3,
    "n": "Piloter, communiquer, clôturer",
    "ideas": [
      "Piloter, c'est comparer le réel au prévu, puis décider. Constater ne suffit pas.",
      "Un indicateur qui ne peut pas changer votre conduite du projet n'a rien à faire dans votre tableau de bord.",
      "Une tâche est finie ou elle ne l'est pas. « À 90 % » est une opinion, pas une mesure.",
      "Une mauvaise nouvelle annoncée tôt est une information ; annoncée tard, c'est une faute.",
      "On ne va pas en comité de pilotage pour informer : on y va pour faire décider, avec deux options chiffrées.",
      "Une réunion sans compte rendu n'a pas eu lieu. Une action sans porteur ni date n'est pas une action.",
      "Un projet se termine par une recette et un retour d'expérience, pas par la fin du travail."
    ]
  }
];

export const TOPICS: Topic[] = [
  {"id":"projet","d":1,"n":"Le projet"},
  {"id":"demande","d":1,"n":"Comprendre la demande"},
  {"id":"cadrage","d":1,"n":"Cadrer le projet"},
  {"id":"arbitrage","d":1,"n":"Arbitrer"},
  {"id":"decouper","d":2,"n":"Découper"},
  {"id":"ordonnancer","d":2,"n":"Ordonnancer"},
  {"id":"ressourcer","d":2,"n":"Ressourcer"},
  {"id":"securiser","d":2,"n":"Sécuriser"},
  {"id":"piloter","d":3,"n":"Piloter"},
  {"id":"communiquer","d":3,"n":"Communiquer"},
  {"id":"cloturer","d":3,"n":"Clôturer"},
];
