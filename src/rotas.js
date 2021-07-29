const express = require('express');

const usuarios = require('./controladores/usuarios');
const verificaLogin = require('./filtros/verificaLogin');
const loginControlador = require('./controladores/login');
const produtos = require('./controladores/produtos');

const rotas = express();

//cadastro de usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario);

//login
rotas.post('/login', loginControlador.logarUsuario);

//filtro pra verificar se usuário ta logado
rotas.use(verificaLogin);

//produtos
rotas.get('/produtos', produtos.listarProdutosRestaurante);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.editarTudoProduto);
rotas.patch('/produtos/:id', produtos.editarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);
rotas.post('/produtos/:id/ativar', produtos.ativarProduto);
rotas.post('/produtos/:id/desativar', produtos.desativarProduto);




module.exports = rotas;