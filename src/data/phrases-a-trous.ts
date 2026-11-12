// Contenu tiré des supports « Management de projets » (M1, O. Blumberg).
import type { BlankItem } from "./types";

/** Phrases à trous : a + [ok] + b, ko = leurres, e = explication. */
export const BL: BlankItem[] = [
  {"t":"projet","a":"Un projet est un effort","ok":"temporaire","b":"entrepris pour créer un produit, un service ou un résultat unique.","ko":["récurrent","continu","illimité"],"e":"Définition du Project Management Institute citée en cours."},
  {"t":"projet","a":"« Plus vite, moins cher, mieux » : choisissez-en","ok":"deux","b":". Le troisième se paiera.","ko":["un","trois","aucun"],"e":"Les trois côtés du triangle QCD sont liés."},
  {"t":"demande","a":"Un client vous donne presque toujours une","ok":"solution","b":", pas un besoin.","ko":["contrainte","date","envie"],"e":"Votre travail est de remonter au problème sans le contredire frontalement."},
  {"t":"demande","a":"Sans date, un objectif est une","ok":"intention","b":".","ko":["contrainte","hypothèse","envie"],"e":"C'est le « T » de SMART : temporellement défini."},
  {"t":"demande","a":"Un projet meurt d'une partie prenante","ok":"oubliée","b":", pas d'un problème technique.","ko":["puissante","mécontente","opposée"],"e":"Elle se réveille trois semaines avant la livraison."},
  {"t":"cadrage","a":"Le","ok":"hors-périmètre","b":"est la partie la plus utile de la note de cadrage.","ko":["contexte","budget","planning"],"e":"Et celle qu'on oublie systématiquement d'écrire."},
  {"t":"cadrage","a":"Ce qui n'est pas écrit n'a jamais été","ok":"arbitré","b":".","ko":["chiffré","livré","planifié"],"e":"La note de cadrage rend visibles les arbitrages déjà faits."},
  {"t":"cadrage","a":"Un jalon est une date de","ok":"décision","b":", pas une date de travail.","ko":["réunion","facturation","production"],"e":"Il ferme une phase et ouvre la suivante."},
  {"t":"arbitrage","a":"Un critère d'acceptation transforme un avis en","ok":"constat","b":".","ko":["contrat","objectif","livrable"],"e":"Il décrit à l'avance ce qui permettra de dire « c'est conforme »."},
  {"t":"arbitrage","a":"Un arbitrage est une décision prise avec le client, dont le","ok":"coût","b":"est rendu visible avant d'être payé.","ko":["délai","périmètre","risque"],"e":"Un arbitrage n'est pas un refus."},
  {"t":"decouper","a":"Le planning est une","ok":"conséquence","b":", pas une intention.","ko":["promesse","estimation","décision"],"e":"On découpe, on ordonne, on estime, puis seulement on date."},
  {"t":"decouper","a":"Une tâche sans condition de fin restera « à","ok":"90","b":"% » pendant trois semaines.","ko":["50","80","100"],"e":"D'où la definition of done : « terminé quand… »."},
  {"t":"ordonnancer","a":"Durée retenue = (optimiste + 4 × probable + pessimiste) ÷","ok":"6","b":".","ko":["3","4","5"],"e":"C'est l'estimation à trois points."},
  {"t":"ordonnancer","a":"La charge se compte en jours-homme, la durée en jours","ok":"ouvrés","b":".","ko":["facturés","fériés","homme"],"e":"Trois jours de travail ne font pas trois jours de calendrier."},
  {"t":"ressourcer","a":"Au-delà de","ok":"80","b":"% de disponibilité, vous mentez à votre planning.","ko":["50","90","100"],"e":"Les 20 % restants partent en réunions, en imprévus et en aide aux autres."},
  {"t":"ressourcer","a":"Le meilleur outil est celui que votre équipe mettra réellement à","ok":"jour","b":".","ko":["profit","l'épreuve","disposition"],"e":"Un tableur tenu à jour vaut mieux qu'un Jira abandonné."},
  {"t":"securiser","a":"La criticité croise la probabilité et l'","ok":"impact","b":".","ko":["urgence","coût","origine"],"e":"Elle dit quel risque traiter en premier."},
  {"t":"securiser","a":"Le plan","ok":"correctif","b":"s'écrit à froid, quand on réfléchit encore bien.","ko":["préventif","de charge","de communication"],"e":"Il dit ce qu'on fera si, malgré tout, le risque survient."},
  {"t":"piloter","a":"Une tâche est finie ou elle ne l'est pas : 0 % ou","ok":"100","b":"%.","ko":["50","90","80"],"e":"C'est l'avancement binaire."},
  {"t":"piloter","a":"Face à un écart, ne rien","ok":"décider","b":"est la seule réponse interdite.","ko":["dire","mesurer","chiffrer"],"e":"Rattraper, décaler, réduire, ou accepter et l'annoncer."},
  {"t":"communiquer","a":"Une réunion sans compte rendu n'a pas eu","ok":"lieu","b":".","ko":["d'utilité","de sens","d'impact"],"e":"Une action sans porteur ni date n'est pas une action."},
  {"t":"communiquer","a":"Le COPIL décide pour un projet ; le CODIR décide pour l'","ok":"entreprise","b":".","ko":["équipe","client","utilisateur"],"e":"Le CODIR arbitre entre les projets."},
  {"t":"cloturer","a":"En REX, on parle de ce qui s'est passé, jamais de","ok":"qui","b":"l'a fait.","ko":["comment","quand","pourquoi"],"e":"Sans cette règle, personne ne dit rien d'utile."},
  {"t":"cloturer","a":"Sans","ok":"capitalisation","b":", un REX est une conversation.","ko":["animateur","compte rendu","bilan"],"e":"Les enseignements doivent servir aux projets suivants."},
];
