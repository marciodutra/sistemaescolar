import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Matriculas() {
  const navigate = useNavigate();

  const [matriculas, setMatriculas] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregarMatriculas() {
    try {
      setLoading(true);
      const res = await api.get("/matriculas");
      setMatriculas(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar matrículas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMatriculas();
  }, []);

  const filtradas = matriculas.filter((m) =>
    m.aluno?.toLowerCase().includes(busca.toLowerCase()) ||
    m.turma?.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirMatricula(id) {
    navigate(`/matriculas/${id}`);
  }

  function novaMatricula() {
    navigate("/matriculas/nova");
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
      justifyContent: "space-between",
      padding: 15,
      borderRadius: 12,
      background: "#fff",
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
    <Layout titulo="Matrículas">
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>🎓 Matrículas</div>

          <button style={styles.button} onClick={novaMatricula}>
            + Nova matrícula
          </button>
        </div>

        {/* BUSCA */}
        <input
          style={styles.search}
          placeholder="Pesquisar aluno ou turma..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {/* LISTA */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={styles.list}>
            {filtradas.map((m) => (
              <div
                key={m.id}
                style={styles.card}
                onClick={() => abrirMatricula(m.id)}
              >
                <div style={styles.left}>
                  <div style={styles.nome}>{m.aluno}</div>
                  <div style={styles.sub}>
                    {m.turma} • Ano {m.ano}
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