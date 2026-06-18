const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 🔥 LISTAR TURMAS
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.perfil === "admin" || user.perfil === "secretaria") {
      const result = await pool.query(`
        SELECT
          t.*,
          p.nome AS professor_nome
        FROM turmas t
        LEFT JOIN professores p
          ON p.id = t.professor_id
        ORDER BY t.id DESC
      `);

      return res.json(result.rows);
    }

    if (user.perfil === "professor") {
      const result = await pool.query(`
        SELECT
          t.*,
          p.nome AS professor_nome
        FROM turmas t
        LEFT JOIN professores p
          ON p.id = t.professor_id
        WHERE t.professor_id = $1
        ORDER BY t.id DESC
      `, [user.professor_id]);

      return res.json(result.rows);
    }

    if (user.perfil === "aluno") {
      const result = await pool.query(`
        SELECT
          t.*,
          p.nome AS professor_nome
        FROM turmas t
        INNER JOIN matriculas m
          ON m.turma_id = t.id
        LEFT JOIN professores p
          ON p.id = t.professor_id
        WHERE m.aluno_id = $1
        ORDER BY t.id DESC
      `, [user.aluno_id]);

      return res.json(result.rows);
    }

    return res.status(403).json({
      erro: "Acesso negado"
    });

  } catch (err) {
    return res.status(500).json({
      erro: err.message
    });
  }
});


// 🔥 BUSCAR TURMA POR ID (CORRIGIDO - ESSENCIAL)
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        t.*,
        p.nome AS professor_nome
      FROM turmas t
      LEFT JOIN professores p
        ON p.id = t.professor_id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: "Turma não encontrada"
      });
    }

    return res.json(result.rows[0]);

  } catch (err) {
    return res.status(500).json({
      erro: err.message
    });
  }
});


// CREATE
router.post(
  "/",
  auth,
  authorize("admin", "secretaria"),
  async (req, res) => {
    try {
      const { nome, ano, professor_id } = req.body;

      await pool.query(
        `
        INSERT INTO turmas (nome, ano, professor_id)
        VALUES ($1, $2, $3)
        `,
        [nome, ano, professor_id || null]
      );

      res.json({ ok: true });

    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
);


// UPDATE
router.put(
  "/:id",
  auth,
  authorize("admin", "secretaria"),
  async (req, res) => {
    try {
      const { nome, ano, professor_id } = req.body;

      await pool.query(
        `
        UPDATE turmas
        SET nome = $1,
            ano = $2,
            professor_id = $3
        WHERE id = $4
        `,
        [nome, ano, professor_id || null, req.params.id]
      );

      res.json({ ok: true });

    } catch (err) {
      res.status(500).json({ erro: err.message });
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
        "DELETE FROM turmas WHERE id = $1",
        [req.params.id]
      );

      res.json({ ok: true });

    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
);

module.exports = router;