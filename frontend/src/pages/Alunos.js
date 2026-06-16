import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Alunos() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState(null);

  const [responsavel, setResponsavel] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");

  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  const [lista, setLista] = useState([]);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);

  function formatarData(dataISO) {
    if (!dataISO) return "";
    return new Date(dataISO).toLocaleDateString("pt-BR");
  }

  async function carregar() {
    try {
      const response = await api.get("/alunos");
      setLista(response.data);
    } catch (err) {
      console.log("Erro ao carregar alunos:", err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limparFormulario() {
    setNome("");
    setDataNascimento("");
    setEmail("");
    setSenha("");
    setFoto(null);
    setResponsavel("");
    setCpf("");
    setRg("");
    setSexo("");
    setTelefone("");
    setLogradouro("");
    setNumero("");
    setBairro("");
    setCidade("");
    setEstado("");
    setCep("");
    setAlunoEmEdicao(null);
  }

  function editar(aluno) {
    setAlunoEmEdicao(aluno);

    setNome(aluno.nome || "");
    setDataNascimento(aluno.data_nascimento || "");
    setResponsavel(aluno.responsavel || "");
    setCpf(aluno.cpf || "");
    setRg(aluno.rg || "");
    setSexo(aluno.sexo || "");
    setTelefone(aluno.telefone || "");
    setLogradouro(aluno.logradouro || "");
    setNumero(aluno.numero || "");
    setBairro(aluno.bairro || "");
    setCidade(aluno.cidade || "");
    setEstado(aluno.estado || "");
    setCep(aluno.cep || "");
  }

  function cancelarEdicao() {
    limparFormulario();
  }

  async function excluir(id) {
    try {
      await api.delete(`/alunos/${id}`);
      toast.success("Aluno excluído!");
      carregar();
    } catch (err) {
      toast.error("Erro ao excluir aluno");
    }
  }

  async function salvar() {
    try {
      if (!nome || !dataNascimento) {
        toast.warning("Preencha todos os campos obrigatórios!");
        return;
      }

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("responsavel", responsavel);
      formData.append("cpf", cpf);
      formData.append("rg", rg);
      formData.append("data_nascimento", dataNascimento);
      formData.append("sexo", sexo);
      formData.append("telefone", telefone);
      formData.append("logradouro", logradouro);
      formData.append("numero", numero);
      formData.append("bairro", bairro);
      formData.append("cidade", cidade);
      formData.append("estado", estado);
      formData.append("cep", cep);

      if (foto) formData.append("foto", foto);

      if (alunoEmEdicao) {
        await api.put(`/alunos/${alunoEmEdicao.id}`, formData);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        if (!email || !senha) {
          toast.warning("Email e senha são obrigatórios!");
          return;
        }

        formData.append("email", email);
        formData.append("senha", senha);

        await api.post("/alunos", formData);
        toast.success("Aluno cadastrado com sucesso!");
      }

      limparFormulario();
      carregar();
    } catch (err) {
      console.log(err);
      toast.error("Erro ao salvar aluno");
    }
  }

  const styles = {
    container: { display: "flex", justifyContent: "center", padding: 20 },

    card: {
      width: "100%",
      maxWidth: 700,
      background: "#fff",
      borderRadius: 20,
      padding: 25,
      boxShadow: "0 20px 50px rgba(0,0,0,.15)"
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20
    },

    backButton: {
      background: "#e2e8f0",
      border: "none",
      padding: 10,
      borderRadius: 8,
      cursor: "pointer"
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    },

    input: {
      padding: 12,
      border: "1px solid #ccc",
      borderRadius: 8
    },

    buttonGroup: {
      display: "flex",
      gap: 10
    },

    saveButton: {
      flex: 1,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: 12,
      borderRadius: 8
    },

    cancelButton: {
      flex: 1,
      background: "#cbd5e1",
      border: "none",
      padding: 12,
      borderRadius: 8
    },

    list: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    },

    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: 12,
      background: "#f8fafc",
      borderRadius: 10
    },

    editButton: {
      background: "green",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6,
      marginRight: 5
    },

    deleteButton: {
      background: "red",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: 6
    }
  };

  return (
    <Layout titulo="Cadastro de Alunos">
      <div style={styles.container}>
        <div style={styles.card}>

          <div style={styles.header}>
            <h1>{alunoEmEdicao ? "Editar Aluno" : "Cadastro de Alunos"}</h1>

            <button
              style={styles.backButton}
              onClick={() => navigate("/dashboard")}
            >
              ← Voltar
            </button>
          </div>

          <div style={styles.form}>

            <input style={styles.input} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input style={styles.input} placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
            <input style={styles.input} placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
            <input style={styles.input} placeholder="RG" value={rg} onChange={e => setRg(e.target.value)} />
            <input style={styles.input} placeholder="Sexo" value={sexo} onChange={e => setSexo(e.target.value)} />
            <input style={styles.input} placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />

            <input style={styles.input} type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />

            <input style={styles.input} type="file" onChange={e => setFoto(e.target.files[0])} />

            {!alunoEmEdicao && (
              <>
                <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input style={styles.input} type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
              </>
            )}

            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={salvar}>
                {alunoEmEdicao ? "Atualizar" : "Salvar"}
              </button>

              {alunoEmEdicao && (
                <button style={styles.cancelButton} onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <hr />

          <h2>Alunos cadastrados</h2>

          <div style={styles.list}>
            {lista.map(aluno => (
              <div key={aluno.id} style={styles.item}>
                <div>
                  <strong>{aluno.nome}</strong>
                  <br />
                  <span>{formatarData(aluno.data_nascimento)}</span>
                </div>

                <div>
                  <button style={styles.editButton} onClick={() => editar(aluno)}>
                    Editar
                  </button>

                  <button style={styles.deleteButton} onClick={() => excluir(aluno.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}