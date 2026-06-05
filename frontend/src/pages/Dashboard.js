import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <Layout titulo={`Logado como ${email}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
          marginTop: 50,
        }}
      >
        <Card
          titulo="👨‍🎓 Alunos"
          cor="#16a34a"
          onClick={() => navigate("/alunos")}
        />

        <Card
          titulo="👨‍🏫 Professores"
          cor="#2563eb"
          onClick={() => navigate("/professores")}
        />

        <Card
          titulo="🏫 Turmas"
          cor="#f97316"
          onClick={() => navigate("/turmas")}
        />

        <Card
          titulo="📝 Matrículas"
          cor="#9333ea"
          onClick={() => navigate("/matriculas")}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </Layout>
  );
}

function Card({ titulo, cor, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 260,
        padding: 30,
        background: cor,
        borderRadius: 20,
        color: "#fff",
        cursor: "pointer",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        transition: ".2s",
      }}
    >
      <h3>{titulo}</h3>
    </div>
  );
}

export default Dashboard;