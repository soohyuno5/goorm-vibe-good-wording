const { readFileSync, existsSync } = require('fs');
const path = require('path');

const envFilePath = path.join(process.cwd(), '.env');

if (existsSync(envFilePath)) {
  const envLines = readFileSync(envFilePath, 'utf8').split(/\r?\n/);

  for (const line of envLines) {
    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue;
    }

    const equalSignIndex = line.indexOf('=');
    const key = line.slice(0, equalSignIndex).trim();
    const value = line.slice(equalSignIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const languageOptions = {
  ko: '한국어',
  en: '영어',
  ja: '일본어',
  zh: '중국어',
  es: '스페인어'
};

function createPrompt(category, languageLabel) {
  const categoryText = category === '전체' ? '동기부여, 성공, 실행, 자기계발, 도전 중 하나' : category;

  return [
    'You are a quote writer for beginner-friendly coding motivation apps.',
    `Write exactly one short original quote in ${languageLabel}.`,
    `The quote category must be ${categoryText}.`,
    'Return strict JSON only.',
    'Use this format: {"text":"...", "author":"...", "category":"..."}.',
    'Keep the quote inspiring, clear, and natural for general users.',
    'Do not include markdown fences or extra explanation.'
  ].join(' ');
}

async function generateQuote(category, language) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY 환경 변수가 없습니다. .env 파일 또는 배포 환경 변수에 API 키를 설정해주세요.');
  }

  const languageLabel = languageOptions[language];

  if (!languageLabel) {
    throw new Error('지원하지 않는 언어입니다.');
  }

  const apiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-5',
      input: createPrompt(category, languageLabel)
    })
  });

  const result = await apiResponse.json();

  if (!apiResponse.ok) {
    const message = result.error?.message || 'OpenAI API 호출에 실패했습니다.';
    throw new Error(message);
  }

  const outputText =
    result.output
      ?.flatMap((item) => item.content || [])
      ?.find((contentItem) => contentItem.type === 'output_text')
      ?.text || '';

  if (!outputText) {
    throw new Error('응답에서 명언 텍스트를 찾을 수 없습니다.');
  }

  let parsedQuote;

  try {
    parsedQuote = JSON.parse(outputText);
  } catch {
    throw new Error('모델 응답을 JSON으로 해석하지 못했습니다. 다시 시도해주세요.');
  }

  return {
    id: Date.now(),
    text: parsedQuote.text || '명언이 생성되지 않았습니다.',
    author: parsedQuote.author || 'GPT',
    category: parsedQuote.category || category,
    language
  };
}

module.exports = {
  generateQuote
};
