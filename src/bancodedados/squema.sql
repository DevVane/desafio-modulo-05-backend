drop table if exists itens_pedido;
drop table if exists pedido;
drop table if exists produto;
drop table if exists restaurante;
drop table if exists usuario;
drop table if exists categoria;
drop table if exists endereco;
drop table if exists cliente;


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
    taxa_entrega integer not null ,
    tempo_entrega_minutos integer not null default 30,
    valor_minimo_pedido integer not null,
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
  	imagem text default 'https://cmrhxoylmbmyrjjylqnw.supabase.in/storage/v1/object/public/icubus/default/addFotoProduto.png',
  	nome_imagem text default 'default/addFotoProduto.png'
  
);

insert into categoria(nome, imagem)
values 
  ('Diversos', 'https://cdn.pixabay.com/photo/2013/04/02/21/47/strawberries-99551_960_720.jpg'),
  ('Lanches', 'https://cdn.pixabay.com/photo/2019/02/19/12/49/a-sandwich-4006766_960_720.jpg'),
  ('Carnes', 'https://cdn.pixabay.com/photo/2018/03/03/10/10/meat-3195334_960_720.jpg'), 
  ('Massas', 'https://cdn.pixabay.com/photo/2010/12/13/10/00/pasta-2093_960_720.jpg' ),
  ('Pizzas', 'https://cdn.pixabay.com/photo/2017/09/23/18/36/meat-2779756_960_720.jpg'),
  ('Japonesa', 'https://image.freepik.com/foto-gratis/arreglo-tradicional-sushi-japones_23-2148809926.jpg'),
  ('Chinesa', 'https://i.ibb.co/Lpc9rGf/guioza.png'),
  ('Mexicano', 'https://i.ibb.co/MfFcJ4x/comida-mexicana.jpg'),
  ('Brasileira', 'https://i.ibb.co/1GbhPRR/feijoada.jpg'),
  ('Italiana', 'https://image.freepik.com/foto-gratis/primer-plano-mezcla-pasta_53876-31975.jpg'),
  ('Árabe', 'https://cdn.pixabay.com/photo/2016/09/06/14/24/hummus-1649231_960_720.jpg')
;


create table cliente(
    id serial primary key,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    telefone varchar(25),
    senha text not null
);

create table endereco(
    id serial primary key,
  	cliente_id integer not null references cliente(id),
    cep varchar(25) not null,
    complemento varchar(100),
    endereco varchar(200) not null
);


create table pedido(
    id serial primary key,
  	restaurante_id integer references restaurante(id),
  	cliente_id integer references cliente(id),
    subtotal integer not null,
    taxa_entrega integer not null,
    total integer not null,
  	saiu_para_entrega boolean default false,
  	foi_entregue boolean default false
);

create table itens_pedido(
    id serial primary key,
  	pedido_id integer not null references pedido(id),
  	produto_id integer references produto(id),
    preco integer not null,
  	quantidade integer not null,
  	preco_total integer not null
);
