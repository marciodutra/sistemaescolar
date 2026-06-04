const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const alunosRoutes = require("./routes/alunos");
const professoresRoutes = require("./routes/professores");
const turmasRoutes = require("./routes/turmas"); // 👈 NOVO

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG
app.use((req, res, next) => {
  console.log("🔥 REQ:", req.method, req.url);
  next();
});

// 🔥 ROTAS
app.use("/login", authRoutes);
app.use("/alunos", alunosRoutes);
app.use("/professores", professoresRoutes);
app.use("/turmas", turmasRoutes); // 👈 NOVO

// 🔥 ROOT
app.get("/", (req, res) => {
  res.send("API Sistema Escolar funcionando");
});

// 🔥 404
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    url: req.url,
    metodo: req.method
  });
});

app.listen(3001, () => {
  console.log("🚀 Servidor rodando na porta 3001");
});