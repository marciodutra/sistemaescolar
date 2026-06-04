const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../config/db");

router.post("/", async (req, res) => {
  try {
    console.log("🔥 LOGIN CHEGOU:", req.body);

    const { email, senha } = req.body;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("senha", sql.VarChar, senha)
      .query(`
        SELECT * FROM usuarios 
        WHERE email = @email AND senha = @senha
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { email },
      "segredo",
      { expiresIn: "8h" }
    );

    return res.json({ token });

  } catch (err) {
    console.log("🔥 ERRO LOGIN:", err);
    return res.status(500).json({ erro: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const pool = await poolPromise;

    // Verifica se já existe
    const check = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM usuarios WHERE email = @email");

    if (check.recordset.length > 0) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    // Insere usuário
    await pool.request()
      .input("email", sql.VarChar, email)
      .input("senha", sql.VarChar, senha)
      .query(`
        INSERT INTO usuarios (email, senha)
        VALUES (@email, @senha)
      `);

    // Gera token automático (login automático após cadastro)
    const token = jwt.sign(
      { email },
      "segredo",
      { expiresIn: "8h" }
    );

    return res.json({ token, email });

  } catch (err) {
    console.log("🔥 ERRO REGISTER:", err);
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;