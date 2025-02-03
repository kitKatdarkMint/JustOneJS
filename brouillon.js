const fs = require('fs') //fs module permet d'ecrire dans un file .txt
const readline = require('readline')

const numPlayer = 5; 
const fileName = "proposition.txt"

// creation d'une interface pour utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
let proposition = rl.question("quel est ton indice ?",proposition=>{
    console.log(`tu as saisi ${proposition}`);
    rl.close();
});

fs.writeFile(fileName,proposition,(err)=>{
    if (err) throw err;//a callback function for if operation fails
})


//in order to add the other proposition
let proposition2 ="indice2"
fs.appendFile(fileName,proposition2,(err)=>{
    if (err) throw err;
})