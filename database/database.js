const mongoose = require("mongoose")

async function conectarBD(){
    try{
        await mongoose.connect("mongodb://localhost:27017/farmacia");
        console.log("Conectado ao Banco de Dados")
    }
    catch(erro){
        console.error("Erro ao tentar conectar ao BD", erro)
        process.exit(1);
    }
}

module.exports = {conectarBD}