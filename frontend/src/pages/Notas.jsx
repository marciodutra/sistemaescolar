import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import Select from "react-select";

function Notas() {
    const [notas, setNotas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState([]);

    const [form, setForm] = useState({
        aluno_id: "",
        turma_id: "",
        disciplina: "",
        bimestre: "",
        nota: ""
    });

    useEffect(() => {
        carregarTudo();
    }, []);

    async function carregarTudo() {
        try {
            const [n, a, t] = await Promise.all([
                api.get("/notas"),
                api.get("/alunos"),
                api.get("/turmas")
            ]);

            setNotas(n.data);
            setAlunos(a.data);
            setTurmas(t.data);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
    }

    async function salvar() {
        try {
            await api.post("/notas", form);

            setForm({
                aluno_id: "",
                turma_id: "",
                disciplina: "",
                bimestre: "",
                nota: ""
            });

            carregarTudo();
        } catch (err) {
            alert(err.response?.data?.erro || "Erro ao salvar nota");
        }
    }

    return (
        <Layout titulo="Lançamento de Notas">

            {/* FORMULÁRIO */}
            <div className="card p-3 mb-3">

                <h5>Lançar Nota</h5>

                {/* ALUNO COM BUSCA */}
                <div className="mb-2">
                    <div style={{ width: "100%" }}>
                        <Select
                            placeholder="🔎 Buscar aluno..."
                            options={alunos.map((a) => ({
                                value: a.id,
                                label: a.nome
                            }))}
                            onChange={(e) =>
                                setForm({ ...form, aluno_id: e?.value || "" })
                            }
                            styles={{
                                container: (base) => ({
                                    ...base,
                                    width: "100%"
                                }),
                                control: (base) => ({
                                    ...base,
                                    minHeight: 45
                                })
                            }}
                        />
                    </div>
                </div>

                {/* TURMA COM BUSCA */}
                <div className="mb-2">
                    <Select
                        placeholder="🔎 Pesquisar turma..."
                        options={turmas.map((t) => ({
                            value: t.id,
                            label: t.nome
                        }))}
                        onChange={(e) =>
                            setForm({ ...form, turma_id: e?.value || "" })
                        }
                    />
                </div>

                <input
                    className="form-control mb-2"
                    placeholder="Disciplina"
                    value={form.disciplina}
                    onChange={(e) =>
                        setForm({ ...form, disciplina: e.target.value })
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Bimestre"
                    value={form.bimestre}
                    onChange={(e) =>
                        setForm({ ...form, bimestre: e.target.value })
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Nota"
                    type="number"
                    value={form.nota}
                    onChange={(e) =>
                        setForm({ ...form, nota: e.target.value })
                    }
                />

                <button className="btn btn-primary" onClick={salvar}>
                    Salvar Nota
                </button>
            </div>

            {/* TABELA */}
            <div className="card p-3">
                <h5>Notas Lançadas</h5>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Aluno</th>
                            <th>Turma</th>
                            <th>Disciplina</th>
                            <th>Bimestre</th>
                            <th>Nota</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notas.length > 0 ? (
                            notas.map((n) => (
                                <tr key={n.id}>
                                    <td>{n.aluno}</td>
                                    <td>{n.turma}</td>
                                    <td>{n.disciplina}</td>
                                    <td>{n.bimestre}</td>
                                    <td>{n.nota}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Nenhuma nota cadastrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </Layout>
    );
}

export default Notas;