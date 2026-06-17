import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

function Professores() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);

  async function carregar() {
    try {
      const res = await api.get("/professores");
      setLista(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setNome("");
    setDisciplina("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setEditando(null);
  }

  async function salvar() {
    try {
      if (!nome || !disciplina) {
        return toast.warning("Preencha nome e disciplina");
      }

      if (!editando && (!email || !senha)) {
        return toast.warning("Email e senha obrigatórios");
      }

      if (editando) {
        await api.put(`/professores/${editando.id}`, {
          nome,
          disciplina,
          email,
          telefone
        });

        toast.success("Professor atualizado!");
      } else {
        await api.post("/professores", {
          nome,
          disciplina,
          email,
          telefone,
          senha
        });

        toast.success("Professor criado!");
      }

      limpar();
      carregar();

    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao salvar");
    }
  }

  function editar(p) {
    setEditando(p);
    setNome(p.nome);
    setDisciplina(p.disciplina);
    setEmail(p.email || "");
    setTelefone(p.telefone || "");
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir?")) return;

    try {
      await api.delete(`/professores/${id}`);
      toast.success("Professor removido");
      carregar();
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  }

  return (
    <Layout titulo="Professores">

      <div style={{ maxWidth: 700, margin: "auto" }}>

        <h2>{editando ? "Editar Professor" : "Novo Professor"}</h2>

        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />

        <input placeholder="Disciplina" value={disciplina} onChange={e => setDisciplina(e.target.value)} />

        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

        <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />

        {!editando && (
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
        )}

        <button onClick={salvar}>
          {editando ? "Atualizar" : "Salvar"}
        </button>

        {editando && <button onClick={limpar}>Cancelar</button>}

        <hr />

        {lista.map(p => (
          <div key={p.id}>
            <b>{p.nome}</b> - {p.disciplina} - {p.email}

            <button onClick={() => editar(p)}>Editar</button>
            <button onClick={() => excluir(p.id)}>Excluir</button>
          </div>
        ))}

      </div>

    </Layout>
  );
}

export default Professores;