import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function ProfessorForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  const [foto, setFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(null);

  const editando = Boolean(id);

  // =========================
  // CARREGAR PROFESSOR (EDIT)
  // =========================
  const carregarProfessor = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await api.get("/professores");

      const lista = Array.isArray(res.data) ? res.data : [];

      const professor = lista.find((p) => p.id === Number(id));

      if (!professor) {
        toast.error("Professor não encontrado");
        navigate("/professores");
        return;
      }

      setNome(professor.nome || "");
      setDisciplina(professor.disciplina || "");
      setEmail(professor.email || "");
      setTelefone(professor.telefone || "");
      setFotoAtual(professor.foto || null);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar professor");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarProfessor();
  }, [carregarProfessor]);

  function getFoto(foto) {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    return `${import.meta.env.VITE_API_URL}/${foto}`;
  }

  // =========================
  // SALVAR
  // =========================
  async function salvar() {
    try {
      if (!nome || !disciplina) {
        toast.warning("Preencha nome e disciplina");
        return;
      }

      if (!editando && !senha) {
        toast.warning("Senha obrigatória");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("disciplina", disciplina);
      formData.append("email", email);
      formData.append("telefone", telefone);

      if (senha) {
        formData.append("senha", senha);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      if (editando) {
        await api.put(`/professores/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Professor atualizado com sucesso!");
      } else {
        await api.post("/professores", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Professor cadastrado com sucesso!");
      }

      navigate("/professores");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.erro || "Erro ao salvar professor");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    container: { display: "flex", justifyContent: "center", padding: 20 },
    card: {
      width: "100%",
      maxWidth: 800,
      background: "#fff",
      borderRadius: 20,
      padding: 25,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    },

    input: {
      padding: 12,
      borderRadius: 8,
      border: "1px solid #ddd",
    },

    fotoBox: {
      display: "flex",
      alignItems: "center",
      gap: 15,
      marginBottom: 15,
    },

    foto: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      objectFit: "cover",
    },

    button: {
      marginTop: 20,
      width: "100%",
      padding: 12,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
    },
  };

  return (
    <Layout titulo={editando ? "Editar Professor" : "Novo Professor"}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>
            {editando ? "Editar Professor" : "Cadastro de Professor"}
          </div>

          {/* FOTO */}
          <div style={styles.fotoBox}>
            <img
              src={foto ? URL.createObjectURL(foto) : getFoto(fotoAtual)}
              style={styles.foto}
              alt="foto"
            />

            <input
              type="file"
              onChange={(e) => setFoto(e.target.files[0])}
            />
          </div>

          {/* FORM */}
          <div style={styles.grid}>
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

            {!editando && (
              <input
                style={styles.input}
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            )}
          </div>

          <button
            style={styles.button}
            onClick={salvar}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar professor"}
          </button>
        </div>
      </div>
    </Layout>
  );
}