import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function TurmaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);

      const resTurmas = await api.get("/turmas");
      const encontrada = resTurmas.data.find(
        (t) => t.id === Number(id)
      );

      if (!encontrada) {
        toast.error("Turma não encontrada");
        navigate("/turmas");
        return;
      }

      setTurma(encontrada);

      const resAlunos = await api.get(
        `/matriculas/turma/${id}`
      );

      setAlunos(resAlunos.data);
    } catch (err) {
      toast.error("Erro ao carregar turma");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function editar() {
    navigate(`/turmas/${id}/editar`);
  }

  async function excluir() {
    if (!window.confirm("Excluir turma?")) return;

    try {
      await api.delete(`/turmas/${id}`);
      toast.success("Turma excluída");
      navigate("/turmas");
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  }

  if (loading) {
    return (
      <Layout titulo="Turma">
        <p>Carregando...</p>
      </Layout>
    );
  }

  return (
    <Layout titulo="Detalhes da Turma">
      <div style={styles.container}>
        <div style={styles.card}>

          <h2>{turma.nome}</h2>
          <p>Ano: {turma.ano}</p>

          <hr />

          <h3>Alunos</h3>

          {alunos.length === 0 ? (
            <p>Nenhum aluno matriculado</p>
          ) : (
            alunos.map((a) => (
              <div key={a.id}>👨‍🎓 {a.nome}</div>
            ))
          )}

          <div style={styles.actions}>
            <button style={styles.edit} onClick={editar}>
              Editar
            </button>

            <button style={styles.delete} onClick={excluir}>
              Excluir
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: 20, display: "flex", justifyContent: "center" },

  card: {
    width: "100%",
    maxWidth: 700,
    background: "#fff",
    padding: 20,
    borderRadius: 20,
  },

  actions: {
    marginTop: 20,
    display: "flex",
    gap: 10,
  },

  edit: {
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 8,
  },

  delete: {
    flex: 1,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 8,
  },
};