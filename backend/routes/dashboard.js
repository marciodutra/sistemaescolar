const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    // 👑 ADMIN / SECRETARIA
    if (
      user.perfil === "admin" ||
      user.perfil === "secretaria"
    ) {

      const alunos = await pool.query(
        "SELECT COUNT(*) FROM alunos"
      );

      const professores = await pool.query(
        "SELECT COUNT(*) FROM professores"
      );

      const turmas = await pool.query(
        "SELECT COUNT(*) FROM turmas"
      );

      const matriculas = await pool.query(
        "SELECT COUNT(*) FROM matriculas"
      );

      const ultimasMatriculas = await pool.query(`
        SELECT
          m.id,
          a.nome AS aluno,
          t.nome AS turma,
          m.data_matricula
        FROM matriculas m
        INNER JOIN alunos a
          ON a.id = m.aluno_id
        INNER JOIN turmas t
          ON t.id = m.turma_id
        ORDER BY m.data_matricula DESC
        LIMIT 5
      `);

      return res.json({
        totalAlunos: Number(alunos.rows[0].count),
        totalProfessores: Number(professores.rows[0].count),
        totalTurmas: Number(turmas.rows[0].count),
        totalMatriculas: Number(matriculas.rows[0].count),
        ultimasMatriculas: ultimasMatriculas.rows
      });
    }

    // 👩‍🏫 PROFESSOR
    if (user.perfil === "professor") {

      const alunos = await pool.query(`
        SELECT COUNT(DISTINCT a.id)
        FROM alunos a
        INNER JOIN matriculas m
          ON m.aluno_id = a.id
        INNER JOIN turmas t
          ON t.id = m.turma_id
        WHERE t.professor_id = $1
      `, [user.professor_id]);

      const turmas = await pool.query(`
        SELECT COUNT(*)
        FROM turmas
        WHERE professor_id = $1
      `, [user.professor_id]);

      const matriculas = await pool.query(`
        SELECT COUNT(*)
        FROM matriculas m
        INNER JOIN turmas t
          ON t.id = m.turma_id
        WHERE t.professor_id = $1
      `, [user.professor_id]);

      const ultimasMatriculas = await pool.query(`
        SELECT
          m.id,
          a.nome AS aluno,
          t.nome AS turma,
          m.data_matricula
        FROM matriculas m
        INNER JOIN alunos a
          ON a.id = m.aluno_id
        INNER JOIN turmas t
          ON t.id = m.turma_id
        WHERE t.professor_id = $1
        ORDER BY m.data_matricula DESC
        LIMIT 5
      `, [user.professor_id]);

      return res.json({
        totalAlunos: Number(alunos.rows[0].count),
        totalProfessores: 1,
        totalTurmas: Number(turmas.rows[0].count),
        totalMatriculas: Number(matriculas.rows[0].count),
        ultimasMatriculas: ultimasMatriculas.rows
      });
    }

    // 🧑 ALUNO
    if (user.perfil === "aluno") {

      const notas = await pool.query(`
        SELECT COUNT(*)
        FROM notas
        WHERE aluno_id = $1
      `, [user.aluno_id]);

      const matriculas = await pool.query(`
        SELECT COUNT(*)
        FROM matriculas
        WHERE aluno_id = $1
      `, [user.aluno_id]);

      return res.json({
        totalAlunos: 1,
        totalProfessores: 0,
        totalTurmas: Number(matriculas.rows[0].count),
        totalMatriculas: Number(matriculas.rows[0].count),
        totalNotas: Number(notas.rows[0].count),
        ultimasMatriculas: []
      });
    }

    return res.status(403).json({
      erro: "Acesso negado"
    });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;