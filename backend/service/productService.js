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

function findCriticalStorageService(){
    return productModel.find({
        $expr: {$lte: ["$quantidadeEmEstoque","$alertaMinimo"]}
    });
}

function findCriticalExpirationDateService(){
    const hoje = new Date();
    const limit = new Date();
    limit.setDate(hoje.getDate() + 7)
    return productModel.find({
        validade: {$lte: limit, $gte: hoje}
    })
}

module.exports = {
    findAllProductsService,
    findProductByIdService,
    createProductService,
    updateProductService,
    deleteProductByIdService,
    findCriticalStorageService,
    findCriticalExpirationDateService
}