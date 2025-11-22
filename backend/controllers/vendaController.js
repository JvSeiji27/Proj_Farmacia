const vendaModel = require("../model/vendaModel");
const productModel = require("../model/produtoModel"); // Certifique-se que o arquivo é produtoModel.js

// Registrar Venda
exports.registrarVenda = async (req, res) => {
    try {
        const { itens, usuarioNome, usuarioId, role } = req.body;
        
        if (!itens || itens.length === 0) {
            return res.status(400).json({ message: "O carrinho está vazio." });
        }

        let totalVenda = 0;
        const itensFinais = [];

        for (const item of itens) {
            // Busca o produto pelo ID
            const produto = await productModel.findById(item.produtoId);
            
            if (!produto) {
                return res.status(400).json({ message: `Produto não encontrado (ID: ${item.produtoId})` });
            }

            if (produto.quantidadeEmEstoque < item.quantidade) {
                return res.status(400).json({ message: `Estoque insuficiente para: ${produto.nome}. Restam: ${produto.quantidadeEmEstoque}` });
            }

            // Atualiza Estoque
            produto.quantidadeEmEstoque -= item.quantidade;
            
            // Adiciona ao histórico do produto (se existir o array)
            if (!produto.historicoMovimentacao) produto.historicoMovimentacao = [];
            produto.historicoMovimentacao.push({
                tipo: "saida",
                quantidade: item.quantidade,
                observacao: `Venda para ${usuarioNome}`
            });

            await produto.save();

            const subtotal = produto.preco * item.quantidade;
            totalVenda += subtotal;

            itensFinais.push({
                produtoId: produto._id,
                nome: produto.nome,
                quantidade: item.quantidade,
                precoUnitario: produto.preco,
                subtotal: subtotal
            });
        }

        const novaVenda = await vendaModel.create({
            usuario: usuarioNome,
            usuarioId: usuarioId, 
            roleUsuario: role,
            itens: itensFinais,
            total: totalVenda
        });

        res.status(201).json(novaVenda);
    } catch (error) {
        console.error("Erro ao processar venda:", error);
        res.status(500).json({ message: "Erro interno ao processar venda", error: error.message });
    }
};

// Relatório
exports.listarVendas = async (req, res) => {
    try {
        const vendas = await vendaModel.find().sort({ data: -1 });
        res.json(vendas);
    } catch (error) {
        console.error("Erro ao listar vendas:", error);
        res.status(500).json({ message: "Erro ao buscar vendas" });
    }
};