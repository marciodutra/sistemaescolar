const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
    }

    const result = await pool.query(
      `
      INSERT INTO usuarios (nome, email, senha, perfil)
      VALUES ($1, $2, $3, 'aluno')
      RETURNING id, email, nome, perfil
      `,
      [nome, email, senha]
    );

    const usuario = result.rows[0];

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      email: usuario.email,
      nome: usuario.nome,
      perfil: usuario.perfil
    });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      `
      SELECT id, email, nome, perfil
      FROM usuarios
      WHERE email = $1 AND senha = $2
      `,
      [email, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const usuario = result.rows[0];

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      email: usuario.email,
      nome: usuario.nome,
      perfil: usuario.perfil
    });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

module.exports = router;