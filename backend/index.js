//para integração devo usar o cors
const express = require("express");
const { conectarBD } = require("./database/database"); 
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute")
const authRouter = require("./routes/authRoute")
const vendaRouter = require("./routes/vendaRoute"); 
const atendimentoRouter = require("./routes/atendimentoRoute");
const app = express();
const cors = require("cors")
const port = 3000;

conectarBD(); //
app.use(cors())
app.use(express.json());
app.use("/produtos", productRouter);
app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/vendas", vendaRouter);
app.use("/atendimentos", atendimentoRouter)
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

