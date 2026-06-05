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
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        a.nome AS aluno,
        t.nome AS turma,
        t.ano,
        m.data_matricula
      FROM matriculas m
      INNER JOIN alunos a
        ON a.id = m.aluno_id
      INNER JOIN turmas t
        ON t.id = m.turma_id
      ORDER BY m.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { aluno_id, turma_id } = req.body;

    await pool.query(
      `
      INSERT INTO matriculas
      (aluno_id, turma_id)
      VALUES($1,$2)
      `,
      [aluno_id, turma_id]
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

router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM matriculas WHERE id = $1",
      [req.params.id]
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

router.get("/turma/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        a.id,
        a.nome,
        a.data_nascimento
      FROM matriculas m
      INNER JOIN alunos a
        ON a.id = m.aluno_id
      WHERE m.turma_id = $1
      ORDER BY a.nome
      `,
      [req.params.id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;