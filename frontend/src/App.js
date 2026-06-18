import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./components/PrivateRoute";

// Páginas principais
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Alunos
import Alunos from "./pages/Alunos";
import AlunoDetalhes from "./pages/alunos/AlunoDetalhes";
import AlunoForm from "./pages/alunos/AlunoForm";

// Professores
import Professores from "./pages/Professores";
import ProfessorForm from "./pages/professores/ProfessorForm";
import ProfessorDetalhes from "./pages/professores/ProfessorDetalhes";

// Turmas
import Turmas from "./pages/Turmas";
import TurmaForm from "./pages/turmas/TurmaForm";
import TurmaDetalhes from "./pages/turmas/TurmaDetalhes";

// Outros módulos
import Matriculas from "./pages/Matriculas";
import Usuarios from "./pages/Usuarios";
import Notas from "./pages/Notas";
import Boletim from "./pages/Boletim";
import Ranking from "./pages/Ranking";

// Suporte
import Suporte from "./pages/Suporte";
import TicketDetalhe from "./pages/TicketDetalhe";
import SuporteAluno from "./pages/SuporteAluno";
import SuporteProfessor from "./pages/SuporteProfessor";
import SuporteAdmin from "./pages/SuporteAdmin";
import MatriculaForm from "./pages/matriculas/MatriculaForm";
import MatriculaDetalhes from "./pages/matriculas/MatriculaDetalhes";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>

        {/* ===================== */}
        {/* PÚBLICAS */}
        {/* ===================== */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===================== */}
        {/* DASHBOARD */}
        {/* ===================== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* ALUNOS */}
        {/* ===================== */}
        <Route
          path="/alunos"
          element={
            <PrivateRoute>
              <Alunos />
            </PrivateRoute>
          }
        />

        <Route
          path="/alunos/novo"
          element={
            <PrivateRoute>
              <AlunoForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/alunos/:id"
          element={
            <PrivateRoute>
              <AlunoDetalhes />
            </PrivateRoute>
          }
        />

        <Route
          path="/alunos/:id/editar"
          element={
            <PrivateRoute>
              <AlunoForm />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* PROFESSORES */}
        {/* ===================== */}
        <Route
          path="/professores"
          element={
            <PrivateRoute>
              <Professores />
            </PrivateRoute>
          }
        />

        <Route
          path="/professores/novo"
          element={
            <PrivateRoute>
              <ProfessorForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/professores/:id"
          element={
            <PrivateRoute>
              <ProfessorDetalhes />
            </PrivateRoute>
          }
        />

        <Route
          path="/professores/:id/editar"
          element={
            <PrivateRoute>
              <ProfessorForm />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* TURMAS */}
        {/* ===================== */}
        <Route
          path="/turmas"
          element={
            <PrivateRoute>
              <Turmas />
            </PrivateRoute>
          }
        />

        <Route
          path="/turmas/novo"
          element={
            <PrivateRoute>
              <TurmaForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/turmas/:id"
          element={
            <PrivateRoute>
              <TurmaDetalhes />
            </PrivateRoute>
          }
        />

        <Route
          path="/turmas/:id/editar"
          element={
            <PrivateRoute>
              <TurmaForm />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* OUTROS MÓDULOS */}
        {/* ===================== */}
        <Route
          path="/matriculas"
          element={
            <PrivateRoute>
              <Matriculas />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          }
        />

        <Route
          path="/notas"
          element={
            <PrivateRoute>
              <Notas />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* CONSULTAS */}
        {/* ===================== */}
        <Route path="/boletim" element={<Boletim />} />
        <Route path="/ranking" element={<Ranking />} />

        {/* ===================== */}
        {/* SUPORTE */}
        {/* ===================== */}
        <Route
          path="/suporte"
          element={
            <PrivateRoute>
              <Suporte />
            </PrivateRoute>
          }
        />

        <Route
          path="/suporte/:id"
          element={
            <PrivateRoute>
              <TicketDetalhe />
            </PrivateRoute>
          }
        />

        <Route
          path="/suporte-aluno"
          element={
            <PrivateRoute>
              <SuporteAluno />
            </PrivateRoute>
          }
        />

        <Route
          path="/suporte-professor"
          element={
            <PrivateRoute>
              <SuporteProfessor />
            </PrivateRoute>
          }
        />

        <Route
          path="/suporte-admin"
          element={
            <PrivateRoute>
              <SuporteAdmin />
            </PrivateRoute>
          }
        />

        <Route
  path="/matriculas"
  element={
    <PrivateRoute>
      <Matriculas />
    </PrivateRoute>
  }
/>

<Route
  path="/matriculas/nova"
  element={
    <PrivateRoute>
      <MatriculaForm />
    </PrivateRoute>
  }
/>

<Route
  path="/matriculas/:id"
  element={
    <PrivateRoute>
      <MatriculaDetalhes />
    </PrivateRoute>
  }
/>

<Route
  path="/matriculas/:id/editar"
  element={
    <PrivateRoute>
      <MatriculaForm />
    </PrivateRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;