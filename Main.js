const display = require('./display');
const saisie_indice = require('./saisie_indice');
const debut_tour = require('./debut_tour')


let currentPlayer = 2; //on commence à 2 car un joueur devine
let liste_indice = [];
saisie_indice.demandePlayer(currentPlayer);
display.afficheIndice();


// a la fin
display.scoreIndice(8);