async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = config.apiKey;
  
    if (searchInput === "") {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Empty Input!</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return;
    }
  
    async function getLonAndLat() {
      const countryCode = 34; // Spain?
      const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
  
      const response = await fetch(geocodeURL);
      if (!response.ok) {
        console.log("Bad response ", response.status);
        return;
      }
  
      const data = await response.json();
        console.log("Geocode data: ", data);
  
      if (data.length === 0) {
        console.log("No data returned from geocoding API.");
        weatherDataSection.innerHTML = `
          <div>
            <h2>Invalid Input: "${searchInput}"</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
          </div>
        `;
        return;
      } else {
        console.log("Geocode data: ", data);
        return data[0]; 
      }
    }
  
    async function getWeatherData(lon, lat, displayName) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);
        const data = await response.json();
      
        console.log("Weather data:", data);
      
        weatherDataSection.style.display = "flex";
        weatherDataSection.style.flexDirection = "column";
        weatherDataSection.style.alignItems = "center";
        weatherDataSection.style.justifyContent = "center";
        weatherDataSection.style.textAlign = "center";
        weatherDataSection.style.border = "1px solid #ccc";
        weatherDataSection.style.borderRadius = "10px";
        weatherDataSection.style.backgroundColor = "#f9f9f9";
        weatherDataSection.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="${data.weather[0].description}" width="100" />
        <div style="margin-top: 5px; font-size: 1em; color: #333; text-align: left; width: 100%;">
          <h2 style="text-align: center;">${displayName}, ${data.sys.country}</h2>
          <p class="weatherdata"><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
          <p class="weatherdata"><strong>Description:</strong> ${data.weather[0].description}</p>
          <p class="weatherdata"><strong>Humidity:</strong> ${data.main.humidity}%</p>
          <p class="weatherdata"><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
          <p class="weatherdata"><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
          <p class="weatherdata"><strong>Visibility:</strong> ${data.visibility / 1000} km</p>
          <p class="weatherdata"><strong>Cloudiness:</strong> ${data.clouds.all}%</p>
          <p class="weatherdata"><strong>Sunrise:</strong> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p class="weatherdata"><strong>Sunset:</strong> ${new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        `;
        weatherDataSection.style.padding = "20px";
        weatherDataSection.style.width = "300px"; // Set a fixed width for the weather data section
        weatherDataSection.style.maxWidth = "90%"; // Ensure it doesn't exceed the viewport width
        weatherDataSection.style.marginTop = "10px"; // Center the section horizontally

      }
      
  
    document.getElementById("search").value = "";
  
    const geocodeData = await getLonAndLat();
    if (geocodeData) {
      await getWeatherData(geocodeData.lon, geocodeData.lat, geocodeData.name);
    }
  }
  