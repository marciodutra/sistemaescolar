import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Professores() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  const [foto, setFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(null);

  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    try {
      const res = await api.get("/professores");
      setLista(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparFormulario() {
    setNome("");
    setDisciplina("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setFoto(null);
    setFotoAtual(null);
    setEditando(null);
  }

  function editar(p) {
    setEditando(p);

    setNome(p.nome || "");
    setDisciplina(p.disciplina || "");
    setEmail(p.email || "");
    setTelefone(p.telefone || "");

    setFotoAtual(p.foto || null);
    setFoto(null);
  }

  async function excluir(id) {
    try {
      await api.delete(`/professores/${id}`);
      toast.success("Professor excluído!");
      carregar();
    } catch (err) {
      toast.error("Erro ao excluir professor");
    }
  }

  async function salvar() {
    try {
      if (!nome || !disciplina) {
        toast.warning("Preencha nome e disciplina!");
        return;
      }

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("disciplina", disciplina);
      formData.append("email", email);
      formData.append("telefone", telefone);

      if (foto) {
        formData.append("foto", foto);
      }

      if (editando) {
        await api.put(`/professores/${editando.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Professor atualizado!");
      } else {
        if (!email || !senha) {
          toast.warning("Email e senha são obrigatórios!");
          return;
        }

        formData.append("senha", senha);

        await api.post("/professores", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Professor cadastrado!");
      }

      limparFormulario();
      carregar();
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao salvar professor");
    }
  }

  const styles = {
    container: { display: "flex", justifyContent: "center", padding: 20 },

    card: {
      width: "100%",
      maxWidth: 700,
      background: "#fff",
      borderRadius: 20,
      padding: 25,
      boxShadow: "0 20px 50px rgba(0,0,0,.15)",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    },

    backButton: {
      background: "#e2e8f0",
      border: "none",
      padding: 10,
      borderRadius: 8,
      cursor: "pointer",
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },

    input: {
      padding: 12,
      border: "1px solid #ccc",
      borderRadius: 8,
    },

    buttonGroup: {
      display: "flex",
      gap: 10,
    },

    saveButton: {
      flex: 1,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: 12,
      borderRadius: 8,
    },

    cancelButton: {
      flex: 1,
      background: "#cbd5e1",
      border: "none",
      padding: 12,
      borderRadius: 8,
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
      background: "#f8fafc",
      borderRadius: 10,
      alignItems: "center",
    },

    editButton: {
      background: "green",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6,
      marginRight: 5,
    },

    deleteButton: {
      background: "red",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 10,
      objectFit: "cover",
      marginRight: 10,
    },
  };

  return (
    <Layout titulo="Cadastro de Professores">
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1>
              {editando ? "Editar Professor" : "Cadastro de Professores"}
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
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Disciplina"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <input
              style={styles.input}
              type="file"
              onChange={(e) => setFoto(e.target.files[0])}
            />

            {fotoAtual && (
              <img src={fotoAtual} alt="foto" style={{ width: 80, borderRadius: 10 }} />
            )}

            {!editando && (
              <input
                style={styles.input}
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            )}

            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={salvar}>
                {editando ? "Atualizar" : "Salvar"}
              </button>

              {editando && (
                <button
                  style={styles.cancelButton}
                  onClick={limparFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <hr />

          <h2>Professores cadastrados</h2>

          <div style={styles.list}>
            {lista.map((p) => (
              <div key={p.id} style={styles.item}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {p.foto && (
                    <img
                      src={p.foto}
                      alt={p.nome}
                      style={styles.avatar}
                    />
                  )}

                  <div>
                    <strong>{p.nome}</strong>
                    <br />
                    <span>{p.disciplina}</span>
                  </div>
                </div>

                <div>
                  <button
                    style={styles.editButton}
                    onClick={() => editar(p)}
                  >
                    Editar
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => excluir(p.id)}
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