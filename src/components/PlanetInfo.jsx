import React from "react";
import "../styles/PlanetInfo.css";

const PlanetInfo = ({ planet, onDetailsClick }) => {
  // Форматируем научные числа для лучшего отображения
  const formatScientificNumber = (value, exponent) => {
    if (exponent === 0) return value.toString();
    return `${value} × 10^${exponent}`;
  };

  // Форматируем расстояние в км в астрономические единицы (а.е.)
  const formatDistance = (km) => {
    const au = km / 149597870.7; // 1 а.е. = 149 597 870,7 км
    return `${au.toFixed(3)} а.е. (${(km / 1000000).toFixed(2)} млн км)`;
  };

  // Форматируем температуру из Кельвинов в Цельсии
  const formatTemperature = (kelvin) => {
    const celsius = kelvin - 273.15;
    return `${kelvin} K (${celsius.toFixed(1)} °C)`;
  };

  return (
    <div className="planet-info">
      <h2>{planet.englishName}</h2>
      <div className="planet-info-content">
        <div className="planet-info-basic">
          <p>
            <strong>Тип:</strong>{" "}
            {planet.isPlanet ? "Планета" : planet.bodyType}
          </p>
          {planet.mass && (
            <p>
              <strong>Масса:</strong>{" "}
              {formatScientificNumber(
                planet.mass.massValue,
                planet.mass.massExponent
              )}{" "}
              кг
            </p>
          )}
          <p>
            <strong>Средний радиус:</strong> {planet.meanRadius} км
          </p>
          <p>
            <strong>Расстояние от Солнца:</strong>{" "}
            {formatDistance(planet.semimajorAxis)}
          </p>
          {planet.avgTemp && (
            <p>
              <strong>Средняя температура:</strong>{" "}
              {formatTemperature(planet.avgTemp)}
            </p>
          )}
          {planet.moons && (
            <p>
              <strong>Количество спутников:</strong> {planet.moons.length}
            </p>
          )}
        </div>
        <button className="details-button" onClick={onDetailsClick}>
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default PlanetInfo;
