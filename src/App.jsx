import { useState } from 'react';

const quotes = [
  {
    id: 1,
    text: '시작이 반이다. 나머지 반은 오늘 계속하는 것이다.',
    author: '바이브코딩',
    category: '동기부여'
  },
  {
    id: 2,
    text: '완벽한 준비보다 작은 실행이 더 큰 변화를 만든다.',
    author: '바이브코딩',
    category: '실행'
  },
  {
    id: 3,
    text: '성장은 어제의 나를 조금 더 잘 이해하는 데서 시작된다.',
    author: '바이브코딩',
    category: '자기계발'
  },
  {
    id: 4,
    text: '성공은 특별한 하루가 아니라 반복되는 좋은 선택의 결과다.',
    author: '바이브코딩',
    category: '성공'
  },
  {
    id: 5,
    text: '두려움은 방향을 막는 벽이 아니라 넘어야 할 문이다.',
    author: '바이브코딩',
    category: '도전'
  },
  {
    id: 6,
    text: '오늘 작성한 한 줄의 코드가 내일의 자신감을 만든다.',
    author: '바이브코딩',
    category: '동기부여'
  },
  {
    id: 7,
    text: '생각만으로는 화면이 바뀌지 않는다. 버튼을 누르고 실행하자.',
    author: '바이브코딩',
    category: '실행'
  },
  {
    id: 8,
    text: '잘하는 사람도 처음에는 콘솔 에러를 읽는 법부터 배웠다.',
    author: '바이브코딩',
    category: '자기계발'
  },
  {
    id: 9,
    text: '작게 완성하는 습관은 크게 성공하는 힘이 된다.',
    author: '바이브코딩',
    category: '성공'
  },
  {
    id: 10,
    text: '새로운 도구가 낯설다면, 그것은 배울 기회가 생겼다는 뜻이다.',
    author: '바이브코딩',
    category: '도전'
  },
  {
    id: 11,
    text: '한 번에 멀리 가지 않아도 괜찮다. 멈추지 않는 것이 중요하다.',
    author: '바이브코딩',
    category: '동기부여'
  },
  {
    id: 12,
    text: '아이디어는 기록할 때 선명해지고, 실행할 때 가치가 생긴다.',
    author: '바이브코딩',
    category: '실행'
  },
  {
    id: 13,
    text: '배움의 속도보다 중요한 것은 다시 돌아오는 태도다.',
    author: '바이브코딩',
    category: '자기계발'
  },
  {
    id: 14,
    text: '성공한 프로젝트는 거창한 시작보다 꾸준한 개선에서 나온다.',
    author: '바이브코딩',
    category: '성공'
  },
  {
    id: 15,
    text: '어려운 문제는 내가 성장하고 있다는 가장 확실한 신호다.',
    author: '바이브코딩',
    category: '도전'
  },
  {
    id: 16,
    text: '지금의 작은 클릭 하나가 다음 단계의 문을 연다.',
    author: '바이브코딩',
    category: '동기부여'
  },
  {
    id: 17,
    text: '실행은 불안을 줄이고 결과를 만든다.',
    author: '바이브코딩',
    category: '실행'
  },
  {
    id: 18,
    text: '모르는 것을 인정하는 순간, 배움은 훨씬 빨라진다.',
    author: '바이브코딩',
    category: '자기계발'
  },
  {
    id: 19,
    text: '성공은 운처럼 보이지만 대부분은 포기하지 않은 시간이다.',
    author: '바이브코딩',
    category: '성공'
  },
  {
    id: 20,
    text: '도전은 실력을 증명하는 일이 아니라 실력을 만드는 일이다.',
    author: '바이브코딩',
    category: '도전'
  },
  {
    id: 21,
    text: '오늘의 작은 완성은 내일의 더 큰 자신감이 된다.',
    author: '바이브코딩',
    category: '동기부여'
  },
  {
    id: 22,
    text: '코드를 고치며 배우는 시간은 절대 낭비가 아니다.',
    author: '바이브코딩',
    category: '자기계발'
  }
];

const categories = ['전체', '동기부여', '성공', '실행', '자기계발', '도전'];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const getQuotesByCategory = () => {
    if (selectedCategory === '전체') {
      return quotes;
    }

    return quotes.filter((quote) => quote.category === selectedCategory);
  };

  const handleGenerateQuote = () => {
    const filteredQuotes = getQuotesByCategory();
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);

    setCurrentQuote(filteredQuotes[randomIndex]);
    setFeedbackMessage('');
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
    const isAlreadySaved = savedQuotes.some((quote) => quote.id === currentQuote.id);

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
        <h1>명언 생성기</h1>
        <p className="description">
          카테고리를 고르고 버튼을 누르면 입문자를 위한 성장 명언이 랜덤으로 표시됩니다.
        </p>

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

        <article className="quote-box">
          <span className="quote-category">{currentQuote.category}</span>
          <p className="quote-text">"{currentQuote.text}"</p>
          <p className="quote-author">- {currentQuote.author}</p>
        </article>

        <div className="button-group">
          <button className="primary-button" type="button" onClick={handleGenerateQuote}>
            명언 생성
          </button>
          <button className="secondary-button" type="button" onClick={handleCopyQuote}>
            현재 명언 복사
          </button>
          <button className="save-button" type="button" onClick={handleSaveQuote}>
            마음에 드는 명언 저장
          </button>
        </div>

        {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

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
                    <span className="saved-category">{quote.category}</span>
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
