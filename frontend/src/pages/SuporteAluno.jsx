import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

function SuporteAluno() {
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [destino, setDestino] = useState("professor");
  const [lista, setLista] = useState([]);
  const [aba, setAba] = useState("professor");

  const carregar = useCallback(async () => {
    try {
      const res = await api.get("/suporte");
      setLista(res.data);
    } catch (err) {
      toast.error("Erro ao carregar chamados");
    }
  }, []);

  async function enviar() {
    try {
      await api.post("/suporte", {
        titulo,
        mensagem,
        destino
      });

      toast.success("Chamado enviado!");

      setTitulo("");
      setMensagem("");
      setDestino("professor");

      carregar();
    } catch {
      toast.error("Erro ao enviar chamado");
    }
  }

  async function encerrar(id) {
    await api.delete(`/suporte/${id}`);
    toast.success("Chamado encerrado!");
    carregar();
  }

  useEffect(() => {
    carregar();
  }, [carregar]);

  // 🔥 separação lógica
  const chamadosProfessor = lista.filter(
    (i) => i.destino === "professor"
  );

  const chamadosAdmin = lista.filter(
    (i) => i.destino === "admin"
  );

  return (
    <Layout titulo="Suporte do Aluno">

      {/* FORM */}
      <div className="card p-3 mb-3">

        <select
          className="form-control mb-2"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        >
          <option value="professor">Professor</option>
          <option value="admin">Administração</option>
        </select>

        <input
          className="form-control mb-2"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />

        <button className="btn btn-primary" onClick={enviar}>
          Enviar chamado
        </button>
      </div>

      {/* ABAS */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${aba === "professor" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setAba("professor")}
        >
          📚 Professor
        </button>

        <button
          className={`btn ${aba === "admin" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setAba("admin")}
        >
          🏢 Administração
        </button>
      </div>

      {/* PROFESSOR */}
      {aba === "professor" && (
        <div>
          {chamadosProfessor.map((item) => (
            <div key={item.id} className="card p-3 mb-2">
              <strong>{item.titulo}</strong>
              <p>{item.mensagem}</p>

              <p>Status: {item.status}</p>

              {item.resposta && (
                <div className="alert alert-success">
                  <b>Resposta do Professor:</b> {item.resposta}
                </div>
              )}

              {item.status !== "encerrado" && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => encerrar(item.id)}
                >
                  Encerrar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADMIN */}
      {aba === "admin" && (
        <div>
          {chamadosAdmin.map((item) => (
            <div key={item.id} className="card p-3 mb-2">
              <strong>{item.titulo}</strong>
              <p>{item.mensagem}</p>

              <p>Status: {item.status}</p>

              {item.resposta && (
                <div className="alert alert-success">
                  <b>Resposta da Administração:</b> {item.resposta}
                </div>
              )}

              {item.status !== "encerrado" && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => encerrar(item.id)}
                >
                  Encerrar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </Layout>
  );
}

export default SuporteAluno;