const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/upload");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;

    // 👑 ADMIN / SECRETARIA
    if (
      user.perfil === "admin" ||
      user.perfil === "secretaria"
    ) {
      const result = await pool.query(
        "SELECT * FROM alunos ORDER BY id DESC"
      );

      return res.json(result.rows);
    }

    // 👩‍🏫 PROFESSOR
    if (user.perfil === "professor") {
      const result = await pool.query(`
        SELECT DISTINCT
          a.*
        FROM alunos a
        INNER JOIN matriculas m
          ON m.aluno_id = a.id
        INNER JOIN turmas t
          ON t.id = m.turma_id
        WHERE t.professor_id = $1
        ORDER BY a.nome
      `, [user.professor_id]);

      return res.json(result.rows);
    }

    // 🧑 ALUNO
    if (user.perfil === "aluno") {
      const result = await pool.query(
        `
        SELECT *
        FROM alunos
        WHERE id = $1
        `,
        [user.aluno_id]
      );

      return res.json(result.rows);
    }

    return res.status(403).json({
      erro: "Acesso negado"
    });

  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});


// CREATE
router.post(
  "/",
  auth,
  authorize("admin", "secretaria"),
  upload.single("foto"),
  async (req, res) => {
    try {

      const foto = req.file ? req.file.path : null;

      const {
  nome,
  responsavel,
  cpf,
  rg,
  data_nascimento,
  sexo,
  telefone,
  logradouro,
  numero,
  bairro,
  cidade,
  estado,
  cep,
  email,
  senha
} = req.body;

      // Cadastra o aluno
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
          logradouro,
          numero,
          bairro,
          cidade,
          estado,
          cep,
          foto,
          email
        )
        VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15
        )
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
          logradouro,
          numero,
          bairro,
          cidade,
          estado,
          cep,
          foto,
          email
        ]
      );

      const aluno_id = alunoResult.rows[0].id;

      const senhaHash = await bcrypt.hash(senha, 10);

      await pool.query(
        `
        INSERT INTO usuarios (
          email,
          senha,
          nome,
          perfil,
          aluno_id
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          email,
          senhaHash,
          nome,
          "aluno",
          aluno_id
        ]
      );

      res.json({
        ok: true,
        aluno_id
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        erro: err.message
      });

    }
  }
);


// UPDATE
router.put(
  "/:id",
  auth,
  authorize("admin", "secretaria"),
  upload.single("foto"),
  async (req, res) => {
    try {

      // 🔥 GARANTE QUE NÃO QUEBRA SE VIER VAZIO
      const {
        nome = "",
        responsavel = "",
        cpf = "",
        rg = "",
        data_nascimento = "",
        sexo = "",
        telefone = "",
        logradouro = "",
        numero = "",
        bairro = "",
        cidade = "",
        estado = "",
        cep = "",
        email = "",
        ativo = true
      } = req.body || {};

      const foto = req.file ? req.file.path : null;

      await pool.query(
        `
        UPDATE alunos
        SET
          nome = $1,
          responsavel = $2,
          cpf = $3,
          rg = $4,
          data_nascimento = $5,
          sexo = $6,
          telefone = $7,
          logradouro = $8,
          numero = $9,
          bairro = $10,
          cidade = $11,
          estado = $12,
          cep = $13,
          foto = COALESCE($14, foto),
          email = $15,
          ativo = $16,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $17
        `,
        [
          nome,
          responsavel,
          cpf,
          rg,
          data_nascimento,
          sexo,
          telefone,
          logradouro,
          numero,
          bairro,
          cidade,
          estado,
          cep,
          foto,
          email,
          ativo,
          req.params.id
        ]
      );

      await pool.query(
        `
        UPDATE usuarios
        SET nome = $1, email = $2
        WHERE aluno_id = $3
        `,
        [nome, email, req.params.id]
      );

      return res.json({ ok: true });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: err.message });
    }
  }
);


// DELETE
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  async (req, res) => {
    try {

      // Exclui o usuário
      await pool.query(
        `
        DELETE FROM usuarios
        WHERE aluno_id = $1
        `,
        [req.params.id]
      );

      // Exclui o aluno
      await pool.query(
        `
        DELETE FROM alunos
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