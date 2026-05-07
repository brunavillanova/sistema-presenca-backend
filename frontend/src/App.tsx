import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Funcionarios from "./pages/Funcionarios";

import Presencas from "./pages/Presencas";

import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* FUNCIONÁRIOS */}
        <Route
          path="/funcionarios"
          element={<Funcionarios />}
        />

        {/* PRESENÇAS */}
        <Route
          path="/presencas"
          element={<Presencas />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;