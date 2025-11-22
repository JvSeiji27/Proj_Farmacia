import React, { useEffect, useState } from "react";
import api from "../services/api";

function RelatoriosSimples() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para armazenar as estatísticas
  const [stats, setStats] = useState({
      produtoMaisVendido: "Nenhum",
      qtdMaisVendido: 0,
      faturamentoTotal: 0
  });

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const res = await api.get("/vendas/relatorio");
        const dados = res.data || [];
        setVendas(dados);
        calcularEstatisticas(dados);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendas();
  }, []);

  // Lógica para descobrir o mais vendido e calcular faturamento
  const calcularEstatisticas = (dados) => {
      let totalFat = 0;
      const contagemProdutos = {};

      // 1. Percorre todas as vendas
      dados.forEach(venda => {
          totalFat += venda.total; // Soma faturamento

          // 2. Percorre os itens de cada venda
          venda.itens.forEach(item => {
              // Se já existe no objeto, soma. Se não, inicia.
              if (contagemProdutos[item.nome]) {
                  contagemProdutos[item.nome] += item.quantidade;
              } else {
                  contagemProdutos[item.nome] = item.quantidade;
              }
          });
      });

      // 3. Descobre qual teve a maior quantidade
      let nomeCampeao = "Nenhum";
      let qtdCampeao = 0;

      for (const [nome, qtd] of Object.entries(contagemProdutos)) {
          if (qtd > qtdCampeao) {
              qtdCampeao = qtd;
              nomeCampeao = nome;
          }
      }

      setStats({
          produtoMaisVendido: nomeCampeao,
          qtdMaisVendido: qtdCampeao,
          faturamentoTotal: totalFat
      });
  };

  if (loading) return <p style={{ color: "#000" }}>Carregando dados...</p>;

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h2 style={{ color: "#000", marginBottom: "20px" }}>Painel de Relatórios</h2>

      {/* --- CARD DE DESTAQUE (ESTATÍSTICAS) --- */}
      <div style={{ 
          display: "flex", 
          gap: "20px", 
          marginBottom: "30px", 
          flexWrap: "wrap" 
      }}>
          {/* Card Faturamento */}
          <div style={{ 
              flex: 1, 
              background: "#0a0a0aff", 
              color: "#fff", 
              padding: "20px", 
              borderRadius: "8px", 
              minWidth: "200px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", textTransform: "uppercase", color: "#aaa" }}>Faturamento Total</h3>
              <p style={{ fontSize: "28px", margin: 0, fontWeight: "bold", color: "#86efac" }}>
                  R$ {stats.faturamentoTotal.toFixed(2)}
              </p>
          </div>

          {/* Card Produto Mais Vendido */}
          <div style={{ 
              flex: 1, 
              background: "#2563eb", 
              color: "#fff", 
              padding: "20px", 
              borderRadius: "8px", 
              minWidth: "200px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", textTransform: "uppercase", color: "#bfdbfe" }}>Produto Mais Vendido</h3>
              <p style={{ fontSize: "24px", margin: 0, fontWeight: "bold" }}>
                  {stats.produtoMaisVendido}
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                  Total vendido: <strong>{stats.qtdMaisVendido} un.</strong>
              </p>
          </div>
      </div>

      <h3 style={{ color: "#000", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Histórico Detalhado</h3>
      
      {vendas.length === 0 ? (
        <p style={{ color: "#666", marginTop: "20px" }}>Nenhuma venda registrada no sistema.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
          {vendas.map((venda) => (
            <div key={venda._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fafafa" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                <div style={{ color: "#000" }}>
                    <strong>Data:</strong> {new Date(venda.data).toLocaleDateString()} <small>{new Date(venda.data).toLocaleTimeString()}</small>
                </div>
                <span style={{ color: "#16a34a", fontWeight: "bold", fontSize: "16px" }}>
                    R$ {venda.total.toFixed(2)}
                </span>
              </div>
              
              <p style={{ margin: "5px 0", color: "#333", fontSize: "14px" }}>
                  <strong>Vendedor:</strong> {venda.usuario} <span style={{color:"#666"}}>({venda.roleUsuario || "Indefinido"})</span>
              </p>
              
              <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#e5e7eb", color: "#000" }}>
                        <th align="left" style={{ padding: "6px", fontSize: "12px" }}>Item</th>
                        <th style={{ padding: "6px", fontSize: "12px" }}>Qtd</th>
                        <th style={{ padding: "6px", fontSize: "12px" }}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {venda.itens.map((item, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #eee", color: "#000" }}>
                            <td style={{ padding: "6px", fontSize: "14px" }}>{item.nome}</td>
                            <td style={{ padding: "6px", fontSize: "14px", textAlign: "center" }}>{item.quantidade}</td>
                            <td style={{ padding: "6px", fontSize: "14px", textAlign: "center" }}>R$ {item.subtotal ? item.subtotal.toFixed(2) : "-"}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatoriosSimples;