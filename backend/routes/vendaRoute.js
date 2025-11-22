const express = require("express");
const router = express.Router();
const vendaController = require("../controllers/vendaController");
const { authMiddlewareToken } = require("../middleware/authmiddleware");


router.post("/registrar", vendaController.registrarVenda);
router.get("/relatorio", vendaController.listarVendas);

module.exports = router;