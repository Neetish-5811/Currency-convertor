const BASE_URL =
  "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_KrPMAkq4fCIUCjYXHPdGUHIEZpfgjZj4n5ulO9cd";

const dropdowns = document.querySelectorAll(".dropdown select");

// Populate dropdowns with currency codes and country flags
function populateDropdowns(rates) {
  dropdowns.forEach((select) => {
    select.innerHTML = "";
    Object.keys(rates).forEach((currency) => {
      // countryList is defined in codes.js
      const countryCode = countryList[currency] || "US";
      const option = document.createElement("option");
      option.value = currency;
      option.textContent = currency;
      option.setAttribute("data-flag", countryCode);
      select.appendChild(option);
    });
  });
  updateFlags();
}

// Update flag images based on selected currency
function updateFlags() {
  document.querySelectorAll(".select-container").forEach((container) => {
    const select = container.querySelector("select");
    const img = container.querySelector("img");
    if (select && img) {
      const selectedCurrency = select.value;
      const countryCode = countryList[selectedCurrency] || "US";
      img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
  });
}

// Fetch currency rates from the API and populate dropdowns
async function fetchCurrencyRates() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    const rates = result.data;
    populateDropdowns(rates);
    setupConvertHandler(rates);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
  }
}

// Set up event listeners for dropdowns and convert button
function setupConvertHandler(rates) {
  dropdowns.forEach((select) => {
    select.addEventListener("change", updateFlags);
  });
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    convertCurrency(rates);
  });
}

// Perform currency conversion and update result
function convertCurrency(rates) {
  const amount = parseFloat(document.querySelector(".amount input").value);
  const fromCurrency = dropdowns[0].value;
  const toCurrency = dropdowns[1].value;
  if (isNaN(amount) || !rates[fromCurrency] || !rates[toCurrency]) {
    document.getElementById("result").textContent = "Invalid input.";
    return;
  }
  const converted = (amount / rates[fromCurrency]) * rates[toCurrency];
  document.getElementById(
    "result"
  ).textContent = `${amount} ${fromCurrency} = ${converted.toFixed(
    2
  )} ${toCurrency}`;
}

// Initial fetch and setup
fetchCurrencyRates();
