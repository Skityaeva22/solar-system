import React, { useState, useEffect } from "react";
import "../styles/FactsPanel.css";

const FactsPanel = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [facts, setFacts] = useState([]);

  // Загрузка фактов из JSON файла
  useEffect(() => {
    try {
      // Импортируем JSON с фактами
      import("../services/facts.json")
        .then((data) => {
          setFacts(data.facts);
        })
        .catch((error) => {
          console.error("Ошибка загрузки фактов:", error);
        });
    } catch (error) {
      console.error("Ошибка при загрузке файла с фактами:", error);
    }
  }, []);

  // Автоматическая смена факта
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentFactIndex(
          (prevIndex) => (prevIndex + 1) % facts.length
        );
        setIsVisible(true);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, [facts]);

  // Ручная смена факта
  const nextFact = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentFactIndex(
        (prevIndex) => (prevIndex + 1) % facts.length
      );
      setIsVisible(true);
    }, 300);
  };

  const prevFact = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === 0 ? facts.length - 1 : prevIndex - 1
      );
      setIsVisible(true);
    }, 300);
  };

  const currentFact = facts[currentFactIndex];

  return (
    <div className={`facts-panel ${isVisible ? "visible" : ""}`}>
      <div className="facts-content">
        <h3>Знаете ли вы?</h3>
        <h4>{currentFact?.title}</h4>
        <p>{currentFact?.content}</p>
        <div className="facts-nav">
          <button onClick={prevFact}>&lt;</button>
          <span>
            {currentFactIndex + 1} / {facts?.length}
          </span>
          <button onClick={nextFact}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default FactsPanel;
