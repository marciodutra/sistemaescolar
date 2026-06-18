import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Professores() {
  const navigate = useNavigate();

  const [professores, setProfessores] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregarProfessores() {
    try {
      setLoading(true);
      const res = await api.get("/professores");
      setProfessores(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar professores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProfessores();
  }, []);

  const professoresFiltrados = professores.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirProfessor(id) {
    navigate(`/professores/${id}`);
  }

  function novoProfessor() {
    navigate("/professores/novo");
  }

  function getFoto(foto) {
    if (!foto)
      return "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";

    if (foto.startsWith("http")) return foto;

    return `${import.meta.env.VITE_API_URL}/${foto}`;
  }

  const styles = {
    container: { padding: 20 },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
    },

    button: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 15px",
      borderRadius: 8,
      cursor: "pointer",
    },

    search: {
      width: "100%",
      padding: 12,
      borderRadius: 10,
      border: "1px solid #ddd",
      marginBottom: 20,
    },

    list: {
      display: "grid",
      gap: 10,
    },

    card: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      cursor: "pointer",
    },

    left: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },

    foto: {
      width: 45,
      height: 45,
      borderRadius: "50%",
      objectFit: "cover",
      background: "#eee",
    },

    nome: {
      fontWeight: "bold",
    },

    sub: {
      fontSize: 12,
      color: "#666",
    },

    arrow: {
      fontSize: 18,
      color: "#999",
    },
  };

  return (
    <Layout titulo="Professores">
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>👨‍🏫 Professores</div>

          <button style={styles.button} onClick={novoProfessor}>
            + Novo professor
          </button>
        </div>

        {/* BUSCA */}
        <input
          style={styles.search}
          placeholder="Pesquisar professor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {/* LISTA */}
        {loading ? (
          <p style={{ color: "#fff" }}>Carregando...</p>
        ) : (
          <div style={styles.list}>
            {professoresFiltrados.map((prof) => (
              <div
                key={prof.id}
                style={styles.card}
                onClick={() => abrirProfessor(prof.id)}
              >
                <div style={styles.left}>
                  <img
                    src={getFoto(prof.foto)}
                    style={styles.foto}
                    alt="foto"
                  />

                  <div>
                    <div style={styles.nome}>{prof.nome}</div>
                    <div style={styles.sub}>{prof.disciplina}</div>
                  </div>
                </div>

                <div style={styles.arrow}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}