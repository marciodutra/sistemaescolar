import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [responsavel, setResponsavel] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [foto, setFoto] = useState(null);

  async function cadastrar() {
    try {
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("senha", senha);

      formData.append("responsavel", responsavel);
      formData.append("cpf", cpf);
      formData.append("rg", rg);
      formData.append("sexo", sexo);
      formData.append("telefone", telefone);
      formData.append("data_nascimento", dataNascimento);

      if (foto) formData.append("foto", foto);

      const response = await axios.post(
        "https://sistemaescolar-tkvc.onrender.com/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("nome", response.data.user.nome);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao cadastrar");
    }
  }

  return (
    <Layout titulo="Cadastro de usuário">
      <div
        style={{
          maxWidth: 500,
          margin: "50px auto",
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,.3)"
        }}
      >
        <h2 className="text-center mb-4">Criar Conta (Aluno)</h2>

        <input
          className="form-control mb-3"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="RG"
          value={rg}
          onChange={(e) => setRg(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Sexo"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-3"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setFoto(e.target.files[0])}
        />

        <button className="btn btn-success w-100" onClick={cadastrar}>
          Cadastrar
        </button>
      </div>
    </Layout>
  );
}

export default Register;