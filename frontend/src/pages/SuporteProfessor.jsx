import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

function SuporteProfessor() {
  const [lista, setLista] = useState([]);
  const [respostas, setRespostas] = useState({});

  const [tituloAdmin, setTituloAdmin] = useState("");
  const [mensagemAdmin, setMensagemAdmin] = useState("");

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

  async function abrirChamadoAdmin() {
    try {

      if (!tituloAdmin.trim()) {
        return toast.warning("Informe o título");
      }

      if (!mensagemAdmin.trim()) {
        return toast.warning("Informe a mensagem");
      }

      await api.post("/suporte", {
        titulo: tituloAdmin,
        mensagem: mensagemAdmin
      });

      toast.success("Chamado enviado para a Administração!");

      setTituloAdmin("");
      setMensagemAdmin("");

      carregar();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao abrir chamado");
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

  const chamadosAlunos = lista.filter(
    item =>
      item.destino === "professor"
  );

  const chamadosAdmin = lista.filter(
    item =>
      item.destino === "admin"
  );

  return (
    <Layout titulo="Suporte do Professor">

      {/* CHAMADO PARA ADMIN */}

      <div className="card p-4 mb-4">

        <h4>Contato com a Administração</h4>

        <input
          className="form-control mb-2"
          placeholder="Título"
          value={tituloAdmin}
          onChange={(e) =>
            setTituloAdmin(e.target.value)
          }
        />

        <textarea
          className="form-control mb-3"
          rows={4}
          placeholder="Descreva o problema"
          value={mensagemAdmin}
          onChange={(e) =>
            setMensagemAdmin(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          onClick={abrirChamadoAdmin}
        >
          Enviar para Administração
        </button>

      </div>

      {/* CHAMADOS DOS ALUNOS */}

      <div className="card p-4 mb-4">

        <h4>Chamados dos Alunos</h4>

        {chamadosAlunos.length === 0 && (
          <div className="alert alert-info">
            Nenhum chamado de aluno.
          </div>
        )}

        {chamadosAlunos.map((item) => (

          <div
            key={item.id}
            className="card p-3 mb-3"
          >
            <h5>{item.titulo}</h5>

            <p>{item.mensagem}</p>

            <div className="mb-2">
              <strong>Status:</strong>{" "}
              {item.status}
            </div>

            {item.resposta ? (
              <div className="alert alert-success">
                <strong>Resposta:</strong>
                <br />
                {item.resposta}
              </div>
            ) : (
              <>
                <textarea
                  className="form-control mb-2"
                  placeholder="Responder..."
                  value={
                    respostas[item.id] || ""
                  }
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
                  Responder
                </button>
              </>
            )}

          </div>

        ))}

      </div>

      {/* CHAMADOS DO PROFESSOR PARA ADMIN */}

      <div className="card p-4">

        <h4>Meus Chamados para Administração</h4>

        {chamadosAdmin.length === 0 && (
          <div className="alert alert-info">
            Nenhum chamado enviado.
          </div>
        )}

        {chamadosAdmin.map((item) => (

          <div
            key={item.id}
            className="card p-3 mb-3"
          >
            <h5>{item.titulo}</h5>

            <p>{item.mensagem}</p>

            <div className="mb-2">
              <strong>Status:</strong>{" "}
              {item.status}
            </div>

            {item.resposta ? (
              <div className="alert alert-success">
                <strong>Resposta da Administração:</strong>
                <br />
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

    </Layout>
  );
}

export default SuporteProfessor;