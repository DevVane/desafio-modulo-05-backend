const yup = require('./yup');

const loginSquema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required(),

    senha: yup
        .string()
        .required()

    
})

module.exports = loginSquema;