import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import CadastroProduto from "./components/ProductForm";      // seu formulário de cadastro
import ListaProdutos from "./components/ProductList";        // página de listagem
import ControleEstoque from "./components/ControleEstoque"; // página que mostra estoque crítico + validade (opcional)
import Movimentacoes from "./components/MovimentacaoProdutos"; // movimentação em massa

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Navbar simples e clara */}
        <nav style={{
          background: "#2563eb",
          color: "#fff",
          padding: "12px 20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0, fontSize: 18 }}>Gestão de Produtos</h1>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/" style={linkStyle}>Cadastro</Link>
              <Link to="/lista" style={linkStyle}>Lista</Link>
              <Link to="/controle" style={linkStyle}>Controle</Link>
              <Link to="/movimentacoes" style={linkStyle}>Movimentações</Link>
            </div>
          </div>
        </nav>

        <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 24 }}>
          <div style={{ width: "100%", maxWidth: 1100 }}>
            <Routes>
              <Route path="/" element={<CadastroProduto />} />
              <Route path="/lista" element={<ListaProdutos />} />
              <Route path="/controle" element={<ControleEstoque />} />
              <Route path="/movimentacoes" element={<Movimentacoes />} />
            </Routes>
          </div>
        </main>

        <footer style={{ background: "#1e40af", color: "#fff", textAlign: "center", padding: 12 }}>
          © {new Date().getFullYear()} Sistema de Gestão — Joao Vitor Seiji, Matheus Ruy e Pedro 
        </footer>
      </div>
    </Router>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 8,
  transition: "background .15s",
  fontSize: 14,
  background: "rgba(255,255,255,0.06)"
};

export default App;
