import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Componentes Antigos
import CadastroProduto from "./components/ProductForm";
import ListaProdutos from "./components/ProductList";
import ControleEstoque from "./components/ControleEstoque";
import Movimentacoes from "./components/MovimentacaoProdutos";
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./components/AuthPage";

// --- NOVOS COMPONENTES ---
import RegistroVendas from "./components/RegistroVendas";
import Relatorios from "./components/RelatoriosSimples";
import Agendamentos from "./components/agendamentos";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    padding: "6px 10px",
    borderRadius: 8,
    transition: "background .15s",
    fontSize: 14,
    background: "rgba(255,255,255,0.06)",
  };

  const logoutButtonStyle = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 14,
  };

  return (
    <Router>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {isAuthenticated && (
          <nav
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 1000,
              background: "#2563eb",
              color: "#fff",
              padding: "12px 20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                maxWidth: 1100,
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 style={{ margin: 0, fontSize: 18 }}>Gestão de Produtos</h1>

              <div style={{ display: "flex", gap: 12 }}>
                
                {/* --- MENU ADMIN --- */}
                {userRole === "ADMIN" && (
                  <>
                    <Link to="/relatorios" style={linkStyle}>Relatórios</Link>
                    <Link to="/vendas" style={linkStyle}>Vender</Link>
                    <Link to="/cadastro" style={linkStyle}>Cadastro</Link>
                    <Link to="/controle" style={linkStyle}>Controle</Link>
                    <Link to="/movimentacoes" style={linkStyle}>Movimentações</Link>
                    <Link to="/agendamentos" style={linkStyle}>Agendamentos</Link>
                  </>
                )}

                {/* --- MENU CLIENTE --- */}
                {userRole !== "ADMIN" && (
                   <>
                    <Link to="/lista" style={linkStyle}>Lista</Link>
                    <Link to="/agendamentos" style={linkStyle}>Meus Agendamentos</Link>
                   </>
                )}

                <button onClick={handleLogout} style={logoutButtonStyle}>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}

        <main
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "24px",
            paddingTop: isAuthenticated ? "80px" : "0px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "100%", maxWidth: 1100 }}>
            <Routes>
              <Route
                path="/"
                element={<AuthPage setIsAuthenticated={setIsAuthenticated} />}
              />

              {/* Rotas Comuns (Protegidas) */}
              <Route
                path="/lista"
                element={
                  <PrivateRoute>
                    <ListaProdutos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/agendamentos"
                element={
                  <PrivateRoute>
                    <Agendamentos />
                  </PrivateRoute>
                }
              />

              {/* Rotas de Admin (Idealmente criar PrivateAdminRoute, mas usando PrivateRoute por enquanto) */}
              {userRole === "ADMIN" && (
                <>
                  <Route path="/cadastro" element={<PrivateRoute><CadastroProduto /></PrivateRoute>} />
                  <Route path="/controle" element={<PrivateRoute><ControleEstoque /></PrivateRoute>} />
                  <Route path="/movimentacoes" element={<PrivateRoute><Movimentacoes /></PrivateRoute>} />
                  
                  {/* NOVAS ROTAS */}
                  <Route path="/vendas" element={<PrivateRoute><RegistroVendas /></PrivateRoute>} />
                  <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
                </>
              )}

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        {isAuthenticated && (
          <footer
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              background: "#1e40af",
              color: "#fff",
              textAlign: "center",
              padding: "12px",
              boxShadow: "0 -2px 6px rgba(0,0,0,0.08)",
            }}
          >
            © {new Date().getFullYear()} Sistema de Gestão — João Vitor Seiji,
            Matheus Ruy e Pedro
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;