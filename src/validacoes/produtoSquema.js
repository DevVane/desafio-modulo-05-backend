const yup = require('./yup');

const produtoSquema = yup.object().shape({
    nome: yup.string().max(50).required().trim(),
    descricao: yup.string().max(100),
    preco: yup.number().integer().positive().required(),
    permiteObservacoes: yup.boolean(), 
    ativo: yup.boolean(),
    imagem: yup.string().trim(),
    nomeImagem: yup.string().trim()  
});

const editarProdutoSquema = yup.object().shape({
    nome: yup.string().max(50).trim(),
    descricao: yup.string().max(100),
    preco: yup.number().integer().positive(),
    permiteObservacoes: yup.boolean(),
    ativo: yup.boolean(),
    imagem: yup.string().trim(),
    nomeImagem: yup.string().trim()  
});

module.exports = {
    produtoSquema,
    editarProdutoSquema
};