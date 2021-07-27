const express = require('express');

const usuarios = require('./controladores/usuarios');
const verificaLogin = require('./filtros/verificaLogin');
const loginControlador = require('./controladores/login');

const rotas = express();

//cadastro de usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario);

//login
rotas.post('/login', loginControlador.logarUsuario);

//filtro pra verificar se usuário ta logado
rotas.use(verificaLogin);

module.exports = rotas;