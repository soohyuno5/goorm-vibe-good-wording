const { generateQuote } = require('../server/quoteService');

module.exports = async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ message: 'POST 요청만 허용됩니다.' });
    return;
  }

  try {
    const category = request.body?.category || '전체';
    const language = request.body?.language || 'ko';
    const quote = await generateQuote(category, language);

    response.status(200).json({ quote });
  } catch (error) {
    response.status(500).json({
      message: error.message || '서버 오류가 발생했습니다.'
    });
  }
};
