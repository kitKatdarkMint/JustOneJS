const fs = require('fs') //fs module permet d'ecrire dans un file .txt
const readline = require('readline')

const numPlayer = 5; 
const fileName = "proposition.txt"
let currentPlayer = 2; //on commence à 2 car un joueur devine

//creation du fichier
fs.writeFile(fileName,'',(err)=>{
    if (err) throw err;//a callback function for if operation fails
    demandePlayer(currentPlayer);
})

// creation d'une interface pour utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function demandePlayer(currentPlayer){
  if (currentPlayer>numPlayer){
    console.log("tous les indices ont été pris en compte !");
    rl.close();//fermeture de l'interface
    return;
  }
  
    rl.question("quel est ton indice ?",proposition=>{
    console.log(`tu as saisi ${proposition}`);
     
    fs.appendFile(fileName,proposition+"\n",(err)=>{
        if (err) throw err;
        setTimeout(()=>{
            console.clear();
            demandePlayer(currentPlayer+1);}
            ,1000);// on attends 1 seconde avant d'effacer
        
    });
 });
}

/* creation d'une fonction recursive pour respecter les 
opérations asynchrones comme l'input ne marche pas avec un while */