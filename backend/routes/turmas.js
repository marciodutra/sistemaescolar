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
      process.env.JWT_SECRET
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
      "SELECT * FROM turmas ORDER BY id DESC"
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
    const { nome, ano } = req.body;

    await pool.query(
      "INSERT INTO turmas(nome, ano) VALUES($1,$2)",
      [nome, ano]
    );

    res.json({
      ok: true
    });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { nome, ano } = req.body;

    await pool.query(
      `
      UPDATE turmas
      SET nome = $1, ano = $2
      WHERE id = $3
      `,
      [nome, ano, req.params.id]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM turmas WHERE id = $1",
      [req.params.id]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;