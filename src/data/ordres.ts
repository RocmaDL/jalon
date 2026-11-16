// Exercices de remise en ordre tirés des supports JavaScript et React.
import type { OrderItem } from "./types";

/** Remise en ordre : p = consigne, items = ordre correct, e = explication. */
export const OR: OrderItem[] = [
  {"t":"js-fondamentaux","p":"Remets les étapes d'une comparaison de valeur dans l'ordre.","items":["Lire les deux valeurs","Vérifier leurs types","Choisir une comparaison stricte","Interpréter le résultat"],"e":"Comprendre le type évite les conversions implicites surprises."},
  {"t":"fonctions","p":"Remets les étapes d'un appel asynchrone dans l'ordre.","items":["Appeler la fonction async","Attendre la Promise","Lire la réponse","Gérer l'erreur"],"e":"Une opération réseau doit prévoir le succès comme l'échec."},
  {"t":"tableaux-objets","p":"Remets ces transformations de tableau dans l'ordre.","items":["filter les éléments utiles","map leurs données","reduce si une valeur globale est nécessaire","Afficher le résultat"],"e":"Chaque méthode répond à une intention différente."},
  {"t":"react-components","p":"Remets les étapes de création d'un composant React dans l'ordre.","items":["Définir les données nécessaires","Écrire le composant","Retourner le JSX","Rendre le composant dans l'arbre"],"e":"Un composant décrit son interface à partir de ses entrées."},
  {"t":"props-state","p":"Remets le flux d'une mise à jour d'état dans l'ordre.","items":["L'utilisateur déclenche une action","Le handler calcule la nouvelle valeur","Le setter met à jour le state","React rend à nouveau le composant"],"e":"Le rendu est une conséquence de la mise à jour, pas une mutation directe."},
  {"t":"events-hooks","p":"Remets le cycle d'un effet React dans l'ordre.","items":["Le composant est rendu","Les dépendances sont comparées","L'effet est exécuté","Le nettoyage intervient si nécessaire"],"e":"Le nettoyage évite les abonnements et timers qui fuient."},
  {"t":"forms-api","p":"Remets l'envoi d'un formulaire contrôlé dans l'ordre.","items":["Saisir une valeur","Mettre à jour le state dans onChange","Empêcher le rechargement dans onSubmit","Valider puis envoyer les données"],"e":"Le composant garde la main sur la valeur et la validation."},
  {"t":"router","p":"Remets une navigation côté client dans l'ordre.","items":["L'utilisateur choisit un lien","L'URL est mise à jour","La route correspondante est sélectionnée","L'écran est rendu"],"e":"Le routeur change de vue sans recharger toute la page."},
  {"t":"quality","p":"Remets une démarche de qualité dans l'ordre.","items":["Définir le comportement attendu","Écrire un test ciblé","Implémenter ou corriger","Lancer les vérifications"],"e":"Un comportement explicite rend les régressions visibles."},
  {"t":"performance","p":"Remets une démarche d'optimisation dans l'ordre.","items":["Mesurer le problème","Identifier la cause","Choisir une optimisation ciblée","Mesurer à nouveau"],"e":"Sans mesure avant et après, l'optimisation reste une hypothèse."}
];
