const atendimentoModel = require("../model/atendimentoModel");

// 1. Criar Atendimento
exports.criarAtendimento = async (req, res) => {
    try {
        // Recebe os dados do corpo da requisição
        const { usuarioNome, usuarioId, dataHora, tipo, observacao } = req.body;
        
        // Validações básicas
        if (!dataHora || !tipo) {
            return res.status(400).json({ message: "Preencha data e tipo." });
        }
        if (!usuarioNome || !usuarioId) {
            return res.status(400).json({ message: "Erro: Usuário não identificado corretamente." });
        }

        // Cria no banco
        const novoAtendimento = await atendimentoModel.create({
            usuario: usuarioNome,
            usuarioId: usuarioId, // O frontend agora manda o ID correto
            dataHora: dataHora,
            tipo: tipo,
            observacao: observacao
        });

        res.status(201).json(novoAtendimento);
    } catch (error) {
        // IMPORTANTE: Isso mostra o motivo exato do erro no seu terminal do VSCode
        console.error("Erro ao criar atendimento:", error);
        res.status(500).json({ message: "Erro ao criar agendamento", error: error.message });
    }
};

// 2. Listar Atendimentos
exports.listarAtendimentos = async (req, res) => {
    try {
        // Pega o ID da query string (ex: ?userId=123)
        const { userId } = req.query; 
        
        let filtro = {};
        // Se veio um userId, filtra apenas os dele
        if (userId) {
            filtro = { usuarioId: userId };
        }

        const lista = await atendimentoModel.find(filtro).sort({ dataHora: 1 });
        res.json(lista);
    } catch (error) {
        console.error("Erro ao listar:", error);
        res.status(500).json({ message: "Erro ao listar agendamentos" });
    }
};

// 3. Atualizar Status
exports.atualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const atendimento = await atendimentoModel.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        if (!atendimento) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }
        res.json(atendimento);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ message: "Erro ao atualizar status" });
    }
};