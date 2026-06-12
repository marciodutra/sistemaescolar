const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");

// =====================
// ABRIR CHAMADO
// =====================
router.post("/", auth, async (req, res) => {
  try {
    const { titulo, mensagem, destino } = req.body;

    if (!titulo || !mensagem) {
      return res.status(400).json({
        erro: "Título e mensagem são obrigatórios"
      });
    }

    // aluno -> professor/admin
    if (req.user.perfil === "aluno") {
      await pool.query(
        `
        INSERT INTO suporte
        (
          usuario_id,
          perfil,
          titulo,
          mensagem,
          status,
          destino
        )
        VALUES ($1,$2,$3,$4,'aberto',$5)
        `,
        [
          req.user.id,
          "aluno",
          titulo,
          mensagem,
          destino || "professor"
        ]
      );

      return res.json({ ok: true });
    }

    // professor -> admin
    if (req.user.perfil === "professor") {
      await pool.query(
        `
        INSERT INTO suporte
        (
          usuario_id,
          perfil,
          titulo,
          mensagem,
          status,
          destino
        )
        VALUES ($1,$2,$3,$4,'aberto','admin')
        `,
        [
          req.user.id,
          "professor",
          titulo,
          mensagem
        ]
      );

      return res.json({ ok: true });
    }

    return res.status(403).json({
      erro: "Perfil não permitido"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message });
  }
});


// =====================
// LISTAR CHAMADOS
// =====================
router.get("/", auth, async (req, res) => {
  try {

    // ALUNO
    if (req.user.perfil === "aluno") {
      const result = await pool.query(
        `
        SELECT *
        FROM suporte
        WHERE usuario_id = $1
        ORDER BY id DESC
        `,
        [req.user.id]
      );

      return res.json(result.rows);
    }

    // PROFESSOR
    if (req.user.perfil === "professor") {

      const chamadosAlunos = await pool.query(
        `
        SELECT s.*
        FROM suporte s
        INNER JOIN usuarios u
          ON u.id = s.usuario_id
        INNER JOIN alunos a
          ON a.id = u.aluno_id
        INNER JOIN matriculas m
          ON m.aluno_id = a.id
        INNER JOIN turmas t
          ON t.id = m.turma_id
        WHERE
          t.professor_id = $1
          AND s.destino = 'professor'
        ORDER BY s.id DESC
        `,
        [req.user.professor_id]
      );

      const chamadosAdmin = await pool.query(
        `
        SELECT *
        FROM suporte
        WHERE usuario_id = $1
          AND destino = 'admin'
        ORDER BY id DESC
        `,
        [req.user.id]
      );

      return res.json([
        ...chamadosAlunos.rows,
        ...chamadosAdmin.rows
      ]);
    }

    // ADMIN
    if (req.user.perfil === "admin") {
      const result = await pool.query(
        `
        SELECT *
        FROM suporte
        WHERE destino = 'admin'
        ORDER BY id DESC
        `
      );

      return res.json(result.rows);
    }

    return res.json([]);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message });
  }
});


// =====================
// RESPONDER CHAMADO
// =====================
router.put("/:id", auth, async (req, res) => {
  try {

    const { resposta } = req.body;

    if (!resposta) {
      return res.status(400).json({
        erro: "Resposta obrigatória"
      });
    }

    // PROFESSOR RESPONDE
    if (req.user.perfil === "professor") {
      await pool.query(
        `
        UPDATE suporte
        SET resposta = $1,
            status = 'respondido'
        WHERE id = $2
          AND destino = 'professor'
        `,
        [resposta, req.params.id]
      );

      return res.json({ ok: true });
    }

    // ADMIN RESPONDE
    if (req.user.perfil === "admin") {
      await pool.query(
        `
        UPDATE suporte
        SET resposta = $1,
            status = 'respondido'
        WHERE id = $2
          AND destino = 'admin'
        `,
        [resposta, req.params.id]
      );

      return res.json({ ok: true });
    }

    return res.status(403).json({
      erro: "Sem permissão"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message });
  }
});


// =====================
// ENCERRAR CHAMADO (NOVO)
// =====================
router.put("/encerrar/:id", auth, async (req, res) => {
  try {

    const ticket = await pool.query(
      `SELECT * FROM suporte WHERE id = $1`,
      [req.params.id]
    );

    if (ticket.rows.length === 0) {
      return res.status(404).json({
        erro: "Chamado não encontrado"
      });
    }

    const t = ticket.rows[0];

    // ALUNO só encerra o próprio
    if (req.user.perfil === "aluno" && t.usuario_id !== req.user.id) {
      return res.status(403).json({
        erro: "Sem permissão"
      });
    }

    // PROFESSOR pode encerrar chamados de aluno/professor
    if (req.user.perfil === "professor") {
      await pool.query(
        `
        UPDATE suporte
        SET status = 'encerrado'
        WHERE id = $1
        `,
        [req.params.id]
      );

      return res.json({ ok: true });
    }

    // ADMIN pode encerrar tudo
    if (req.user.perfil === "admin") {
      await pool.query(
        `
        UPDATE suporte
        SET status = 'encerrado'
        WHERE id = $1
        `,
        [req.params.id]
      );

      return res.json({ ok: true });
    }

    return res.status(403).json({
      erro: "Sem permissão"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message });
  }
});

// =====================
// ENCERRAR CHAMADO (DELETE)
// =====================
router.delete("/:id", auth, async (req, res) => {
  try {
    const ticketId = req.params.id;

    // =====================
    // ALUNO
    // =====================
    if (req.user.perfil === "aluno") {
      const result = await pool.query(
        `
        UPDATE suporte
        SET status = 'encerrado'
        WHERE id = $1
          AND usuario_id = $2
        RETURNING *
        `,
        [ticketId, req.user.id]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({
          erro: "Não autorizado ou ticket não encontrado"
        });
      }

      return res.json({ ok: true });
    }

    // =====================
    // PROFESSOR
    // =====================
    if (req.user.perfil === "professor") {
      const result = await pool.query(
        `
        UPDATE suporte
        SET status = 'encerrado'
        WHERE id = $1
          AND (
            destino = 'professor'
            OR destino = 'admin'
          )
        RETURNING *
        `,
        [ticketId]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({
          erro: "Não autorizado ou ticket não encontrado"
        });
      }

      return res.json({ ok: true });
    }

    // =====================
    // ADMIN
    // =====================
    if (req.user.perfil === "admin") {
      const result = await pool.query(
        `
        UPDATE suporte
        SET status = 'encerrado'
        WHERE id = $1
        RETURNING *
        `,
        [ticketId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          erro: "Ticket não encontrado"
        });
      }

      return res.json({ ok: true });
    }

    return res.status(403).json({
      erro: "Sem permissão"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;