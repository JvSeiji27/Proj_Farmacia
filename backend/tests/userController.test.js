const userController = require('../controllers/userController');
const userService = require('../service/userService');

// 1. Mockamos o Service para não bater no banco de dados real
jest.mock('../service/userService');

// Helpers para simular req e res (iguais ao anterior)
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}) => ({
  body,
  params
});

describe('User Controller', () => {

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- TESTES DE BUSCAR TODOS ---
  describe('findAllUsersController', () => {
    it('Deve retornar lista de usuários e status 200', async () => {
      // ARRANGE
      const usersMock = [{ name: 'João', email: 'joao@email.com' }];
      userService.findAllUsersService.mockResolvedValue(usersMock);

      const req = mockRequest();
      const res = mockResponse();

      // ACT
      await userController.findAllUsersController(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(usersMock);
    });

    it('Deve retornar 404 se não houver usuários', async () => {
      userService.findAllUsersService.mockResolvedValue([]); // Array vazio

      const req = mockRequest();
      const res = mockResponse();

      await userController.findAllUsersController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Nenhum usuário foi encontado" });
    });
  });

  // --- TESTES DE BUSCAR POR ID ---
  describe('findUserByIdController', () => {
    it('Deve retornar 400 se o ID for inválido', async () => {
      const req = mockRequest({}, { id: 'id-invalido-123' });
      const res = mockResponse();

      await userController.findUserByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "O id não está no formato ideal" });
    });

    it('Deve retornar 404 se o usuário não for encontrado', async () => {
      // ID válido (formato hex), mas service retorna null
      const validId = '507f1f77bcf86cd799439011';
      userService.findUserByIdService.mockResolvedValue(null);

      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await userController.findUserByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Nenhum usuário foi encontado" });
    });

    it('Deve retornar 200 e o usuário se encontrado', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const userMock = { id: validId, name: 'Maria' };
      userService.findUserByIdService.mockResolvedValue(userMock);

      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await userController.findUserByIdController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(userMock);
    });
  });

  // --- TESTES DE CRIAÇÃO (CREATE) ---
  describe('createUserController', () => {
    it('Deve criar usuário com sucesso (201)', async () => {
      const body = { name: 'José', email: 'jose@teste.com', password: '123' };
      const userCreated = { ...body, id: 'abc-123' };
      
      userService.createUserService.mockResolvedValue(userCreated);

      const req = mockRequest(body);
      const res = mockResponse();

      await userController.createUserController(req, res);

      expect(userService.createUserService).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(userCreated);
    });

    it('Deve retornar 400 se faltar campos obrigatórios', async () => {
      // Faltando password
      const body = { name: 'José', email: 'jose@teste.com' }; 
      const req = mockRequest(body);
      const res = mockResponse();

      await userController.createUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Preencha todos os campos" });
      // Garante que o service NÃO foi chamado
      expect(userService.createUserService).not.toHaveBeenCalled();
    });
  });

  // --- TESTES DE ATUALIZAÇÃO (UPDATE) ---
  describe('updateUserController', () => {
    it('Deve retornar 400 se o ID for inválido', async () => {
      const req = mockRequest({ name: 'A', email: 'b', password: 'c' }, { id: 'invalido' });
      const res = mockResponse();

      await userController.updateUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "O id não está no formato ideal" });
    });

    it('Deve retornar 400 se faltar campos no body', async () => {
      const validId = '507f1f77bcf86cd799439011';
      // Faltando email
      const req = mockRequest({ name: 'Update', password: '123' }, { id: validId });
      const res = mockResponse();

      await userController.updateUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Preencha todos os campos" });
    });

    it('Deve atualizar com sucesso (200)', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const body = { name: 'Novo Nome', email: 'novo@email.com', password: 'newpass' };
      
      // Simulamos o retorno do service
      userService.updateUserService.mockResolvedValue({ id: validId, ...body });

      const req = mockRequest(body, { id: validId });
      const res = mockResponse();

      await userController.updateUserController(req, res);

      expect(userService.updateUserService).toHaveBeenCalledWith(validId, body);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- TESTES DE REMOÇÃO (DELETE) ---
  describe('deleteUserController', () => {
    it('Deve retornar 400 se o ID for inválido', async () => {
      const req = mockRequest({}, { id: 'invalido' });
      const res = mockResponse();

      await userController.deleteUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('Deve deletar com sucesso (200)', async () => {
      const validId = '507f1f77bcf86cd799439011';
      userService.deleteUser.mockResolvedValue({ message: "Usuário deletado" });

      const req = mockRequest({}, { id: validId });
      const res = mockResponse();

      await userController.deleteUserController(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith(validId);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

});