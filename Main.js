// Main.js
const fs = require('fs');
const readline = require('readline');
const { demandePlayer } = require('./saisie_indice');
const { afficheIndice, scoreIndice } = require('./display');

// Configuration du jeu
const NB_JOUEURS = 5;
const TOTAL_CARTES = 13; // La « pioche » initiale
let score = 0;
let cartesRestantes = TOTAL_CARTES;
let tour = 0;
let activePlayer = null; // Le joueur qui doit deviner

// Fonction utilitaire pour poser une question et attendre la réponse
function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Fonction pour simuler la sélection du mot mystère (inspirée de debut_tour.js)
async function selectionMotMystere() {
  // Chargement de la base de mots et sélection aléatoire de 5 propositions
  let mots = fs.readFileSync('base_de_données_mots.txt', 'utf8').split(',');
  let motsSelectionnes = [];
  while (motsSelectionnes.length < 5) {
    let mot = mots[Math.floor(Math.random() * mots.length)].trim();
    if (!motsSelectionnes.includes(mot)) {
      motsSelectionnes.push(mot);
    }
  }

  // Détermination du joueur actif : on fait tourner les joueurs (de 1 à NB_JOUEURS)
  activePlayer = (tour % NB_JOUEURS) + 1;
  console.log(`\nTour ${tour + 1} - Joueur ${activePlayer}, c'est à vous de deviner !`);
  console.log("Choisissez un chiffre entre 1 et 5 pour sélectionner le mot à faire deviner :");
  motsSelectionnes.forEach((mot, index) => {
    console.log(`${index + 1}: ${mot}`);
  });

  // Le joueur actif choisit un chiffre
  let choix = await askQuestion("Votre choix : ");
  let indexChoisi = parseInt(choix) - 1;
  if (isNaN(indexChoisi) || indexChoisi < 0 || indexChoisi >= 5) {
    console.log("Choix invalide, un chiffre entre 1 et 5 est requis. Un mot au hasard sera choisi.");
    indexChoisi = 0;
  }

  console.log("Prenez quelques secondes pour vous éloigner...");
  await new Promise(r => setTimeout(r, 3000)); // Délai pour que le joueur actif s'éloigne

  let motMystere = motsSelectionnes[indexChoisi];
  console.log(`Le mot à faire deviner est : ${motMystere}`);
  console.log("(Les autres joueurs écrivent un indice sans se consulter.)\n");

  return motMystere;
}

// Fonction principale du jeu
async function main() {
  console.log("Bienvenue dans Just One !\n");

  // Tant qu'il reste des cartes dans la pioche...
  while (cartesRestantes > 0) {
    tour++;

    // 1. Sélection du mot mystère et détermination du joueur actif
    const motMystere = await selectionMotMystere();

    // 2. Les autres joueurs rédigent leurs indices
    // On suppose ici que le joueur actif ne participe pas à la rédaction des indices.
    // Ainsi, on lance la collecte des indices pour NB_JOUEURS - 1 joueurs.
    // Dans saisie_indice.js, currentPlayer est initialisé à 2 pour exclure le joueur 1,
    // mais ici, pour simplifier, nous lançons la fonction et attendons qu’elle se termine.
    // ATTENTION : dans la version actuelle, la fonction demandePlayer ferme son interface readline
    // à la fin, ce qui est acceptable ici car nous l'utilisons à chaque tour séparément.
    await new Promise(resolve => {
      // Remise à zéro du fichier des propositions à chaque tour pour ne pas cumuler les indices d'un tour précédent
      fs.writeFile('proposition.txt', '', (err) => {
        if (err) throw err;
        // On démarre la collecte des indices à partir du joueur 2
        demandePlayer(2);
        // On attend un délai (ici 6 secondes) pour laisser le temps aux joueurs de saisir leurs indices.
        setTimeout(resolve, 6000);
      });
    });

    // 3. Afficher les indices collectés au joueur actif
    console.log("\nVoici les indices saisis par vos coéquipiers :");
    afficheIndice();

    // 4. Le joueur actif propose sa réponse
    let proposition = await askQuestion("D'après ces indices, quel est le mot-mystère ? (ou tapez 'pass' pour passer) : ");
    proposition = proposition.trim();

    // 5. Gestion de la réponse
    if (proposition.toLowerCase() === motMystere.toLowerCase()) {
      console.log("Bravo, bonne réponse !");
      score++;
      // Succès : on retire 1 carte de la pioche
      cartesRestantes--;
    } else if (proposition.toLowerCase() === 'pass') {
      console.log("Vous avez passé ce tour.");
      // Pass : on retire 1 carte et le joueur actif change (ce qui se fera naturellement lors du prochain tour)
      cartesRestantes--;
    } else {
      console.log("Mauvaise réponse...");
      // Échec : on retire 2 cartes de la pioche
      cartesRestantes = Math.max(0, cartesRestantes - 2);
    }

    console.log(`\nCartes restantes : ${cartesRestantes}`);
    console.log(`Score actuel : ${score}\n`);

    // Petite pause avant le tour suivant
    await new Promise(r => setTimeout(r, 3000));
  }

  // Fin de partie : affichage du score
  console.log("\n--- Fin de la partie ---");
  scoreIndice(score);
}

main();
