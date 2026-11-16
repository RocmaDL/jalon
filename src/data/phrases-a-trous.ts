// Phrases à trous tirées des supports de cours JavaScript et React.
import type { BlankItem } from "./types";

/** Phrases à trous : a + [ok] + b, ko = leurres, e = explication. */
export const BL: BlankItem[] = [
  {"t":"js-fondamentaux","a":"Une variable déclarée avec","ok":"const","b":"ne peut pas être réassignée.","ko":["let","var","function"],"e":"La référence est fixe, même si l'objet référencé peut être mutable."},
  {"t":"types-operateurs","a":"L'opérateur","ok":"===","b":"compare la valeur et le type.","ko":["==","=","!=="],"e":"Il évite une conversion implicite."},
  {"t":"types-operateurs","a":"L'opérateur","ok":"??","b":"utilise la valeur de droite pour null ou undefined.","ko":["||","&&","=>"],"e":"Il est utile pour fournir une valeur par défaut précise."},
  {"t":"fonctions","a":"Une fonction","ok":"async","b":"retourne toujours une Promise.","ko":["pure","fléchée","sync"],"e":"Même un return de valeur simple devient une Promise résolue."},
  {"t":"fonctions","a":"Le mot-clé","ok":"await","b":"attend le résultat d'une Promise.","ko":["yield","pause","wait"],"e":"Il s'utilise dans une fonction async ou un module compatible."},
  {"t":"tableaux-objets","a":"La méthode","ok":"map","b":"transforme chaque élément d'un tableau.","ko":["filter","reduce","find"],"e":"Elle retourne un tableau de même longueur."},
  {"t":"tableaux-objets","a":"La déstructuration permet d'","ok":"extraire","b":"des valeurs d'un tableau ou d'un objet.","ko":["trier","supprimer","compiler"],"e":"Elle rend l'accès aux données plus concis."},
  {"t":"react-components","a":"En JSX, l'attribut HTML class devient","ok":"className","b":".","ko":["cssClass","class","htmlClass"],"e":"JSX utilise les noms de propriétés JavaScript."},
  {"t":"react-components","a":"Une liste React doit fournir une","ok":"key","b":"stable à chaque élément.","ko":["id CSS","route","ref"],"e":"React utilise cette clé pour suivre l'identité des éléments."},
  {"t":"props-state","a":"Les","ok":"props","b":"sont transmises du parent vers l'enfant.","ko":["states","events","effects"],"e":"Elles sont en lecture seule dans le composant enfant."},
  {"t":"props-state","a":"Le hook","ok":"useState","b":"permet de déclarer un état local.","ko":["useValue","useData","useLocal"],"e":"Il renvoie la valeur et sa fonction de mise à jour."},
  {"t":"props-state","a":"Pour modifier un objet dans le state, on crée une nouvelle","ok":"référence","b":".","ko":["mutation","classe","route"],"e":"L'immuabilité aide React à détecter le changement."},
  {"t":"events-hooks","a":"Le handler React d'un clic s'appelle","ok":"onClick","b":".","ko":["onclick","on-click","clickHandler"],"e":"Les noms d'événements React sont en camelCase."},
  {"t":"events-hooks","a":"Les hooks ne doivent pas être appelés dans une","ok":"condition","b":"ou une boucle.","ko":["fonction","application","page"],"e":"Leur ordre d'appel doit être identique à chaque rendu."},
  {"t":"forms-api","a":"Un formulaire contrôlé stocke la valeur de ses champs dans le","ok":"state","b":"React.","ko":["DOM","router","CSS"],"e":"onChange synchronise la saisie avec l'état."},
  {"t":"forms-api","a":"Pour lire le corps JSON d'une réponse, on appelle","ok":"response.json()","b":".","ko":["response.bodyText()","fetch.json()","JSON.response()"],"e":"Cette méthode renvoie elle-même une Promise."},
  {"t":"router","a":"Un routeur associe un chemin d'URL à un","ok":"écran","b":"de l'application.","ko":["type","hook","style"],"e":"Il permet de naviguer entre plusieurs vues."},
  {"t":"quality","a":"TypeScript ajoute un","ok":"typage","b":"statique à JavaScript.","ko":["rendu","routeur","serveur"],"e":"Les incohérences sont détectées avant l'exécution."},
  {"t":"performance","a":"Le","ok":"lazy loading","b":"diffère le chargement d'une fonctionnalité.","ko":["state lifting","strict mode","hot reload"],"e":"C'est une technique de découpage du coût initial."}
];
