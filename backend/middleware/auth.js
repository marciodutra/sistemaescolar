const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ erro: "Sem token" });
  }

  const token = header.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET não configurado");
    return res.status(500).json({ erro: "Configuração inválida do servidor" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

module.exports = auth;