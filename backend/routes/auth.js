const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");


// ==========================
// LOGIN
// ==========================
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
      LEFT JOIN alunos a ON a.id = u.aluno_id
      LEFT JOIN professores p ON p.id = u.professor_id
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

    const senhaOk = await bcrypt.compare(senha, user.senha);

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
      { expiresIn: "8h" }
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


// ==========================
// REGISTER (ALUNO COMPLETO)
// ==========================
router.post(
  "/register",
  upload.single("foto"),
  async (req, res) => {
    try {
      const {
        nome,
        email,
        senha,
        responsavel,
        cpf,
        rg,
        sexo,
        telefone,
        data_nascimento
      } = req.body;

      const foto = req.file ? req.file.path : null;

      // 1. cria aluno
      const alunoResult = await pool.query(
        `
        INSERT INTO alunos (
          nome,
          responsavel,
          cpf,
          rg,
          data_nascimento,
          sexo,
          telefone,
          foto,
          email
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id
        `,
        [
          nome,
          responsavel,
          cpf,
          rg,
          data_nascimento,
          sexo,
          telefone,
          foto,
          email
        ]
      );

      const aluno_id = alunoResult.rows[0].id;

      // 2. cria usuário
      const senhaHash = await bcrypt.hash(senha, 10);

      const userResult = await pool.query(
        `
        INSERT INTO usuarios (
          email,
          senha,
          nome,
          perfil,
          aluno_id
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id
        `,
        [
          email,
          senhaHash,
          nome,
          "aluno",
          aluno_id
        ]
      );

      const user = userResult.rows[0];

      // 3. gera token
      const token = jwt.sign(
        {
          id: user.id,
          nome,
          perfil: "aluno",
          aluno_id
        },
        process.env.JWT_SECRET || "segredo",
        { expiresIn: "8h" }
      );

      return res.json({
        success: true,
        token,
        user: {
          nome,
          email,
          perfil: "aluno",
          aluno_id
        }
      });

    } catch (err) {
      console.error(err);

      if (err.constraint === "alunos_cpf_unique") {
        return res.status(400).json({
          success: false,
          erro: "Já existe um aluno cadastrado com este CPF."
        });
      }

      if (err.constraint === "alunos_email_unique") {
        return res.status(400).json({
          success: false,
          erro: "Já existe um aluno cadastrado com este e-mail."
        });
      }

      if (err.constraint === "usuarios_email_key") {
        return res.status(400).json({
          success: false,
          erro: "Este e-mail já possui um usuário cadastrado."
        });
      }

      return res.status(500).json({
        success: false,
        erro: "Erro ao cadastrar usuário."
      });
    }
  }
);

module.exports = router;