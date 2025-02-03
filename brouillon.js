const fs = require('fs') //fs module permet d'ecrire dans un file .txt
const readline = require('readline')

const numPlayer = 5; 
const fileName = "proposition.txt"
let proposition = "indice"

fs.writeFile(fileName,proposition,(err)=>{
    if (err) throw err;//a callback function for if operation fails
})


//in order to add the other proposition
let proposition2 ="indice2"
fs.appendFile(fileName,proposition2,(err)=>{
    if (err) throw err;
})