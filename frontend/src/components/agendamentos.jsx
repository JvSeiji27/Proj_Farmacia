import React, { useEffect, useState } from "react";
import api from "../services/api";

function Agendamentos() {
  const [lista, setLista] = useState([]);
  const [dataHora, setDataHora] = useState("");
  const [tipo, setTipo] = useState("Consulta Farmacêutica");
  const [observacao, setObservacao] = useState("");
  const [user, setUser] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr) {
        try {
            const storedUser = JSON.parse(storedUserStr);
            setUser(storedUser);
            carregarLista(storedUser);
        } catch (e) {
            console.error("Erro ao ler usuário do localStorage", e);
        }
    }
  }, []);

  const carregarLista = async (usuarioLogado) => {
    try {
      let url = "/atendimentos/listar";
      const userId = usuarioLogado._id || usuarioLogado.id;

      if (usuarioLogado && usuarioLogado.role !== "ADMIN" && userId) {
         url = `/atendimentos/listar?userId=${userId}`;
      }

      const response = await api.get(url);
      setLista(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar agendamentos", error);
    }
  };

  const handleAgendar = async (e) => {
    e.preventDefault();
    
    if (!user) {
        setMensagem("Erro: Usuário não identificado. Faça login novamente.");
        return;
    }

    const idUsuario = user._id || user.id;
    const nomeUsuario = user.name || user.nome || user.usuario || user.username || user.email;

    if (!idUsuario) {
        setMensagem("Erro: ID do usuário inválido.");
        return;
    }
    
    if (!nomeUsuario) {
        setMensagem("Erro: Nome ou Email do usuário não encontrado.");
        return;
    }

    try {
      const payload = {
        usuarioNome: nomeUsuario, 
        usuarioId: idUsuario,
        dataHora,
        tipo,
        observacao,
      };

      console.log("Enviando payload:", payload);

      await api.post("/atendimentos/criar", payload);

      setMensagem("Agendamento solicitado com sucesso!");
      setDataHora("");
      setObservacao("");
      carregarLista(user);
      
      setTimeout(() => setMensagem(""), 3000);
    } catch (error) {
      const msgErro = error.response?.data?.message || "Erro ao agendar.";
      console.error("Erro na requisição:", error.response?.data);
      setMensagem(`Erro: ${msgErro}`);
    }
  };

  const alterarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/atendimentos/status/${id}`, { status: novoStatus });
      carregarLista(user);
    } catch (error) {
      console.error("Erro ao alterar status", error);
      alert("Erro ao alterar status");
    }
  };

  const getStatusColor = (status) => { 
      if (status === "Confirmado") return "#86efac"; 
      if (status === "Concluído") return "#93c5fd"; 
      if (status === "Cancelado") return "#fca5a5"; 
      return "#fde047"; 
  };
  
  const btnStyle = (bg) => ({ background: bg, color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" });

  return (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}>
      <h2 style={{ color: "#000" }}>Central de Atendimentos</h2>
      
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
        <h3 style={{ color: "#000" }}>Solicitar Novo Agendamento</h3>
        
        {mensagem && (
            <div style={{ 
                padding: "10px", 
                marginBottom: "10px", 
                borderRadius: "4px",
                background: mensagem.includes("Erro") ? "#fee2e2" : "#dcfce7",
                color: mensagem.includes("Erro") ? "#dc2626" : "#16a34a",
                fontWeight: "bold"
            }}>
                {mensagem}
            </div>
        )}
        
        <form onSubmit={handleAgendar} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "500px" }}>
          <label style={{ color: "#000", fontWeight: "bold" }}>Data e Hora:</label>
          <input 
            type="datetime-local" 
            value={dataHora} 
            onChange={(e) => setDataHora(e.target.value)} 
            required 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", color: "#000" }} 
          />
          
          <label style={{ color: "#000", fontWeight: "bold" }}>Tipo de Serviço:</label>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)} 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", color: "#000" }}
          >
            <option>Consulta Farmacêutica</option>
            <option>Retirada de Medicamentos</option>
            <option>Aplicação de Injetáveis</option>
            <option>Outro</option>
          </select>
          
          <label style={{ color: "#000", fontWeight: "bold" }}>Observação:</label>
          <input 
            type="text" 
            value={observacao} 
            onChange={(e) => setObservacao(e.target.value)} 
            placeholder="Ex: Alergias..." 
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff", color: "#000" }} 
          />
          
          <button type="submit" style={{ padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Confirmar Agendamento
          </button>
        </form>
      </div>

      <h3 style={{ color: "#000" }}>Histórico</h3>
      {lista.length === 0 ? <p style={{ color: "#000" }}>Nenhum agendamento encontrado.</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            {/* Cabeçalho preto com texto BRANCO */}
            <tr style={{ background: "#0a0a0aff", color: "#ffffff", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Data/Hora</th>
                <th style={{ padding: "12px" }}>Cliente</th>
                <th style={{ padding: "12px" }}>Serviço</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((item) => (
              // Linhas com texto PRETO forçado
              <tr key={item._id} style={{ borderBottom: "1px solid #a71212ff", color: "#000000" }}>
                <td style={{ padding: "12px" }}>
                    {new Date(item.dataHora).toLocaleDateString()} {new Date(item.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td style={{ padding: "12px" }}>{item.usuario}</td>
                <td style={{ padding: "12px" }}>{item.tipo}</td>
                <td style={{ padding: "12px" }}>
                    <span style={{ 
                        background: getStatusColor(item.status),
                        color: "#1f2937", 
                        padding: "6px 12px", 
                        borderRadius: "20px", 
                        fontSize: "12px", 
                        fontWeight: "bold",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}>
                        {item.status}
                    </span>
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                    {user && user.role === "ADMIN" && item.status === "Pendente" && (
                        <button onClick={() => alterarStatus(item._id, "Confirmado")} style={btnStyle("#16a34a")}>✔</button>
                    )}
                    {user && user.role === "ADMIN" && item.status === "Confirmado" && (
                        <button onClick={() => alterarStatus(item._id, "Concluído")} style={btnStyle("#2563eb")}>🏁</button>
                    )}
                    
                    {(item.status === "Pendente" || (user && user.role === "ADMIN" && item.status !== "Cancelado")) && (
                        <button onClick={() => alterarStatus(item._id, "Cancelado")} style={btnStyle("#dc2626")}>✖</button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Agendamentos;