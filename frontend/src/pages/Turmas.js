import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Turmas() {
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Carregar turmas
  async function carregarTurmas() {
    try {
      setLoading(true);
      const res = await api.get("/turmas");
      setTurmas(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar turmas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTurmas();
  }, []);

  // 🔎 filtro de busca
  const turmasFiltradas = turmas.filter((t) =>
    t.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirTurma(id) {
    navigate(`/turmas/${id}`);
  }

  function novaTurma() {
    navigate("/turmas/novo");
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
      background: "#fff",
      padding: 15,
      borderRadius: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      cursor: "pointer",
    },

    left: {
      display: "flex",
      flexDirection: "column",
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
    <Layout titulo="Turmas">
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>🏫 Turmas</div>

          <button style={styles.button} onClick={novaTurma}>
            + Nova turma
          </button>
        </div>

        {/* BUSCA */}
        <input
          style={styles.search}
          placeholder="Pesquisar turma..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {/* LISTA */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={styles.list}>
            {turmasFiltradas.map((t) => (
              <div
                key={t.id}
                style={styles.card}
                onClick={() => abrirTurma(t.id)}
              >
                <div style={styles.left}>
                  <div style={styles.nome}>{t.nome}</div>
                  <div style={styles.sub}>Ano: {t.ano}</div>
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