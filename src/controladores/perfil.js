const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const { usuarioEditarSquema, restauranteSquema } = require('../validacoes/usuarioSquema');
const { uploadImagem }= require('../funcoes/upload');


async function obterPerfil(req, res){
    const { usuario, restaurante } = req;

    return res.status(200).json({ usuario, restaurante });
}

async function atualizarPerfil(req, res){
    const { id: usuarioId } = req.usuario;
    const { id: restauranteId } = req.restaurante;
    const { nome, email} = req.body;
    let { senha } = req.body;


    try {
        await usuarioEditarSquema.validate(req.body);
        await restauranteSquema.validate(req.body.restaurante);

        let senhaCriptografada;

        usuario = await knex('usuario').where({ id: usuarioId }).first();

        if(!senha) {
            senhaCriptografada = usuario.senha;
        } else {
            senhaCriptografada = await bcrypt.hash(senha, 10);
        }

        const emailEncontrado = await knex('usuario').where({ email }).first();
        
        if (emailEncontrado && (emailEncontrado.id != usuarioId)) {
            return res.status(400).json('Já existe usuário cadastrado com esse email');
        }

        const usuarioAtualizado = await knex('usuario')
            .update({ nome, email, senha: senhaCriptografada})
            .where({ id: usuarioId });

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
            imagem
        } = req.body.restaurante;

        let { nomeImagem } = req.body.restaurante;
        if(nomeImagem) {
            const idAleatorio = Math.floor(Date.now() * Math.random()).toString(36);
            nomeImagem = "restaurante" + restauranteId + "/" + idAleatorio + "-" + nomeImagem;
        }

        let imagemUrl;
        if (imagem) {
            const { erro, data } = await uploadImagem(nomeImagem, imagem);
            
            if (!data) {
                return res.status(400).json(erro);   
            }

            imagemUrl = data;
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
                nome_imagem: nomeImagem,
                imagem: imagemUrl
            })
            .where({ id: restauranteId });
           

        if(!restauranteAtualizado) {
            await knex('usuario').del().where({ id: usuarioId });

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