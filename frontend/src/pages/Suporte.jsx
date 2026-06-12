import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Suporte() {
  const [tickets, setTickets] = useState([]);
  const [assunto, setAssunto] = useState("");
  const navigate = useNavigate();

  async function carregar() {
    const res = await api.get("/suporte/ticket");
    setTickets(res.data);
  }

  async function criarTicket() {
    if (!assunto) return toast.warning("Digite um assunto");

    await api.post("/suporte/ticket", { assunto });
    setAssunto("");
    toast.success("Ticket criado!");
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Layout titulo="Suporte">

      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        <h2>Abrir chamado</h2>

        <input
          placeholder="Assunto do problema"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />

        <button onClick={criarTicket} style={{ marginTop: 10 }}>
          Criar ticket
        </button>

        <hr />

        <h2>Meus tickets</h2>

        {tickets.map(t => (
          <div key={t.id}
               style={{
                 padding: 10,
                 border: "1px solid #ddd",
                 marginBottom: 10,
                 cursor: "pointer"
               }}
               onClick={() => navigate(`/suporte/${t.id}`)}
          >
            <strong>{t.assunto}</strong>
            <div>Status: {t.status}</div>
          </div>
        ))}

      </div>

    </Layout>
  );
}