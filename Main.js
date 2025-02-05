const fs = require('fs');
const readline = require('readline');
const display = require('./display');
const saisie_indice = require('./saisie_indice');

const TOTAL_TOURS = 13;
const NB_JOUEURS = 5;
let tourActuel = 0;
let joueurActif = Math.floor(Math.random() * NB_JOUEURS);
let motsUtilises = new Set();

// Charger les mots depuis le fichier
const mots = fs.readFileSync('base_de_données_mots.txt', 'utf-8').split(',').map(mot => mot.trim());

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

function nouveauTour() {
    if (tourActuel >= TOTAL_TOURS) {
        console.log("Fin de la partie !");
        rl.close();
        return;
    }
    
    tourActuel++;
    joueurActif = (joueurActif + 1) % NB_JOUEURS;
    let motADeviner = choisirMotUnique();
    
    console.log(`\nTour ${tourActuel} - Joueur ${joueurActif + 1}, fermez les yeux !\n`);
    console.log("Prenez quelques secondes pour vous éloigner...\n");
    
    setTimeout(() => {
        console.log(`Le mot à faire deviner est : ${motADeviner}\n`);
        console.log("(Les autres joueurs écrivent un indice sans se consulter.)\n");
        
        // Le jeu ne passe plus automatiquement au tour suivant, permettant d'ajouter d'autres actions ici
    }, 3000); // Temps pour permettre au joueur actif de s'éloigner
}

// Démarrer le jeu
console.log("Bienvenue dans Just One !\n");
nouveauTour();



