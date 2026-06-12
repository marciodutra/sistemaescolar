import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import Select from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Boletim() {
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [dados, setDados] = useState(null);
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    carregarAlunos();
  }, []);

  async function carregarAlunos() {
    const res = await api.get("/alunos");
    setAlunos(res.data);
  }

  async function buscarAluno(opcao) {
    setAlunoSelecionado(opcao);
    const res = await api.get(`/boletim/${opcao.value}`);
    setDados(res.data);
  }

  async function gerarPDF() {
    const el = document.getElementById("boletim");

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);

    pdf.save(`boletim-${dados.aluno}.pdf`);
  }

  return (
    <Layout titulo="Boletim Escolar">

      {/* SELECT */}
      <div className="card p-3 mb-3">
        <Select
          placeholder="🔎 Buscar aluno..."
          value={alunoSelecionado}
          options={alunos.map((a) => ({
            value: a.id,
            label: a.nome,
          }))}
          onChange={buscarAluno}
        />
      </div>

      {dados && (
        <>
          <div className="text-end mb-2">
            <button className="btn btn-danger" onClick={gerarPDF}>
              📄 Imprimir / Baixar PDF
            </button>
          </div>

          {/* BOLETIM PROFISSIONAL */}
          <div
            id="boletim"
            className="card p-4"
            style={{ fontFamily: "Arial" }}
          >

            {/* CABEÇALHO ESCOLA */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h4>SISTEMA ESCOLAR</h4>
              <p style={{ margin: 0 }}>
                Histórico Escolar - Boletim de Notas
              </p>
              <hr />
            </div>

            {/* ALUNO */}
            <h5>Aluno: {dados.aluno}</h5>

            {/* TABELA */}
            <table className="table table-bordered mt-3">
              <thead style={{ background: "#f1f5f9" }}>
                <tr>
                  <th>Disciplina</th>
                  <th>Bimestre</th>
                  <th>Média</th>
                </tr>
              </thead>

              <tbody>
                {dados.disciplinas.map((d, i) => (
                  <tr key={i}>
                    <td>{d.disciplina}</td>
                    <td>{d.bimestre || "-"}</td>
                    <td>{Number(d.media).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MÉDIA FINAL */}
            <div
              style={{
                marginTop: 20,
                padding: 15,
                background: "#f8fafc",
                borderRadius: 10,
                textAlign: "center",
              }}
            >
              <h5>Média Geral</h5>
              <h2 style={{ margin: 0 }}>{dados.mediaGeral}</h2>

              <h4
                style={{
                  color:
                    dados.situacao === "Aprovado"
                      ? "green"
                      : dados.situacao === "Recuperação"
                      ? "orange"
                      : "red",
                }}
              >
                Situação: {dados.situacao}
              </h4>
            </div>

            {/* ASSINATURAS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 60,
              }}
            >
              <div style={{ textAlign: "center" }}>
                _______________________<br />
                Professor
              </div>

              <div style={{ textAlign: "center" }}>
                _______________________<br />
                Direção
              </div>
            </div>

          </div>
        </>
      )}
    </Layout>
  );
}

export default Boletim;