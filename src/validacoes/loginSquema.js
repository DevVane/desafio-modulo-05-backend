const yup = require('./yup');

const loginSquema = yup.object().shape({
    email: yup.string().max(100).email().required(),
    senha: yup.string().required()   
})

module.exports = loginSquema;