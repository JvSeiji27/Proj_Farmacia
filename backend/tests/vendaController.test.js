const vendaController = require('../controllers/vendaController');
const vendaModel = require('../model/vendaModel');
const productModel = require('../model/produtoModel');

// Mockamos os DOIS models
jest.mock('../model/vendaModel');
jest.mock('../model/produtoModel');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}) => ({ body });

describe('Venda Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. TESTES DE REGISTRAR VENDA ---
  describe('registrarVenda', () => {

    it('Deve retornar 400 se o carrinho estiver vazio', async () => {
      const req = mockRequest({ itens: [] });
      const res = mockResponse();

      await vendaController.registrarVenda(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "O carrinho está vazio." });
    });

    it('Deve retornar 400 se um produto não for encontrado', async () => {
      productModel.findById.mockResolvedValue(null);

      const req = mockRequest({
        itens: [{ produtoId: 'id-inexistente', quantidade: 1 }]
      });
      const res = mockResponse();

      await vendaController.registrarVenda(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: expect.stringContaining("Produto não encontrado") 
      }));
    });

    it('Deve retornar 400 se o estoque for insuficiente', async () => {
      const produtoMock = { 
        _id: 'prod-1', 
        nome: 'Remédio X', 
        quantidadeEmEstoque: 5 
      };
      productModel.findById.mockResolvedValue(produtoMock);

      const req = mockRequest({
        itens: [{ produtoId: 'prod-1', quantidade: 10 }]
      });
      const res = mockResponse();

      await vendaController.registrarVenda(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: expect.stringContaining("Estoque insuficiente") 
      }));
    });

    it('Deve registrar venda com sucesso, baixar estoque e calcular total', async () => {
      // ARRANGE
      const produtoMock = {
        _id: 'prod-abc',
        nome: 'Vitamina C',
        preco: 10,
        quantidadeEmEstoque: 100,
        historicoMovimentacao: [],
        save: jest.fn() 
      };

      productModel.findById.mockResolvedValue(produtoMock);

      const vendaCriadaMock = { _id: 'venda-1', total: 20 };
      vendaModel.create.mockResolvedValue(vendaCriadaMock);

      const req = mockRequest({
        usuarioNome: 'João',
        usuarioId: 'user-1',
        role: 'admin',
        itens: [{ produtoId: 'prod-abc', quantidade: 2 }]
      });
      const res = mockResponse();

      // ACT
      await vendaController.registrarVenda(req, res);

      // ASSERT
      expect(produtoMock.quantidadeEmEstoque).toBe(98);
      expect(produtoMock.save).toHaveBeenCalled();

      // Ajustado para esperar 'usuario' em vez de 'usuarioNome'
      expect(vendaModel.create).toHaveBeenCalledWith(expect.objectContaining({
        total: 20,
        usuario: 'João' 
      }));

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(vendaCriadaMock);
    });

    it('Deve tratar erros internos (500)', async () => {
      // SILENCIADOR DE CONSOLE: Impede que o erro apareça vermelho no terminal
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      productModel.findById.mockRejectedValue(new Error("Erro no banco"));

      const req = mockRequest({ itens: [{ produtoId: '1', quantidade: 1 }] });
      const res = mockResponse();

      await vendaController.registrarVenda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      // Restaura o console normal
      spy.mockRestore();
    });
  });

  // --- 2. TESTES DE LISTAR VENDAS ---
  describe('listarVendas', () => {
    it('Deve listar vendas ordenadas por data', async () => {
      const listaVendas = [{ id: 1, total: 50 }];

      vendaModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(listaVendas)
      });

      const req = mockRequest();
      const res = mockResponse();

      await vendaController.listarVendas(req, res);

      expect(vendaModel.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(listaVendas);
    });
  });

});