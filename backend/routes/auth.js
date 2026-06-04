const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { sql, poolPromise } = require("../config/db");

// 🔐 AUTH
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

// 🔥 LISTAR TURMAS
router.get("/", auth, async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query("SELECT * FROM turmas");

    res.json(result.recordset);

  } catch (err) {
    console.log("🔥 ERRO LISTAR TURMAS:", err);
    res.status(500).json({ erro: err.message });
  }
});

// 🔥 CADASTRAR TURMA
router.post("/", auth, async (req, res) => {
  try {
    const { nome, ano } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("nome", sql.VarChar, nome)
      .input("ano", sql.Int, ano)
      .query(`
        INSERT INTO turmas (nome, ano)
        VALUES (@nome, @ano)
      `);

    res.json({ ok: true });

  } catch (err) {
    console.log("🔥 ERRO CADASTRAR TURMA:", err);
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;