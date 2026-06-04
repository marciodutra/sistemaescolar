const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const alunosRoutes = require("./routes/alunos");
const professoresRoutes = require("./routes/professores");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG GLOBAL
app.use((req, res, next) => {
  console.log("🔥 REQ:", req.method, req.url);
  next();
});

// 🔥 ROTA TESTE
app.get("/", (req, res) => {
  res.send("API Sistema Escolar funcionando");
});

// 🔥 ROTAS (ORDEM IMPORTA!)
app.use("/alunos", alunosRoutes);
app.use("/professores", professoresRoutes);
app.use("/login", authRoutes); // 👈 MELHOR DO QUE app.use("/", authRoutes)

// 🔥 404 EXPLÍCITO (AJUDA MUITO A DEBUGAR)
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    url: req.url,
    metodo: req.method
  });
});

// 🔥 ERROS GLOBAIS
process.on("uncaughtException", (err) => {
  console.log("🔥 ERRO NÃO TRATADO:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("🔥 PROMISE REJEITADA:", err);
});

// 🔥 START SERVER
app.listen(3001, () => {
  console.log("🚀 Servidor rodando na porta 3001");
});