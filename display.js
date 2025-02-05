const fs = require('fs');
const readline = require('readline');

// Interface readline pour gérer l'entrée utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function afficheIndice(){
    const text = fs.readFileSync('proposition.txt',{encoding:'utf8'});
    if (!text){
        console.log("aucun indice dispo")
    }
    else{
        console.log("Voici tous les indices :")
        console.log(text);
    }
    
    
}

function reponse(mot_mystere){
    return new Promise((resolve) =>{
        rl.question("d'après les indices quel est le mot-mystere ?", (proposition) => {
        console.log(`Tu as saisi : ${proposition}`);
        resolve(proposition.trim().toLowerCase() === mot_mystere.trim().toLowerCase());
        });
    });
}
function scoreIndice(nb_cartes) {
    if (nb_cartes === 13) {
        console.log("Score parfait ! Y arriverez-vous encore ?");
    } else if (nb_cartes === 12) {
        console.log("Incroyable ! Vos amis doivent être impressionnés !");
    } else if (nb_cartes === 11) {
        console.log("Génial ! C’est un score qui se fête !");
    } else if (nb_cartes === 9 || nb_cartes === 10) {
        console.log("Waouh, pas mal du tout !");
    } else if (nb_cartes >= 7 && nb_cartes <= 8) {
        console.log("Vous êtes dans la moyenne. Arriverez-vous à faire mieux ?");
    } else if (nb_cartes >= 4 && nb_cartes <= 6) {
        console.log("C’est un bon début. Réessayez !");
    } else {
        console.log("Essayez encore.");
    }
}
afficheIndice();
reponse("vache");
scoreIndice(8);
module.exports={afficheIndice,scoreIndice,reponse};