// main.js
const fs = require('fs');
const readline = require('readline');
const display = require('./display');
const saisie_indice = require('./saisie_indice');

const TOTAL_TOURS = 5;
const NB_JOUEURS = 5;
let tourActuel = 0;
let score = 0;
let joueurActif = Math.floor(Math.random() * NB_JOUEURS);
let motsUtilises = new Set();

// Charger les mots depuis le fichier (les mots doivent être séparés par des virgules)
const mots = fs.readFileSync('base_de_données_mots.txt', 'utf-8')
  .split(',')
  .map(mot => mot.trim());

// Création d'une interface readline partagée
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function choisirMotUnique() {
  let mot;
  do {
    mot = mots[Math.floor(Math.random() * mots.length)];
  } while (motsUtilises.has(mot) && motsUtilises.size < mots.length);
  motsUtilises.add(mot);
  return mot;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function nouveauTour() {
  if (tourActuel >= TOTAL_TOURS) {
    console.log("\nFin de la partie !");
    display.scoreIndice(score);
    rl.close();
    return;
  }

  tourActuel++;
  // Alterner le joueur actif (celui qui devine)
  joueurActif = (joueurActif + 1) % NB_JOUEURS;
  const motADeviner = choisirMotUnique();

  console.log(`\n=== Tour ${tourActuel} ===`);
  console.log(`Joueur ${joueurActif + 1} (devineur), fermez les yeux !`);
  console.log("Les autres joueurs, préparez vos indices...\n");

  // Laisser quelques secondes pour que le devineur ferme les yeux
  await delay(3000);

  console.log(`Le mot à faire deviner est : ${motADeviner}\n`);

  // Constituer la liste des joueurs qui vont donner un indice (tous sauf le devineur)
  const joueursIndices = [];
  for (let i = 1; i <= NB_JOUEURS; i++) {
    if (i !== (joueurActif + 1)) {
      joueursIndices.push(i);
    }
  }

  // Demander les indices aux autres joueurs
  await saisie_indice.demandeIndices(rl, joueursIndices);

  // Afficher les indices collectés
  display.afficheIndice();

  // Le devineur essaie de deviner le mot
  // On attend que le devineur saisisse une réponse.
  // On considère que s'il tape "pass", c'est qu'il passe.
  const reponseDevineur = await display.reponse(rl, motADeviner);

  if (reponseDevineur === true) {
    console.log("Bonne réponse !");
    score++;
    // Une seule carte est défaussée (le tour actuel déjà comptabilisé)
  } else if (reponseDevineur === "pass") {
    console.log("Le devineur a passé. Seule la carte est défaussée.");
    // Rien d'autre à faire, le tour actuel compte pour une carte défaussée
  } else {
    console.log("Mauvaise réponse !");
    // En cas de mauvaise réponse, on défausse la carte actuelle
    // et une carte supplémentaire : on incrémente tourActuel d'une fois de plus.
    tourActuel++;
  }

  await delay(1000);
  nouveauTour();
}

// Lancer le jeu
console.log("Bienvenue dans Just One !\n");
nouveauTour();
