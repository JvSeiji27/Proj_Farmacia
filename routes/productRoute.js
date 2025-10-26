const express = require('express')
const router = express.Router();
const { findAllProductsController } = require('../controllers/productController');
const { findProductByIdController } = require('../controllers/productController');
const { createProductController } = require('../controllers/productController');
const { updateProductController } = require('../controllers/productController');
const { deleteProductController } = require('../controllers/productController');

//GET
router.get("/findAll", findAllProductsController);
router.get("/findById/:id", findProductByIdController);
//POST
router.post("/create", createProductController);
//PUT
router.put("/update/:id", updateProductController)
//DELETE
router.delete("/delete/:id", deleteProductController);

module.exports = router;