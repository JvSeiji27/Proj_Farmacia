const bcrypt = require("bcrypt")
const userModel = require("../model/usuarioModel")
const jwt = require("jsonwebtoken")
const loginService = async (email, password) => {
    const user = await userModel.findOne({email})
    if(!user){
        throw new Error("Usuario nao encontrado")
    }
    const isPasswordIsValid = await bcrypt.compare(password, user.password);
    if(!isPasswordIsValid){
        throw new Error ("Senha incorreta ")
    }
    const token =  jwt.sign({id: user.id, role: user.role}, "hazard10messi",{expiresIn: "1h"})
    return {user, token}
}


module.exports = {loginService}