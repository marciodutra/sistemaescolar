import logo from "../img/logo.jpg";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

function Layout({ children, titulo }) {
  const location = useLocation();

  const paginasPublicas = ["/", "/register"];

  const mostrarNavbar = !paginasPublicas.includes(location.pathname);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
        padding: "30px",
      }}
    >
      {/* TOPO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "70px",
            height: "70px",
            objectFit: "contain",
          }}
        />

        <div>
          <h2
            style={{
              color: "#fff",
              margin: 0,
              fontWeight: 700,
            }}
          >
            Sistema Escolar
          </h2>

          {titulo && (
            <p
              style={{
                color: "#cbd5e1",
                margin: 0,
              }}
            >
              {titulo}
            </p>
          )}
        </div>
      </div>

      {/* NAVBAR só aparece logado */}
      {mostrarNavbar && <Navbar />}

      {children}
    </div>
  );
}

export default Layout;