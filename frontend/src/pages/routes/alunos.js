const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { sql, poolPromise } = require("../config/db");

// 🔐 MIDDLEWARE DE AUTENTICAÇÃO
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = header.split(" ")[1];

  try {
    jwt.verify(token, "segredo");
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// 🔥 LISTAR ALUNOS (PROTEGIDO)
router.get("/", auth, async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query("SELECT * FROM alunos");

    res.json(result.recordset);

  } catch (err) {
    console.log("🔥 ERRO LISTAR:", err);
    res.status(500).json({ erro: err.message });
  }
});

// 🔥 CADASTRAR ALUNO (PROTEGIDO)
router.post("/", auth, async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { nome, data_nascimento } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("nome", sql.VarChar, nome)
      .input("data_nascimento", sql.Date, data_nascimento)
      .query(`
        INSERT INTO alunos (nome, data_nascimento)
        VALUES (@nome, @data_nascimento)
      `);

    res.json({ ok: true });

  } catch (err) {
    console.log("🔥 ERRO CADASTRO:", err);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;