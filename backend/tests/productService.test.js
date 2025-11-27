const productService = require('../service/productService');
const productModel = require('../model/produtoModel');

jest.mock('../model/produtoModel');

describe('Product Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- CRUD BÁSICO ---
    
    it('findAllProductsService: Deve chamar productModel.find()', async () => {
        const mockList = [{ nome: 'A' }];
        productModel.find.mockResolvedValue(mockList);

        const result = await productService.findAllProductsService();

        expect(productModel.find).toHaveBeenCalled();
        expect(result).toEqual(mockList);
    });

    it('findProductByIdService: Deve chamar findById com o ID correto', async () => {
        const mockProd = { nome: 'A' };
        productModel.findById.mockResolvedValue(mockProd);

        const result = await productService.findProductByIdService('123');

        expect(productModel.findById).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockProd);
    });

    it('createProductService: Deve chamar create com o body', async () => {
        const body = { nome: 'Novo' };
        productModel.create.mockResolvedValue(body);

        await productService.createProductService(body);

        expect(productModel.create).toHaveBeenCalledWith(body);
    });

    it('updateProductService: Deve chamar findByIdAndUpdate com new: true', async () => {
        const id = '123';
        const body = { nome: 'Atualizado' };
        
        await productService.updateProductService(id, body);

        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(id, body, { new: true });
    });

    it('deleteProductByIdService: Deve chamar findByIdAndDelete', async () => {
        await productService.deleteProductByIdService('123');
        expect(productModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    // --- REGRAS ESPECÍFICAS ---

    it('findCriticalStorageService: Deve buscar produtos onde estoque <= alertaMinimo', async () => {
        await productService.findCriticalStorageService();

        // Verificamos se a query complexa do mongo foi passada corretamente
        expect(productModel.find).toHaveBeenCalledWith({
            $expr: { $lte: ["$quantidadeEmEstoque", "$alertaMinimo"] }
        });
    });

    it('findCriticalExpirationDateService: Deve buscar validade entre hoje e 7 dias', async () => {
        await productService.findCriticalExpirationDateService();

        // Aqui capturamos o argumento passado para o .find()
        // productModel.find.mock.calls[0][0] pega o primeiro argumento da primeira chamada
        const queryPassada = productModel.find.mock.calls[0][0];

        expect(queryPassada).toHaveProperty('validade');
        expect(queryPassada.validade).toHaveProperty('$gte'); // Maior ou igual a hoje
        expect(queryPassada.validade).toHaveProperty('$lte'); // Menor ou igual ao limite
        
        // Verifica se as datas são objetos Date
        expect(queryPassada.validade.$gte).toBeInstanceOf(Date);
        expect(queryPassada.validade.$lte).toBeInstanceOf(Date);
    });

});