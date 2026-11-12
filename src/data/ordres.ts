// Contenu tiré des supports « Management de projets » (M1, O. Blumberg).
import type { OrderItem } from "./types";

/** Remise en ordre : p = consigne, items = ordre correct, e = explication. */
export const OR: OrderItem[] = [
  {"t":"projet","p":"Remets les phases du cycle de vie dans l'ordre.","items":["Avant-projet","Cadrage","Planification","Exécution et pilotage","Clôture"],"e":"L'ordre ne se négocie pas, même si les phases se recouvrent un peu."},
  {"t":"demande","p":"De l'intention au comment : remets ces documents dans l'ordre.","items":["Brief","Note de cadrage","Cahier des charges fonctionnel","Cahier des charges technique"],"e":"On passe de l'intention au quoi, puis du quoi au comment."},
  {"t":"demande","p":"Remets les critères SMART dans l'ordre.","items":["Spécifique","Mesurable","Atteignable","Réaliste / pertinent","Temporellement défini"],"e":"Test simple : peut-on dire le jour de la livraison si l'objectif est atteint ?"},
  {"t":"cadrage","p":"Remets les huit rubriques de la note de cadrage dans l'ordre.","items":["Contexte et problématique","Objectifs","Périmètre","Livrables","Jalons et échéances","Parties prenantes et gouvernance","Contraintes et hypothèses","Critères d'acceptation"],"e":"Un plan qui marche pour un projet client, un mémoire ou un déménagement."},
  {"t":"arbitrage","p":"Du moins cher au plus cher : quand le changement est-il décidé ?","items":["Cadrage","Conception","Réalisation","Recette","Après mise en production"],"e":"1×, 5×, 10×, 25×, 100× : un ordre de grandeur, la courbe ne varie jamais."},
  {"t":"decouper","p":"Remets les étapes de la planification dans l'ordre.","items":["Découper","Ordonner","Estimer","Dater"],"e":"Le planning est une conséquence, pas une intention."},
  {"t":"ressourcer","p":"Remets les questions d'affectation dans l'ordre.","items":["Qui sait faire ?","Qui est disponible ?","Qui est autorisé ?"],"e":"La compétence d'abord. L'autorisation est la question qu'on oublie."},
  {"t":"piloter","p":"Remets le circuit d'une demande de changement dans l'ordre.","items":["L'enregistrer par écrit","Chiffrer son impact","La soumettre avec deux options","Tracer la décision et mettre à jour"],"e":"Une demande orale n'existe pas."},
  {"t":"piloter","p":"Analyse d'un écart : remets les questions dans l'ordre.","items":["Quel est l'écart ?","D'où vient-il ?","Qu'est-ce qu'on fait ?"],"e":"Un écart qu'on ne chiffre pas ne se traite pas."},
  {"t":"communiquer","p":"Remets l'ordre du jour d'une réunion de suivi dans l'ordre.","items":["Ce qui a été terminé","Les écarts et ce qu'on propose","Les décisions à prendre","Les prochaines échéances"],"e":"Envoyé la veille ; trente minutes en tout."},
  {"t":"cloturer","p":"Remets les étapes de la clôture dans l'ordre.","items":["Recette","Validation","Transfert","Bilan et REX"],"e":"Bilan et REX sont les deux étapes qu'on saute toujours."},
];
