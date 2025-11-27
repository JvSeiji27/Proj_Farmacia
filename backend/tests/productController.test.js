const productController = require('../controllers/productController');
const productService = require('../service/productService');
const mongoose = require('mongoose');

// Mock do Service
jest.mock('../service/productService');

// Helpers
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query
});

describe('Product Controller - Cobertura Total', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. FIND ALL ---
  describe('findAllProductsController', () => {
    it('Deve retornar 200 e a lista de produtos', async () => {
      const mockList = [{ nome: 'A' }];
      productService.findAllProductsService.mockResolvedValue(mockList);
      const req = mockRequest();
      const res = mockResponse();

      await productController.findAllProductsController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockList);
    });

    it('Deve retornar 404 se a lista for vazia', async () => {
      productService.findAllProductsService.mockResolvedValue([]);
      const req = mockRequest();
      const res = mockResponse();

      await productController.findAllProductsController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Nenhum produto encontrado." });
    });

    it('Deve retornar 404 se for nulo', async () => {
      productService.findAllProductsService.mockResolvedValue(null);
      const req = mockRequest();
      const res = mockResponse();

      await productController.findAllProductsController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 500 em caso de erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      productService.findAllProductsService.mockRejectedValue(new Error('Erro DB'));
      const req = mockRequest();
      const res = mockResponse();

      await productController.findAllProductsController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 2. FIND BY ID ---
  describe('findProductByIdController', () => {
    it('Deve retornar 400 se ID for inválido', async () => {
      const req = mockRequest({}, { id: 'invalid-id' });
      const res = mockResponse();
      await productController.findProductByIdController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "ID inválido." });
    });

    it('Deve retornar 404 se produto não encontrado', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      productService.findProductByIdService.mockResolvedValue(null);
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await productController.findProductByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 200 e o produto', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      const mockProd = { nome: 'Teste' };
      productService.findProductByIdService.mockResolvedValue(mockProd);
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await productController.findProductByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockProd);
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const validId = new mongoose.Types.ObjectId().toString();
      productService.findProductByIdService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await productController.findProductByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 3. CREATE ---
  describe('createProductController', () => {
    it('Deve retornar 400 se faltar nome ou preço', async () => {
      const req = mockRequest({ nome: '' }); // Sem preço
      const res = mockResponse();
      await productController.createProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Nome e preço são obrigatórios." });
    });

    it('Deve criar produto com sucesso (201) e processar dados', async () => {
      const body = {
        nome: '  Teste  ',
        preco: '10.50',
        quantidadeEmEstoque: '5',
        alertaMinimo: '2'
      };
      
      const createdMock = { ...body, id: 1 };
      productService.createProductService.mockResolvedValue(createdMock);

      const req = mockRequest(body);
      const res = mockResponse();

      await productController.createProductController(req, res);

      // Verifica se o controller chamou o service convertendo os tipos (String -> Number, Trim)
      expect(productService.createProductService).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Teste', // Trim
        preco: 10.5,   // Number
        quantidadeEmEstoque: 5 // Number
      }));

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ product: createdMock }));
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      productService.createProductService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest({ nome: 'A', preco: 1 });
      const res = mockResponse();

      await productController.createProductController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 4. UPDATE ---
  describe('updateProductController', () => {
    it('Deve retornar 400 ID inválido', async () => {
      const req = mockRequest({}, { id: 'bad-id' });
      const res = mockResponse();
      await productController.updateProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar 404 se não encontrar para atualizar', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      productService.updateProductService.mockResolvedValue(null);
      const req = mockRequest({ nome: 'Novo' }, { id: validId });
      const res = mockResponse();

      await productController.updateProductController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 200 se atualizar', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      const mockUpdated = { nome: 'Novo' };
      productService.updateProductService.mockResolvedValue(mockUpdated);
      const req = mockRequest({ nome: 'Novo' }, { id: validId });
      const res = mockResponse();

      await productController.updateProductController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ product: mockUpdated }));
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const validId = new mongoose.Types.ObjectId().toString();
      productService.updateProductService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await productController.updateProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 5. DELETE ---
  describe('deleteProductController', () => {
    it('Deve retornar 400 ID inválido', async () => {
      const req = mockRequest({}, { id: 'bad' });
      const res = mockResponse();
      await productController.deleteProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar 404 se produto não existir', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      productService.deleteProductByIdService.mockResolvedValue(null);
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();
      await productController.deleteProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 200 se deletar', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      productService.deleteProductByIdService.mockResolvedValue({ ok: 1 });
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();
      await productController.deleteProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const validId = new mongoose.Types.ObjectId().toString();
      productService.deleteProductByIdService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest({}, { id: validId });
      const res = mockResponse();
      await productController.deleteProductController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 6. ENTRADA ---
  describe('entradaProdutoController', () => {
    it('Deve retornar 404 se produto não encontrado', async () => {
      productService.findProductByIdService.mockResolvedValue(null);
      const req = mockRequest({ quantidade: 1 }, { id: '123' });
      const res = mockResponse();
      await productController.entradaProdutoController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve realizar entrada com sucesso (200)', async () => {
      const produtoMock = {
        quantidadeEmEstoque: 10,
        historicoMovimentacao: [],
        save: jest.fn()
      };
      productService.findProductByIdService.mockResolvedValue(produtoMock);

      const req = mockRequest({ quantidade: 5, observacao: 'Compra' }, { id: '123' });
      const res = mockResponse();

      await productController.entradaProdutoController(req, res);

      expect(produtoMock.quantidadeEmEstoque).toBe(15); // 10 + 5
      expect(produtoMock.historicoMovimentacao).toHaveLength(1);
      expect(produtoMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      productService.findProductByIdService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();
      await productController.entradaProdutoController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 7. SAIDA ---
  describe('saidaProdutoController', () => {
    it('Deve retornar 404 se não encontrado', async () => {
      productService.findProductByIdService.mockResolvedValue(null);
      const req = mockRequest({ quantidade: 1 }, { id: '123' });
      const res = mockResponse();
      await productController.saidaProdutoController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 400 se estoque insuficiente', async () => {
      const produtoMock = { quantidadeEmEstoque: 2 };
      productService.findProductByIdService.mockResolvedValue(produtoMock);
      const req = mockRequest({ quantidade: 5 }, { id: '123' }); // Quer 5, tem 2
      const res = mockResponse();

      await productController.saidaProdutoController(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: "Estoque insuficiente" }));
    });

    it('Deve realizar saída com sucesso (200)', async () => {
      const produtoMock = {
        quantidadeEmEstoque: 10,
        historicoMovimentacao: [],
        save: jest.fn()
      };
      productService.findProductByIdService.mockResolvedValue(produtoMock);

      const req = mockRequest({ quantidade: 3 }, { id: '123' });
      const res = mockResponse();

      await productController.saidaProdutoController(req, res);

      expect(produtoMock.quantidadeEmEstoque).toBe(7); // 10 - 3
      expect(produtoMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      productService.findProductByIdService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();
      await productController.saidaProdutoController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 8. CRITICAL STORAGE ---
  describe('controlCriticalStorageController', () => {
    it('Deve retornar 200 e lista', async () => {
      productService.findCriticalStorageService.mockResolvedValue([{ nome: 'X' }]);
      const req = mockRequest();
      const res = mockResponse();
      await productController.controlCriticalStorageController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar 404 se vazio', async () => {
      productService.findCriticalStorageService.mockResolvedValue([]);
      const req = mockRequest();
      const res = mockResponse();
      await productController.controlCriticalStorageController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      productService.findCriticalStorageService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest();
      const res = mockResponse();
      await productController.controlCriticalStorageController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

  // --- 9. CRITICAL EXPIRATION ---
  describe('controlCriticalExpirationDateController', () => {
    it('Deve retornar 200 e lista', async () => {
      productService.findCriticalExpirationDateService.mockResolvedValue([{ nome: 'X' }]);
      const req = mockRequest();
      const res = mockResponse();
      await productController.controlCriticalExpirationDateController(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Deve retornar 404 se vazio', async () => {
      productService.findCriticalExpirationDateService.mockResolvedValue([]);
      const req = mockRequest();
      const res = mockResponse();
      await productController.controlCriticalExpirationDateController(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 500 em erro', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      productService.findCriticalExpirationDateService.mockRejectedValue(new Error('Erro'));
      const req = mockRequest();
      const res = mockResponse();
      await productController.controlCriticalExpirationDateController(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      spy.mockRestore();
    });
  });

});