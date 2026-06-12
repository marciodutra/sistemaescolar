import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

function Professores() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [lista, setLista] = useState([]);
  const [professoresEmEdicao, setProfessoresEmEdicao] = useState(null);

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
      if (!nome || !disciplina) {
        toast.warning("Preencha todos os campos!");
        return;
      }

      if (!professoresEmEdicao && (!email || !senha)) {
        toast.warning("Informe e-mail e senha!");
        return;
      }

      if (professoresEmEdicao) {
        await api.put(`/professores/${professoresEmEdicao.id}`, {
          nome,
          disciplina,
        });

        toast.success("✅ Professor atualizado com sucesso!");
      } else {
        await api.post("/professores", {
          nome,
          disciplina,
          email,
          senha,
        });

        toast.success("✅ Professor cadastrado com login criado!");
      }

      setNome("");
      setDisciplina("");
      setEmail("");
      setSenha("");
      setProfessoresEmEdicao(null);

      carregar();
    } catch (err) {
      toast.error(
        err?.response?.data?.erro ||
        "Erro ao salvar professor"
      );

      console.log(err);
    }
  }

  async function editar(prof) {
    setProfessoresEmEdicao(prof);
    setNome(prof.nome);
    setDisciplina(prof.disciplina);
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza que deseja excluir este professor?")) {
      return;
    }

    try {
      await api.delete(`/professores/${id}`);

      toast.success("✅ Professor excluído com sucesso!");

      carregar();
    } catch (err) {
      toast.error("❌ Erro ao excluir professor");

      console.log(err);
    }
  }

  function cancelarEdicao() {
    setProfessoresEmEdicao(null);

    setNome("");
    setDisciplina("");
    setEmail("");
    setSenha("");
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Cadastro de Professores">
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1 style={{ margin: 0 }}>
              {professoresEmEdicao
                ? "Editar Professor"
                : "Cadastro de Professores"}
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

            {!professoresEmEdicao && (
              <>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="E-mail para login"
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
              <button
                style={styles.saveButton}
                onClick={salvar}
              >
                {professoresEmEdicao
                  ? "Atualizar"
                  : "Salvar professor"}
              </button>

              {professoresEmEdicao && (
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

          <h2>Professores cadastrados</h2>

          <div style={styles.list}>
            {lista.map((prof) => (
              <div key={prof.id} style={styles.item}>
                <div>
                  <strong>{prof.nome}</strong>
                  <span> • {prof.disciplina}</span>
                </div>

                <div style={styles.itemActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => editar(prof)}
                  >
                    Editar
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => excluir(prof.id)}
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
    fontWeight: "bold",
    cursor: "pointer",
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

export default Professores;