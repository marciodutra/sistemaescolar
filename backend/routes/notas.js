const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 🔥 LISTAR NOTAS
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    // 👑 ADMIN / SECRETARIA
    if (
      user.perfil === "admin" ||
      user.perfil === "secretaria"
    ) {
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
        INNER JOIN alunos a
          ON a.id = n.aluno_id
        INNER JOIN turmas t
          ON t.id = n.turma_id
        ORDER BY n.id DESC
      `);

      return res.json(result.rows);
    }

    // 👩‍🏫 PROFESSOR
    if (user.perfil === "professor") {
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
        INNER JOIN alunos a
          ON a.id = n.aluno_id
        INNER JOIN turmas t
          ON t.id = n.turma_id
        WHERE t.professor_id = $1
        ORDER BY n.id DESC
      `, [user.professor_id]);

      return res.json(result.rows);
    }

    // 🧑 ALUNO
    if (user.perfil === "aluno") {
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
        INNER JOIN alunos a
          ON a.id = n.aluno_id
        INNER JOIN turmas t
          ON t.id = n.turma_id
        WHERE n.aluno_id = $1
        ORDER BY n.id DESC
      `, [user.aluno_id]);

      return res.json(result.rows);
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


// 🔥 CRIAR NOTA
router.post(
  "/",
  auth,
  authorize("admin", "professor"),
  async (req, res) => {
    try {
      const {
        aluno_id,
        turma_id,
        disciplina,
        bimestre,
        nota
      } = req.body;

      // 👩‍🏫 PROFESSOR só pode lançar nota
      // em turma dele
      if (req.user.perfil === "professor") {

        const turma = await pool.query(
          `
          SELECT id
          FROM turmas
          WHERE id = $1
            AND professor_id = $2
          `,
          [
            turma_id,
            req.user.professor_id
          ]
        );

        if (turma.rows.length === 0) {
          return res.status(403).json({
            erro:
              "Você não possui acesso a esta turma"
          });
        }

        // valida se o aluno está matriculado
        const matricula = await pool.query(
          `
          SELECT id
          FROM matriculas
          WHERE aluno_id = $1
            AND turma_id = $2
          `,
          [
            aluno_id,
            turma_id
          ]
        );

        if (matricula.rows.length === 0) {
          return res.status(400).json({
            erro:
              "Aluno não pertence à turma"
          });
        }
      }

      await pool.query(
        `
        INSERT INTO notas (
          aluno_id,
          turma_id,
          disciplina,
          bimestre,
          nota
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          aluno_id,
          turma_id,
          disciplina,
          bimestre,
          nota
        ]
      );

      res.json({
        sucesso: true
      });

    } catch (err) {
      res.status(500).json({
        erro: err.message
      });
    }
  }
);

module.exports = router;