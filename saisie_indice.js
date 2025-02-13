const fs = require('fs');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 Supprime un indice du fichier proposition.txt en réécrivant le contenu.
 */
function supprimerIndiceDuFichier(indiceASupprimer) {
  const fileName = 'proposition.txt';
  const lignes = fs.readFileSync(fileName, 'utf8').split('\n');
  const nouvellesLignes = lignes.filter(line => !line.includes(indiceASupprimer));
  fs.writeFileSync(fileName, nouvellesLignes.join('\n'), 'utf8');
}

/**
 * Demande aux joueurs (sauf le devineur) de saisir un indice unique.
 * Le mot à faire deviner est affiché pendant quelques secondes avant d'effacer l'écran.
 * En cas de doublon, l'indice déjà saisi et le nouvel indice ne seront pas retenus.
 */
async function demandeIndices(rl, players, motADeviner) {
  // initialise (ou créer) le fichier des indices
  fs.writeFileSync('proposition.txt', '');

  
  await delay(4000); // temps pour voir le mot mystere
  
  let indices = []; // Liste des indices validés
  let joueurs_indices = {};  // Association indice => numéro du joueur

  for (const joueur of players) {
    console.clear(); // efface la console avant chaque saisie d'indice
    
    const indice = await new Promise(r => {
      rl.question(`Joueur ${joueur}, quel est ton indice ? `, (answer) => {
        r(answer.trim());
      });
    });

    // verif des doublons 
    if (joueurs_indices[indice]) {
      console.log(`Doublon détecté pour "${indice}". Les deux indices sont supprimés.`);
      await delay(2000); // temps pour voir le message avant d'effacer
      
      supprimerIndiceDuFichier(indice);
      indices = indices.filter(item => item !== indice);
      delete joueurs_indices[indice];
    } else {
      indices.push(indice);
      joueurs_indices[indice] = joueur;
      fs.appendFileSync('proposition.txt', `Joueur ${joueur}: ${indice}\n`);
    }
  }

  return indices;
}

module.exports = { demandeIndices };
