import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Alunos() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Carregar alunos
  async function carregarAlunos() {
    try {
      setLoading(true);
      const res = await api.get("/alunos");
      setAlunos(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  // 🔎 filtro de busca
  const alunosFiltrados = alunos.filter((a) =>
    a.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirAluno(id) {
    navigate(`/alunos/${id}`);
  }

  function novoAluno() {
    navigate("/alunos/novo");
  }

  function getFoto(foto) {
    if (!foto) return "https://cdn-icons-png.flaticon.com/512/1946/1946429.png";

    if (foto.startsWith("http")) return foto;

    // ⚠️ ajuste aqui depois com sua URL do Render
    return `${import.meta.env.VITE_API_URL}/${foto}`;
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
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      cursor: "pointer",
    },

    left: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },

    foto: {
      width: 45,
      height: 45,
      borderRadius: "50%",
      objectFit: "cover",
      background: "#eee",
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
    <Layout titulo="Alunos">
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>👨‍🎓 Alunos</div>

          <button style={styles.button} onClick={novoAluno}>
            + Novo aluno
          </button>
        </div>

        {/* BUSCA */}
        <input
          style={styles.search}
          placeholder="Pesquisar aluno..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {/* LISTA */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={styles.list}>
            {alunosFiltrados.map((aluno) => (
              <div
                key={aluno.id}
                style={styles.card}
                onClick={() => abrirAluno(aluno.id)}
              >
                <div style={styles.left}>
                  <img
                    src={getFoto(aluno.foto)}
                    style={styles.foto}
                    alt="foto"
                  />

                  <div>
                    <div style={styles.nome}>{aluno.nome}</div>
                    <div style={styles.sub}>
                      {aluno.responsavel || "Sem responsável"}
                    </div>
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