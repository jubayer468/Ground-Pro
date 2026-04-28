/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_KEY = (import.meta as any).env.VITE_OPENWEATHER_API_KEY;

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  if (!API_KEY) {
    console.warn("VITE_OPENWEATHER_API_KEY is not set. Weather features will be limited.");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) throw new Error("Weather API error");
    
    const data = await response.json();
    
    return {
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      forecast: `Current conditions in ${data.name}: ${data.weather[0].main} with ${data.main.temp}°C.`
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

export async function getWeatherByCity(city: string): Promise<WeatherData | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) throw new Error("Weather API error");
    
    const data = await response.json();
    
    return {
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      forecast: `Current conditions in ${data.name}: ${data.weather[0].main} with ${data.main.temp}°C.`
    };
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    return null;
  }
}
