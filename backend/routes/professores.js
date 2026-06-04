const express = require("express");
const router = express.Router();

const { sql, poolPromise } = require("../config/db");
const auth = require("../middleware/auth");

// protege todas rotas
router.use(auth);

// 🔥 LISTAR PROFESSORES
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM professores");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// 🔥 CADASTRAR PROFESSOR
router.post("/", async (req, res) => {
  try {
    const { nome, disciplina } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("nome", sql.VarChar, nome)
      .input("disciplina", sql.VarChar, disciplina)
      .query(`
        INSERT INTO professores (nome, disciplina)
        VALUES (@nome, @disciplina)
      `);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// 🔥 EDITAR PROFESSOR
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, disciplina } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.VarChar, nome)
      .input("disciplina", sql.VarChar, disciplina)
      .query(`
        UPDATE professores
        SET nome=@nome, disciplina=@disciplina
        WHERE id=@id
      `);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// 🔥 DELETAR PROFESSOR
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM professores WHERE id=@id");

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;