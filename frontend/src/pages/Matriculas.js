import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <div className="container mt-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Matrículas</h2>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Voltar
        </button>
      </div>

      <form onSubmit={salvar}>
        <select
          className="form-control mb-2"
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
          className="form-control mb-2"
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

        <button
          className="btn btn-primary"
          type="submit"
        >
          Matricular
        </button>
      </form>

      <hr />

      <table className="table">
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
  );
}