import { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [result, setResultState] = useState(() => {
    try {
      const stored = sessionStorage.getItem('mbQuizResult');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setResult = (res) => {
    setResultState(res);
    sessionStorage.setItem('mbQuizResult', JSON.stringify(res));
  };

  const clearResult = () => {
    setResultState(null);
    sessionStorage.removeItem('mbQuizResult');
  };

  const value = {
    result,
    setResult,
    clearResult,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export const useQuiz = () => useContext(QuizContext);
