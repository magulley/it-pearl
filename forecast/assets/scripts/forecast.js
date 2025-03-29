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

  if (!location) {
    errorMessage.textContent = "Location is required!";
    errorMessage.style.display = "block";
    return;
  }

  // Use Open-Meteo API for geocoding and weather forecast
  const geoUrl = `https://api.open-meteo.com/v1/search?name=${location}&count=1`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const locationData = data.results[0];
        const lat = locationData.latitude;
        const lon = locationData.longitude;
        const name = locationData.name;
        const admin1 = locationData.admin1;
        const country = locationData.country;

        // Display location details
        locationDetails.innerHTML = `
                    <h3>${name}, ${admin1}, ${country}</h3>
                    <p>Latitude: ${lat}</p>
                    <p>Longitude: ${lon}</p>
                `;

        // Fetch temperature forecast
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=America/Phoenix`;

        return fetch(forecastUrl);
      } else {
        throw new Error("Location not found");
      }
    })
    .then((response) => response.json())
    .then((forecastData) => {
      const dailyForecasts = forecastData.daily;

      // Populate the table with forecast data
      dailyForecasts.temperature_2m_max.forEach((temp, index) => {
        const date = new Date(dailyForecasts.time[index]);
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${date.toDateString()}</td>
                    <td>${temp} °C</td>
                `;
        forecastTableBody.appendChild(row);
      });

      // Prepare the data for the chart
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
              label: "Max Temperature (°C)",
              data: maxTemps,
              borderColor: "rgb(255, 99, 132)",
              fill: false,
            },
            {
              label: "Min Temperature (°C)",
              data: minTemps,
              borderColor: "rgb(54, 162, 235)",
              fill: false,
            },
          ],
        },
      });
    })
    .catch((error) => {
      console.error(error);
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    });
});
