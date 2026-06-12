const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    // 👑 ADMIN / SECRETARIA
    if (
      user.perfil === "admin" ||
      user.perfil === "secretaria"
    ) {
      const result = await pool.query(
        "SELECT * FROM alunos ORDER BY id DESC"
      );

      return res.json(result.rows);
    }

    // 👩‍🏫 PROFESSOR
    if (user.perfil === "professor") {
      const result = await pool.query(`
        SELECT DISTINCT
          a.*
        FROM alunos a
        INNER JOIN matriculas m
          ON m.aluno_id = a.id
        INNER JOIN turmas t
          ON t.id = m.turma_id
        WHERE t.professor_id = $1
        ORDER BY a.nome
      `, [user.professor_id]);

      return res.json(result.rows);
    }

    // 🧑 ALUNO
    if (user.perfil === "aluno") {
      const result = await pool.query(
        `
        SELECT *
        FROM alunos
        WHERE id = $1
        `,
        [user.aluno_id]
      );

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


// CREATE
router.post(
  "/",
  auth,
  authorize("admin", "secretaria"),
  async (req, res) => {
    try {
      const {
        nome,
        data_nascimento,
        email,
        senha
      } = req.body;

      const alunoResult = await pool.query(
        `
        INSERT INTO alunos (
          nome,
          data_nascimento
        )
        VALUES ($1,$2)
        RETURNING id
        `,
        [nome, data_nascimento]
      );

      const aluno_id =
        alunoResult.rows[0].id;

      const senhaHash =
        await bcrypt.hash(senha, 10);

      await pool.query(
        `
        INSERT INTO usuarios (
          email,
          senha,
          nome,
          perfil,
          aluno_id
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          email,
          senhaHash,
          nome,
          "aluno",
          aluno_id
        ]
      );

      res.json({
        ok: true,
        aluno_id
      });

    } catch (err) {
      res.status(500).json({
        erro: err.message
      });
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
      const {
        nome,
        data_nascimento
      } = req.body;

      await pool.query(
        `
        UPDATE alunos
        SET
          nome = $1,
          data_nascimento = $2
        WHERE id = $3
        `,
        [
          nome,
          data_nascimento,
          req.params.id
        ]
      );

      res.json({
        ok: true
      });

    } catch (err) {
      res.status(500).json({
        erro: err.message
      });
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
        `
        DELETE FROM alunos
        WHERE id = $1
        `,
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
  }
);

module.exports = router;