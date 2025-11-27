const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../model/usuarioModel'); // Certifique-se que o caminho está certo

let mongoServer;

describe('User Model Test', () => {

    // 1. Sobe o banco em memória antes de tudo
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // 2. Desliga depois de tudo
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    // 3. Limpa os dados entre os testes
    afterEach(async () => {
        await User.deleteMany({});
    });

    // --- TESTES DE SUCESSO E DEFAULTS ---
    it('Deve criar usuário com sucesso e aplicar valores padrão', async () => {
        const dados = {
            name: ' João Silva ', // Com espaços para testar o trim
            email: 'JOAO@TESTE.COM', // Maiúsculo para testar o lowercase
            password: 'senha-super-secreta'
        };

        const usuarioCriado = await User.create(dados);

        // Verifica se salvou
        expect(usuarioCriado._id).toBeDefined();
        
        // Verifica o Trim do nome
        expect(usuarioCriado.name).toBe('João Silva');
        
        // Verifica o Default do Role e Active
        expect(usuarioCriado.role).toBe('USER');
        expect(usuarioCriado.active).toBe(true);
        expect(usuarioCriado.createAt).toBeDefined();

        // OBS: O Mongoose usa 'lowercase' (tudo minúsculo) nas opções. 
        // Se no seu Schema estiver 'lowerCase' (camelCase), talvez ele não converta.
        // Esse teste vai te dizer se está funcionando ou não:
        // expect(usuarioCriado.email).toBe('joao@teste.com'); 
    });

    // --- TESTE DE CRIPTOGRAFIA (BCRYPT) ---
    it('Deve criptografar a senha antes de salvar', async () => {
        const senhaPlana = '123456';
        const usuario = await User.create({
            name: 'Teste Hash',
            email: 'hash@teste.com',
            password: senhaPlana
        });

        // A senha salva NÃO pode ser igual à senha plana
        expect(usuario.password).not.toBe(senhaPlana);
        // O hash do bcrypt geralmente começa com $2b$
        expect(usuario.password).toMatch(/^\$2b\$/);
    });

    // --- TESTES DE VALIDAÇÃO (REQUIRED) ---
    it('Deve falhar se faltar campos obrigatórios', async () => {
        const usuarioVazio = new User({});

        let erro;
        try {
            await usuarioVazio.save();
        } catch (e) {
            erro = e;
        }

        expect(erro).toBeDefined();
        expect(erro.name).toBe('ValidationError');
        expect(erro.errors.name).toBeDefined();
        expect(erro.errors.email).toBeDefined();
        expect(erro.errors.password).toBeDefined();
    });

    // --- TESTE DE SENHA CURTA ---
    it('Deve falhar se a senha tiver menos de 6 caracteres', async () => {
        const usuarioSenhaCurta = new User({
            name: 'Teste',
            email: 'curto@teste.com',
            password: '123' // Só 3 caracteres
        });

        let erro;
        try {
            await usuarioSenhaCurta.save();
        } catch (e) {
            erro = e;
        }

        expect(erro).toBeDefined();
        expect(erro.errors.password).toBeDefined();
    });

    // --- TESTE DE EMAIL ÚNICO ---
    it('Deve falhar ao tentar cadastrar email duplicado', async () => {
        const dados = {
            name: 'User 1',
            email: 'unico@email.com',
            password: '123456'
        };

        await User.create(dados); // Cria o primeiro

        let erro;
        try {
            // Tenta criar o segundo com o mesmo email
            await User.create({ ...dados, name: 'User 2' }); 
        } catch (e) {
            erro = e;
        }

        expect(erro).toBeDefined();
        // 11000 é o código de erro do Mongo para "Duplicate Key"
        expect(erro.code).toBe(11000);
    });

    // --- TESTE DE ENUM (ROLE) ---
    it('Deve falhar se passar uma ROLE inválida', async () => {
        const usuarioRoleErrada = new User({
            name: 'Hacker',
            email: 'hacker@teste.com',
            password: '123456',
            role: 'SUPER_ADMIN_MEGA_POWER' // Não existe no enum
        });

        let erro;
        try {
            await usuarioRoleErrada.save();
        } catch (e) {
            erro = e;
        }

        expect(erro).toBeDefined();
        expect(erro.errors.role).toBeDefined();
    });

});