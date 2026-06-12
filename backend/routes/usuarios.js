const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// LISTAR
router.get(
  "/",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT id, nome, email, perfil
        FROM usuarios
        ORDER BY id
        `
      );

      res.json(result.rows);

    } catch (err) {
      res.status(500).json({
        erro: err.message
      });
    }
  }
);

// ALTERAR PERFIL
router.put(
  "/:id/perfil",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      const { perfil } = req.body;

      await pool.query(
        `
        UPDATE usuarios
        SET perfil = $1
        WHERE id = $2
        `,
        [perfil, req.params.id]
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

// EXCLUIR
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM usuarios
        WHERE id = $1
        `,
        [req.params.id]
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