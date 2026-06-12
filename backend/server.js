require("dotenv").config();

const express = require("express");
const cors = require("cors");

const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const alunosRoutes = require("./routes/alunos");
const professoresRoutes = require("./routes/professores");
const turmasRoutes = require("./routes/turmas");
const matriculasRoutes = require("./routes/matriculas");
const usuariosRoutes = require("./routes/usuarios");
const dashboardRoutes = require("./routes/dashboard");
const notasRoutes = require("./routes/notas");
const boletimRoutes = require("./routes/boletim");
const rankingRoutes = require("./routes/ranking");
const suporteRoutes = require("./routes/suporte");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// DEBUG
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

/*
  🔐 ROTAS PROTEGIDAS
  (IMPORTANTE: NÃO DUPLICAR auth AQUI)
*/
app.use("/alunos", auth, alunosRoutes);
app.use("/professores", auth, professoresRoutes);
app.use("/turmas", auth, turmasRoutes);
app.use("/matriculas", auth, matriculasRoutes);
app.use("/usuarios", auth, usuariosRoutes);
app.use("/dashboard", auth, dashboardRoutes);
app.use("/notas", auth, notasRoutes);
app.use("/boletim", auth, boletimRoutes);
app.use("/ranking", auth, rankingRoutes);
app.use("/suporte", auth, suporteRoutes);

/*
  🌐 ROTAS PÚBLICAS
*/
app.use("/auth", authRoutes);

// TESTE
app.get("/", (req, res) => {
  res.send("API Sistema Escolar funcionando");
});

// 404
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    url: req.url,
    metodo: req.method
  });
});

// ❌ ERROR HANDLER GLOBAL
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});