const userService = require('../service/userService');
const userModel = require('../model/usuarioModel');

jest.mock('../model/usuarioModel');

describe('User Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve listar todos os usuários', async () => {
        const mockUsers = [{ name: 'User1' }];
        userModel.find.mockResolvedValue(mockUsers);

        const result = await userService.findAllUsersService();

        expect(userModel.find).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });

    it('Deve buscar usuário por ID', async () => {
        const mockUser = { name: 'User1' };
        userModel.findById.mockResolvedValue(mockUser);

        const result = await userService.findUserByIdService('123');

        expect(userModel.findById).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockUser);
    });

    it('Deve criar um usuário', async () => {
        const dados = { name: 'Novo', email: 'a@a.com' };
        userModel.create.mockResolvedValue(dados);

        const result = await userService.createUserService(dados);

        expect(userModel.create).toHaveBeenCalledWith(dados);
        expect(result).toEqual(dados);
    });

    it('Deve atualizar um usuário', async () => {
        const id = '123';
        const dados = { name: 'Update' };
        
        await userService.updateUserService(id, dados);

        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, dados, { new: true });
    });

    it('Deve deletar um usuário', async () => {
        await userService.deleteUser('123');
        expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

});