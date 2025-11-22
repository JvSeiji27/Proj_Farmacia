const express = require("express");
const router = express.Router();
const atendimentoController = require("../controllers/atendimentoController");

// Rota para criar
router.post("/criar", atendimentoController.criarAtendimento);

// Rota para listar (filtra automaticamente se é admin ou user no controller)
router.get("/listar", atendimentoController.listarAtendimentos);

// Rota para mudar status (ex: /atendimentos/status/12345)
router.put("/status/:id", atendimentoController.atualizarStatus);

module.exports = router;