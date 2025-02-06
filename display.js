const fs = require('fs');

function afficheIndice() {
  const text = fs.readFileSync('proposition.txt', { encoding: 'utf8' });
  if (!text) {
    console.log("Aucun indice dispo");
  } else {
    console.log("Voici tous les indices :");
    console.log(text);
  }
}


function reponse(rl, mot_mystere) {
    return new Promise((resolve) => {
      rl.question("D'après les indices, quel est le mot mystère ? (ou tapez 'pass' pour passer) ", (proposition) => {
        const saisie = proposition.trim().toLowerCase();
        if (saisie === "pass") {
          resolve("pass");
        } else {
          resolve(saisie === mot_mystere.trim().toLowerCase());
        }
      });
    });
  }
  

function scoreIndice(score) {
  console.log("\nVotre score final est : " + score);
  if (score === 13) {
    console.log("Score parfait ! Y arriverez-vous encore ?");
  } else if (score === 12) {
    console.log("Incroyable ! Vos amis doivent être impressionnés !");
  } else if (score === 11) {
    console.log("Génial ! C’est un score qui se fête !");
  } else if (score === 9 || score === 10) {
    console.log("Waouh, pas mal du tout !");
  } else if (score >= 7 && score <= 8) {
    console.log("Vous êtes dans la moyenne. Arriverez-vous à faire mieux ?");
  } else if (score >= 4 && score <= 6) {
    console.log("C’est un bon début. Réessayez !");
  } else {
    console.log("Essayez encore.");
  }
}

module.exports = {afficheIndice, reponse, scoreIndice};
