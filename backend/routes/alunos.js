const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      erro: "Token não enviado"
    });
  }

  const token = header.split(" ")[1];

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "segredo"
    );

    next();

  } catch {
    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM alunos ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { nome, data_nascimento } = req.body;

    await pool.query(
      `
      INSERT INTO alunos
      (nome, data_nascimento)
      VALUES($1,$2)
      `,
      [nome, data_nascimento]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;