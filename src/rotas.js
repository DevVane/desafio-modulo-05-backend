const express = require('express');

const usuarios = require('./controladores/usuarios');
const verificaLogin = require('./filtros/verificaLogin');
const loginControlador = require('./controladores/login');
const produtos = require('./controladores/produtos');
const categorias = require('./controladores/categorias');
const perfil = require('./controladores/perfil');

const rotas = express();

//cadastro de usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario);

//login
rotas.post('/login', loginControlador.logarUsuario);

//categorias
rotas.get('/categorias', categorias.listarCategorias);
rotas.get('/categorias/:id', categorias.obterCategoria);

//filtro pra verificar se usuário ta logado
rotas.use(verificaLogin);

//perfil
rotas.get('/perfil', perfil.obterPerfil);
rotas.put('/perfil', perfil.atualizarPerfil);

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