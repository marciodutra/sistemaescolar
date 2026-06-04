const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

router.post("/", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const existe = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        erro: "Usuário já existe"
      });
    }

    await pool.query(
      "INSERT INTO usuarios(email, senha) VALUES($1,$2)",
      [email, senha]
    );

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      email
    });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;