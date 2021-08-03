const knex = require('../bancodedados/conexao');

async function obterPerfil(req, res){
    const { usuario, restaurante } = req;

    return res.status(200).json({ usuario, restaurante });
}

async function atualizarPerfil(req, res){

}

module.exports = {
    obterPerfil,
    atualizarPerfil
}