const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginSquema = require('../validacoes/loginSquema');

async function logarUsuario(req, res) {
    const { email, senha } = req.body;

    try {
        await loginSquema.validate(req.body);

        const usuario = await knex('usuario').where({ email }).first();

        if (!usuario) {
            return res.status(404).json('O usuário não foi encontrado');
        }
        
        const validacaoSenhaBcrypt = await bcrypt.compare(senha, usuario.senha);

        if (!validacaoSenhaBcrypt) {
            return res.status(400).json('Email e senha não confere.');
        }

        const dadosTokenUsuario = {
            id: usuario.id,
            email: usuario.email
        }

        const token = jwt.sign(dadosTokenUsuario, process.env.SENHA_JWT, { expiresIn: '1d' });

        const { senha: senhaUsuario, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    logarUsuario
}