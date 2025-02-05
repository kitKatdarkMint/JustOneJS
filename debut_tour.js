const fs = require('fs');
const readline = require('readline');

const TOTAL_TOURS = 13;
const NB_JOUEURS = 5;
let tourActuel = 0;
let joueurActif = Math.floor(Math.random() * NB_JOUEURS);

// Charger les mots depuis le fichier
const mots = fs.readFileSync('base_de_données_mots.txt', 'utf-8').split(',');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function choisirMotsAleatoires() {
    let motsSelectionnes = [];
    while (motsSelectionnes.length < 5) {
        let mot = mots[Math.floor(Math.random() * mots.length)].trim();
        if (!motsSelectionnes.includes(mot)) {
            motsSelectionnes.push(mot);
        }
    }
    return motsSelectionnes;
}

function nouveauTour() {
    if (tourActuel >= TOTAL_TOURS) {
        console.log("Fin de la partie !");
        rl.close();
        return;
    }
    
    tourActuel++;
    joueurActif = (joueurActif + 1) % NB_JOUEURS;
    let motsSelectionnes = choisirMotsAleatoires();
    
    console.log(`\nTour ${tourActuel} - Joueur ${joueurActif + 1}, c'est à vous de deviner !`);
    console.log("Choisissez un chiffre entre 1 et 5 pour sélectionner un mot à deviner :");
    
    rl.question("Votre choix : ", (choix) => {
        let indexChoisi = parseInt(choix) - 1;
        if (indexChoisi < 0 || indexChoisi >= 5 || isNaN(indexChoisi)) {
            console.log("Choix invalide, un chiffre entre 1 et 5 est requis.");
            return nouveauTour();
        }
        
        console.log("Prenez quelques secondes pour vous éloigner...\n");
        setTimeout(() => {
            let motADeviner = motsSelectionnes[indexChoisi];
            console.log(`Le mot à faire deviner est : ${motADeviner}\n`);
            console.log("(Les autres joueurs écrivent un indice sans se consulter.)\n");
            
            setTimeout(nouveauTour, 5000); // Simule un délai avant le tour suivant
        }, 3000); // Temps pour permettre au joueur actif de s'éloigner
    });
}

// Démarrer le jeu
console.log("Bienvenue dans Just One !\n");
nouveauTour();
