const knex = require('../bancodedados/conexao');


async function listarPedidosNaoSairamParaEntrega (req, res) {
    const { restaurante } = req;

    try {
        let pedidos = await knex('pedido')
            .where({ restaurante_id: restaurante.id, saiu_para_entrega: false })
            .orderBy('pedido.id', 'desc');

        for (let pedido of pedidos) {
            pedido.cliente = await knex('pedido')
            .join('cliente', 'pedido.cliente_id', 'cliente.id')
            .join('endereco', 'pedido.cliente_id', 'endereco.cliente_id')
            .select('cliente.nome', 'endereco.cep', 'endereco.endereco', 'endereco.complemento')
            .where('pedido.id', pedido.id);

            pedido.produtos = await knex('itens_pedido')
            .join('produto', 'itens_pedido.produto_id', 'produto.id')
            .select('produto.*', 'itens_pedido.quantidade', 'itens_pedido.preco_total')
            .where({pedido_id: pedido.id})
            
        }
    

        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function enviarPedido (req, res) {
    const { id: pedidoId } = req.params;

    try {
        const pedidoAtualizado = await knex('pedido')
            .update({ saiu_para_entrega: true })
            .where({ id: pedidoId});

        if (!pedidoAtualizado) {
            return res.status(404).json('Não foi possível atualizar a propriedade saiu_para_entrega');
        }

        return res.status(200).json('Pedido saiu para entrega');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarPedidosNaoSairamParaEntrega,
    enviarPedido
}