const yup = require('./yup');

const produtoSquema = yup.object().shape({
    nome: yup.string().max(50).required(),
    descricao: yup.string().max(100),
    preco: yup.number().integer().positive().required(),
    permiteObservacoes: yup.boolean() 
});

const editarProdutoSquema = yup.object().shape({
    nome: yup.string().max(50),
    descricao: yup.string().max(100),
    preco: yup.number().integer().positive(),
    permiteObservacoes: yup.boolean() 
});

module.exports = {
    produtoSquema,
    editarProdutoSquema
};