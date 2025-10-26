const express = require("express");
const mongoose = require("./database/database");
const { conectarBD } = require("./database/database");
const app = express(0);
port = 3000;
conectarBD();
app.use("/", (req,res)=>{
    res.send("Hello, World!")
})

app.listen(port, ()=>{
    console.log("Ouvindo a porta 3000!\nNo endereço: http://localhost:3000")
})