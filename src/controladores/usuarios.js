const bcrypt = require('bcrypt');
const knex = require('../bancodedados/conexao');
const cadastroUsuarioSquema = require('../validacoes/cadastroUsuarioSquema');

async function cadastrarUsuario(req, res){
    const { nome, email, senha, restaurante} = req.body;
    
    try {
        await cadastroUsuarioSquema.validate(req.body);

        const emailEncontrado = await knex('usuario').where({ email }).first();

        if (emailEncontrado) {
            return res.status(400).json('Já existe usuário cadastrado com esse email');
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuario').insert({ nome, email, senha: senhaCriptografada});

        if (!usuario) {
            return res.status(400).json('Não foi possível cadastrar o usuário');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.');
   
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    cadastrarUsuario,
    
}