import http from 'k6/http';

export default function () {
  const url1 = 'http://localhost:3010/api/qa/questions?product_id=10';
  const url2 = 'http://localhost:3010/api/qa/questions?product_id=500';
  const url3 = 'http://localhost:3010/api/qa/questions?product_id=10000';

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.get(url1, params);
  http.get(url2, params);
  http.get(url3, params);
}
