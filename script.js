const getWeatherForecast = async (cityName) => {
  try {
    const response = await fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        "x-rapidapi-key": "a2bdff4d7dmsh4f33e07adddcb1bp1045ecjsnad7d19613e04"
      },
    });
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const displayCityName = (weatherData) => {
  const cityNameDiv = document.getElementById("city-description");
  const cityName = weatherData.location.name;
  const countryName = weatherData.location.country;

  const element = `<h2>Showing the weather of ${cityName}, ${countryName}</h2>`;

  cityNameDiv.innerHTML = element;
}

const displayCurrentWeather = (weatherData) => {
  const currentWeatherDiv = document.getElementById("current-weather");

  const currentWeather = {
    condition: weatherData.current.condition.text,
    conditionImage: weatherData.current.condition.icon,
    temperature: weatherData.current.temp_c,
    humidity: weatherData.current.humidity,
    time: weatherData.current.last_updated
  }

  const element = `
  <div class="weather-container">
    <h2>Current Weather</h2>
    <p>"${currentWeather.condition}"</p>
    <img src="https:${currentWeather.conditionImage}" class="weather-image">
    <p>temperature: ${currentWeather.temperature}℃</p>
    <p>humidity: ${currentWeather.humidity}%</p>
    <p>(updated at ${currentWeather.time})</p>
  </div>
  `;

  currentWeatherDiv.innerHTML = element;
}

const displayForecastDesc = (weatherData) => {
  const forecastDiv = document.getElementById("forecast-description");

  const element = `<h2>Forecast For Next 3 Days</h2>`;

  forecastDiv.innerHTML = element;
}

const displayWeatherForecast = (weatherData) => {
  const forecastDiv = document.getElementById("weather-forecast");
  const forecasts = weatherData.forecast.forecastday;

  let listOfElement = "";
  for (let i = 0; i < forecasts.length; i++) {

    const forecastData = {
      date: forecasts[i].date,
      condition: forecasts[i].day.condition.text,
      conditionImage: forecasts[i].day.condition.icon,
      avg_temp: forecasts[i].day.avgtemp_c,
      max_temp: forecasts[i].day.maxtemp_c,
      min_temp: forecasts[i].day.mintemp_c,
      avg_humidity: forecasts[i].day.avghumidity
    }

    const element = `
    <div class="weather-container">
      <h2>"${forecastData.date}"</h2>
      <p>"${forecastData.condition}"</p>
      <img src="https:${forecastData.conditionImage}" class="weather-image">
      <p>temperature: ${forecastData.avg_temp}℃</p>
      <p>humidity: ${forecastData.avg_humidity}%</p>
    </div>
    `;

    listOfElement += element;
  }

  forecastDiv.innerHTML = listOfElement;
}

const showLoader = () => {
  document.getElementById('loader').classList.remove('hidden');
}

const hideLoader = () => {
  document.getElementById('loader').classList.add('hidden');
}

const showError = (message) => {
  const errorMessageDiv = document.getElementById('error-message');
  const element = `<p class="error-message">${message}</p>`;
  errorMessageDiv.innerHTML = element;
  errorMessageDiv.classList.remove('hidden');
}

const hideError = () => {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.classList.add('hidden');
  errorMessageDiv.innerHTML = '';
}

const hideWeatherInfo = () => {
  document.getElementById("city-description").classList.add('hidden');
  document.getElementById("current-weather").classList.add('hidden');
  document.getElementById("weather-forecast").classList.add('hidden');
  document.getElementById("forecast-description").classList.add('hidden');
}

const showWeatherInfo = () => {
  document.getElementById("city-description").classList.remove('hidden');
  document.getElementById("current-weather").classList.remove('hidden');
  document.getElementById("weather-forecast").classList.remove('hidden');
  document.getElementById("forecast-description").classList.remove('hidden');
}

const searchWeather = async () => {
  const cityName = document.getElementById("city-name").value;
  if (!cityName) {
    showError('Please enter a city name.');
    hideWeatherInfo();
    return;
  }

  showLoader();
  hideError();

  try {
    const weatherData = await getWeatherForecast(cityName);
    showWeatherInfo();
    displayCityName(weatherData);
    displayCurrentWeather(weatherData);
    displayForecastDesc(weatherData);
    displayWeatherForecast(weatherData);
  } catch (error) {
    showError('Cannot find the city name.');
    hideWeatherInfo();
  } finally {
    hideLoader();
  }
}
