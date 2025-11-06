const userService = require("../service/userService")
const mongoose = require("mongoose")

const findAllUsersController = async (req, res) => {
    try{
        const users = await userService.findAllUsersService();
        if(!users || users.length == 0){
            return res.status(404).send({message: "Nenhum usuário foi encontado"})
        }else{
            return res.status(200).send(users)
        }
}   
    catch(erro){
        console.log(erro);
        return res.status(500).send({message: "Erro interno, tente novamente depois!"})
    }

}



const findUserByIdController = async(req, res) => {
    try{

        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send({message: "O id não está no formato ideal"})
        }
        const user = await userService.findUserByIdService(id);
        if(!user){
            return res.status(404).send({message: "Nenhum usuário foi encontado"})
        }
        return res.status(200).send(user)

    }
    catch(erro){
        console.log(erro)
        return res.status(500).send({message: "Erro interno, tente novamente!"})
    }
}

const createUserController = async (req, res) => {
    try{
        const body = req.body;
        if(!body.name || !body.email || !body.password){
            return res.status(400).send({message: "Preencha todos os campos"})
        }
        const user = await userService.createUserService(body);
        return res.status(201).send(user)
    }catch(erro){
        console.log(erro)
        return res.status(500).send({message: "Erro interno, tente novamente!"})
    }
}

const updateUserController = async (req, res) => {
    try{
        const body = req.body;
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send({message: "O id não está no formato ideal"})
        }
        if(!body.name || !body.email || !body.password){
            return res.status(400).send({message: "Preencha todos os campos"})
        }
        const user = await userService.updateUserService(id, body)
        return res.status(200).send(user)
    }catch(erro){
        console.log(erro)
        return res.status(500).send({message: "Erro interno, tente novamente!"})
    }
}

const deleteUserController = async (req, res) => {
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send({message: "O id não está no formato ideal"})
        }
        const userDeleted = await userService.deleteUser(id);
        return res.status(200).send(userDeleted);

    }catch(erro){
        console.log(erro)
        return res.status(500).send({message: "Erro interno, tente novamente!"})
    }
}

module.exports = {
    findAllUsersController,
    findUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController
}