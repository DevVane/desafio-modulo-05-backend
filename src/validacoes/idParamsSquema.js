const yup = require('./yup');

const idParamsSquema = yup.object().shape({
    id: yup.number().integer()
})

module.exports = idParamsSquema;