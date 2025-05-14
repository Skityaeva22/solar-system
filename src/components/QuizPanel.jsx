import React, { useState, useEffect } from "react";
import "../styles/QuizPanel.css";

const QuizPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка вопросов из JSON файла
  useEffect(() => {
    try {
      // Импортируем JSON с вопросами
      import("../services/questions.json")
        .then((data) => {
          setQuestions(data.questions);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error("Ошибка загрузки вопросов:", error);
        });
    } catch (error) {
      console.error("Ошибка при загрузке файла с вопросами:", error);
    }
  }, []);

  // Автоматическая смена вопроса
  useEffect(() => {
    if (isLoaded && !isAnswered) {
      const interval = setInterval(() => {
        nextQuestion();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, isAnswered, isLoaded]);

  // Переход к следующему вопросу
  const nextQuestion = () => {
    setIsVisible(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => 
        (prevIndex + 1) % questions.length
      );
      setIsVisible(true);
    }, 300);
  };

  // Переход к предыдущему вопросу
  const prevQuestion = () => {
    setIsVisible(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === 0 ? questions.length - 1 : prevIndex - 1
      );
      setIsVisible(true);
    }, 300);
  };

  // Обработка выбора ответа
  const handleAnswerClick = (index) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
      setIsAnswered(true);
    }
  };

  // Если вопросы еще не загрузились, показываем загрузку
  if (!isLoaded || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={`quiz-panel ${isVisible ? "visible" : ""}`}>
      <div className="quiz-content">
        <h3>Космический квиз</h3>
        <div className="question">
          <h4>{currentQuestion.question}</h4>
        </div>
        <div className="answers">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              className={`answer-button ${
                isAnswered
                  ? answer.correct
                    ? "correct"
                    : selectedAnswer === index
                    ? "incorrect"
                    : ""
                  : ""
              }`}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
            >
              {answer.text}
            </button>
          ))}
        </div>
        <div className="quiz-nav">
          <button onClick={prevQuestion}>&lt;</button>
          <span>
            {currentQuestionIndex + 1} / {questions.length}
          </span>
          <button onClick={nextQuestion}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default QuizPanel;
