import React, { useState, useEffect } from "react";
import "../styles/FactsPanel.css";
import factsData from "../services/facts.json";

const FactsPanel = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Автоматическая смена факта
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentFactIndex(
          (prevIndex) => (prevIndex + 1) % factsData.facts.length
        );
        setIsVisible(true);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Ручная смена факта
  const nextFact = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentFactIndex(
        (prevIndex) => (prevIndex + 1) % factsData.facts.length
      );
      setIsVisible(true);
    }, 300);
  };

  const prevFact = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === 0 ? factsData.facts.length - 1 : prevIndex - 1
      );
      setIsVisible(true);
    }, 300);
  };

  const currentFact = factsData.facts[currentFactIndex];

  return (
    <div className={`facts-panel ${isVisible ? "visible" : ""}`}>
      <div className="facts-content">
        <h3>Знаете ли вы?</h3>
        <h4>{currentFact.title}</h4>
        <p>{currentFact.content}</p>
        <div className="facts-nav">
          <button onClick={prevFact}>&lt;</button>
          <span>
            {currentFactIndex + 1} / {factsData.facts.length}
          </span>
          <button onClick={nextFact}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default FactsPanel;
