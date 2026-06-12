const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const auth = require("../middleware/auth");

// RANKING DE ALUNOS
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.nome,
        AVG(n.nota) AS media
      FROM alunos a
      LEFT JOIN notas n ON n.aluno_id = a.id
      GROUP BY a.id, a.nome
      ORDER BY media DESC NULLS LAST
    `);

    const ranking = result.rows.map((r, index) => ({
      posicao: index + 1,
      aluno: r.nome,
      media: Number(r.media || 0)
    }));

    res.json(ranking);

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;