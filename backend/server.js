const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const alunosRoutes = require("./routes/alunos");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG: mostra todas requisições
app.use((req, res, next) => {
  console.log("🔥 REQ:", req.method, req.url);
  next();
});

// 🔥 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("API Sistema Escolar");
});

// 🔥 ROTAS (CORRIGIDO)
app.use("/alunos", alunosRoutes);
app.use("/", authRoutes); // 👈 login fica /login

// 🔥 TRATAMENTO DE ERROS
process.on("uncaughtException", (err) => {
  console.log("🔥 ERRO NÃO TRATADO:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("🔥 PROMISE REJEITADA:", err);
});

// 🔥 START SERVER
app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});