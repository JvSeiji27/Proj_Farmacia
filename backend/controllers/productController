const productService = require("../service/productService");
const mongoose = require("mongoose");

// GET -> Busca todos os produtos
const findAllProductsController = async (req, res) => {
  try {
    const products = await productService.findAllProductsService();
    if (!products || products.length === 0) {
      return res.status(404).send({ message: "Nenhum produto encontrado." });
    }
    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao buscar produtos.", error: error.message || error });
  }
};

// GET -> Buscar produto por ID
const findProductByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "ID inválido." });
    }

    const product = await productService.findProductByIdService(id);
    if (!product) return res.status(404).send({ message: "Produto não encontrado." });

    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao buscar produto.", error });
  }
};

// POST -> Criar novo produto (corrigido)
const createProductController = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      fabricante,
      preco,
      dosagem,
      formaFarmaceutica,
      quantidadeEmEstoque,
      validade,
      codigoBarras,
      controlado,
      ativo,
      alertaMinimo
    } = req.body;

    if (!nome || preco == null) {
      return res.status(400).send({ message: "Nome e preço são obrigatórios." });
    }

    const created = await productService.createProductService({
      nome: nome.trim(),
      descricao,
      fabricante,
      preco: Number(preco),
      dosagem,
      formaFarmaceutica,
      quantidadeEmEstoque: Number(quantidadeEmEstoque) || 0,
      validade: validade || null,
      codigoBarras,
      controlado: controlado ?? false,
      ativo: ativo ?? true,
      alertaMinimo: Number(alertaMinimo) || 5
    });

    return res.status(201).send({
      message: "Produto criado com sucesso!",
      product: created
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao criar produto.", error });
  }
};

// PUT -> Atualizar produto
const updateProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "ID inválido." });
    }

    const updated = await productService.updateProductService(id, body);
    if (!updated) return res.status(404).send({ message: "Produto não encontrado." });

    return res.status(200).send({
      message: "Produto atualizado com sucesso!",
      product: updated
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao atualizar produto.", error });
  }
};

// DELETE -> Remover produto
const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "ID inválido." });
    }

    const deleted = await productService.deleteProductByIdService(id);
    if (!deleted) return res.status(404).send({ message: "Produto não encontrado." });

    return res.status(200).send({ message: "Produto removido com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao deletar produto.", error });
  }
};

// POST -> Registrar entrada
const entradaProdutoController = async (req, res) => {
  try {
    const { quantidade, observacao } = req.body;
    const produto = await productService.findProductByIdService(req.params.id);

    if (!produto) return res.status(404).send({ message: "Produto não encontrado" });

    produto.quantidadeEmEstoque += Number(quantidade);
    produto.historicoMovimentacao.push({
      tipo: "entrada",
      quantidade: Number(quantidade),
      observacao: observacao || "",
      data: new Date()
    });

    await produto.save();
    return res.status(200).send({ message: "Entrada registrada", produto });
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ message: "Erro ao registrar entrada", erro });
  }
};

// POST -> Registrar saída
const saidaProdutoController = async (req, res) => {
  try {
    const { quantidade, observacao } = req.body;
    const produto = await productService.findProductByIdService(req.params.id);

    if (!produto) return res.status(404).send({ message: "Produto não encontrado" });
    if (produto.quantidadeEmEstoque < quantidade) {
      return res.status(400).send({ message: "Estoque insuficiente" });
    }

    produto.quantidadeEmEstoque -= Number(quantidade);
    produto.historicoMovimentacao.push({
      tipo: "saida",
      quantidade: Number(quantidade),
      observacao: observacao || "",
      data: new Date()
    });

    await produto.save();
    return res.status(200).send({ message: "Saída registrada", produto });
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ message: "Erro ao registrar saída", erro });
  }
};

// GET -> Produtos em estoque crítico
const controlCriticalStorageController = async (req, res) => {
  try {
    const produtos = await productService.findCriticalStorageService();
    if (!produtos || produtos.length === 0) {
      return res.status(404).send({ message: "Nenhum produto em estado crítico." });
    }
    return res.status(200).send(produtos);
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ message: "Erro ao buscar produtos com estoque baixo", erro });
  }
};

// GET -> Produtos com validade próxima
const controlCriticalExpirationDateController = async (req, res) => {
  try {
    const produtos = await productService.findCriticalExpirationDateService();
    if (!produtos || produtos.length === 0) {
      return res.status(404).send({ message: "Nenhum produto com validade crítica." });
    }
    return res.status(200).send(produtos);
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ message: "Erro ao buscar produtos com validade próxima", erro });
  }
};

module.exports = {
  findAllProductsController,
  findProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
  entradaProdutoController,
  saidaProdutoController,
  controlCriticalStorageController,
  controlCriticalExpirationDateController
};
