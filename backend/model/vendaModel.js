const mongoose = require("mongoose");

const vendaSchema = new mongoose.Schema({
    usuario: { type: String, required: true }, // Nome do usuário
    usuarioId: { type: String }, // ID para referência (pode ser String ou ObjectId)
    roleUsuario: { type: String }, // ADMIN ou USER
    itens: [
        {
            produtoId: { type: mongoose.Schema.Types.ObjectId, ref: "produto" },
            nome: String,
            quantidade: Number,
            precoUnitario: Number,
            subtotal: Number
        }
    ],
    total: { type: Number, required: true },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model("venda", vendaSchema);