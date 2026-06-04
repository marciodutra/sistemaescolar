import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

function Professores() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [lista, setLista] = useState([]);

  async function carregar() {
    try {
      const response = await api.get("/professores");
      setLista(response.data);
    } catch (err) {
      console.log("Erro ao carregar professores:", err);
    }
  }

  async function salvar() {
    try {
      await api.post("/professores", {
        nome,
        disciplina,
      });

      setNome("");
      setDisciplina("");
      carregar();
    } catch (err) {
      console.log("Erro ao salvar professor:", err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Cadastro de Professores">
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1 style={{ margin: 0 }}>Cadastro de Professores</h1>

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
              placeholder="Nome do professor"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Disciplina"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
            />

            <button
              style={styles.saveButton}
              onClick={salvar}
            >
              Salvar professor
            </button>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h2>Professores cadastrados</h2>

          <div style={styles.list}>
            {lista.map((prof) => (
              <div key={prof.id} style={styles.item}>
                <strong>{prof.nome}</strong>
                <span>{prof.disciplina}</span>
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
    fontWeight: "bold",
    cursor: "pointer",
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

export default Professores;