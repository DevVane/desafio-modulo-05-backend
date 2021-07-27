const yup = require('./yup');

const usuarioSquema = yup.object().shape({
    nome: yup.string().max(100).required(),
    email: yup.string().max(100).email().required(),
    senha: yup.string().required()
})

const restauranteSquema = yup.object().shape({
    nome: yup.string().max(50).required(), 
    descricao: yup.string().max(100).required(), 
    idCategoria: yup.number().integer().required(), 
    taxaEntrega: yup.number().integer().required(), 
    tempoEntregaEmMinutos: yup.number().integer().required(), 
    valorMinimoPedido: yup.number().required()   
})

module.exports = {
    usuarioSquema,
    restauranteSquema
};