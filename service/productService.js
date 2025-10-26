const productModel = require("../model/produtoModel")

//get

function findAllProductsService() {
    return productModel.find();
}

function findProductByIdService(id){
    return productModel.findById(id);
}

//post
function createProductService(body){
    return productModel.create(body)
}

//put
function updateProductService(id, body){
    return productModel.findByIdAndUpdate(id, body, {new: true}) //retorna o documento atualizado
}

//delete
function deleteProductByIdService(id){
    return productModel.findByIdAndDelete(id);
}

module.exports = {
    findAllProductsService,
    findProductByIdService,
    createProductService,
    updateProductService,
    deleteProductByIdService
}