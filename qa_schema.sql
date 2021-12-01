-- CREATE TABLES

CREATE TABLE qa_schema.products (
  id serial primary key,
  name varchar(30) not null,
  slogan text,
  description text,
  category varchar(30),
  default_price int
);

CREATE TABLE qa_schema.questions (
  question_id serial primary key,
  product_id int,
  question_body text,
  question_date bigint,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported boolean,
  question_helpfulness int,
  constraint fk_products
  foreign key(product_id)
  references qa_schema.products(id)
);

CREATE TABLE qa_schema.answers (
  answer_id serial primary key,
  question_id int,
  body text,
  date bigint,
  answerer_name varchar(30) not null,
  answerer_email varchar(50) not null,
  reported boolean,
  helpfulness int,
  constraint fk_questions
  foreign key(question_id)
  references qa_schema.questions(question_id)
);

CREATE TABLE qa_schema.photos (
  id serial primary key,
  answer_id int,
  url varchar,
  constraint fk_answers
  foreign key(answer_id)
  references qa_schema.answers(answer_id)
);

-- load csv data into tables

\copy qa_schema.products from './data/product.csv' delimiter ',' csv header;

\copy qa_schema.questions from './data/questions.csv' delimiter ',' csv header;

\copy qa_schema.answers from './data/answers.csv' delimiter ',' csv header;

\copy qa_schema.photos from './data/answers_photos.csv' delimiter ',' csv header;

-- change epoch time to timestamp with time zone
ALTER TABLE qa_schema.questions ALTER COLUMN question_date
SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + question_date * interval '1 millisecond';

ALTER TABLE qa_schema.answers ALTER COLUMN date
SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date * interval '1 millisecond';

CREATE INDEX product_id_index ON qa_schema.questions(product_id);
CREATE INDEX question_id_index ON qa_schema.answers(question_id);
CREATE INDEX answer_id_index ON qa_schema.photos(answer_id);