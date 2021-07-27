create database icubus;

drop table if exists categoria;
drop table if exists usuario;
drop table if exists restaurante;
drop table if exists produto;

create table categoria(
    id serial primary key,
    nome varchar(30) not null
);

create table usuario(
    id serial primary key,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    senha text not null
);

create table restaurante(
    id serial primary key,
    usuario_id integer not null references usuario(id),
    nome varchar(50) not null,
    descricao varchar(100),
    categoria_id integer not null references categoria(id),
    taxa_entrega integer not null default 0,
    tempo_entrega_minutos integer not null default 30,
    valor_minimo_pedido integer not null default 0
);

create table produto(
    id serial primary key,
    restaurante_id integer not null references restaurante(id),
    nome varchar(50) not null,
    descricao varchar(100),
    preco integer not null,
    ativo boolean not null default true,
    permite_observacoes boolean not null default false
);
