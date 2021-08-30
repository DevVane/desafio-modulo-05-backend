const knex = require('../bancodedados/conexao');
const { produtoSquema, editarProdutoSquema } = require('../validacoes/produtoSquema');
const idParamsSquema = require('../validacoes/idParamsSquema');
const { uploadImagem }= require('../funcoes/upload');


async function listarProdutosRestaurante (req, res) {
    const { restaurante } = req;

    try {
        const produtos = await knex('produto')
            .where({ restaurante_id: restaurante.id });

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function obterProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();
            

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function cadastrarProduto (req, res){
    const { restaurante } = req;
    const { nome, preco, descricao, permiteObservacoes, ativo, imagem } = req.body;
    let { nomeImagem } = req.body;

    let imagemUrl;
    if (!imagem && !nomeImagem) {
        imagemUrl = "https://cmrhxoylmbmyrjjylqnw.supabase.in/storage/v1/object/public/icubus/default/addFotoProduto.png";
        nomeImagem = "default/addFotoProduto.png";
    } else {
        const idAleatorio = Math.floor(Date.now() * Math.random()).toString(36);
        nomeImagem = "restaurante" + restaurante.id + "/" + idAleatorio + "-" + nomeImagem;
    }
    
    
    try {
        await produtoSquema.validate(req.body);
        
        const produtoExistente = await knex('produto')
            .where({ restaurante_id: restaurante.id})
            .andWhere('nome', 'ilike', `${nome}`)
            .first();

        if (produtoExistente) {
            return res.status(400).json('Já existe produto cadastrado com esse nome');
        }

        if (imagem) {
            const { erro, data } = await uploadImagem(nomeImagem, imagem);
            
            if (!data) {
                return res.status(400).json(erro);   
            }

            imagemUrl = data;
        }

        const valores = {
            restaurante_id: restaurante.id,
            nome,
            preco,
            descricao,
            permite_observacoes: permiteObservacoes,
            ativo,
            nome_imagem: nomeImagem,
            imagem: imagemUrl
        }

        const produto = await knex('produto')
            .insert(valores)
            .returning('*');
        
        if (!produto) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(201).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function editarProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;
    const { nome, preco, descricao, permiteObservacoes, ativo, imagem } = req.body;
    let { nomeImagem } = req.body;

    
    try {
        await produtoSquema.validate(req.body);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }
    
        if(nomeImagem) {
            const idAleatorio = Math.floor(Date.now() * Math.random()).toString(36);
            nomeImagem = "restaurante" + restaurante.id + "/" + idAleatorio + "-" + nomeImagem;
        }

        let imagemUrl;
        if (imagem) {
            const { erro, data } = await uploadImagem(nomeImagem, imagem);
            
            if (!data) {
                return res.status(400).json(erro);   
            }

            imagemUrl = data;
        }

        const valoresAtualizados = {
            nome,
            preco,
            descricao,
            permite_observacoes: permiteObservacoes,
            ativo,
            nome_imagem: nomeImagem,
            imagem: imagemUrl
        }

        const produtoAtualizado = await knex('produto')
            .update(valoresAtualizados)
            .where({ restaurante_id: restaurante.id, id: idProduto });
    

        if (!produtoAtualizado) {
            return res.status(400).json('O produto não foi atualizado');
        }

        return res.status(200).json('O produto foi atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


async function excluirProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtivo = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto, ativo: true })
            .first();

        if (produtoAtivo) {
            return res.status(400).json('Não é possível excluir um produto ativo');
        }

        let pedidosNaoSairamParaEntrega = await knex('pedido')
            .where({ restaurante_id: restaurante.id, saiu_para_entrega: false})
            .returning('*');
        
        for (const pedido of pedidosNaoSairamParaEntrega) {
            const produtoSendoVendido = await knex('itens_pedido')
                .where({ pedido_id: pedido.id, produto_id: idProduto})
                .first();

            if (produtoSendoVendido) {
                return res.status(400).json('Não é possível excluir um produto que faz parte de um pedido ativo');
            }
        }

        let pedidosSairamParaEntrega = await knex('pedido')
            .where({ restaurante_id: restaurante.id, saiu_para_entrega: true})
            .returning('*');
        
        for (let pedido of pedidosSairamParaEntrega) {
            let produtoJaSaiu = await knex('itens_pedido')
                .where({ pedido_id: pedido.id, produto_id: idProduto})
                .update({ produto_id: null})
                .returning('*');

            if (produtoJaSaiu.length === 0) {
                return res.status(400).json('Algo deu errado');
            }
        }

        const produtoExcluido = await knex('produto')
            .del()
            .where({ restaurante_id: restaurante.id, id: idProduto });

        if (!produtoExcluido) {
            return res.status(400).json('O produto não foi excluido');
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function ativarProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtivado = await knex('produto')
            .update({ ativo: true })
            .where({ restaurante_id: restaurante.id, id: idProduto });

        if (!produtoAtivado) {
            return res.status(400).json('O produto não foi ativado');
        }

        return res.status(200).json('Produto ativado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function desativarProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoDesativado = await knex('produto')
            .update({ ativo: false })
            .where({ restaurante_id: restaurante.id, id: idProduto });

        if (!produtoDesativado) {
            return res.status(400).json('O produto não foi desativado');
        }

        return res.status(200).json('Produto desativado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutosRestaurante,
    obterProduto,
    cadastrarProduto,
    editarProduto,
    excluirProduto,
    ativarProduto,
    desativarProduto
}