import { useState } from 'react';

const starterQuotes = [
  {
    id: 1,
    text: '시작이 반이다. 나머지 반은 오늘 계속하는 것이다.',
    author: '바이브코딩',
    category: '동기부여',
    language: 'ko'
  },
  {
    id: 2,
    text: 'Action beats perfect preparation.',
    author: 'Vibe Coding',
    category: '실행',
    language: 'en'
  },
  {
    id: 3,
    text: '小さな一歩でも、止まらなければ前進になる。',
    author: 'Vibe Coding',
    category: '도전',
    language: 'ja'
  },
  {
    id: 4,
    text: '每一次认真练习，都会让未来更从容。',
    author: 'Vibe Coding',
    category: '자기계발',
    language: 'zh'
  },
  {
    id: 5,
    text: 'El progreso empieza cuando decides intentarlo hoy.',
    author: 'Vibe Coding',
    category: '성공',
    language: 'es'
  }
];

const categories = ['전체', '동기부여', '성공', '실행', '자기계발', '도전'];

const languageOptions = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh', label: '중국어' },
  { value: 'es', label: '스페인어' }
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [currentQuote, setCurrentQuote] = useState(starterQuotes[0]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getLanguageLabel = (languageValue) => {
    return languageOptions.find((language) => language.value === languageValue)?.label || '한국어';
  };

  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api/quote';
    }

    return '/api/quote';
  };

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    setFeedbackMessage('');

    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: selectedCategory,
          language: selectedLanguage
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '명언 생성에 실패했습니다.');
      }

      setCurrentQuote(result.quote);
      setFeedbackMessage(`${getLanguageLabel(selectedLanguage)} 명언이 생성되었습니다.`);
    } catch (error) {
      setFeedbackMessage(error.message || '명언 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuote = async () => {
    const textToCopy = `"${currentQuote.text}" - ${currentQuote.author}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setFeedbackMessage('현재 명언이 복사되었습니다.');
    } catch {
      setFeedbackMessage('복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSaveQuote = () => {
    const isAlreadySaved = savedQuotes.some(
      (quote) =>
        quote.text === currentQuote.text &&
        quote.author === currentQuote.author &&
        quote.language === currentQuote.language
    );

    if (isAlreadySaved) {
      setFeedbackMessage('이미 저장된 명언입니다.');
      return;
    }

    setSavedQuotes([currentQuote, ...savedQuotes]);
    setFeedbackMessage('마음에 드는 명언 목록에 저장되었습니다.');
  };

  const handleRemoveSavedQuote = (quoteId) => {
    const nextSavedQuotes = savedQuotes.filter((quote) => quote.id !== quoteId);

    setSavedQuotes(nextSavedQuotes);
    setFeedbackMessage('저장된 명언을 목록에서 삭제했습니다.');
  };

  return (
    <main className="app">
      <section className="quote-card">
        <p className="eyebrow">Vibe Coding Quote</p>
        <h1>GPT 다국어 명언 생성기</h1>
        <p className="description">
          카테고리와 언어를 고르면 GPT가 새로운 명언을 생성합니다. API 키는 브라우저가 아닌 Node
          서버에서만 사용됩니다.
        </p>

        <div className="control-grid">
          <div className="category-area">
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="category-area">
            <label htmlFor="language">생성 언어</label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
            >
              {languageOptions.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <article className="quote-box">
          <div className="quote-meta-row">
            <span className="quote-category">{currentQuote.category}</span>
            <span className="quote-language">{getLanguageLabel(currentQuote.language)}</span>
          </div>
          <p className="quote-text">"{currentQuote.text}"</p>
          <p className="quote-author">- {currentQuote.author}</p>
        </article>

        <div className="button-group">
          <button
            className="primary-button"
            type="button"
            onClick={handleGenerateQuote}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : 'GPT 명언 생성'}
          </button>
          <button className="secondary-button" type="button" onClick={handleCopyQuote}>
            현재 명언 복사
          </button>
          <button className="save-button" type="button" onClick={handleSaveQuote}>
            마음에 드는 명언 저장
          </button>
        </div>

        {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

        <section className="guide-box">
          <h2>실행 전 준비</h2>
          <p>
            프로젝트 루트에 <code>.env</code> 파일을 만들고 <code>OPENAI_API_KEY</code> 값을 넣으면
            로컬에서 바로 사용할 수 있습니다. 실제 배포 환경에서는 호스팅 서비스의 환경 변수 설정에
            같은 키를 등록하면 됩니다.
          </p>
        </section>

        <section className="saved-section">
          <div className="saved-title-row">
            <h2>저장한 명언</h2>
            <span>{savedQuotes.length}개</span>
          </div>

          {savedQuotes.length === 0 ? (
            <p className="empty-message">아직 저장한 명언이 없습니다.</p>
          ) : (
            <ul className="saved-list">
              {savedQuotes.map((quote) => (
                <li key={quote.id} className="saved-item">
                  <div>
                    <div className="saved-badges">
                      <span className="saved-category">{quote.category}</span>
                      <span className="saved-language">{getLanguageLabel(quote.language)}</span>
                    </div>
                    <p className="saved-text">"{quote.text}"</p>
                    <p className="saved-author">- {quote.author}</p>
                  </div>
                  <button type="button" onClick={() => handleRemoveSavedQuote(quote.id)}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
