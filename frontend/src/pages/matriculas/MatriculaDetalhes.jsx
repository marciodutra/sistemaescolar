import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function MatriculaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/matriculas/${id}`);
        setMatricula(res.data);
      } catch {
        toast.error("Erro ao carregar matrícula");
      }
    }

    carregar();
  }, [id]);

  async function excluir() {
    if (!window.confirm("Deseja excluir esta matrícula?")) return;

    try {
      await api.delete(`/matriculas/${id}`);
      toast.success("Matrícula excluída");
      navigate("/matriculas");
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  if (!matricula) return <p>Carregando...</p>;

  const styles = {
    container: { padding: 20, display: "flex", justifyContent: "center" },

    card: {
      width: "100%",
      maxWidth: 600,
      background: "#fff",
      padding: 20,
      borderRadius: 12,
    },

    button: {
      background: "#ef4444",
      color: "#fff",
      border: "none",
      padding: 10,
      borderRadius: 8,
      cursor: "pointer",
      marginRight: 10,
    },

    back: {
      background: "#e5e7eb",
      border: "none",
      padding: 10,
      borderRadius: 8,
      cursor: "pointer",
    },
  };

  return (
    <Layout titulo="Detalhes da matrícula">
      <div style={styles.container}>

        <div style={styles.card}>
          <h2>Detalhes</h2>

          <p><strong>Aluno:</strong> {matricula.aluno}</p>
          <p><strong>Turma:</strong> {matricula.turma}</p>
          <p><strong>Ano:</strong> {matricula.ano}</p>

          <div style={{ marginTop: 20 }}>
            <button style={styles.button} onClick={excluir}>
              Excluir
            </button>

            <button
              style={styles.back}
              onClick={() => navigate("/matriculas")}
            >
              Voltar
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}