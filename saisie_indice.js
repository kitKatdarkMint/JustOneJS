// saisie_indice.js
const fs = require('fs');

/**
 * Attendre un certain temps avant de continuer.
 * @param {number} ms - Durée en millisecondes.
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Supprime un indice du fichier proposition.txt en réécrivant le contenu.
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
 *
 * @param {Interface} rl - L'interface readline partagée.
 * @param {Array} players - Liste des numéros de joueurs devant saisir un indice.
 * @param {string} motADeviner - Le mot à faire deviner.
 * @returns {Promise} Résout avec la liste des indices validés.
 */
async function demandeIndices(rl, players, motADeviner) {
  // Réinitialiser (ou créer) le fichier des indices
  fs.writeFileSync('proposition.txt', '');

  
  await delay(4000); // Laisser le temps de voir le mot
  
  let indices = [];            // Liste des indices validés
  let joueurs_indices = {};    // Association indice => numéro du joueur

  for (const joueur of players) {
    console.clear(); // Effacer la console avant chaque saisie d'indice
    
    const indice = await new Promise(r => {
      rl.question(`Joueur ${joueur}, quel est ton indice ? `, (answer) => {
        r(answer.trim());
      });
    });

    // Vérifier si l'indice a déjà été proposé par un autre joueur
    if (joueurs_indices[indice]) {
      console.log(`Doublon détecté pour "${indice}". Les deux indices sont supprimés.`);
      await delay(2000); // Laisser un temps pour voir le message avant d'effacer
      
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
