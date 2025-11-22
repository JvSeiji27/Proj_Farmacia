import React, { useState, useEffect } from "react";
import api from "../services/api";

function RegistroVendas() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [produtoIdSelecionado, setProdutoIdSelecionado] = useState("");
  const [qtd, setQtd] = useState(1);
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);

  // Carrega usuário e produtos ao abrir
  useEffect(() => {
    // 1. Tenta ler o usuário do LocalStorage
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
        try {
            setUser(JSON.parse(storedUserStr));
        } catch (e) {
            console.error("Erro ao ler user do localstorage", e);
        }
    }

    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
      try {
          const res = await api.get("/produtos/findAll");
          // Filtra apenas produtos ativos e com estoque
          const validos = res.data.filter(p => p.ativo && p.quantidadeEmEstoque > 0);
          setProdutos(validos);
      } catch (error) {
          console.error("Erro ao buscar produtos", error);
      }
  };

  const adicionarItem = () => {
    const prod = produtos.find(p => p._id === produtoIdSelecionado);
    if (!prod) return;

    if (qtd > prod.quantidadeEmEstoque) {
        setMsg(`Erro: Só existem ${prod.quantidadeEmEstoque} unidades deste produto.`);
        return;
    }

    const novoItem = {
      produtoId: prod._id, // ID correto para o backend
      nome: prod.nome,
      preco: prod.preco,
      quantidade: parseInt(qtd),
      subtotal: prod.preco * parseInt(qtd)
    };

    setCarrinho([...carrinho, novoItem]);
    setMsg(""); 
  };

  const removerItem = (index) => {
      const novoCarrinho = [...carrinho];
      novoCarrinho.splice(index, 1);
      setCarrinho(novoCarrinho);
  };

  const finalizar = async () => {
    if (!user) {
        setMsg("Erro: Usuário não identificado. Faça login novamente.");
        return;
    }

    // Lógica para garantir que temos ID e Nome (Nome ou Email)
    const idUsuario = user._id || user.id;
    const nomeUsuario = user.name || user.nome || user.usuario || user.email;

    if (!idUsuario) {
        setMsg("Erro: ID do usuário inválido.");
        return;
    }

    const corpo = {
        usuarioNome: nomeUsuario,
        usuarioId: idUsuario,
        role: user.role,
        itens: carrinho
    };

    try {
        console.log("Enviando Venda:", corpo);
        
        // Post para a rota (agora liberada no backend)
        await api.post("/vendas/registrar", corpo);

        setMsg("Venda registrada com sucesso!");
        setCarrinho([]);
        setQtd(1);
        setProdutoIdSelecionado("");
        carregarProdutos(); // Atualiza o estoque na tela
        
        setTimeout(() => setMsg(""), 3000);
    } catch (error) {
        const erroTxt = error.response?.data?.message || "Erro ao registrar venda.";
        console.error("Erro venda:", error); // Log detalhado no console
        setMsg("Erro: " + erroTxt);
    }
  };

  const totalGeral = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h2 style={{ color: "#000" }}>Registro de Vendas</h2>
      
      {msg && (
        <p style={{ 
            fontWeight: "bold", 
            color: msg.includes("Erro") ? "#dc2626" : "#16a34a",
            background: msg.includes("Erro") ? "#fee2e2" : "#dcfce7",
            padding: "10px",
            borderRadius: "4px"
        }}>
            {msg}
        </p>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>Produto:</label>
            <select 
                value={produtoIdSelecionado} 
                onChange={e => setProdutoIdSelecionado(e.target.value)} 
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "300px", background: "#fff", color: "#000" }}
            >
                <option value="">Selecione o Produto...</option>
                {produtos.map(p => (
                    <option key={p._id} value={p._id}>
                        {p.nome} (R$ {p.preco}) — Est: {p.quantidadeEmEstoque}
                    </option>
                ))}
            </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ color: "#000", fontSize: "12px", fontWeight: "bold" }}>Qtd:</label>
            <input 
                type="number" 
                min="1" 
                value={qtd} 
                onChange={e => setQtd(e.target.value)} 
                style={{ width: "60px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", color: "#000" }} 
            />
        </div>

        <button 
            onClick={adicionarItem} 
            style={{ background: "#2563eb", color: "#fff", border:"none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", height: "35px" }}
        >
            Adicionar
        </button>
      </div>

      <h3 style={{ color: "#000" }}>Carrinho</h3>
      <table style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}>
        <thead>
            <tr style={{ background: "#0a0a0aff", color: "#fff" }}>
                <th align="left" style={{ padding: "8px" }}>Produto</th>
                <th style={{ padding: "8px" }}>Qtd</th>
                <th style={{ padding: "8px" }}>Unitário</th>
                <th style={{ padding: "8px" }}>Subtotal</th>
                <th style={{ padding: "8px" }}>Ação</th>
            </tr>
        </thead>
        <tbody>
            {carrinho.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ddd", color: "#000" }}>
                    <td style={{ padding: "8px" }}>{item.nome}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{item.quantidade}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>R$ {item.preco}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>R$ {item.subtotal.toFixed(2)}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                        <button onClick={() => removerItem(idx)} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", padding: "4px 8px" }}>X</button>
                    </td>
                </tr>
            ))}
            {carrinho.length === 0 && (
                <tr><td colSpan="5" style={{ padding: "10px", textAlign: "center", color: "#666" }}>Carrinho vazio</td></tr>
            )}
        </tbody>
      </table>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", borderTop: "2px solid #eee", paddingTop: "10px" }}>
        <h3 style={{ color: "#000", margin: 0 }}>Total a Pagar: R$ {totalGeral.toFixed(2)}</h3>
        <button 
            onClick={finalizar} 
            disabled={carrinho.length===0} 
            style={{ 
                padding: "12px 24px", 
                background: carrinho.length === 0 ? "#ccc" : "#059669", 
                color: "#fff", 
                border:"none", 
                borderRadius: "4px", 
                cursor: carrinho.length === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px"
            }}
        >
          FINALIZAR VENDA
        </button>
      </div>
    </div>
  );
}

export default RegistroVendas;