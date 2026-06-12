const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");

// LISTAR NOTAS
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.id,
        n.aluno_id,
        n.turma_id,
        n.disciplina,
        n.bimestre,
        n.nota,
        a.nome AS aluno,
        t.nome AS turma
      FROM notas n
      INNER JOIN alunos a ON a.id = n.aluno_id
      INNER JOIN turmas t ON t.id = n.turma_id
      ORDER BY n.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

// CRIAR NOTA
router.post("/", auth, async (req, res) => {
  try {
    const { aluno_id, turma_id, disciplina, bimestre, nota } = req.body;

    await pool.query(`
      INSERT INTO notas (aluno_id, turma_id, disciplina, bimestre, nota)
      VALUES ($1,$2,$3,$4,$5)
    `, [aluno_id, turma_id, disciplina, bimestre, nota]);

    res.json({ sucesso: true });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;