// GET /qa/questions?product_id=40344
// page & count -> qa/questions?product_id=40344&page=1&count=10
// no matter what the count is, always returns only 3

// Postgres read ETL - Native options

{
  "product_id": "40344",
  "results": [
    {
      "question_id": 553458,
      "question_body": "Has Anyone Really Been Far Even as Decided to Use Even Go Want to do Look More Like?",
      "question_date": "2021-11-10T00:00:00.000Z",
      "asker_name": "Anonymous",
      "question_helpfulness": 4446,
      "reported": false,
      "answers": {
        "5181052": {
          "id": 5181052,
          "body": "YES, I want ",
          "date": "2021-11-10T00:00:00.000Z",
          "answerer_name": "test",
          "helpfulness": 0,
          "photos": [
            "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/spring-flowers-1613759017.jpg?crop=0.669xw:1.00xh;0.0635xw,0&resize=640:*",
            "https://media.self.com/photos/5ea9f52ea469834e6f5489e6/1:1/w_3204,h_3204,c_limit/peony_flowers_bouquet.jpg"
          ]
        },
        // ...
    },
    // ...
  ]
}