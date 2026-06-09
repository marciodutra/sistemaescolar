const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

// Cadastro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: "Nome, email e senha são obrigatórios"
      });
    }

    // Verifica se já existe usuário com o mesmo email
    const usuarioExistente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        erro: "Email já cadastrado"
      });
    }

    // Gera hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `
      INSERT INTO usuarios (nome, email, senha, perfil)
      VALUES ($1, $2, $3, 'aluno')
      RETURNING id, email, nome, perfil
      `,
      [nome, email, senhaHash]
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
    return res.status(500).json({
      erro: err.message
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      `
      SELECT id, email, nome, perfil, senha
      FROM usuarios
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

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
    return res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;