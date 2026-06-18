import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Layout from "../../components/Layout";
import "./AlunoForm.css";

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

  return (
    <Layout titulo={id ? "Editar Aluno" : "Novo Aluno"}>
      <div className="aluno-container">
        <div className="aluno-card">
          <div className="aluno-title">
            {id ? "Editar Aluno" : "Cadastro de Aluno"}
          </div>

          <div className="foto-box">
            <img
              src={foto ? URL.createObjectURL(foto) : getFoto(fotoAtual)}
              className="foto"
              alt="foto"
            />

            <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
          </div>

          <div className="grid">
            <input className="input" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="input" placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />

            <input className="input" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            <input className="input" placeholder="RG" value={rg} onChange={e => setRg(e.target.value)} />

            <select className="input" value={sexo} onChange={e => setSexo(e.target.value)}>
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>

            <input className="input" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />

            <input className="input" type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />

            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

            {!id && (
              <input className="input" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
            )}

            <input className="input" placeholder="Rua" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
            <input className="input" placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} />

            <input className="input" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
            <input className="input" placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />

            <select className="input" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="">Estado</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
            </select>

            <input className="input" placeholder="CEP" value={cep} onChange={e => setCep(e.target.value)} />
          </div>

          <button className="button" onClick={salvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar aluno"}
          </button>
        </div>
      </div>
    </Layout>
  );
}