const knex = require('../bancodedados/conexao');


async function listarPedidosNaoSairamParaEntrega (req, res) {
    const { restaurante } = req;

    try {
        const pedidos = await knex('pedido')
            .join('cliente', 'pedido.cliente_id', 'cliente.id')
            .join('endereco', 'endereco.cliente_id', 'cliente.id')
            .select('pedido.*', 'cliente.nome AS cliente_nome', 'endereco.*')
            .where({ restaurante_id: restaurante.id, saiu_para_entrega: false })
            .orderBy('pedido.id', 'desc');

       
    

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