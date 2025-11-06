export const authorizeRoles = (...rolesPermitidos) => { //posso passar quantos parâmetros quiser
  return (req, res, next) => {
    // req.user é preenchido pelo middleware de autenticação (authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado: permissão insuficiente" });
    }

    next(); // pode prosseguir
  };
};
