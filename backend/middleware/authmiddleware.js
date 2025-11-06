import jwt from "jsonwebtoken";
export const authMiddlewareToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Ex: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "hazard10messi");
    req.user = decoded; // adiciona { id, role } no req
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

