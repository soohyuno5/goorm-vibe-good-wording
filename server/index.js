const http = require('http');
const { generateQuote } = require('./quoteService');

const serverPort = 3001;

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });

  response.end(JSON.stringify(data));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      resolve(body);
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });
    response.end();
    return;
  }

  if (request.method === 'POST' && request.url === '/api/quote') {
    try {
      const rawBody = await readRequestBody(request);
      const requestBody = rawBody ? JSON.parse(rawBody) : {};
      const category = requestBody.category || '전체';
      const language = requestBody.language || 'ko';
      const quote = await generateQuote(category, language);

      sendJson(response, 200, { quote });
    } catch (error) {
      sendJson(response, 500, {
        message: error.message || '서버 오류가 발생했습니다.'
      });
    }

    return;
  }

  sendJson(response, 404, { message: '요청한 경로를 찾을 수 없습니다.' });
});

server.listen(serverPort, () => {
  console.log(`Quote API server is running on http://localhost:${serverPort}`);
});
