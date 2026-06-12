const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 🔥 LISTAR PROFESSORES (CONTROLADO)
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    // 👑 ADMIN / SECRETARIA veem todos
    if (
      user.perfil === "admin" ||
      user.perfil === "secretaria"
    ) {
      const result = await pool.query(
        "SELECT * FROM professores ORDER BY id DESC"
      );

      return res.json(result.rows);
    }

    // 👩‍🏫 PROFESSOR vê apenas ele mesmo
    if (user.perfil === "professor") {
      const result = await pool.query(
        "SELECT * FROM professores WHERE id = $1",
        [user.professor_id]
      );

      return res.json(result.rows);
    }

    // 🧑 ALUNO NÃO VÊ PROFESSORES
    return res.status(403).json({
      erro: "Acesso negado"
    });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});


// CREATE (admin apenas)
router.post(
  "/",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const {
        nome,
        disciplina,
        email,
        senha
      } = req.body;

      // verifica email duplicado
      const emailExiste = await pool.query(
        `
        SELECT id
        FROM usuarios
        WHERE email = $1
        `,
        [email]
      );

      if (emailExiste.rows.length > 0) {
        return res.status(400).json({
          erro: "E-mail já cadastrado"
        });
      }

      // cria professor
      const professorResult = await pool.query(
        `
        INSERT INTO professores
        (
          nome,
          disciplina
        )
        VALUES ($1,$2)
        RETURNING id
        `,
        [
          nome,
          disciplina
        ]
      );

      const professor_id =
        professorResult.rows[0].id;

      // cria login
      const senhaHash =
        await bcrypt.hash(senha, 10);

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
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          email,
          senhaHash,
          nome,
          "professor",
          professor_id
        ]
      );

      res.json({
        ok: true,
        professor_id
      });

    } catch (err) {
      res.status(500).json({
        erro: err.message
      });
    }
  }
);


// UPDATE (admin apenas)
router.put(
  "/:id",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const {
        nome,
        disciplina
      } = req.body;

      await pool.query(
        `
        UPDATE professores
        SET
          nome = $1,
          disciplina = $2
        WHERE id = $3
        `,
        [
          nome,
          disciplina,
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


// DELETE (admin apenas)
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {

      // remove usuário vinculado
      await pool.query(
        `
        DELETE FROM usuarios
        WHERE professor_id = $1
        `,
        [req.params.id]
      );

      // remove professor
      await pool.query(
        `
        DELETE FROM professores
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