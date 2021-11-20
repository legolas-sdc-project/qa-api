-- CREATE TABLES

create table qa_schema.questions(
  question_id serial primary key,
  product_id int,
  question_body text,
  question_date bigint,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  reported bit,
  question_helpfulness int
);

create table qa_schema.answers (
  answer_id serial primary key,
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


-- change 0, 1 to true/false
ALTER TABLE qa_schema.questions ALTER reported TYPE bool USING CASE WHEN reported='0' THEN FALSE ELSE TRUE END;
ALTER TABLE qa_schema.questions ALTER COLUMN reported TYPE bool;

ALTER TABLE qa_schema.answers ALTER reported TYPE bool USING CASE WHEN reported='0' THEN FALSE ELSE TRUE END;
ALTER TABLE qa_schema.answers ALTER COLUMN reported TYPE bool;