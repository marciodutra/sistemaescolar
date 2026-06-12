import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

function SuporteProfessor() {
  const [lista, setLista] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [aba, setAba] = useState("alunos"); // 👈 controle das abas

  const carregar = useCallback(async () => {
    try {
      const res = await api.get("/suporte");
      setLista(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar chamados");
    }
  }, []);

  async function responder(id) {
    try {
      const resposta = respostas[id] || "";

      if (!resposta.trim()) {
        return toast.warning("Digite uma resposta");
      }

      await api.put(`/suporte/${id}`, { resposta });

      toast.success("Resposta enviada!");

      setRespostas({
        ...respostas,
        [id]: ""
      });

      carregar();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao responder");
    }
  }

  function handleChange(id, value) {
    setRespostas({
      ...respostas,
      [id]: value
    });
  }

  useEffect(() => {
    carregar();
  }, [carregar]);

  // 🔥 separação lógica (aqui está a mágica)
  const chamadosAlunos = lista.filter(
    item => item.destino === "professor"
  );

  const chamadosAdmin = lista.filter(
    item => item.destino === "admin"
  );

  return (
    <Layout titulo="Suporte do Professor">

      {/* BOTÕES DE ABA */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${aba === "alunos" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setAba("alunos")}
        >
          📚 Alunos
        </button>

        <button
          className={`btn ${aba === "admin" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setAba("admin")}
        >
          🏢 Administração
        </button>
      </div>

      {/* ===================== */}
      {/* ABA ALUNOS */}
      {/* ===================== */}
      {aba === "alunos" && (
        <div className="card p-4">
          <h4>Chamados dos Alunos</h4>

          {chamadosAlunos.length === 0 && (
            <div className="alert alert-info">
              Nenhum chamado de aluno.
            </div>
          )}

          {chamadosAlunos.map((item) => (
            <div key={item.id} className="card p-3 mb-3">
              <h5>{item.titulo}</h5>
              <p>{item.mensagem}</p>

              <div className="mb-2">
                <strong>Status:</strong> {item.status}
              </div>

              {item.resposta ? (
                <div className="alert alert-success">
                  <strong>Resposta:</strong><br />
                  {item.resposta}
                </div>
              ) : (
                <>
                  <textarea
                    className="form-control mb-2"
                    placeholder="Responder..."
                    value={respostas[item.id] || ""}
                    onChange={(e) =>
                      handleChange(item.id, e.target.value)
                    }
                  />

                  <button
                    className="btn btn-success"
                    onClick={() => responder(item.id)}
                  >
                    Responder
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===================== */}
      {/* ABA ADMIN */}
      {/* ===================== */}
      {aba === "admin" && (
        <div className="card p-4">
          <h4>Chamados para Administração</h4>

          {chamadosAdmin.length === 0 && (
            <div className="alert alert-info">
              Nenhum chamado enviado ao admin.
            </div>
          )}

          {chamadosAdmin.map((item) => (
            <div key={item.id} className="card p-3 mb-3">
              <h5>{item.titulo}</h5>
              <p>{item.mensagem}</p>

              <div className="mb-2">
                <strong>Status:</strong> {item.status}
              </div>

              {item.resposta ? (
                <div className="alert alert-success">
                  <strong>Resposta da Administração:</strong><br />
                  {item.resposta}
                </div>
              ) : (
                <div className="alert alert-warning">
                  Aguardando resposta da Administração...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </Layout>
  );
}

export default SuporteProfessor;