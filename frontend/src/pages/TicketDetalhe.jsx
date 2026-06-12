import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

export default function TicketDetalhe() {
  const { id } = useParams();

  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

  const carregar = useCallback(async () => {
    const res = await api.get(`/suporte/ticket/${id}/mensagens`);
    setMensagens(res.data);
  }, [id]);

  async function enviar() {
    if (!texto) return;

    await api.post(`/suporte/ticket/${id}/mensagens`, {
      mensagem: texto
    });

    setTexto("");
    carregar();
  }

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <Layout titulo="Ticket">

      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        <div style={{ border: "1px solid #ddd", padding: 10, height: 400, overflowY: "auto" }}>
          {mensagens.map(m => (
            <div key={m.id} style={{ marginBottom: 10 }}>
              <strong>{m.sender_role}</strong>: {m.mensagem}
            </div>
          ))}
        </div>

        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite sua mensagem"
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <button onClick={enviar} style={{ marginTop: 10 }}>
          Enviar
        </button>

      </div>

    </Layout>
  );
}