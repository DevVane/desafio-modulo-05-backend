const knex = require('../bancodedados/conexao');
const idParamsSquema = require('../validacoes/idParamsSquema');

async function listarCategorias (req, res) {
    try {
        const categorias = await knex('categoria').returning('*');

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function obterCategoria (req, res) {
    const { id: idCategoria } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const categorias = await knex('categoria')
            .where({ id: idCategoria })
            .first();

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarCategorias,
    obterCategoria
}