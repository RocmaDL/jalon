// QCM tirés des supports de cours JavaScript et React.
import type { QcmItem } from "./types";
import { COURSE_QCM } from "./course-qcm";

/** QCM : q = question, ok = bonne réponse, ko = leurres, e = explication. */
const CORE_QCM: QcmItem[] = [
  {"t":"js-fondamentaux","q":"Quelle déclaration empêche la réassignation de la variable ?","ok":"const","ko":["let","var","static"],"e":"const protège la liaison, mais pas nécessairement l'objet référencé."},
  {"t":"js-fondamentaux","q":"Quelle portée possède une variable déclarée avec let dans un bloc ?","ok":"La portée du bloc","ko":["La portée globale","La portée du fichier HTML","La portée de toute l'application"],"e":"let et const sont limitées au bloc dans lequel elles sont déclarées."},
  {"t":"types-operateurs","q":"Que vérifie l'opérateur === ?","ok":"La valeur et le type","ko":["La valeur uniquement","Le nom de la variable","La référence uniquement"],"e":"L'égalité stricte évite les conversions implicites de l'égalité lâche."},
  {"t":"types-operateurs","q":"Quelle valeur est falsy en JavaScript ?","ok":"0","ko":["[]","{}","'0'"],"e":"0 est falsy ; les tableaux et objets, même vides, sont truthy."},
  {"t":"types-operateurs","q":"Que renvoie null ?? 'défaut' ?","ok":"'défaut'","ko":["null","false","Une erreur"],"e":"?? utilise la valeur de droite pour null ou undefined."},
  {"t":"fonctions","q":"À quoi sert un callback ?","ok":"À être appelé par une autre fonction","ko":["À déclarer un type","À créer un composant DOM","À remplacer une Promise"],"e":"Les callbacks sont très utilisés par les méthodes de tableaux et les événements."},
  {"t":"fonctions","q":"Que renvoie toujours une fonction async ?","ok":"Une Promise","ko":["Un tableau","Un événement","Un composant React"],"e":"Même un return simple est enveloppé dans une Promise."},
  {"t":"fonctions","q":"Que permet await ?","ok":"D'attendre le résultat d'une Promise dans une fonction async","ko":["De rendre une fonction synchrone partout","De bloquer le navigateur","De supprimer les erreurs"],"e":"await suspend la fonction async, pas le thread JavaScript entier."},
  {"t":"tableaux-objets","q":"Quelle méthode transforme chaque élément d'un tableau ?","ok":"map","ko":["filter","find","includes"],"e":"map produit un nouveau tableau de même longueur."},
  {"t":"tableaux-objets","q":"Quelle méthode sélectionne les éléments correspondant à un test ?","ok":"filter","ko":["map","reduce","sort"],"e":"filter conserve les éléments dont le callback renvoie true."},
  {"t":"tableaux-objets","q":"Quel est l'effet du spread sur un objet ?","ok":"Copier et étendre ses propriétés","ko":["Le rendre immutable automatiquement","Le sérialiser en JSON","Le supprimer"],"e":"Le spread crée une copie superficielle."},
  {"t":"react-components","q":"Que retourne généralement un composant fonctionnel React ?","ok":"Du JSX ou un élément React","ko":["Une feuille CSS","Une Promise obligatoire","Un fichier HTML complet"],"e":"Le composant décrit la partie d'interface qu'il rend."},
  {"t":"react-components","q":"Quel attribut JSX remplace class ?","ok":"className","ko":["classNameHtml","cssClass","class"],"e":"class est un mot réservé JavaScript, JSX utilise className."},
  {"t":"react-components","q":"Pourquoi utiliser un Fragment ?","ok":"Regrouper des éléments sans ajouter de nœud DOM","ko":["Créer un état global","Charger une API","Remplacer toutes les props"],"e":"<>...</> est la syntaxe courte d'un Fragment."},
  {"t":"props-state","q":"Les props d'un composant enfant sont-elles modifiables par l'enfant ?","ok":"Non, elles sont en lecture seule","ko":["Oui, toujours","Seulement avec useEffect","Seulement en production"],"e":"L'enfant demande au parent de changer ses données via un callback."},
  {"t":"props-state","q":"Quel hook crée une variable d'état ?","ok":"useState","ko":["useValue","useData","createState"],"e":"useState renvoie une paire valeur / fonction de mise à jour."},
  {"t":"props-state","q":"Pourquoi ne faut-il pas modifier directement un objet dans le state ?","ok":"React doit recevoir une nouvelle référence pour détecter le changement","ko":["Les objets sont interdits","Le navigateur ne sait pas les lire","Cela désactive JSX"],"e":"On crée une nouvelle valeur avec le spread ou une transformation."},
  {"t":"events-hooks","q":"Quel prop gère un clic en React ?","ok":"onClick","ko":["onclick","click","handleClickEvent"],"e":"Les noms d'événements React sont en camelCase."},
  {"t":"events-hooks","q":"Où les hooks peuvent-ils être appelés ?","ok":"Au niveau supérieur d'un composant ou d'un hook personnalisé","ko":["Dans une boucle","Dans une condition","Dans un callback d'événement"],"e":"L'ordre d'appel des hooks doit rester identique à chaque rendu."},
  {"t":"events-hooks","q":"Quel est le rôle principal de useEffect ?","ok":"Synchroniser avec un système extérieur","ko":["Calculer le JSX","Remplacer useState","Optimiser automatiquement tous les rendus"],"e":"Exemples : abonnement, timer, titre du document ou requête."},
  {"t":"forms-api","q":"Qu'est-ce qu'un formulaire contrôlé ?","ok":"Un formulaire dont la valeur vient de l'état React","ko":["Un formulaire sans validation","Un formulaire contrôlé par le navigateur uniquement","Un formulaire sans onSubmit"],"e":"La valeur et onChange sont reliés à l'état."},
  {"t":"forms-api","q":"Que renvoie fetch ?","ok":"Une Promise de Response","ko":["Directement le JSON","Un élément JSX","Un tableau de champs"],"e":"Il faut ensuite vérifier la réponse puis appeler response.json()."},
  {"t":"router","q":"À quoi sert une route ?","ok":"Associer une URL à un écran","ko":["Styliser un bouton","Créer une Promise","Remplacer TypeScript"],"e":"Le routeur permet de changer d'écran sans rechargement complet."},
  {"t":"quality","q":"Quel est l'intérêt principal de TypeScript ?","ok":"Détecter des incohérences de types avant l'exécution","ko":["Remplacer React","Rendre le réseau plus rapide","Supprimer les tests"],"e":"Le typage documente aussi les contrats entre composants."},
  {"t":"quality","q":"Que doit faire un composant pur ?","ok":"Retourner le même résultat pour les mêmes entrées","ko":["Modifier le DOM pendant le rendu","Faire une requête à chaque rendu","Modifier les props"],"e":"Les effets et synchronisations se placent dans les mécanismes prévus pour cela."},
  {"t":"performance","q":"Quand faut-il optimiser un composant ?","ok":"Après avoir identifié un coût réel","ko":["Toujours avant d'écrire le composant","Uniquement après une erreur TypeScript","Jamais"],"e":"La simplicité est préférable à une memoisation prématurée."},
  {"t":"performance","q":"À quoi sert le lazy loading ?","ok":"Charger une partie de l'application à la demande","ko":["Rendre un state global","Remplacer les tests","Forcer tous les composants à se re-rendre"],"e":"Il réduit le coût initial quand une fonctionnalité n'est pas immédiatement nécessaire."}
];

export const QCM: QcmItem[] = [...CORE_QCM, ...COURSE_QCM];
