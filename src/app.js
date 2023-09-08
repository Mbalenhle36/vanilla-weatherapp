function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}
function formatTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  console.log(response.data);
  let weatherForecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (weatherDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `   <div class="col-2">
                <span class="forcast-date">${formatTime(weatherDay.time)}</span>
                <div>
                  <img
                    src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                      weatherDay.condition.icon
                    }.png"
                    alt=""
                    width="42"
                  />
                </div>
                <div class="temp-forecast">
                  <span class="forcast-max">${Math.round(
                    weatherDay.temperature.maximum
                  )}°</span>
                  <span class="forcast-min">${Math.round(
                    weatherDay.temperature.minimum
                  )}°</span>
                </div>
              </div> 
            `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  weatherForecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "3924a86bf345oaabbdfd30450684t789";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
  console.log(apiUrl);
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let datesElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  datesElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "3924a86bf345oaabbdfd30450684t789";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", showCelsiusTemperature);

search("Cape Town");
