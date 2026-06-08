require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const alunosRoutes = require("./routes/alunos");
const professoresRoutes = require("./routes/professores");
const turmasRoutes = require("./routes/turmas");
const matriculasRoutes = require("./routes/matriculas");

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

// ROTAS
app.use("/auth", authRoutes);
app.use("/alunos", alunosRoutes);
app.use("/professores", professoresRoutes);
app.use("/turmas", turmasRoutes);
app.use("/matriculas", matriculasRoutes);

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
