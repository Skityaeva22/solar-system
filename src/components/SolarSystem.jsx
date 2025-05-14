import React, { useState, useEffect, useRef } from "react";
import { SolarSystemApi } from "../services/api";
import { calculateAllPlanetPositions } from "../utils/planetPositions";
import {
  PLANETS_ORDER,
  PLANET_SIZES,
  PLANET_COLORS,
  ORBIT_RADII,
} from "../utils/constants";
import Planet from "./Planet";
import PlanetInfo from "./PlanetInfo";
import PlanetModal from "./PlanetModal";
import FactsPanel from "./FactsPanel";
import QuizPanel from "./QuizPanel";
import "../styles/SolarSystem.css";

const SolarSystem = () => {
  // Состояние компонентов
  const [planets, setPlanets] = useState([]);
  const [sun, setSun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planetPositions, setPlanetPositions] = useState({});
  const [selectedPlanet, setSelectedPlanet] = useState({
    planet: null,
    isModalOpen: false,
  });

  // Состояние для перемещения по экрану
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });

  // Ссылка на контейнер солнечной системы для получения размеров
  const containerRef = useRef(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Параллельно загружаем планеты и солнце
        const [planetsData, sunData] = await Promise.all([
          SolarSystemApi.getPlanets(),
          SolarSystemApi.getSun(),
        ]);

        // Сортировка планет в порядке от Солнца
        const sortedPlanets = planetsData.sort(
          (a, b) => PLANETS_ORDER.indexOf(a.id) - PLANETS_ORDER.indexOf(b.id)
        );

        setPlanets(sortedPlanets);
        setSun(sunData);
        setLoading(false);
      } catch (err) {
        console.error("Не удалось загрузить данные солнечной системы:", err);
        setError("Не удалось загрузить данные о солнечной системе. Пожалуйста, повторите попытку позже");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Расчет позиций планет каждые 100мс для анимации
  useEffect(() => {
    if (!planets.length || !containerRef.current) return;

    const updatePositions = () => {
      if (!containerRef.current) return;

      const centerX = containerRef.current.offsetWidth / 2 + panOffset.x;
      const centerY = containerRef.current.offsetHeight / 2 + panOffset.y;

      const positions = calculateAllPlanetPositions(planets, centerX, centerY);
      setPlanetPositions(positions);
    };

    // Первичный расчет позиций
    updatePositions();

    // Перерасчет позиций при изменении размера окна
    window.addEventListener("resize", updatePositions);

    // Интервал для анимации движения планет
    const interval = setInterval(updatePositions, 100);

    return () => {
      window.removeEventListener("resize", updatePositions);
      clearInterval(interval);
    };
  }, [planets, panOffset]);

  // Обработчики событий для перемещения
  const handleMouseDown = (e) => {
    // Игнорируем клик по планетам, чтобы не мешать выбору планеты
    if (e.target.classList.contains('planet')) return;
    
    setIsPanning(true);
    setStartPanPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const deltaX = e.clientX - startPanPos.x;
    const deltaY = e.clientY - startPanPos.y;

    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setStartPanPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Обработчики событий для тач-устройств
  const handleTouchStart = (e) => {
    // Игнорируем клик по планетам, чтобы не мешать выбору планеты
    if (e.target.classList.contains('planet')) return;
    
    setIsPanning(true);
    setStartPanPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!isPanning) return;
    
    const deltaX = e.touches[0].clientX - startPanPos.x;
    const deltaY = e.touches[0].clientY - startPanPos.y;

    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setStartPanPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Обработчики событий для компонентов
  const handlePlanetClick = (planet) => {
    if (isPanning) return; // Игнорируем клик на планету если происходит перемещение
    
    setSelectedPlanet({
      planet,
      isModalOpen: false,
    });
  };

  const handleShowDetails = () => {
    setSelectedPlanet((prev) => ({
      ...prev,
      isModalOpen: true,
    }));
  };

  const handleCloseModal = () => {
    setSelectedPlanet((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  };

  const handleCloseInfo = () => {
    setSelectedPlanet({
      planet: null,
      isModalOpen: false,
    });
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="solar-system-loading">
        <div className="loading-spinner"></div>
        <p>Loading Solar System...</p>
      </div>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div className="solar-system-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Стиль курсора в зависимости от состояния перемещения
  const cursorStyle = isPanning ? 'grabbing' : 'grab';

  const questionsData = require("../services/questions.json");

  return (
    <div 
      className="solar-system-container" 
      ref={containerRef}
      style={{ cursor: cursorStyle }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Солнце */}
      {sun && (
        <div
          className="sun"
          style={{
            width: `${PLANET_SIZES.soleil}px`,
            height: `${PLANET_SIZES.soleil}px`,
            backgroundColor: PLANET_COLORS.soleil,
            left: `${
              containerRef.current
                ? containerRef.current.offsetWidth / 2 - PLANET_SIZES.soleil / 2 + panOffset.x
                : 0
            }px`,
            top: `${
              containerRef.current
                ? containerRef.current.offsetHeight / 2 -
                  PLANET_SIZES.soleil / 2 + panOffset.y
                : 0
            }px`,
          }}
        />
      )}

      {/* Орбиты планет */}
      {Object.entries(PLANETS_ORDER).map(([_, planetId]) => (
        <div
          key={`orbit-${planetId}`}
          className="planet-orbit"
          style={{
            width: `${ORBIT_RADII[planetId] * 2}px`,
            height: `${
              ORBIT_RADII[planetId] * 2
            }px`,
            left: `${
              containerRef.current
                ? containerRef.current.offsetWidth / 2 -
                  ORBIT_RADII[planetId] + panOffset.x
                : 0
            }px`,
            top: `${
              containerRef.current
                ? containerRef.current.offsetHeight / 2 -
                  ORBIT_RADII[planetId] + panOffset.y
                : 0
            }px`,
          }}
        />
      ))}

      {/* Планеты */}
      {planets.map((planet) => (
        <Planet
          key={planet.id}
          planet={planet}
          position={planetPositions[planet.id] || { x: 0, y: 0 }}
          isSelected={selectedPlanet.planet?.id === planet.id}
          onClick={() => handlePlanetClick(planet)}
        />
      ))}

      {/* Информация о выбранной планете */}
      {selectedPlanet.planet && !selectedPlanet.isModalOpen && (
        <div
          className="planet-info-container"
          style={{
            left: `${planetPositions[selectedPlanet.planet.id]?.x + 50 || 0}px`,
            top: `${planetPositions[selectedPlanet.planet.id]?.y - 100 || 0}px`,
          }}
        >
          <button className="close-info-button" onClick={handleCloseInfo}>
            ×
          </button>
          <PlanetInfo
            planet={selectedPlanet.planet}
            onDetailsClick={handleShowDetails}
          />
        </div>
      )}

      {/* Модальное окно с подробной информацией */}
      {selectedPlanet.planet && selectedPlanet.isModalOpen && (
        <PlanetModal
          planet={selectedPlanet.planet}
          onClose={handleCloseModal}
        />
      )}

      {/* Панель с интересными фактами */}
      <FactsPanel />

      {/* Квиз */}
      <QuizPanel questions={questionsData.questions} />
    </div>
  );
};

export default SolarSystem;
