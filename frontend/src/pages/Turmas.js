import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

function Turmas() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [lista, setLista] = useState([]);

  const [turmaAberta, setTurmaAberta] = useState(null);
  const [alunosTurma, setAlunosTurma] = useState([]);

  async function carregar() {
    try {
      const response = await api.get("/turmas");
      setLista(response.data);
    } catch (err) {
      console.log("Erro ao carregar turmas:", err);
    }
  }

  async function salvar() {
    try {
      await api.post("/turmas", {
        nome,
        ano: Number(ano),
      });

      setNome("");
      setAno("");

      carregar();

    } catch (err) {
      console.log("Erro ao salvar turma:", err);
    }
  }

  async function verAlunos(id) {
    try {
      if (turmaAberta === id) {
        setTurmaAberta(null);
        setAlunosTurma([]);
        return;
      }

      const response = await api.get(
        `/matriculas/turma/${id}`
      );

      setTurmaAberta(id);
      setAlunosTurma(response.data);

    } catch (err) {
      console.log("Erro ao carregar alunos da turma:", err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Cadastro de Turmas">
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1 style={styles.title}>
              Cadastro de Turmas
            </h1>

            <button
              onClick={() => navigate("/dashboard")}
              style={styles.backButton}
            >
              ← Voltar
            </button>
          </div>

          <div style={styles.form}>
            <input
              placeholder="Nome da turma"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Ano"
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={salvar}
              style={styles.saveButton}
            >
              Salvar turma
            </button>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h2>Turmas cadastradas</h2>

          <div style={styles.list}>
            {lista.map((t) => (
              <div key={t.id}>

                <div style={styles.item}>
                  <div>
                    <strong>{t.nome}</strong>
                    <br />
                    <span>{t.ano}</span>
                  </div>

                  <button
                    style={styles.viewButton}
                    onClick={() => verAlunos(t.id)}
                  >
                    {turmaAberta === t.id
                      ? "Ocultar alunos"
                      : "Ver alunos"}
                  </button>
                </div>

                {turmaAberta === t.id && (
                  <div style={styles.alunosBox}>

                    <strong>
                      Alunos matriculados:
                    </strong>

                    {alunosTurma.length === 0 ? (
                      <p>
                        Nenhum aluno matriculado.
                      </p>
                    ) : (
                      alunosTurma.map((a) => (
                        <div
                          key={a.id}
                          style={styles.aluno}
                        >
                          👨‍🎓 {a.nome}
                        </div>
                      ))
                    )}

                  </div>
                )}

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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    margin: 0,
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
    background: "#2563eb",
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
    alignItems: "center",
    padding: 12,
    background: "#f8fafc",
    borderRadius: 10,
  },

  viewButton: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },

  alunosBox: {
    background: "#eef2ff",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
  },

  aluno: {
    padding: 5,
  },
};

export default Turmas;