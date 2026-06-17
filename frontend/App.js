import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Alunos from "./pages/alunos/Alunos";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ALUNOS (TUDO EM UMA SÓ TELA) */}
        <Route path="/alunos" element={<Alunos />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;