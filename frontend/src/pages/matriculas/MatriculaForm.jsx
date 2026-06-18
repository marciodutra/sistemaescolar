import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function MatriculaForm() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);

  const [alunoId, setAlunoId] = useState("");
  const [turmaId, setTurmaId] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const resAlunos = await api.get("/alunos");
        const resTurmas = await api.get("/turmas");

        setAlunos(resAlunos.data);
        setTurmas(resTurmas.data);
      } catch (err) {
        toast.error("Erro ao carregar dados");
      }
    }

    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();

    try {
      await api.post("/matriculas", {
        aluno_id: alunoId,
        turma_id: turmaId,
      });

      toast.success("Matrícula realizada!");
      navigate("/matriculas");
    } catch (err) {
      toast.error("Erro ao matricular");
    }
  }

  const styles = {
    container: { padding: 20, display: "flex", justifyContent: "center" },

    card: {
      width: "100%",
      maxWidth: 600,
      background: "#fff",
      padding: 20,
      borderRadius: 12,
    },

    input: {
      width: "100%",
      padding: 12,
      marginBottom: 10,
      borderRadius: 8,
      border: "1px solid #ddd",
    },

    button: {
      width: "100%",
      padding: 12,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
    },
  };

  return (
    <Layout titulo="Nova matrícula">
      <div style={styles.container}>

        <div style={styles.card}>
          <h2>Nova matrícula</h2>

          <form onSubmit={salvar}>

            <select
              style={styles.input}
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              required
            >
              <option value="">Selecione o aluno</option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>

            <select
              style={styles.input}
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              required
            >
              <option value="">Selecione a turma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome} - {t.ano}
                </option>
              ))}
            </select>

            <button style={styles.button} type="submit">
              Matricular
            </button>

          </form>
        </div>

      </div>
    </Layout>
  );
}