import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function AlunoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ CORREÇÃO APENAS AQUI (sem mexer no layout)
  const carregarAluno = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/alunos");
      const encontrado = res.data.find((a) => a.id === Number(id));

      if (!encontrado) {
        toast.error("Aluno não encontrado");
        navigate("/alunos");
        return;
      }

      setAluno(encontrado);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar aluno");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarAluno();
  }, [carregarAluno]);

  async function excluirAluno() {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
      await api.delete(`/alunos/${id}`);
      toast.success("Aluno excluído com sucesso!");
      navigate("/alunos");
    } catch (err) {
      toast.error("Erro ao excluir aluno");
    }
  }

  function editarAluno() {
    navigate(`/alunos/${id}/editar`);
  }

  function getFoto(foto) {
    if (!foto) return "https://cdn-icons-png.flaticon.com/512/1946/1946429.png";
    if (foto.startsWith("http")) return foto;
    return `${import.meta.env.VITE_API_URL}/${foto}`;
  }

  const styles = {
    container: { padding: 20, display: "flex", justifyContent: "center" },

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

    label: {
      color: "#666",
    },

    value: {
      fontWeight: "bold",
    },

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
      <Layout titulo="Aluno">
        <div style={{ padding: 20 }}>Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout titulo="Detalhes do Aluno">
      <div style={styles.container}>
        <div style={styles.card}>
          {/* HEADER */}
          <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate("/alunos")}>
              ← Voltar
            </button>
          </div>

          {/* FOTO + NOME */}
          <div style={styles.center}>
            <img
              src={getFoto(aluno.foto)}
              style={styles.foto}
              alt="foto"
            />

            <div style={styles.nome}>{aluno.nome}</div>
          </div>

          {/* INFO */}
          <div style={styles.infoBox}>
            <div style={styles.row}>
              <span style={styles.label}>Responsável</span>
              <span style={styles.value}>{aluno.responsavel || "-"}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Data nascimento</span>
              <span style={styles.value}>
                {aluno.data_nascimento
                  ? new Date(aluno.data_nascimento).toLocaleDateString("pt-BR")
                  : "-"}
              </span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Telefone</span>
              <span style={styles.value}>{aluno.telefone || "-"}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>CPF</span>
              <span style={styles.value}>{aluno.cpf || "-"}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>RG</span>
              <span style={styles.value}>{aluno.rg || "-"}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Endereço</span>
              <span style={styles.value}>
                {aluno.logradouro} {aluno.numero}
              </span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Cidade</span>
              <span style={styles.value}>{aluno.cidade || "-"}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>CEP</span>
              <span style={styles.value}>{aluno.cep || "-"}</span>
            </div>
          </div>

          {/* BOTÕES */}
          <div style={styles.actions}>
            <button style={styles.editBtn} onClick={editarAluno}>
              Editar
            </button>

            <button style={styles.deleteBtn} onClick={excluirAluno}>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}