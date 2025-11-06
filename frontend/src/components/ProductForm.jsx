import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./Produtos.css";


const formatarData = (data) => {
  const d = new Date(data);
  return new Intl.DateTimeFormat("pt-BR", {timeZone: "UTC"}).format(d)
}

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [formaFarmaceutica, setFormaFarmaceutica] = useState("Outro");
  const [quantidadeEmEstoque, setQuantidadeEmEstoque] = useState(0);
  const [validade, setValidade] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [controlado, setControlado] = useState(false);
  const [ativo, setAtivo] = useState(true);
  const [alertaMinimo, setAlertaMinimo] = useState(5);


  const fetchProdutos = async () => {
    try {
      const response = await api.get("/findAll");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setMensagem(error.response?.data.message || "Erro ao buscar produtos.");
    }
  };

  useEffect(() => {
    if (mostrarLista) fetchProdutos();
  }, [mostrarLista]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/create", {
        nome,
        preco: Number(preco),
        descricao,
        fabricante,
        dosagem,
        formaFarmaceutica,
        quantidadeEmEstoque: Number(quantidadeEmEstoque),
        validade: validade || null,
        codigoBarras,
        controlado,
        ativo,
        alertaMinimo: Number(alertaMinimo),
      });

      setMensagem(response.data.message || "Produto criado com sucesso!");

      // Reset campos
      setNome(""); setPreco(""); setDescricao(""); setFabricante("");
      setDosagem(""); setFormaFarmaceutica("Outro"); setQuantidadeEmEstoque(0);
      setValidade(""); setCodigoBarras(""); setControlado(false); setAtivo(true);
      setAlertaMinimo(5);

      if (mostrarLista) fetchProdutos();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setMensagem(error.response?.data.message || "Erro ao criar produto.");
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Produtos</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row"><label>Nome:</label><input value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
          <div className="form-row"><label>Preço:</label><input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required /></div>
          <div className="form-row"><label>Descrição:</label><input value={descricao} onChange={(e) => setDescricao(e.target.value)} /></div>
          <div className="form-row"><label>Fabricante:</label><input value={fabricante} onChange={(e) => setFabricante(e.target.value)} /></div>
          <div className="form-row"><label>Dosagem:</label><input value={dosagem} onChange={(e) => setDosagem(e.target.value)} /></div>
          <div className="form-row">
            <label>Forma Farmacêutica:</label>
            <select value={formaFarmaceutica} onChange={(e) => setFormaFarmaceutica(e.target.value)}>
              <option>Comprimido</option><option>Cápsula</option><option>Xarope</option>
              <option>Pomada</option><option>Injetável</option><option>Outro</option>
            </select>
          </div>
          <div className="form-row"><label>Quantidade em Estoque:</label><input type="number" value={quantidadeEmEstoque} onChange={(e) => setQuantidadeEmEstoque(e.target.value)} /></div>
          <div className="form-row"><label>Alerta Mínimo:</label><input type="number" value={alertaMinimo} onChange={(e) => setAlertaMinimo(e.target.value)} /></div>
          <div className="form-row"><label>Validade:</label><input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} /></div>
          <div className="form-row"><label>Código de Barras:</label><input value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} /></div>
          <div className="form-row checkbox-row"><label><input type="checkbox" checked={controlado} onChange={(e) => setControlado(e.target.checked)} /> Controlado</label></div>
          <div className="form-row checkbox-row"><label><input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> Ativo</label></div>
          <button type="submit">Cadastrar Produto</button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>

      <div className="list-toggle">
        <button onClick={() => setMostrarLista(!mostrarLista)}>
          {mostrarLista ? "Ocultar Produtos" : "Mostrar Produtos"}
        </button>
      </div>

      {mostrarLista && (
        <div className="list-container">
          <h2>Lista de Produtos</h2>
          {produtos.map((p) => (
            <div key={p._id} className="produto-card">
              <h3>{p.nome}</h3>
              <p className="produto-atributo"><strong>Preço:</strong> R${p.preco}</p>
              <p className="produto-atributo"><strong>Descrição:</strong> {p.descricao || "-"}</p>
              <p className="produto-atributo"><strong>Fabricante:</strong> {p.fabricante || "-"}</p>
              <p className="produto-atributo"><strong>Dosagem:</strong> {p.dosagem || "-"}</p>
              <p className="produto-atributo"><strong>Forma Farmacêutica:</strong> {p.formaFarmaceutica}</p>
              <p className={`produto-atributo ${p.quantidadeEmEstoque <= p.alertaMinimo ? "produto-estoque-baixo" : ""}`}>
                <strong>Estoque:</strong> {p.quantidadeEmEstoque} {p.quantidadeEmEstoque <= p.alertaMinimo ? "(Baixo)" : ""}
              </p>
              <p className="produto-atributo"><strong>Validade:</strong> {p.validade ? formatarData(p.validade) : "-"}</p>
              <p className="produto-atributo"><strong>Código de Barras:</strong> {p.codigoBarras || "-"}</p>
              <p className="produto-atributo"><strong>Controlado:</strong> {p.controlado ? "Sim" : "Não"}</p>
              <p className="produto-atributo"><strong>Ativo:</strong> {p.ativo ? "Sim" : "Não"}</p>
              <p className="produto-atributo"><strong>Alerta Mínimo:</strong> {p.alertaMinimo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Produtos;
