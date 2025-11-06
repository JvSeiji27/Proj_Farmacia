const userModel = require("../model/usuarioModel");


function findAllUsersService() {
    return userModel.find();
}

function findUserByIdService(id){
    return userModel.findById(id);
}

function createUserService(body){
    return userModel.create(body)
}

function updateUserService(id, body){
    return userModel.findByIdAndUpdate(id, body, {new: true});
}

function deleteUser(id){
    return userModel.findByIdAndDelete(id);
}


module.exports = {
    findAllUsersService,
    findUserByIdService,
    createUserService,
    updateUserService,
    deleteUser
}