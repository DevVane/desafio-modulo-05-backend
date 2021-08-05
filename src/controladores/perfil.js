const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const { usuarioSquema, restauranteSquema } = require('../validacoes/usuarioSquema');
const { uploadImagem }= require('../funcoes/upload');


async function obterPerfil(req, res){
    const { usuario, restaurante } = req;

    return res.status(200).json({ usuario, restaurante });
}

async function atualizarPerfil(req, res){
    const { id: usuarioId } = req.usuario;
    const { id: restauranteId } = req.restaurante;
    const { nome, email, senha} = req.body;

    try {
        await usuarioSquema.validate(req.body);
        await restauranteSquema.validate(req.body.restaurante);

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioAtualizado = await knex('usuario')
            .update({ nome, email, senha: senhaCriptografada})
            .where({ id: usuarioId })

        console.log(usuarioAtualizado);

        if (!usuarioAtualizado) {
            return res.status(400).json('Não foi possível atualizar o usuário');
        }

        const { 
            nome: nomeRestaurante, 
            descricao, 
            idCategoria, 
            taxaEntrega, 
            tempoEntregaEmMinutos, 
            valorMinimoPedido, 
            nomeImagem, 
            imagem
        } = req.body.restaurante;

        let imagemUrl;

        if (imagem) {
            const response = await uploadImagem(nomeImagem, imagem);

            if( !response.erro ) {
                imagemUrl = response;
            }
        }
        
        const restauranteAtualizado = await knex('restaurante')
            .update({ 
                usuario_id: usuarioId, 
                nome: nomeRestaurante, 
                descricao, 
                categoria_id: idCategoria, 
                taxa_entrega: taxaEntrega, 
                tempo_entrega_minutos: tempoEntregaEmMinutos, 
                valor_minimo_pedido: valorMinimoPedido,
                imagem: imagemUrl
            })
            .where({ id: restauranteId });
           
            
        console.log(restauranteAtualizado);

        if(!restauranteAtualizado) {
            await knex('usuario').del().where({ id: usuario[0].id });

            return res.status(400).json('Não foi possível atualizar o restaurante');
        }

        return res.status(201).json('Usuário e restaurante atualizados com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    obterPerfil,
    atualizarPerfil
}