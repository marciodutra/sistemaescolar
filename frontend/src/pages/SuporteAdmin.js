import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

function SuporteAdmin() {
  const [lista, setLista] = useState([]);
  const [respostas, setRespostas] = useState({});

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

      await api.put(`/suporte/${id}`, {
        resposta
      });

      toast.success("Resposta enviada com sucesso!");

      setRespostas({
        ...respostas,
        [id]: ""
      });

      carregar();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao responder chamado");
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

  return (
    <Layout titulo="Suporte da Administração">

      <div className="card p-4">

        <h3 className="mb-4">
          Chamados para Administração
        </h3>

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
              <h5>{item.titulo}</h5>

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

            <div className="mb-2">
              <strong>Origem:</strong>{" "}
              {item.perfil === "professor"
                ? "Professor"
                : "Aluno"}
            </div>

            <div className="mb-2">
              <strong>Mensagem:</strong>
              <br />
              {item.mensagem}
            </div>

            {item.resposta ? (
              <div className="alert alert-success mt-3">
                <strong>Resposta enviada:</strong>
                <br />
                {item.resposta}
              </div>
            ) : (
              <>
                <textarea
                  className="form-control mb-2"
                  rows={4}
                  placeholder="Digite sua resposta..."
                  value={respostas[item.id] || ""}
                  onChange={(e) =>
                    handleChange(
                      item.id,
                      e.target.value
                    )
                  }
                />

                <button
                  className="btn btn-success"
                  onClick={() =>
                    responder(item.id)
                  }
                >
                  Responder Chamado
                </button>
              </>
            )}

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default SuporteAdmin;