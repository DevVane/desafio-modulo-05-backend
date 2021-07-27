const bcrypt = require('bcrypt');
const knex = require('../bancodedados/conexao');
const { usuarioSquema, restauranteSquema } = require('../validacoes/cadastroUsuarioSquema');

async function cadastrarUsuario(req, res){
    const { nome, email, senha} = req.body;
    
    try {
        await usuarioSquema.validate(req.body);
        await restauranteSquema.validate(req.body.restaurante);
        
        const { nome: nomeRestaurante, descricao, idCategoria, taxaEntrega, tempoEntregaEmMinutos, valorMinimoPedido} = req.body.restaurante;

        const emailEncontrado = await knex('usuario').where({ email }).first();

        if (emailEncontrado) {
            return res.status(400).json('Já existe usuário cadastrado com esse email');
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuario').insert({ nome, email, senha: senhaCriptografada}).returning('*');

        if (!usuario) {
            return res.status(400).json('Não foi possível cadastrar o usuário');
        }
        
        const restauranteCadastrado = await knex('restaurante')
            .insert({ 
                usuario_id: usuario[0].id, 
                nome: nomeRestaurante, 
                descricao, 
                categoria_id: idCategoria, 
                taxa_entrega: taxaEntrega, 
                tempo_entrega_minutos: tempoEntregaEmMinutos, 
                valor_minimo_pedido: valorMinimoPedido
            });
            
        if(!restauranteCadastrado) {
            await knex('usuario').del().where({ id: usuario[0].id });

            return res.status(400).json('Não foi possível cadastrar o restaurante');
        }

        return res.status(200).json('Usuário e restaurante cadastrados com sucesso.');
   
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



module.exports = {
    cadastrarUsuario,
    
}