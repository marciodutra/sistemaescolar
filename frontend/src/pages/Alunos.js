import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

function Alunos() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [lista, setLista] = useState([]);

  async function carregar() {
    try {
      const response = await api.get("/alunos");
      setLista(response.data);
    } catch (err) {
      console.log("Erro ao carregar alunos:", err);
    }
  }

  async function salvar() {
    try {
      await api.post("/alunos", {
        nome,
        data_nascimento: dataNascimento,
      });

      setNome("");
      setDataNascimento("");
      carregar();
    } catch (err) {
      console.log("Erro ao salvar aluno:", err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Cadastro de Alunos">
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1 style={{ margin: 0 }}>Cadastro de Alunos</h1>

            <button
              style={styles.backButton}
              onClick={() => navigate("/dashboard")}
            >
              ← Voltar
            </button>
          </div>

          <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Nome do aluno"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              style={styles.input}
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />

            <button
              style={styles.saveButton}
              onClick={salvar}
            >
              Salvar aluno
            </button>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h2>Alunos cadastrados</h2>

          <div style={styles.list}>
            {lista.map((aluno) => (
              <div key={aluno.id} style={styles.item}>
                <strong>{aluno.nome}</strong>
                <span>{aluno.data_nascimento}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 700,
    background: "rgba(255,255,255,0.98)",
    borderRadius: 20,
    padding: 25,
    boxShadow: "0 20px 50px rgba(0,0,0,.25)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    background: "#e2e8f0",
    border: "none",
    padding: "10px 15px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 14,
  },

  saveButton: {
    padding: 12,
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
  },
};

export default Alunos;