const API_BASE_URL = 'https://api.le-systeme-solaire.net/rest';

/**
 * Класс для работы с API солнечной системы
 */
export class SolarSystemApi {
  /**
   * Получает данные о всех планетах солнечной системы
   */
  static async getPlanets() {
    try {
      const response = await fetch(`${API_BASE_URL}/bodies?filter[]=isPlanet,eq,true`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.bodies;
    } catch (error) {
      console.error('Не удалось найти планеты:', error);
      throw error;
    }
  }

  /**
   * Получает детальную информацию о конкретной планете по её ID
   */
  static async getPlanetById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/bodies/${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Не удалось найти планету ${id}:`, error);
      throw error;
    }
  }

  /**
   * Получает данные о солнце
   */
  static async getSun() {
    try {
      const response = await fetch(`${API_BASE_URL}/bodies/soleil`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Не удалось получить данные о солнце:', error);
      throw error;
    }
  }

  /**
   * Получает все небесные тела (планеты, спутники, астероиды и т.д.)
   */
  static async getAllBodies() {
    try {
      const response = await fetch(`${API_BASE_URL}/bodies`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.bodies;
    } catch (error) {
      console.error('Не удалось получить данные о всех небесных телах:', error);
      throw error;
    }
  }
}
