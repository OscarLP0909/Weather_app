const apiKey = config.apiKey; // Reemplaza con tu clave de OpenWeather

document.getElementById("submit").addEventListener("click", fetchWeather);
document.getElementById("search").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchWeather();
  }
});

async function fetchWeather() {
  const searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.innerHTML = "";

  if (!searchInput) {
    weatherDataSection.innerHTML = `<p>Please enter a valid city name.</p>`;
    return;
  }

  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${apiKey}`;
  try {
    const geocodeResponse = await fetch(geocodeURL);
    console.log("Geocode Response:", geocodeResponse);
    const geocodeData = await geocodeResponse.json();
    console.log("Geocode Data:", geocodeData);

    if (geocodeData.length === 0) {
      weatherDataSection.innerHTML = `<p>City not found. Please try again.</p>`;
      return;
    }

    const { lat, lon, name, country } = geocodeData[0];
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherURL);
    console.log("Weather Response:", weatherResponse);
    const weatherData = await weatherResponse.json();
    console.log("Weather Data:", weatherData);

    if (!weatherData || weatherData.cod !== 200) {
      throw new Error("Invalid weather data");
    }

    weatherDataSection.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p class="weatherdata"><strong>Temperature:</strong> ${Math.round(weatherData.main.temp)}°C</p>
      <p class="weatherdata"><strong>Description:</strong> ${weatherData.weather[0].description}</p>
      <p class="weatherdata"><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
      <p class="weatherdata"><strong>Wind Speed:</strong> ${Math.round(weatherData.wind.speed) * 3.6} km/h</p>
      <p class="weatherdata"><strong>Pressure:</strong> ${weatherData.main.pressure} hPa</p>
      <p class="weatherdata"><strong>Visibility:</strong> ${weatherData.visibility / 1000} km</p>
      <p class="weatherdata"><strong>Cloudiness:</strong> ${weatherData.clouds.all}%</p>
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}" />
    `;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherDataSection.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
  }
}