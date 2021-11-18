
create table qa_schema.products(
  id serial,
  primary key (id)
);

create table qa_schema.questions(
  id serial,
  product_id varchar,
  question_body text,
  question_date timestamptz,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported bit,
  question_helpfulness int
  primary key (id)
  constraint fk_products
  foreign key(product_id)
  references products(id)
);

create table qa_schema.answers (
  id serial,
  question_id varchar,
  body text,
  date timestamptz,
  answerer_name varchar(30) not null,
  answerer_email varchar(50) not null,
  reported bit,
  helpfulness int
  primary key (id)
  constraint fk_questions
  foreign key(question_id)
  references questions(id)
)

create table qa_schema.photos (
  id serial,
  answer_id varchar,
  url varchar
  primary key (id)
  constraint fk_answers
  foreign key(answer_id)
  references answers(id)
)