import React, { useEffect, useState } from "react";
import api from "../services/api";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/produtos/findAll");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        if (error.response) {
          setMensagem(error.response.data.message || "Erro ao buscar produtos.");
        } else if (error.request) {
          setMensagem("Servidor não respondeu.");
        } else {
          setMensagem("Erro desconhecido ao buscar produtos.");
        }
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div>
      <h2>Lista de Produtos</h2>
      {mensagem && <p>{mensagem}</p>}
      <ul>
        {produtos.map((produto) => (
          <li key={produto._id}>
            {produto.nome} - R$ {produto.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaProdutos;
