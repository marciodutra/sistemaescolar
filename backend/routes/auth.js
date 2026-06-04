const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../config/db");

router.post("/login", async (req, res) => {
  try {
    console.log("🔥 LOGIN CHEGOU:", req.body);

    const { email, senha } = req.body;

    const pool = await poolPromise;

    console.log("🔥 CONECTOU NO POOL");

    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("senha", sql.VarChar, senha)
      .query("SELECT * FROM usuarios WHERE email = @email AND senha = @senha");

    console.log("RESULT:", result.recordset);

    if (result.recordset.length === 0) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { email },
      "segredo",
      { expiresIn: "8h" }
    );

    return res.json({ token });

  } catch (err) {
    console.log("🔥 ERRO LOGIN:", err);
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;