//para integração devo usar o cors
const express = require("express");
const { conectarBD } = require("./database/database"); 
const productRouter = require("./routes/productRoute");
const app = express();
const cors = require("cors")
const port = 3000;

conectarBD(); //
app.use(cors())
app.use(express.json());
app.use("/produtos", productRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
