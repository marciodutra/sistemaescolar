import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

function Turmas() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [lista, setLista] = useState([]);

  const [turmaAberta, setTurmaAberta] = useState(null);
  const [alunosTurma, setAlunosTurma] = useState([]);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);

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
      if (!nome || !ano) {
        toast.warning("Preencha todos os campos!");
        return;
      }

      if (turmaEmEdicao) {
        await api.put(`/turmas/${turmaEmEdicao.id}`, {
          nome,
          ano: Number(ano),
        });
        toast.success("✅ Turma atualizada com sucesso!");
      } else {
        await api.post("/turmas", {
          nome,
          ano: Number(ano),
        });
        toast.success("✅ Turma adicionada com sucesso!");
      }

      setNome("");
      setAno("");
      setTurmaEmEdicao(null);
      carregar();

    } catch (err) {
      toast.error("❌ Erro ao salvar turma: " + err.message);
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

  async function editar(turma) {
    setTurmaEmEdicao(turma);
    setNome(turma.nome);
    setAno(turma.ano.toString());
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta turma?")) {
      return;
    }

    try {
      await api.delete(`/turmas/${id}`);
      toast.success("✅ Turma excluída com sucesso!");
      carregar();
    } catch (err) {
      toast.error("❌ Erro ao excluir turma: " + err.message);
      console.log("Erro ao excluir turma:", err);
    }
  }

  function cancelarEdicao() {
    setTurmaEmEdicao(null);
    setNome("");
    setAno("");
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
              {turmaEmEdicao ? "Editar Turma" : "Cadastro de Turmas"}
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

            <div style={styles.buttonGroup}>
              <button
                onClick={salvar}
                style={styles.saveButton}
              >
                {turmaEmEdicao ? "Atualizar" : "Salvar turma"}
              </button>
              {turmaEmEdicao && (
                <button
                  style={styles.cancelButton}
                  onClick={cancelarEdicao}
                >
                  Cancelar
                </button>
              )}
            </div>
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

                  <div style={styles.itemActions}>
                    <button
                      style={styles.editButton}
                      onClick={() => editar(t)}
                    >
                      Editar
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => excluir(t.id)}
                    >
                      Excluir
                    </button>
                    <button
                      style={styles.viewButton}
                      onClick={() => verAlunos(t.id)}
                    >
                      {turmaAberta === t.id
                        ? "Ocultar alunos"
                        : "Ver alunos"}
                    </button>
                  </div>
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

  buttonGroup: {
    display: "flex",
    gap: 10,
  },

  saveButton: {
    flex: 1,
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#cbd5e1",
    color: "#000",
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

  itemActions: {
    display: "flex",
    gap: 8,
  },

  editButton: {
    padding: "6px 12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: "bold",
  },

  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: "bold",
  },

  viewButton: {
    background: "#06b6d4",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: "bold",
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