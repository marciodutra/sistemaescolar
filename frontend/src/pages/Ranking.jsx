import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    carregarRanking();
  }, []);

  async function carregarRanking() {
    try {
      const res = await api.get("/ranking");
      setRanking(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function cor(posicao) {
    if (posicao === 1) return "#facc15"; // ouro
    if (posicao === 2) return "#cbd5e1"; // prata
    if (posicao === 3) return "#b45309"; // bronze
    return "#fff";
  }

  return (
    <Layout titulo="Ranking de Alunos">

      <div className="card p-3">

        <h4 className="mb-3">🏆 Classificação Geral</h4>

        <table className="table">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Aluno</th>
              <th>Média</th>
            </tr>
          </thead>

          <tbody>
            {ranking.map((r) => (
              <tr key={r.posicao} style={{ background: cor(r.posicao) }}>
                <td>{r.posicao}º</td>
                <td>{r.aluno}</td>
                <td>{r.media.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </Layout>
  );
}

export default Ranking;