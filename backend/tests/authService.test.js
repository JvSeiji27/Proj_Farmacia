const authService = require('../service/auth.service'); // Ajuste o nome do arquivo se for diferente
const userModel = require('../model/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mockamos as dependências externas
jest.mock('../model/usuarioModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve realizar login com sucesso e retornar token', async () => {
        // ARRANGE
        const mockUser = { 
            id: '123', 
            email: 'teste@teste.com', 
            password: 'hash-da-senha', 
            role: 'USER' 
        };
        
        // 1. O banco encontra o usuário
        userModel.findOne.mockResolvedValue(mockUser);
        // 2. O bcrypt diz que a senha bate
        bcrypt.compare.mockResolvedValue(true);
        // 3. O jwt gera um token
        jwt.sign.mockReturnValue('token-falso-123');

        // ACT
        const result = await authService.loginService('teste@teste.com', '123456');

        // ASSERT
        expect(result).toHaveProperty('token', 'token-falso-123');
        expect(result.user).toEqual(mockUser);
        
        // Verificamos se as funções foram chamadas corretamente
        expect(userModel.findOne).toHaveBeenCalledWith({ email: 'teste@teste.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hash-da-senha');
        expect(jwt.sign).toHaveBeenCalled();
    });

    it('Deve lançar erro se usuário não for encontrado', async () => {
        // O banco retorna null
        userModel.findOne.mockResolvedValue(null);

        // ACT & ASSERT
        // Quando testamos função que lança erro, usamos essa sintaxe com o reject
        await expect(authService.loginService('errado@teste.com', '123'))
            .rejects
            .toThrow('Usuario nao encontrado');
            
        expect(bcrypt.compare).not.toHaveBeenCalled(); // Não deve nem tentar comparar senha
    });

    it('Deve lançar erro se a senha estiver incorreta', async () => {
        const mockUser = { password: 'hash-correto' };
        
        userModel.findOne.mockResolvedValue(mockUser);
        // O bcrypt diz que a senha NÃO bate
        bcrypt.compare.mockResolvedValue(false);

        await expect(authService.loginService('teste@teste.com', 'senha-errada'))
            .rejects
            .toThrow('Senha incorreta '); // Atenção ao espaço no final que está no seu código original
    });

});