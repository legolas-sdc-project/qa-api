-- CREATE TABLES

create table qa_schema.products (
  id serial primary key,
  name varchar(30) not null,
  slogan text,
  description text,
  category varchar(30),
  default_price int
);

create table qa_schema.questions (
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
  references products(id)
);

create table qa_schema.answers (
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
  references questions(question_id)
);

create table qa_schema.photos (
  id serial primary key,
  answer_id int,
  url varchar,
  constraint fk_answers
  foreign key(answer_id)
  references answers(answer_id)
);

-- load csv data into tables

\copy qa_schema.photos from './data/product.csv' delimiter ',' csv header;

\copy qa_schema.questions from './data/questions.csv' delimiter ',' csv header;

\copy qa_schema.answers from './data/answers.csv' delimiter ',' csv header;

\copy qa_schema.photos from './data/answers_photos.csv' delimiter ',' csv header;

-- change epoch time to timestamp with time zone
ALTER TABLE qa_schema.questions ALTER COLUMN question_date
SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + question_date * interval '1 millisecond';

ALTER TABLE qa_schema.answers ALTER COLUMN date
SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date * interval '1 millisecond';

-- change 0, 1 to true/false
-- ALTER TABLE qa_schema.questions ALTER reported TYPE bool USING CASE WHEN reported='0' THEN FALSE ELSE TRUE END;
-- ALTER TABLE qa_schema.questions ALTER COLUMN reported TYPE bool;

-- ALTER TABLE qa_schema.answers ALTER reported TYPE bool USING CASE WHEN reported='0' THEN FALSE ELSE TRUE END;
-- ALTER TABLE qa_schema.answers ALTER COLUMN reported TYPE bool;