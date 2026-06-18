import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Turmas() {
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      setLoading(true);
      const res = await api.get("/turmas");
      setTurmas(res.data);
    } catch (err) {
      toast.error("Erro ao carregar turmas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirTurma = (id) => {
    navigate(`/turmas/${id}`);
  };

  const novaTurma = () => {
    navigate("/turmas/novo");
  };

  return (
    <Layout titulo="Turmas">
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>🏫 Turmas</h2>

          <button style={styles.button} onClick={novaTurma}>
            + Nova turma
          </button>
        </div>

        {/* LISTA */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={styles.list}>
            {turmas.map((t) => (
              <div
                key={t.id}
                style={styles.card}
                onClick={() => abrirTurma(t.id)}
              >
                <div>
                  <strong>{t.nome}</strong>
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

const styles = {
  container: { padding: 20 },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    margin: 0,
  },

  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 8,
    cursor: "pointer",
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
    cursor: "pointer",
  },

  sub: {
    fontSize: 12,
    color: "#666",
  },

  arrow: {
    color: "#999",
    fontSize: 18,
  },
};