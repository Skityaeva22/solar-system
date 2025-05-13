import React from "react";
import { PLANET_SIZES, PLANET_COLORS } from "../utils/constants";
import "../styles/Planet.css";

const Planet = ({
  planet,
  position,
  isSelected,
  onClick,
}) => {
  // Получаем размер и цвет планеты из констант
  const size = PLANET_SIZES[planet.id] || 10;
  const color =
    PLANET_COLORS[planet.id] || "#CCCCCC";

  // Размер планеты увеличивается, когда она выбрана
  const scale = isSelected ? 1.5 : 1;
  const finalSize = size * scale;

  // Классы для стилизации
  const planetClasses = `planet ${isSelected ? "planet-selected" : ""}`;

  return (
    <div
      className={planetClasses}
      style={{
        width: `${finalSize}px`,
        height: `${finalSize}px`,
        backgroundColor: color,
        left: `${position.x - finalSize / 2}px`,
        top: `${position.y - finalSize / 2}px`,
        transition:
          "transform 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out",
      }}
      onClick={onClick}
      title={planet.englishName}
    >
      {/* Если это Сатурн, добавляем кольца */}
      {planet.id === "saturne" && <div className="saturn-rings"></div>}
    </div>
  );
};

export default Planet;
