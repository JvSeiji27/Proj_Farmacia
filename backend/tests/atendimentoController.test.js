const atendimentoController = require('../controllers/atendimentoController'); 
const atendimentoModel = require('../model/atendimentoModel');

// Mock do Model do Mongoose
jest.mock('../model/atendimentoModel');

// Helpers
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, query = {}, params = {}) => ({
  body,
  query,
  params
});

describe('Atendimento Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. TESTES DE CRIAR (CREATE) ---
  describe('criarAtendimento', () => {
    it('Deve criar atendimento com sucesso (201)', async () => {
      const body = {
        usuarioNome: 'Maria',
        usuarioId: '123',
        dataHora: '2023-10-10',
        tipo: 'Consulta',
        observacao: 'Dor de cabeça'
      };
      
      atendimentoModel.create.mockResolvedValue({ _id: 'abc', ...body });

      const req = mockRequest(body);
      const res = mockResponse();

      await atendimentoController.criarAtendimento(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ usuarioNome: 'Maria' }));
    });

    it('Deve retornar 400 se faltar Data ou Tipo', async () => {
      // Cenário: Tem usuário, mas falta data
      const body = { usuarioNome: 'Maria', usuarioId: '123', tipo: 'Consulta' }; // Sem dataHora
      
      const req = mockRequest(body);
      const res = mockResponse();

      await atendimentoController.criarAtendimento(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Preencha data e tipo." });
      expect(atendimentoModel.create).not.toHaveBeenCalled(); 
    });

    it('Deve retornar 400 se faltar Usuário ou ID', async () => {
      // Cenário: Tem data e tipo, mas falta usuarioId
      const body = { usuarioNome: 'Maria', dataHora: '2023', tipo: 'Consulta' }; 
      
      const req = mockRequest(body);
      const res = mockResponse();

      await atendimentoController.criarAtendimento(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: expect.stringContaining("Usuário não identificado") 
      }));
    });

    it('Deve retornar 500 caso o banco falhe', async () => {
      // MELHORIA: Testando o catch do controller
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Silencia o console.error
      
      atendimentoModel.create.mockRejectedValue(new Error('Erro de conexão'));

      const req = mockRequest({ usuarioNome: 'A', usuarioId: '1', dataHora: 'D', tipo: 'T' });
      const res = mockResponse();

      await atendimentoController.criarAtendimento(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Erro ao criar agendamento" }));
      
      spy.mockRestore(); // Restaura o console
    });
  });

  // --- 2. TESTES DE LISTAR (FIND + SORT) ---
  describe('listarAtendimentos', () => {
    it('Deve listar todos os atendimentos ordenados', async () => {
      const listaMock = [{ id: 1, tipo: 'Consulta' }];
      
      // Mock encadeado para .find().sort()
      atendimentoModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(listaMock)
      });

      const req = mockRequest({}, { userId: null });
      const res = mockResponse();

      await atendimentoController.listarAtendimentos(req, res);

      expect(atendimentoModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(listaMock);
    });

    it('Deve filtrar por userId quando passado na query', async () => {
      const listaMock = [{ id: 2, usuarioId: '555' }];
      
      atendimentoModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(listaMock)
      });

      const req = mockRequest({}, { userId: '555' });
      const res = mockResponse();

      await atendimentoController.listarAtendimentos(req, res);

      expect(atendimentoModel.find).toHaveBeenCalledWith({ usuarioId: '555' });
      expect(res.json).toHaveBeenCalledWith(listaMock);
    });

    it('Deve retornar 500 em caso de erro no banco', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Simula erro na cadeia find().sort()
      atendimentoModel.find.mockImplementation(() => {
        throw new Error("Erro DB");
      });

      const req = mockRequest();
      const res = mockResponse();

      await atendimentoController.listarAtendimentos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      
      spy.mockRestore();
    });
  });

  // --- 3. TESTES DE ATUALIZAR STATUS (UPDATE) ---
  describe('atualizarStatus', () => {
    it('Deve atualizar status com sucesso', async () => {
      const updatedMock = { id: 'abc', status: 'Concluído' };
      
      atendimentoModel.findByIdAndUpdate.mockResolvedValue(updatedMock);

      const req = mockRequest({ status: 'Concluído' }, {}, { id: 'abc' });
      const res = mockResponse();

      await atendimentoController.atualizarStatus(req, res);

      expect(atendimentoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc', 
        { status: 'Concluído' }, 
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(updatedMock);
    });

    it('Deve retornar 404 se o atendimento não existir', async () => {
      atendimentoModel.findByIdAndUpdate.mockResolvedValue(null);

      const req = mockRequest({ status: 'Concluído' }, {}, { id: 'id-inexistente' });
      const res = mockResponse();

      await atendimentoController.atualizarStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Deve retornar 500 caso o banco falhe na atualização', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        atendimentoModel.findByIdAndUpdate.mockRejectedValue(new Error('Falha update'));
  
        const req = mockRequest({ status: 'X' }, {}, { id: 'abc' });
        const res = mockResponse();
  
        await atendimentoController.atualizarStatus(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        
        spy.mockRestore();
      });
  });

});