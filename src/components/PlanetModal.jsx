import React, { useEffect, useRef, useState } from "react";
import { PLANET_COLORS } from "../utils/constants";
import "../styles/PlanetModal.css";

const PlanetModal = ({ planet, onClose }) => {
  const [showAllMoons, setShowAllMoons] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMoons, setFilteredMoons] = useState([]);

  const modalRef = useRef(null);

  // Закрывать модальное окно при клике за его пределами
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sideModal = document.querySelector(".side-modal");
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!sideModal || !sideModal.contains(event.target))
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Предотвращает прокрутку страницы, когда открыто модальное окно
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Закрытие модального окна при нажатии ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showAllMoons) {
          setShowAllMoons(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose, showAllMoons]);

  // Обновление отфильтрованных спутников при изменении поискового запроса
  useEffect(() => {
    if (!planet.moons) return;

    const filtered = planet.moons.filter((moon) =>
      moon.moon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMoons(filtered);
  }, [searchTerm, planet.moons]);

  // Форматирование числа для отображения
  const formatNumber = (value) => {
    if (value === undefined) return "Нет данных";
    return value.toLocaleString("ru-RU");
  };

  // Форматирование научной записи
  const formatScientificNumber = (value, exponent) => {
    if (value === undefined || exponent === undefined) return "Нет данных";
    return `${value} × 10^${exponent}`;
  };

  // Форматирование даты
  const formatDate = (dateStr) => {
    if (!dateStr) return "Неизвестно";
    return new Date(dateStr).toLocaleDateString("ru-RU");
  };

  // Цвет планеты
  const planetColor = PLANET_COLORS[planet.id] || "#CCCCCC";

  // Определение списка спутников для отображения
  const moonsToShow = searchTerm === "" ? planet.moons || [] : filteredMoons;
  const hasExtraMoons = moonsToShow.length > 10;
  const visibleMoons = moonsToShow.slice(0, 10);
  const extraMoonsCount = moonsToShow.length - 10;

  return (
    <div className="modal-backdrop">
      <div className="planet-modal" ref={modalRef}>
        <div className="modal-header" style={{ backgroundColor: planetColor }}>
          <h2>{planet.englishName}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-section">
            <h3>Основные характеристики</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Тип:</span>
                <span className="info-value">
                  {planet.isPlanet ? "Планета" : planet.bodyType}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Масса:</span>
                <span className="info-value">
                  {planet.mass
                    ? formatScientificNumber(
                        planet.mass.massValue,
                        planet.mass.massExponent
                      ) + " кг"
                    : "Нет данных"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Средний радиус:</span>
                <span className="info-value">
                  {formatNumber(planet.meanRadius)} км
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Экваториальный радиус:</span>
                <span className="info-value">
                  {formatNumber(planet.equaRadius)} км
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Полярный радиус:</span>
                <span className="info-value">
                  {formatNumber(planet.polarRadius)} км
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Плотность:</span>
                <span className="info-value">{planet.density} г/см³</span>
              </div>
              <div className="info-item">
                <span className="info-label">Гравитация:</span>
                <span className="info-value">{planet.gravity} м/с²</span>
              </div>
              <div className="info-item">
                <span className="info-label">Средняя температура:</span>
                <span className="info-value">
                  {planet.avgTemp
                    ? `${planet.avgTemp} K (${(planet.avgTemp - 273.15).toFixed(
                        1
                      )} °C)`
                    : "Нет данных"}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Орбитальные характеристики</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Большая полуось:</span>
                <span className="info-value">
                  {formatNumber(planet.semimajorAxis)} км
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Перигелий:</span>
                <span className="info-value">
                  {formatNumber(planet.perihelion)} км
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Афелий:</span>
                <span className="info-value">
                  {formatNumber(planet.aphelion)} км
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Эксцентриситет:</span>
                <span className="info-value">{planet.eccentricity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Наклон орбиты:</span>
                <span className="info-value">{planet.inclination}°</span>
              </div>
              <div className="info-item">
                <span className="info-label">Наклон оси:</span>
                <span className="info-value">{planet.axialTilt}°</span>
              </div>
              <div className="info-item">
                <span className="info-label">Период обращения:</span>
                <span className="info-value">{planet.sideralOrbit} дней</span>
              </div>
              <div className="info-item">
                <span className="info-label">Период вращения:</span>
                <span className="info-value">
                  {planet.sideralRotation} часов
                </span>
              </div>
            </div>
          </div>

          {planet.moons && planet.moons.length > 0 && (
            <div className="modal-section">
              <h3>Спутники ({planet.moons.length})</h3>

              <div className="moons-search">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="moon-search-input"
                />
                {searchTerm && (
                  <button
                    className="clear-search-button"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>

              {searchTerm && (
                <div className="moons-search-results">
                  Найдено: {filteredMoons.length} из {planet.moons.length}
                </div>
              )}

              <div className="moons-list">
                {visibleMoons.length > 0 ? (
                  visibleMoons.map((moon, index) => (
                    <span key={index} className="moon-item">
                      {moon.moon}
                    </span>
                  ))
                ) : (
                  <div className="no-moons-found">Спутники не найдены</div>
                )}
              </div>

              {hasExtraMoons && extraMoonsCount > 0 && (
                <button
                  className="more-moons-button"
                  onClick={() => setShowAllMoons(true)}
                >
                  + {extraMoonsCount}
                </button>
              )}
            </div>
          )}

          <div className="modal-section">
            <h3>Дополнительная информация</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Открыт:</span>
                <span className="info-value">
                  {formatDate(planet.discoveryDate)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Открыт:</span>
                <span className="info-value">
                  {planet.discoveredBy || "Неизвестно"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Боковое модальное окно со всеми спутниками */}
      {showAllMoons && (
        <div className="side-modal">
          <div className="side-modal-header">
            <h4>Спутники ({extraMoonsCount}):</h4>
            <button onClick={() => setShowAllMoons(false)}>×</button>
          </div>
          <div className="side-modal-content">
            {moonsToShow.slice(10).map((moon, index) => (
              <div key={index} className="moon-item-full">
                {moon.moon}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetModal;
