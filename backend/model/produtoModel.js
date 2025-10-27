const mongoose = require("mongoose")

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true //remove espaços em branco antes ao final da string antes de salvar no mongo
    },
    descricao: {
        type: String
    },
    fabricante: {
        type: String
    },
    preco: {
        type: Number,
        required: true,
        min: 0 //só valores acima ou igual a zero serão tolerados
    },  
    dosagem: {
        type: String
    },
    formaFarmaceutica: {
        type: String,
        enum: ["Comprimido", "Cápsula", "Xarope", "Pomada", "Injetável", "Outro"], //so valores enum serão tolerados
        default: "Outro"
    },
    quantidadeEmEstoque: {
        type: Number,
        default: 0,
        min: 0
    },
    validade: {
        type: Date
    },
    codigoBarras: { //estou permitindo que a maioria nao tenha codigo de barras, mas deve ser único
        type: String,
        unique: true,
        sparse: true
    },
    controlado: {
        type: Boolean,
        default: false
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    ativo: {
        type: Boolean,
        default: true
    },//para controle de estoque, saidas, entradas e validade
    alertaMinimo: {
        type: Number,
        default: 5
    },
    historicoMovimentacao: [
        {
            tipo: {type: String, enum:["entrada","saida"], required: true},
            quantidade: {type: Number, required: true},
            data: {type: Date, default: Date.now},
            observacao: {type: String}
        }
    ]
})

const productModel = mongoose.model("produto", produtoSchema);
module.exports = productModel