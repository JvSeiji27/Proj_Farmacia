import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./MovimentacaoProdutos.css";

function MovimentacaoProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Carrega todos os produtos
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setCarregando(true);
        const res = await api.get("/findAll");
        if (Array.isArray(res.data)) {
          setProdutos(res.data);
        } else {
          setMensagem("Erro: formato inesperado de resposta do servidor.");
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setMensagem("Erro ao carregar produtos. Verifique o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregarProdutos();
  }, []);

  // Seleciona um produto e carrega histórico
  const selecionarProduto = async (produto) => {
    try {
      setSelecionado(produto);
      setMensagem(`Produto "${produto.nome}" selecionado.`);

      if (produto.historicoMovimentacao && produto.historicoMovimentacao.length > 0) {
        setHistorico(produto.historicoMovimentacao);
      } else {
        const res = await api.get(`/findById/${produto._id}`);
        setHistorico(res.data.historicoMovimentacao || []);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      setHistorico([]);
    }
  };

  // Registra entrada ou saída
  const handleMovimentacao = async (tipo) => {
    if (!selecionado) return alert("Selecione um produto primeiro.");
    if (!quantidade || quantidade <= 0) return alert("Informe uma quantidade válida.");

    try {
      const res = await api.post(`/${tipo}/${selecionado._id}`, {
        quantidade: Number(quantidade),
        observacao: observacao.trim()
      });

      alert(`Movimentação de ${tipo} registrada com sucesso!`);
      setSelecionado(res.data.produto);
      setHistorico(res.data.produto.historicoMovimentacao || []);
      setQuantidade("");
      setObservacao("");
    } catch (err) {
      console.error("Erro na movimentação:", err);
      alert("Erro ao registrar movimentação.");
    }
  };

  return (
    <div className="mov-container">
      <h1>Movimentação de Produtos</h1>

      {carregando && <p>Carregando produtos...</p>}
      {mensagem && <p className="mensagem">{mensagem}</p>}

      {/* Lista de produtos */}
      <section className="tabela-container">
        <h2>Selecione um Produto</h2>
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p, index) => (
              <tr key={p._id} className={index % 2 === 0 ? "linha-par" : "linha-impar"}>
                <td>{p.nome}</td>
                <td>{p.quantidadeEmEstoque}</td>
                <td>
                  <button className="btn-selecionar" onClick={() => selecionarProduto(p)}>
                    Selecionar
                  </button>
                </td>
              </tr>
            ))}
            {produtos.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  Nenhum produto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Painel de movimentação */}
      {selecionado && (
        <section className="painel-movimentacao">
          <h3>{selecionado.nome}</h3>
          <p>Estoque atual: {selecionado.quantidadeEmEstoque}</p>

          <div className="mov-buttons">
            <input
              type="number"
              placeholder="Quantidade"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              style={{ width: "100px", marginRight: "8px" }}
            />
            <input
              type="text"
              placeholder="Observação (opcional)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              style={{ width: "250px", marginRight: "8px" }}
            />
            <button className="btn-entrada" onClick={() => handleMovimentacao("entrada")}>
              Registrar Entrada
            </button>
            <button className="btn-saida" onClick={() => handleMovimentacao("saida")}>
              Registrar Saída
            </button>
          </div>

          <h4>Histórico de Movimentações</h4>
          {historico.length > 0 ? (
            <ul className="historico-lista">
              {historico.map((h, i) => {
                const dataFormatada = new Date(h.data).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <li key={i}>
                    <strong
                      style={{
                        color: h.tipo === "entrada" ? "green" : "red"
                      }}
                    >
                      {String(h.tipo || "indefinido").toUpperCase()}
                    </strong>{" "}
                    — {h.quantidade} un.
                    {h.observacao && h.observacao.trim() !== "" && ` — Obs: ${h.observacao}`}
                    <br />
                    <span style={{ fontSize: "0.9em", color: "#666" }}>Data: {dataFormatada}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Nenhuma movimentação registrada ainda.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default MovimentacaoProdutos;
