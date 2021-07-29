const yup = require('./yup');

const cadastroProdutoSquema = yup.object().shape({
    nome: yup.string().max(50).required(),
    descricao: yup.string().max(100),
    preco: yup.number().integer().required(),
    permiteObservacoes: yup.boolean() 
})

module.exports = cadastroProdutoSquema;