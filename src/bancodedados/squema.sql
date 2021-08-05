create database icubus;

drop table if exists produto;
drop table if exists restaurante;
drop table if exists usuario;
drop table if exists categoria;

create table categoria(
    id serial primary key,
    nome varchar(30) not null,
	  imagem text
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
    valor_minimo_pedido integer not null default 0,
  	imagem  text default 'https://cmrhxoylmbmyrjjylqnw.supabase.in/storage/v1/object/public/icubus/default/semfoto.jpg',
  	nome_imagem text default 'default/semfoto.jpg'
);

create table produto(
    id serial primary key,
    restaurante_id integer not null references restaurante(id),
    nome varchar(50) not null,
    descricao varchar(100),
    preco integer not null,
    ativo boolean not null default true,
    permite_observacoes boolean not null default false,
  	imagem text default 'https://cmrhxoylmbmyrjjylqnw.supabase.in/storage/v1/object/public/icubus/default/addFotoProduto.jpg',
  	nome_imagem text default 'default/addFotoProduto.jpg'
);

insert into categoria(nome, imagem)
values 
  ('Diversos', 'https://cdn.pixabay.com/photo/2018/01/08/17/30/mushrooms-3069822_960_720.jpg'),
  ('Lanches', 'https://cdn.pixabay.com/photo/2021/07/29/18/07/burger-6507710_960_720.jpg'),
  ('Carnes', 'https://cdn.pixabay.com/photo/2018/02/08/15/02/meat-3139641_960_720.jpg'), 
  ('Massas', 'https://cdn.pixabay.com/photo/2017/06/01/18/46/cook-2364221_960_720.jpg' ),
  ('Pizzas', 'https://cdn.pixabay.com/photo/2016/06/08/00/03/pizza-1442946_960_720.jpg'),
  ('Japonesa', 'https://cdn.pixabay.com/photo/2017/06/29/19/57/sushi-2455981_960_720.jpg'),
  ('Chinesa', 'https://cdn.pixabay.com/photo/2020/04/01/17/34/char-siu-4992042_960_720.jpg'),
  ('Mexicano', 'https://cdn.pixabay.com/photo/2016/08/23/08/53/tacos-1613795_960_720.jpg'),
  ('Brasileira', 'https://cdn.pixabay.com/photo/2020/05/17/14/15/bean-stew-5181831_960_720.jpg'),
  ('Italiana', 'https://cdn.pixabay.com/photo/2017/03/16/21/11/noodles-2150272_960_720.jpg'),
  ('Árabe', 'https://cdn.pixabay.com/photo/2016/09/06/14/24/hummus-1649231_960_720.jpg')
;

