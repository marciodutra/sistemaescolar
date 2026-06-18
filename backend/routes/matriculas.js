const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");


// 🔥 LISTAR MATRÍCULAS (CONTROLADO)
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.perfil === "admin" || user.perfil === "secretaria") {
      const result = await pool.query(`
        SELECT
          m.id,
          a.nome AS aluno,
          t.nome AS turma,
          t.ano,
          m.data_matricula
        FROM matriculas m
        INNER JOIN alunos a ON a.id = m.aluno_id
        INNER JOIN turmas t ON t.id = m.turma_id
        ORDER BY m.id DESC
      `);

      return res.json(result.rows);
    }

    if (user.perfil === "professor") {
      const result = await pool.query(`
        SELECT
          m.id,
          a.nome AS aluno,
          t.nome AS turma,
          t.ano,
          m.data_matricula
        FROM matriculas m
        INNER JOIN alunos a ON a.id = m.aluno_id
        INNER JOIN turmas t ON t.id = m.turma_id
        WHERE t.professor_id = $1
        ORDER BY m.id DESC
      `, [user.professor_id]);

      return res.json(result.rows);
    }

    if (user.perfil === "aluno") {
      const result = await pool.query(`
        SELECT
          m.id,
          a.nome AS aluno,
          t.nome AS turma,
          t.ano,
          m.data_matricula
        FROM matriculas m
        INNER JOIN alunos a ON a.id = m.aluno_id
        INNER JOIN turmas t ON t.id = m.turma_id
        WHERE m.aluno_id = $1
        ORDER BY m.id DESC
      `, [user.aluno_id]);

      return res.json(result.rows);
    }

    return res.status(403).json({ erro: "Acesso negado" });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});


// 🔥 BUSCAR MATRÍCULA POR ID (CORREÇÃO DO ERRO 404)
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        m.id,
        a.nome AS aluno,
        t.nome AS turma,
        t.ano,
        m.data_matricula
      FROM matriculas m
      INNER JOIN alunos a ON a.id = m.aluno_id
      INNER JOIN turmas t ON t.id = m.turma_id
      WHERE m.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Matrícula não encontrada" });
    }

    return res.json(result.rows[0]);

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});


// CREATE
router.post(
  "/",
  auth,
  authorize("admin", "secretaria"),
  async (req, res) => {
    try {
      const { aluno_id, turma_id } = req.body;

      await pool.query(`
        INSERT INTO matriculas (aluno_id, turma_id)
        VALUES ($1, $2)
      `, [aluno_id, turma_id]);

      return res.json({ ok: true });

    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
);


// DELETE
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      await pool.query(
        "DELETE FROM matriculas WHERE id = $1",
        [req.params.id]
      );

      return res.json({ ok: true });

    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
);


// 🔥 ALUNOS POR TURMA
router.get("/turma/:id", auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.perfil === "admin" || user.perfil === "secretaria") {
      const result = await pool.query(`
        SELECT
          a.id,
          a.nome,
          a.data_nascimento
        FROM matriculas m
        INNER JOIN alunos a ON a.id = m.aluno_id
        WHERE m.turma_id = $1
        ORDER BY a.nome
      `, [req.params.id]);

      return res.json(result.rows);
    }

    if (user.perfil === "professor") {
      const result = await pool.query(`
        SELECT
          a.id,
          a.nome,
          a.data_nascimento
        FROM matriculas m
        INNER JOIN alunos a ON a.id = m.aluno_id
        INNER JOIN turmas t ON t.id = m.turma_id
        WHERE m.turma_id = $1
          AND t.professor_id = $2
        ORDER BY a.nome
      `, [req.params.id, user.professor_id]);

      return res.json(result.rows);
    }

    return res.status(403).json({ erro: "Acesso negado" });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;