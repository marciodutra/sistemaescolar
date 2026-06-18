import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [aberto, setAberto] = useState(false);

    const perfil = (localStorage.getItem("perfil") || "").toLowerCase();

    function logout() {
        localStorage.clear();
        navigate("/");
    }

    return (
        <nav
            className="navbar navbar-dark navbar-expand-lg"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "#0f172a",
                borderRadius: 15,
                marginBottom: 25,
                padding: "10px 20px",
            }}
        >
            <div className="container-fluid">

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setAberto(!aberto)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${aberto ? "show" : ""}`}>

                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </button>
                        </li>

                        {/* ADMIN */}
                        {perfil === "admin" && (
                            <>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/alunos")}
                                    >
                                        Alunos
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/professores")}
                                    >
                                        Professores
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/turmas")}
                                    >
                                        Turmas
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/matriculas")}
                                    >
                                        Matrículas
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/notas")}
                                    >
                                        Notas
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/usuarios")}
                                    >
                                        Usuários
                                    </button>
                                </li>
                            </>
                        )}

                        {/* PROFESSOR */}
                        {perfil === "professor" && (
                            <>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/alunos")}
                                    >
                                        Alunos
                                    </button>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={() => navigate("/turmas")}
                                    >
                                        Turmas
                                    </button>
                                </li>
                            </>
                        )}

                        {/* PROFESSOR E ALUNO */}
                        {(perfil === "professor" || perfil === "aluno") && (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={() => navigate("/notas")}
                                >
                                    Notas
                                </button>
                            </li>
                        )}

                        {/* TODOS */}
                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/boletim")}
                            >
                                Boletim
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className="btn btn-link nav-link"
                                onClick={() => navigate("/ranking")}
                            >
                                Ranking
                            </button>
                        </li>

                        {/* SUPORTE */}
                        {perfil === "aluno" && (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={() => navigate("/suporte-aluno")}
                                >
                                    📞 Suporte
                                </button>
                            </li>
                        )}

                        {perfil === "professor" && (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={() => navigate("/suporte-professor")}
                                >
                                    📩 Chamados
                                </button>
                            </li>
                        )}

                        {perfil === "admin" && (
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link"
                                    onClick={() => navigate("/suporte-admin")}
                                >
                                    📞 Suporte Administração
                                </button>
                            </li>
                        )}

                    </ul>

                    <button
                        className="btn btn-danger btn-sm"
                        onClick={logout}
                    >
                        Sair
                    </button>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;