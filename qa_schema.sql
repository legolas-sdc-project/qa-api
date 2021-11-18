-- CREATE TABLES

create table qa_schema.questions(
  id serial primary key,
  product_id int,
  question_body text,
  question_date bigint,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported bit,
  question_helpfulness int
);

create table qa_schema.answers (
  id serial primary key,
  question_id int,
  body text,
  date bigint,
  answerer_name varchar(30) not null,
  answerer_email varchar(50) not null,
  reported bit,
  helpfulness int,
  constraint fk_questions
  foreign key(question_id)
  references questions(id)
);

create table qa_schema.photos (
  id serial primary key,
  answer_id int,
  url varchar,
  constraint fk_answers
  foreign key(answer_id)
  references answers(id)
);

-- load csv data into tables

\copy questions from './data/questions.csv' delimiter ',' csv header;

\copy answers from './data/answers.csv' delimiter ',' csv header;

\copy photos from './data/answers_photos.csv' delimiter ',' csv header;