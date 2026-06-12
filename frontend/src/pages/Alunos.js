import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Alunos() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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

        toast.success("Aluno atualizado com sucesso!");
      } else {
        if (!email || !senha) {
          toast.warning("Email e senha são obrigatórios!");
          return;
        }

        await api.post("/alunos", {
          nome,
          data_nascimento: dataNascimento,
          email,
          senha,
        });

        toast.success("Aluno criado com login!");
      }

      setNome("");
      setDataNascimento("");
      setEmail("");
      setSenha("");
      setAlunoEmEdicao(null);

      carregar();
    } catch (err) {
      toast.error("Erro ao salvar aluno");
      console.log(err);
    }
  }

  async function editar(aluno) {
    setAlunoEmEdicao(aluno);
    setNome(aluno.nome);
    setDataNascimento(aluno.data_nascimento.split("T")[0]);
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`/alunos/${id}`);
      toast.success("Aluno excluído!");
      carregar();
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  }

  function cancelarEdicao() {
    setAlunoEmEdicao(null);
    setNome("");
    setDataNascimento("");
    setEmail("");
    setSenha("");
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Cadastro de Alunos">
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1>
              {alunoEmEdicao ? "Editar Aluno" : "Cadastro de Alunos"}
            </h1>

            <button style={styles.backButton} onClick={() => navigate("/dashboard")}>
              ← Voltar
            </button>
          </div>

          <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              style={styles.input}
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />

            {!alunoEmEdicao && (
              <>
                <input
                  style={styles.input}
                  placeholder="Email (login)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  style={styles.input}
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </>
            )}

            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={salvar}>
                {alunoEmEdicao ? "Atualizar" : "Salvar aluno"}
              </button>

              {alunoEmEdicao && (
                <button style={styles.cancelButton} onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <hr />

          <h2>Alunos cadastrados</h2>

          <div style={styles.list}>
            {lista.map((aluno) => (
              <div key={aluno.id} style={styles.item}>
                <div>
                  <strong>{aluno.nome}</strong>
                  <span> • {formatarData(aluno.data_nascimento)}</span>
                </div>

                <div>
                  <button style={styles.editButton} onClick={() => editar(aluno)}>
                    Editar
                  </button>

                  <button style={styles.deleteButton} onClick={() => excluir(aluno.id)}>
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
  container: { display: "flex", justifyContent: "center", padding: 20 },

  card: {
    width: "100%",
    maxWidth: 700,
    background: "#fff",
    borderRadius: 20,
    padding: 25,
    boxShadow: "0 20px 50px rgba(0,0,0,.15)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
  },

  backButton: {
    background: "#e2e8f0",
    border: "none",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  input: {
    padding: 12,
    border: "1px solid #ccc",
    borderRadius: 8
  },

  buttonGroup: {
    display: "flex",
    gap: 10
  },

  saveButton: {
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 8
  },

  cancelButton: {
    flex: 1,
    background: "#cbd5e1",
    border: "none",
    padding: 12,
    borderRadius: 8
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    background: "#f8fafc",
    borderRadius: 10
  },

  editButton: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    marginRight: 5
  },

  deleteButton: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6
  }
};