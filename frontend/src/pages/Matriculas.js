import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Matriculas() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [matriculas, setMatriculas] = useState([]);

  const [alunoId, setAlunoId] = useState("");
  const [turmaId, setTurmaId] = useState("");

  async function carregarDados() {
    try {
      const alunosRes = await api.get("/alunos");
      const turmasRes = await api.get("/turmas");
      const matriculasRes = await api.get("/matriculas");

      setAlunos(alunosRes.data);
      setTurmas(turmasRes.data);
      setMatriculas(matriculasRes.data);
    } catch (err) {
      console.log("Erro ao carregar dados:", err);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function salvar(e) {
    e.preventDefault();

    try {
      await api.post("/matriculas", {
        aluno_id: alunoId,
        turma_id: turmaId,
      });

      setAlunoId("");
      setTurmaId("");

      carregarDados();
    } catch (err) {
      console.log("Erro ao matricular:", err);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir matrícula?")) {
      return;
    }

    try {
      await api.delete(`/matriculas/${id}`);
      carregarDados();
    } catch (err) {
      console.log("Erro ao excluir matrícula:", err);
    }
  }

  return (
    <Layout titulo="Matrículas">
      <div style={styles.container}>
        <div style={styles.card}>
          
          <div style={styles.header}>
            <h1 style={{ margin: 0 }}>Matrículas</h1>

            <button
              style={styles.backButton}
              onClick={() => navigate("/dashboard")}
            >
              ← Voltar
            </button>
          </div>

          <form onSubmit={salvar}>
            <select
              className="form-control mb-3"
              value={alunoId}
              onChange={(e) => setAlunoId(e.target.value)}
              required
            >
              <option value="">
                Selecione o aluno
              </option>

              {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>

            <select
              className="form-control mb-3"
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              required
            >
              <option value="">
                Selecione a turma
              </option>

              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome} - {t.ano}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              type="submit"
            >
              Matricular
            </button>
          </form>

          <hr style={{ margin: "20px 0" }} />

          <h2>Matrículas realizadas</h2>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Turma</th>
                <th>Ano</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {matriculas.map((m) => (
                <tr key={m.id}>
                  <td>{m.aluno}</td>
                  <td>{m.turma}</td>
                  <td>{m.ano}</td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => excluir(m.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
    maxWidth: 900,
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
};