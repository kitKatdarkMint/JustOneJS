const fs = require('fs')

function afficheIndice(){
    const text = fs.readFileSync('proposition.txt',{encoding:'utf8'});
    console.log("Voici tous les indices :")
    console.log(text)
    //attente pour que joueur actif saissise reponse retourne la reponse
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

module.exports={afficheIndice,scoreIndice};