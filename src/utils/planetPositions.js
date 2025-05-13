import { ORBIT_RADII } from './constants';

/**
 * Рассчитывает позицию планеты на орбите вокруг Солнца на текущий момент времени
 * 
 * @param planet Данные о планете
 * @param centerX Координата X центра (Солнца)
 * @param centerY Координата Y центра (Солнца)
 * @returns Объект с координатами X и Y
 */
export const calculatePlanetPosition = (
  planet,
  centerX,
  centerY
) => {
    // Получаем радиус орбиты для данной планеты
    const orbitRadius = ORBIT_RADII[planet.id] || 0;
  
    if (orbitRadius === 0) {
        return { x: centerX, y: centerY };
    }

  // Вычисляем орбитальную скорость (упрощенная модель)
  // Чем дальше планета от Солнца, тем медленнее она движется
  const orbitalSpeed = 1000 / Math.sqrt(planet.semimajorAxis);
  
  // Рассчитываем текущее положение планеты на орбите
  // Используем текущее время для анимации
  const time = Date.now() / 1000; // текущее время в секундах
  const angle = (time * orbitalSpeed) % (2 * Math.PI);
  
  // С учетом эксцентриситета орбиты (упрощенно)
  const eccentricity = planet.eccentricity || 0;
  const r = orbitRadius * (1 - eccentricity * Math.cos(angle));
  
  // Рассчитываем координаты
  const x = centerX + r * Math.cos(angle);
  const y = centerY + r * Math.sin(angle);
  
  return { x, y };
};

/**
 * Рассчитывает позиции всех планет
 * 
 * @param planets Массив планет
 * @param centerX Координата X центра (Солнца)
 * @param centerY Координата Y центра (Солнца)
 * @returns Объект с позициями планет по их ID
 */
export const calculateAllPlanetPositions = (
  planets,
  centerX,
  centerY
) => {
  const positions = {};
  
  planets.forEach(planet => {
    positions[planet.id] = calculatePlanetPosition(planet, centerX, centerY);
  });
  
  return positions;
};
