import React from "react";
import CadastroProduto from "./components/CadastroProduto";
import ListaProdutos from "./components/ListaProdutos";

function App() {
  return (
    <div>
      <h1>Controle de Produtos</h1>
      <CadastroProduto />
      <ListaProdutos />
    </div>
  );
}

export default App;
