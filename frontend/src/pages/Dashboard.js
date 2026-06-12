import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Dashboard() {
  const nome = localStorage.getItem("nome") || "Usuário";

  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalProfessores: 0,
    totalTurmas: 0,
    totalMatriculas: 0,
    ultimasMatriculas: [],
  });

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {
      const response = await api.get("/dashboard");

      console.log(
        "DASHBOARD:",
        JSON.stringify(response.data, null, 2)
      );

      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Layout titulo={`Bem-vindo, ${nome}`}>

      {/* Indicadores */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <Indicador
          titulo="Alunos"
          valor={stats.totalAlunos}
          cor="#16a34a"
        />

        <Indicador
          titulo="Professores"
          valor={stats.totalProfessores}
          cor="#2563eb"
        />

        <Indicador
          titulo="Turmas"
          valor={stats.totalTurmas}
          cor="#f97316"
        />

        <Indicador
          titulo="Matrículas"
          valor={stats.totalMatriculas}
          cor="#9333ea"
        />
      </div>

      {/* Últimas Matrículas */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 20,
          marginBottom: 40,
          boxShadow: "0 10px 25px rgba(0,0,0,.1)",
        }}
      >
        <h4 style={{ marginBottom: 20 }}>
          📋 Últimas Matrículas
        </h4>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            {stats.ultimasMatriculas?.length > 0 ? (
              stats.ultimasMatriculas.map((m) => (
                <tr key={m.id}>
                  <td>{m.aluno}</td>
                  <td>{m.turma}</td>
                  <td>
                    {new Date(
                      m.data_matricula
                    ).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center" }}
                >
                  Nenhuma matrícula encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}

function Indicador({ titulo, valor, cor }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 25,
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,.1)",
      }}
    >
      <h5 style={{ color: "#666" }}>{titulo}</h5>

      <h1
        style={{
          margin: 0,
          color: cor,
          fontWeight: "bold",
        }}
      >
        {valor}
      </h1>
    </div>
  );
}

export default Dashboard;