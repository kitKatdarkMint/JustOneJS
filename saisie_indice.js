const fs = require('fs');
const readline = require('readline');

const numPlayers = 5;
const fileName = "proposition.txt";
let currentPlayer = 2; // On commence à 2 car un joueur devine
let liste_indice = []; // Stocke les indices pour comparaison
let joueurs_indices = {}; // Associe les indices aux joueurs

// Création (ou vidage) du fichier au lancement
fs.writeFile(fileName, '', (err) => {
    if (err) throw err;
    demandePlayer(currentPlayer);
});

// Interface readline pour gérer l'entrée utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * Fonction pour demander un indice et gérer la suppression des doublons
 */
function demandePlayer(currentPlayer) {
    if (currentPlayer > numPlayers) {
        console.log("Tous les indices ont été pris en compte !");
        rl.close();
        return;
    }

    rl.question(`Joueur ${currentPlayer}, quel est ton indice ? `, (proposition) => {
        console.log(`Tu as saisi : ${proposition}`);

        // Vérification des doublons
        if (liste_indice.includes(proposition)) {
            console.log("Un autre joueur a déjà choisi ce mot. Suppression des deux indices ...");
            
            // Récupérer le joueur qui avait déjà cet indice
            const joueurASupprimer = joueurs_indices[proposition];

            // Supprimer l'indice de la liste et de la table d'association
            liste_indice = liste_indice.filter(indice => indice !== proposition);
            delete joueurs_indices[proposition];

            // Mettre à jour le fichier pour retirer les entrées en double
            updateFile(proposition, () => {
                setTimeout(() => {
                    console.clear();
                    demandePlayer(currentPlayer + 1); // On passe au joueur suivant
                }, 1000);
            });

            return; // On ne sauvegarde pas cet indice
        }

        // Ajout du nouvel indice
        liste_indice.push(proposition);
        joueurs_indices[proposition] = currentPlayer; // Associer l'indice au joueur

        // Écriture de l'indice dans le fichier
        fs.appendFile(fileName, `Joueur ${currentPlayer}: ${proposition}\n`, (err) => {
            if (err) throw err;

            // Attendre 1 seconde avant d'effacer et passer au joueur suivant
            setTimeout(() => {
                console.clear();
                demandePlayer(currentPlayer + 1);
            }, 1000);
        });
    });
}

/**
 * Fonction pour supprimer les lignes contenant un indice dupliqué dans le fichier
 */
function updateFile(indiceASupprimer, callback) {
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

        // Filtrer les lignes qui ne contiennent pas l'indice à supprimer
        let newContent = data.split('\n').filter(line => !line.includes(indiceASupprimer)).join('\n');

        // Réécriture du fichier sans les indices en double
        fs.writeFile(fileName, newContent, (err) => {
            if (err) throw err;
            callback(); // Appeler la suite du programme après suppression
        });
    });
}

module.exports = {demandePlayer};