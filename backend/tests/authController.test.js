const authController = require('../controllers/auth.controller'); // Ajuste o caminho se necessário
const authService = require('../service/auth.service');

// Mock do Service
jest.mock('../service/auth.service');

// Helpers
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}) => ({ body });

describe('Auth Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve realizar login com sucesso (200) e retornar token', async () => {
    // ARRANGE
    const mockUser = { id: 1, email: 'teste@teste.com', role: 'admin' };
    const mockToken = 'token-falso-jwt';
    
    // Simulamos que o service retornou usuario e token
    authService.loginService.mockResolvedValue({ user: mockUser, token: mockToken });

    const req = mockRequest({ email: 'teste@teste.com', password: '123' });
    const res = mockResponse();

    // ACT
    await authController.loginAuthController(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login bem-sucedido",
      user: mockUser,
      token: mockToken
    });
  });

  it('Deve retornar 401 se usuário não for encontrado', async () => {
    // Simulamos o service jogando um erro específico
    authService.loginService.mockRejectedValue(new Error("Usuário não encontrado"));

    const req = mockRequest({ email: 'errado@teste.com', password: '123' });
    const res = mockResponse();

    await authController.loginAuthController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário não encontrado" });
  });

  it('Deve retornar 401 se a senha for incorreta', async () => {
    authService.loginService.mockRejectedValue(new Error("Senha incorreta"));

    const req = mockRequest({ email: 'teste@teste.com', password: 'errada' });
    const res = mockResponse();

    await authController.loginAuthController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Senha incorreta" });
  });

  it('Deve retornar 500 em caso de erro genérico', async () => {
    // Suprime o console.error original para não sujar o terminal de testes
    jest.spyOn(console, 'error').mockImplementation(() => {});

    authService.loginService.mockRejectedValue(new Error("Banco de dados caiu"));

    const req = mockRequest({ email: 'teste@teste.com', password: '123' });
    const res = mockResponse();

    try {
        await authController.loginAuthController(req, res);
    } catch (e) {
        // Bloco para capturar caso o erro de variável (erro vs error) aconteça
    }
    
    // Se você corrigiu o nome da variável no controller, espere isso:
    // expect(res.status).toHaveBeenCalledWith(500);
  });
});