const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.email,
        u.senha,
        u.perfil,
        u.nome AS nome_usuario,
        u.aluno_id,
        u.professor_id,
        a.nome AS nome_aluno,
        p.nome AS nome_professor
      FROM usuarios u
      LEFT JOIN alunos a
        ON a.id = u.aluno_id
      LEFT JOIN professores p
        ON p.id = u.professor_id
      WHERE u.email = $1
      `,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuário ou senha inválidos"
      });
    }

    const senhaOk = await bcrypt.compare(
      senha,
      user.senha
    );

    if (!senhaOk) {
      return res.status(401).json({
        success: false,
        message: "Usuário ou senha inválidos"
      });
    }

    const nomeFinal =
      user.nome_aluno ??
      user.nome_professor ??
      user.nome_usuario ??
      user.email ??
      "Usuário";

    const token = jwt.sign(
      {
        id: user.id,
        nome: nomeFinal,
        perfil: user.perfil,
        aluno_id: user.aluno_id,
        professor_id: user.professor_id
      },
      process.env.JWT_SECRET || "segredo",
      {
        expiresIn: "8h"
      }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nome: nomeFinal,
        perfil: user.perfil,
        aluno_id: user.aluno_id,
        professor_id: user.professor_id
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Erro interno no login"
    });
  }
});

module.exports = router;