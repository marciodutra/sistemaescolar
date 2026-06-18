import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function TurmaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        // professores
        const resProf = await api.get("/professores");
        setProfessores(resProf.data);

        // turma (edição)
        if (id) {
          const resTurma = await api.get(`/turmas/${id}`);

          const turma = resTurma.data;

          setNome(turma.nome);
          setAno(turma.ano);
          setProfessorId(turma.professor_id || "");
        }
      } catch (err) {
        toast.error("Erro ao carregar dados");
        console.log(err);
      }
    }

    carregarDados();
  }, [id]);

  async function salvar() {
    try {
      const payload = {
        nome,
        ano: Number(ano),
        professor_id: professorId || null,
      };

      if (id) {
        await api.put(`/turmas/${id}`, payload);
        toast.success("Turma atualizada");
      } else {
        await api.post("/turmas", payload);
        toast.success("Turma criada");
      }

      navigate("/turmas");
    } catch (err) {
      toast.error("Erro ao salvar turma");
    }
  }

  return (
    <Layout titulo={id ? "Editar Turma" : "Nova Turma"}>
      <div style={styles.container}>
        <div style={styles.card}>

          <h2>{id ? "Editar" : "Nova"} Turma</h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            style={styles.input}
          />

          <select
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value)}
            style={styles.input}
          >
            <option value="">Professor</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          <button style={styles.button} onClick={salvar}>
            Salvar
          </button>

        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: { padding: 20, display: "flex", justifyContent: "center" },

  card: {
    width: "100%",
    maxWidth: 600,
    background: "#fff",
    padding: 20,
    borderRadius: 20,
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
  },
};