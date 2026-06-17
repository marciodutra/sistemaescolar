import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";

export default function AlunoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [foto, setFoto] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(null);

  // ✅ FUNÇÃO CORRETA (useCallback)
  const carregarAluno = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await api.get("/alunos");
      const lista = Array.isArray(res.data) ? res.data : [];

      const aluno = lista.find((a) => a.id === Number(id));

      if (!aluno) {
        toast.error("Aluno não encontrado");
        navigate("/alunos");
        return;
      }

      setNome(aluno.nome || "");
      setResponsavel(aluno.responsavel || "");
      setCpf(aluno.cpf || "");
      setRg(aluno.rg || "");
      setSexo(aluno.sexo || "");
      setTelefone(aluno.telefone || "");
      setDataNascimento(aluno.data_nascimento || "");

      setLogradouro(aluno.logradouro || "");
      setNumero(aluno.numero || "");
      setBairro(aluno.bairro || "");
      setCidade(aluno.cidade || "");
      setEstado(aluno.estado || "");
      setCep(aluno.cep || "");

      setEmail(aluno.email || "");
      setFotoAtual(aluno.foto || null);

    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar aluno");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // ✅ useEffect correto
  useEffect(() => {
    carregarAluno();
  }, [carregarAluno]);

  function getFoto(foto) {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    return `${process.env.REACT_APP_API_URL}/${foto}`;
  }

  async function salvar() {
    try {
      if (!nome || !dataNascimento) {
        toast.warning("Preencha os campos obrigatórios");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("responsavel", responsavel);
      formData.append("cpf", cpf);
      formData.append("rg", rg);
      formData.append("sexo", sexo);
      formData.append("telefone", telefone);
      formData.append("data_nascimento", dataNascimento);

      formData.append("logradouro", logradouro);
      formData.append("numero", numero);
      formData.append("bairro", bairro);
      formData.append("cidade", cidade);
      formData.append("estado", estado);
      formData.append("cep", cep);

      formData.append("email", email);

      if (!id) {
        if (!senha) {
          toast.warning("Senha obrigatória para novo aluno");
          return;
        }
        formData.append("senha", senha);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      if (id) {
        await api.put(`/alunos/${id}`, formData);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await api.post("/alunos", formData);
        toast.success("Aluno cadastrado com sucesso!");
      }

      navigate("/alunos");

    } catch (err) {
      console.log(err);
      toast.error("Erro ao salvar aluno");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    container: { display: "flex", justifyContent: "center", padding: 20 },
    card: {
      width: "100%",
      maxWidth: 800,
      background: "#fff",
      borderRadius: 20,
      padding: 25,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    },
    input: {
      padding: 12,
      borderRadius: 8,
      border: "1px solid #ddd",
    },
    fotoBox: {
      display: "flex",
      alignItems: "center",
      gap: 15,
      marginBottom: 15,
    },
    foto: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      objectFit: "cover",
    },
    button: {
      marginTop: 20,
      width: "100%",
      padding: 12,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
    },
  };

  return (
    <Layout titulo={id ? "Editar Aluno" : "Novo Aluno"}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>
            {id ? "Editar Aluno" : "Cadastro de Aluno"}
          </div>

          {/* FOTO */}
          <div style={styles.fotoBox}>
            <img
              src={foto ? URL.createObjectURL(foto) : getFoto(fotoAtual)}
              style={styles.foto}
              alt="foto"
            />

            <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
          </div>

          {/* FORM */}
          <div style={styles.grid}>
            <input style={styles.input} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input style={styles.input} placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />

            <input style={styles.input} placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
            <input style={styles.input} placeholder="RG" value={rg} onChange={e => setRg(e.target.value)} />

            <select style={styles.input} value={sexo} onChange={e => setSexo(e.target.value)}>
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>

            <input style={styles.input} placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />

            <input style={styles.input} type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />

            <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

            {!id && (
              <input style={styles.input} type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
            )}

            <input style={styles.input} placeholder="Rua" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
            <input style={styles.input} placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} />

            <input style={styles.input} placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
            <input style={styles.input} placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />

            <input style={styles.input} placeholder="Estado" value={estado} onChange={e => setEstado(e.target.value)} />
            <input style={styles.input} placeholder="CEP" value={cep} onChange={e => setCep(e.target.value)} />
          </div>

          <button style={styles.button} onClick={salvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar aluno"}
          </button>
        </div>
      </div>
    </Layout>
  );
}