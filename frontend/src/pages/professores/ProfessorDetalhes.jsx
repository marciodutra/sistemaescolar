import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function ProfessorDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // CARREGAR PROFESSOR
  // =========================
  const carregarProfessor = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/professores");

      const lista = Array.isArray(res.data) ? res.data : [];

      const encontrado = lista.find(
        (p) => p.id === Number(id)
      );

      if (!encontrado) {
        toast.error("Professor não encontrado");
        navigate("/professores");
        return;
      }

      setProfessor(encontrado);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar professor");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarProfessor();
  }, [carregarProfessor]);

  // =========================
  // EXCLUIR
  // =========================
  async function excluirProfessor() {
    if (!window.confirm("Tem certeza que deseja excluir este professor?"))
      return;

    try {
      await api.delete(`/professores/${id}`);
      toast.success("Professor excluído com sucesso!");
      navigate("/professores");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao excluir professor");
    }
  }

  // =========================
  // EDITAR
  // =========================
  function editarProfessor() {
    navigate(`/professores/${id}/editar`);
  }

  // =========================
  // FOTO
  // =========================
  function getFoto(foto) {
    if (!foto)
      return "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";

    if (foto.startsWith("http")) return foto;

    return `${import.meta.env.VITE_API_URL}/${foto}`;
  }

  const styles = {
    container: {
      padding: 20,
      display: "flex",
      justifyContent: "center",
    },

    card: {
      width: "100%",
      maxWidth: 700,
      background: "#fff",
      borderRadius: 20,
      padding: 25,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    },

    backBtn: {
      border: "none",
      background: "#eee",
      padding: "8px 12px",
      borderRadius: 8,
      cursor: "pointer",
    },

    foto: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: 15,
    },

    center: {
      textAlign: "center",
    },

    nome: {
      fontSize: 22,
      fontWeight: "bold",
    },

    infoBox: {
      marginTop: 20,
      display: "grid",
      gap: 10,
    },

    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },

    label: { color: "#666" },
    value: { fontWeight: "bold" },

    actions: {
      marginTop: 25,
      display: "flex",
      gap: 10,
    },

    editBtn: {
      flex: 1,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: 12,
      borderRadius: 10,
      cursor: "pointer",
    },

    deleteBtn: {
      flex: 1,
      background: "#ef4444",
      color: "#fff",
      border: "none",
      padding: 12,
      borderRadius: 10,
      cursor: "pointer",
    },
  };

  if (loading) {
    return (
      <Layout titulo="Professor">
        <div style={{ padding: 20 }}>Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout titulo="Detalhes do Professor">
      <div style={styles.container}>
        <div style={styles.card}>
          {/* HEADER */}
          <div style={styles.header}>
            <button
              style={styles.backBtn}
              onClick={() => navigate("/professores")}
            >
              ← Voltar
            </button>
          </div>

          {/* FOTO + NOME */}
          <div style={styles.center}>
            <img
              src={getFoto(professor.foto)}
              style={styles.foto}
              alt="foto"
            />

            <div style={styles.nome}>{professor.nome}</div>
          </div>

          {/* INFO */}
          <div style={styles.infoBox}>
            <div style={styles.row}>
              <span style={styles.label}>Disciplina</span>
              <span style={styles.value}>
                {professor.disciplina || "-"}
              </span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Email</span>
              <span style={styles.value}>{professor.email || "-"}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Telefone</span>
              <span style={styles.value}>
                {professor.telefone || "-"}
              </span>
            </div>
          </div>

          {/* BOTÕES */}
          <div style={styles.actions}>
            <button style={styles.editBtn} onClick={editarProfessor}>
              Editar
            </button>

            <button style={styles.deleteBtn} onClick={excluirProfessor}>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}