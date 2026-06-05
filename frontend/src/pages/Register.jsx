import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function cadastrar() {
    try {
      const response = await axios.post(
        "https://sistemaescolar-tkvc.onrender.com/auth/register",
        {
          nome,
          email,
          senha,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("nome", response.data.nome);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.erro);
    }
  }

  return (
    <Layout titulo="Cadastro de usuário">
      <div
        style={{
          maxWidth: 450,
          margin: "50px auto",
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,.3)",
        }}
      >
        <h2 className="text-center mb-4">Criar Conta</h2>

        <input
          className="form-control mb-3"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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

        <button
          className="btn btn-success w-100"
          onClick={cadastrar}
        >
          Cadastrar
        </button>
      </div>
    </Layout>
  );
}

export default Register;