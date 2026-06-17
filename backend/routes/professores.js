const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");


// ==========================
// LISTAR
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
// CREATE
// ==========================
router.post(
  "/",
  auth,
  authorize("admin"),
  upload.single("foto"),
  async (req, res) => {
    try {

      const foto = req.file ? req.file.path : null;

      const {
        nome,
        disciplina,
        email,
        telefone,
        senha
      } = req.body;

      const existe = await pool.query(
        "SELECT id FROM usuarios WHERE email = $1",
        [email]
      );

      if (existe.rows.length > 0) {
        return res.status(400).json({
          erro: "E-mail já cadastrado"
        });
      }

      console.log("BODY:", req.body);
console.log("FILE:", req.file);

      const prof = await pool.query(
        
        `
        INSERT INTO professores
        (
          nome,
          disciplina,
          email,
          telefone,
          foto
        )
        VALUES
        (
          $1,$2,$3,$4,$5
        )
        RETURNING id
        `,
        [
          nome,
          disciplina,
          email,
          telefone,
          foto
        ]
      );

      const professor_id = prof.rows[0].id;

      const senhaHash = await bcrypt.hash(senha, 10);

      await pool.query(
        `
        INSERT INTO usuarios
        (
          email,
          senha,
          nome,
          perfil,
          professor_id
        )
        VALUES
        (
          $1,$2,$3,$4,$5
        )
        `,
        [
          email,
          senhaHash,
          nome,
          "professor",
          professor_id
        ]
      );

      return res.json({
        ok: true,
        professor_id
      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: err.message
      });

    }
  }
);


// ==========================
// UPDATE
// ==========================
router.put(
  "/:id",
  auth,
  authorize("admin"),
  upload.single("foto"),
  async (req, res) => {
    try {

      const {
        nome = "",
        disciplina = "",
        email = "",
        telefone = "",
        ativo = true
      } = req.body || {};

      const foto = req.file ? req.file.path : null;

      await pool.query(
        `
        UPDATE professores
        SET
          nome = $1,
          disciplina = $2,
          email = $3,
          telefone = $4,
          foto = COALESCE($5, foto),
          ativo = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        `,
        [
          nome,
          disciplina,
          email,
          telefone,
          foto,
          ativo,
          req.params.id
        ]
      );

      await pool.query(
        `
        UPDATE usuarios
        SET
          nome = $1,
          email = $2
        WHERE professor_id = $3
        `,
        [
          nome,
          email,
          req.params.id
        ]
      );

      return res.json({
        ok: true
      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: err.message
      });

    }
  }
);


// ==========================
// DELETE
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