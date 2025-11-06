const express = require('express')
const router = express.Router();
const { findAllProductsController } = require('../controllers/productController');
const { findProductByIdController } = require('../controllers/productController');
const { createProductController } = require('../controllers/productController');
const { updateProductController } = require('../controllers/productController');
const { deleteProductController } = require('../controllers/productController');
const { entradaProdutoController } = require('../controllers/productController');
const { saidaProdutoController } = require('../controllers/productController');
const { controlCriticalExpirationDateController } = require('../controllers/productController');
const { controlCriticalStorageController } = require('../controllers/productController');
const { authMiddlewareToken } = require('../middleware/authmiddleware');
const {authorizeRoles} = require("../middleware/role_middleware")
//GET
router.get("/findAll", findAllProductsController);
router.get("/findById/:id",  findProductByIdController);
router.get("/expirationDate", controlCriticalExpirationDateController)
router.get("/criticalStorage",  controlCriticalStorageController)
//POST
router.post("/create", createProductController);
router.post("/entrada/:id",  entradaProdutoController);
router.post("/saida/:id", saidaProdutoController);
//PUT
router.put("/update/:id", updateProductController)
//DELETE
router.delete("/delete/:id",  deleteProductController);




module.exports = router;