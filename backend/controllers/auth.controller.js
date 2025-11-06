const authService = require("../service/auth.service")

const loginAuthController = async(req, res) => {
    try{
        const {email, password} = req.body;
        const {user, token} = await authService.loginService(email, password)
        res.status(200).json({
            message: "Login bem-sucedido",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }, token
        });
    }catch(erro){
        if (erro.message === "Usuário não encontrado" || erro.message === "Senha incorreta") {
      return res.status(401).json({ message: erro.message });
    }

    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor" });
    }
}


module.exports = {loginAuthController}