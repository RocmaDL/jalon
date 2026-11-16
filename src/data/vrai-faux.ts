// Vrai/faux tirés des supports de cours JavaScript et React.
import type { TrueFalseItem } from "./types";

export const TF: TrueFalseItem[] = [
  {"t":"js-fondamentaux","s":"Une variable const contenant un objet ne peut jamais voir ses propriétés changer.","v":false,"e":"const empêche la réassignation de la référence, pas la mutation de l'objet."},
  {"t":"js-fondamentaux","s":"let et const ont une portée de bloc.","v":true,"e":"Elles ne sont accessibles que dans le bloc où elles sont déclarées."},
  {"t":"types-operateurs","s":"[] est une valeur falsy.","v":false,"e":"Les tableaux et les objets sont truthy, même lorsqu'ils sont vides."},
  {"t":"types-operateurs","s":"=== évite les conversions implicites de type.","v":true,"e":"C'est la différence principale avec l'égalité ==."},
  {"t":"fonctions","s":"Une fonction async renvoie toujours une Promise.","v":true,"e":"La valeur retournée est automatiquement enveloppée dans une Promise."},
  {"t":"fonctions","s":"await peut être utilisé dans n'importe quelle fonction classique.","v":false,"e":"Il doit être dans une fonction async ou dans un contexte autorisé par le module."},
  {"t":"tableaux-objets","s":"filter modifie toujours le tableau d'origine.","v":false,"e":"filter retourne un nouveau tableau et laisse le tableau source intact."},
  {"t":"tableaux-objets","s":"Le spread réalise une copie profonde de tous les objets imbriqués.","v":false,"e":"La copie est superficielle : les références imbriquées restent partagées."},
  {"t":"react-components","s":"JSX permet d'utiliser des expressions JavaScript entre accolades.","v":true,"e":"Une expression comme {user.name} peut être interpolée dans le JSX."},
  {"t":"react-components","s":"Un composant React doit obligatoirement être une classe.","v":false,"e":"Les composants fonctionnels sont la forme courante avec les hooks."},
  {"t":"props-state","s":"Les props sont des données en lecture seule pour l'enfant.","v":true,"e":"Le parent reste propriétaire des props qu'il transmet."},
  {"t":"props-state","s":"Modifier directement un objet du state garantit un nouveau rendu.","v":false,"e":"Il faut produire une nouvelle référence avec une mise à jour immuable."},
  {"t":"events-hooks","s":"Les hooks peuvent être appelés dans une condition si elle est toujours vraie.","v":false,"e":"Les hooks doivent rester au niveau supérieur pour conserver leur ordre."},
  {"t":"events-hooks","s":"useEffect est adapté à une requête réseau ou à un abonnement.","v":true,"e":"Ce sont des synchronisations avec des systèmes extérieurs."},
  {"t":"forms-api","s":"fetch rejette automatiquement la Promise pour une réponse HTTP 404.","v":false,"e":"Il faut vérifier response.ok ; fetch rejette surtout en cas d'erreur réseau."},
  {"t":"router","s":"Une navigation avec un routeur peut éviter un rechargement complet.","v":true,"e":"Le routeur remplace l'écran côté client selon l'URL."},
  {"t":"quality","s":"Un composant pur peut modifier les props reçues pour simplifier son rendu.","v":false,"e":"Les props restent immuables et le rendu doit rester sans effet de bord."},
  {"t":"performance","s":"React.memo est toujours bénéfique pour les performances.","v":false,"e":"La comparaison a un coût et peut compliquer inutilement le code."}
];
