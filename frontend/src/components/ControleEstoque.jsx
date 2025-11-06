import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./ControleEstoque.css";

const formatarData = (data) => {
  const d = new Date(data);
  return new Intl.DateTimeFormat("pt-BR", {timeZone: "UTC"}).format(d)
}

function ControleEstoque() {
  const [estoqueCritico, setEstoqueCritico] = useState([]);
  const [validadeCritica, setValidadeCritica] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchCriticos = async () => {
      try {
        const [respEstoque, respValidade] = await Promise.all([
          api.get("/criticalStorage").catch(() => ({ data: [] })),
          api.get("/expirationDate").catch(() => ({ data: [] })),
        ]);

        setEstoqueCritico(respEstoque.data || []);
        setValidadeCritica(respValidade.data || []);
      } catch (error) {
        console.error(error);
        setMensagem("Erro ao buscar dados de controle.");
      }
    };

    fetchCriticos();
  }, []);

  // função para calcular dias até a validade
  const diasAteValidade = (dateStr) => {
    if (!dateStr) return "-";
    const hoje = new Date();
    const dataValidade = new Date(dateStr);
    hoje.setHours(0, 0, 0, 0);
    dataValidade.setHours(0, 0, 0, 0);
    const diff = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // função para retornar cor com base nos dias restantes
  const corDias = (dias) => {
    if (dias <= 3) return "#dc2626"; // vermelho
    if (dias <= 7) return "#f59e0b"; // laranja
    return "#16a34a"; // verde
  };

  return (
    <div className="controle-container">
      <h1>Controle de Estoque e Validade</h1>
      {mensagem && <p className="mensagem">{mensagem}</p>}

      <section>
        <h2>Produtos com Estoque Baixo</h2>
        {estoqueCritico.length > 0 ? (
          <ul>
            {estoqueCritico.map((p) => (
              <li key={p._id}>
                <strong>{p.nome}</strong> — Estoque: {p.quantidadeEmEstoque}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum produto com estoque baixo</p>
        )}
      </section>

      <section>
        <h2>Produtos Próximos da Validade</h2>
        {validadeCritica.length > 0 ? (
          <ul>
            {validadeCritica.map((p) => {
              const dias = diasAteValidade(p.validade);
              return (
                <li key={p._id}>
                  <strong>{p.nome}</strong> — Validade:{" "}
                  {p.validade ? formatarData(p.validade) : "-"}{" "}
                  <span
                    className="dias-restantes"
                    style={{ color: corDias(dias), fontWeight: "bold", marginLeft: 6 }}
                  >
                    ({dias} dias)
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Nenhum produto próximo da validade</p>
        )}
      </section>
    </div>
  );
}

export default ControleEstoque;
