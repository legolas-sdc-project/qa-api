const http = require('k6/http');
const { sleep, check } = require('k6');

export const options = {
  vus: 10,
  duration: '1s',
};

const API = 'http://localhost:3010/api';

export default () => {
  let getQuestion = http.get(`${API}/qa/questions?product_id=5000`);
  let getAnswer = http.get(`${API}/qa/questions/5000/answers`);
  
  check(getQuestion, {
    'get question - status 200': r => r.status === 200,
    'get question - transaction time < 2000ms': r => r.timings.duration < 2000,
  });
  sleep(1);
  
  check(getAnswer, {
    'get answer - status 200': r => r.status === 200,
    'get answer - transaction time < 2000ms': r => r.timings.duration < 2000,
  });
  sleep(1);
}