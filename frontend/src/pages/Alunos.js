import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

function Alunos() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [lista, setLista] = useState([]);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);

  function formatarData(dataISO) {
    if (!dataISO) return "";

    return new Date(dataISO).toLocaleDateString("pt-BR");
  }

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
      if (!nome || !dataNascimento) {
        toast.warning("Preencha todos os campos!");
        return;
      }

      if (alunoEmEdicao) {
        await api.put(`/alunos/${alunoEmEdicao.id}`, {
          nome,
          data_nascimento: dataNascimento,
        });
        toast.success("✅ Aluno atualizado com sucesso!");
      } else {
        await api.post("/alunos", {
          nome,
          data_nascimento: dataNascimento,
        });
        toast.success("✅ Aluno adicionado com sucesso!");
      }

      setNome("");
      setDataNascimento("");
      setAlunoEmEdicao(null);
      carregar();
    } catch (err) {
      toast.error("❌ Erro ao salvar aluno: " + err.message);
      console.log("Erro ao salvar aluno:", err);
    }
  }

  async function editar(aluno) {
    setAlunoEmEdicao(aluno);
    setNome(aluno.nome);
    setDataNascimento(aluno.data_nascimento.split('T')[0]);
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) {
      return;
    }

    try {
      await api.delete(`/alunos/${id}`);
      toast.success("✅ Aluno excluído com sucesso!");
      carregar();
    } catch (err) {
      toast.error("❌ Erro ao excluir aluno: " + err.message);
      console.log("Erro ao excluir aluno:", err);
    }
  }

  function cancelarEdicao() {
    setAlunoEmEdicao(null);
    setNome("");
    setDataNascimento("");
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Cadastro de Alunos">
      <div style={styles.container}>
        <div style={styles.card}>
          
          <div style={styles.header}>
            <h1 style={{ margin: 0 }}>
              {alunoEmEdicao ? "Editar Aluno" : "Cadastro de Alunos"}
            </h1>

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

            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={salvar}>
                {alunoEmEdicao ? "Atualizar" : "Salvar aluno"}
              </button>
              {alunoEmEdicao && (
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

          <h2>Alunos cadastrados</h2>

          <div style={styles.list}>
            {lista.map((aluno) => (
              <div key={aluno.id} style={styles.item}>
                <div>
                  <strong>{aluno.nome}</strong>
                  <span> • {formatarData(aluno.data_nascimento)}</span>
                </div>
                <div style={styles.itemActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => editar(aluno)}
                  >
                    Editar
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => excluir(aluno.id)}
                  >
                    Excluir
                  </button>
                </div>
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

  buttonGroup: {
    display: "flex",
    gap: 10,
  },

  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#2563eb",
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
    backgroundColor: "#f8fafc",
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
};

export default Alunos;
