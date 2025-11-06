//para integração devo usar o cors
const express = require("express");
const { conectarBD } = require("./database/database"); 
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute")
const authRouter = require("./routes/authRoute")
const app = express();
const cors = require("cors")
const port = 3000;

conectarBD(); //
app.use(cors())
app.use(express.json());
app.use("/produtos", productRouter);
app.use("/users", userRouter)
app.use("/auth", authRouter)
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

