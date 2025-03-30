document.getElementById("getForecast").addEventListener("click", function () {
  const location = document.getElementById("locationInput").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const locationDetails = document.getElementById("locationDetails");
  const forecastTableBody = document.querySelector("#forecastTable tbody");
  const forecastChartContainer = document.getElementById("forecastChart");

  // Clear previous results
  errorMessage.style.display = "none";
  locationDetails.innerHTML = "";
  forecastTableBody.innerHTML = "";
  forecastChartContainer.innerHTML = "";

  // Default to Kartchner Caverns if no input is given
  if (!location) {
    fetchWeather(
      31.8392,
      -110.3504,
      "Kartchner Caverns State Park",
      "Arizona",
      "USA"
    );
    return;
  }

  // Geocode the location
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const locationData = data.results[0];
        fetchWeather(
          locationData.latitude,
          locationData.longitude,
          locationData.name,
          locationData.admin1,
          locationData.country
        );
      } else {
        throw new Error("Location not found");
      }
    })
    .catch((error) => {
      console.error(error);
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    });
});

function fetchWeather(lat, lon, name, admin1, country) {
  const locationDetails = document.getElementById("locationDetails");
  const forecastTableBody = document.querySelector("#forecastTable tbody");
  const forecastChartContainer = document.getElementById("forecastChart");

  // Display location details
  locationDetails.innerHTML = `
        <h3>${name}, ${admin1}, ${country}</h3>
        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>
    `;

  // Fetch weather forecast
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America/Phoenix`;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((forecastData) => {
      const dailyForecasts = forecastData.daily;

      // Populate the table with forecast data
      dailyForecasts.temperature_2m_max.forEach((temp, index) => {
        const date = new Date(dailyForecasts.time[index]);
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${date.toDateString()}</td>
                    <td>${temp} °F</td>
                `;
        forecastTableBody.appendChild(row);
      });

      // Prepare data for the chart
      const dates = dailyForecasts.time.map((time) =>
        new Date(time).toDateString()
      );
      const maxTemps = dailyForecasts.temperature_2m_max;
      const minTemps = dailyForecasts.temperature_2m_min;

      // Create the chart
      new Chart(forecastChartContainer, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Max Temperature (°F)",
              data: maxTemps,
              borderColor: "rgb(255, 99, 132)",
              fill: false,
            },
            {
              label: "Min Temperature (°F)",
              data: minTemps,
              borderColor: "rgb(54, 162, 235)",
              fill: false,
            },
          ],
        },
      });
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}
