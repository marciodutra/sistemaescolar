const express = require("express");
const router = express.Router();

const { sql, poolPromise } = require("../config/db");
const auth = require("../middleware/auth");

// protege rotas
router.use(auth);

// GET
router.get("/", async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM alunos");
  res.json(result.recordset);
});

// POST
router.post("/", async (req, res) => {
  const { nome, data_nascimento } = req.body;

  const pool = await poolPromise;

  await pool.request()
    .input("nome", sql.VarChar, nome)
    .input("data_nascimento", sql.Date, data_nascimento)
    .query(`
      INSERT INTO alunos (nome, data_nascimento)
      VALUES (@nome, @data_nascimento)
    `);

  res.json({ ok: true });
});

// PUT
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento } = req.body;

  const pool = await poolPromise;

  await pool.request()
    .input("id", sql.Int, id)
    .input("nome", sql.VarChar, nome)
    .input("data_nascimento", sql.Date, data_nascimento)
    .query(`
      UPDATE alunos
      SET nome=@nome, data_nascimento=@data_nascimento
      WHERE id=@id
    `);

  res.json({ ok: true });
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const pool = await poolPromise;

  await pool.request()
    .input("id", sql.Int, id)
    .query("DELETE FROM alunos WHERE id=@id");

  res.json({ ok: true });
});

module.exports = router;