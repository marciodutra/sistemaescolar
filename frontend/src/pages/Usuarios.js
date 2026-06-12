import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    async function carregarUsuarios() {
        try {
            const response = await api.get("/usuarios");
            setUsuarios(response.data);
        } catch (err) {
            alert(err.response?.data?.erro || "Erro ao carregar usuários");
        }
    }

    useEffect(() => {
        const perfil = localStorage.getItem("perfil");

        if (perfil !== "admin") {
            navigate("/dashboard");
            return;
        }

        carregarUsuarios();
    }, [navigate]);

    async function salvarPerfil(id, perfil) {
        try {
            await api.put(`/usuarios/${id}/perfil`, {
                perfil,
            });

            alert("Perfil atualizado");
            carregarUsuarios();

        } catch (err) {
            alert(err.response?.data?.erro || "Erro ao atualizar perfil");
        }
    }

    async function excluirUsuario(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este usuário?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/usuarios/${id}`);

            alert("Usuário excluído");

            carregarUsuarios();

        } catch (err) {
            alert(err.response?.data?.erro || "Erro ao excluir usuário");
        }
    }

    return (
        <Layout titulo="Administração de Usuários">
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 20,
                    overflowX: "auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    <h2 style={{ margin: 0 }}>Usuários</h2>

                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Voltar
                    </button>
                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <LinhaUsuario
                                key={usuario.id}
                                usuario={usuario}
                                salvarPerfil={salvarPerfil}
                                excluirUsuario={excluirUsuario}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

function LinhaUsuario({
    usuario,
    salvarPerfil,
    excluirUsuario,
}) {
    const [perfil, setPerfil] = useState(usuario.perfil);

    return (
        <tr>
            <td>{usuario.nome}</td>
            <td>{usuario.email}</td>

            <td>
                <select
                    className="form-select"
                    value={perfil}
                    onChange={(e) => setPerfil(e.target.value)}
                >
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                    <option value="secretaria">Secretaria</option>
                    <option value="admin">Administrador</option>
                </select>
            </td>

            <td>
                <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => salvarPerfil(usuario.id, perfil)}
                >
                    Salvar
                </button>

                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => excluirUsuario(usuario.id)}
                >
                    Excluir
                </button>
            </td>
        </tr>
    );
}

export default Usuarios;