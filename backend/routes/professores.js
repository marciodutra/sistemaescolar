const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");


// ==========================
// LISTAR PROFESSORES
// ==========================
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.perfil === "admin" || user.perfil === "secretaria") {
      const result = await pool.query(
        "SELECT * FROM professores ORDER BY id DESC"
      );

      return res.json(result.rows);
    }

    if (user.perfil === "professor") {
      const result = await pool.query(
        "SELECT * FROM professores WHERE id = $1",
        [user.professor_id]
      );

      return res.json(result.rows);
    }

    return res.status(403).json({ erro: "Acesso negado" });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});


// ==========================
// CREATE PROFESSOR
// ==========================
router.post("/", auth, authorize("admin"), async (req, res) => {
  try {
    const { nome, disciplina, email, senha } = req.body;

    // email duplicado
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    const prof = await pool.query(
      `
      INSERT INTO professores (nome, disciplina)
      VALUES ($1,$2)
      RETURNING id
      `,
      [nome, disciplina]
    );

    const professor_id = prof.rows[0].id;

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      `
      INSERT INTO usuarios (email, senha, nome, perfil, professor_id)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [email, senhaHash, nome, "professor", professor_id]
    );

    return res.json({
      ok: true,
      professor_id
    });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});


// ==========================
// UPDATE PROFESSOR
// ==========================
router.put("/:id", auth, authorize("admin"), async (req, res) => {
  try {
    const { nome, disciplina } = req.body;

    await pool.query(
      `
      UPDATE professores
      SET nome = $1,
          disciplina = $2
      WHERE id = $3
      `,
      [nome, disciplina, req.params.id]
    );

    await pool.query(
      `
      UPDATE usuarios
      SET nome = $1
      WHERE professor_id = $2
      `,
      [nome, req.params.id]
    );

    return res.json({ ok: true });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});


// ==========================
// DELETE PROFESSOR
// ==========================
router.delete("/:id", auth, authorize("admin"), async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM usuarios WHERE professor_id = $1",
      [req.params.id]
    );

    await pool.query(
      "DELETE FROM professores WHERE id = $1",
      [req.params.id]
    );

    return res.json({ ok: true });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;