import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function entrar() {
    try {
      const response = await axios.post(
        "https://sistemaescolar-tkvc.onrender.com/auth",
        {
          email,
          senha,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);

      window.location = "/dashboard";
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.erro || "Erro ao fazer login");
      } else {
        alert("Erro de conexão com o servidor");
      }
    }
  }

  return (
    <Layout titulo="Acesso ao sistema">
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
        <h2 className="text-center mb-4">Login Escolar</h2>

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

        <button className="btn btn-primary w-100" onClick={entrar}>
          Entrar
        </button>

        <button
          className="btn btn-outline-success w-100 mt-2"
          onClick={() => navigate("/register")}
        >
          Criar Conta
        </button>
      </div>
    </Layout>
  );
}

export default Login;
