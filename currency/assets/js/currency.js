const apiKey = "eZpYu61kFouZeU32uajmSD8Su4yL6Bwz";

function fetchData() {
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  // Validate form inputs
  if (!fromCurrency || !toCurrency || !fromDate || !toDate) {
    document.getElementById("errorMessages").innerText =
      "All fields are required!";
    return;
  }

  const currencyPair = `C:${fromCurrency}${toCurrency}`; 
  const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${currencyPair}/range/1/day/${fromDate}/${toDate}?apiKey=${apiKey}`;

  console.log("Fetching data from:", apiUrl);

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      if (data.results && data.results.length > 0) {
        displayChart(data.results);
      } else {
        document.getElementById("errorMessages").innerText =
          "No data available for the selected range.";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("errorMessages").innerText =
        "Error fetching data.";
    });
}

function displayChart(data) {
  const dates = data.map((item) => new Date(item.t).toLocaleDateString());
  const values = data.map((item) => item.c);

  let ctx = document.getElementById("currencyChart").getContext("2d");

  if (Chart.getChart("currencyChart")) {
    Chart.getChart("currencyChart").destroy();
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Exchange Rate",
          data: values,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function clearForm() {
  document.getElementById("currencyForm").reset();
  document.getElementById("errorMessages").innerText = "";
  const chart = Chart.getChart("currencyChart");
  if (chart) {
    chart.destroy();
  }
}
