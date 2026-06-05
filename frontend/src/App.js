import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Professores from "./pages/Professores";
import Turmas from "./pages/Turmas";
import Matriculas from "./pages/Matriculas";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/matriculas" element={<Matriculas />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
