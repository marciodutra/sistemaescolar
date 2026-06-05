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