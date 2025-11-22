const mongoose = require("mongoose");

const atendimentoSchema = new mongoose.Schema({
    usuario: { 
        type: String, 
        required: true 
    }, // Nome do cliente para exibição fácil
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }, // ID para referência técnica
    dataHora: { 
        type: Date, 
        required: true 
    },
    tipo: { 
        type: String, 
        required: true,
        enum: ["Consulta Farmacêutica", "Retirada de Medicamentos", "Aplicação de Injetáveis", "Outro"]
    },
    observacao: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ["Pendente", "Confirmado", "Concluído", "Cancelado"],
        default: "Pendente"
    },
    criadoEm: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("atendimento", atendimentoSchema);