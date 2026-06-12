const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const auth = require("../middleware/auth");

router.get("/:aluno_id", auth, async (req, res) => {
  try {
    const { aluno_id } = req.params;
    const user = req.user;

    // 🔥 REGRA DE SEGURANÇA
    if (user.perfil === "aluno" && user.aluno_id != aluno_id) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    const result = await pool.query(
      `
      SELECT
        disciplina,
        bimestre,
        AVG(nota) AS media
      FROM notas
      WHERE aluno_id = $1
      GROUP BY disciplina, bimestre
      ORDER BY disciplina, bimestre
      `,
      [aluno_id]
    );

    const disciplinas = result.rows.map((d) => ({
      disciplina: d.disciplina,
      bimestre: d.bimestre,
      media: Number(d.media),
    }));

    const mediaGeral =
      disciplinas.reduce((acc, d) => acc + d.media, 0) /
      (disciplinas.length || 1);

    let situacao = "Reprovado";

    if (mediaGeral >= 7) situacao = "Aprovado";
    else if (mediaGeral >= 5) situacao = "Recuperação";

    const aluno = await pool.query(
      "SELECT nome FROM alunos WHERE id = $1",
      [aluno_id]
    );

    res.json({
      aluno: aluno.rows[0]?.nome || "Aluno",
      disciplinas,
      mediaGeral: Number(mediaGeral.toFixed(2)),
      situacao,
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
module.exports = router;