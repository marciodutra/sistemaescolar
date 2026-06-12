import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

function SuporteAluno() {
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [destino, setDestino] = useState("professor");
  const [lista, setLista] = useState([]);

  const carregar = useCallback(async () => {
    try {
      const res = await api.get("/suporte");
      setLista(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar chamados");
    }
  }, []);

  async function enviar() {
    try {
      if (!titulo.trim()) {
        return toast.warning("Informe o título");
      }

      if (!mensagem.trim()) {
        return toast.warning("Informe a mensagem");
      }

      await api.post("/suporte", {
        titulo,
        mensagem,
        destino
      });

      toast.success("Chamado enviado com sucesso!");

      setTitulo("");
      setMensagem("");
      setDestino("professor");

      carregar();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar chamado");
    }
  }

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <Layout titulo="Suporte do Aluno">

      <div className="card p-4">

        <h4 className="mb-3">Abrir Chamado</h4>

        <label className="mb-2">
          Falar com:
        </label>

        <select
          className="form-control mb-3"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        >
          <option value="professor">
            Professor
          </option>

          <option value="admin">
            Administração
          </option>
        </select>

        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="form-control mb-2"
        />

        <textarea
          placeholder="Descreva seu problema"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="form-control mb-3"
          rows={4}
        />

        <button
          className="btn btn-primary"
          onClick={enviar}
        >
          Enviar Chamado
        </button>

      </div>

      <div className="mt-4">

        <h4>Meus Chamados</h4>

        {lista.length === 0 && (
          <div className="alert alert-info">
            Nenhum chamado encontrado.
          </div>
        )}

        {lista.map((item) => (

          <div
            key={item.id}
            className="card p-3 mb-3"
          >
            <div className="d-flex justify-content-between">
              <strong>{item.titulo}</strong>

              <span
                className={
                  item.status === "respondido"
                    ? "badge bg-success"
                    : "badge bg-warning text-dark"
                }
              >
                {item.status}
              </span>
            </div>

            <div className="mt-2">
              <b>Destino:</b>{" "}
              {item.destino === "admin"
                ? "Administração"
                : "Professor"}
            </div>

            <div className="mt-2">
              <b>Mensagem:</b>
              <br />
              {item.mensagem}
            </div>

            {item.resposta ? (
              <div className="alert alert-success mt-3 mb-0">
                <strong>Resposta:</strong>
                <br />
                {item.resposta}
              </div>
            ) : (
              <div className="alert alert-warning mt-3 mb-0">
                Aguardando resposta...
              </div>
            )}

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default SuporteAluno;