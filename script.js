const BASE_URL =
  "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_KrPMAkq4fCIUCjYXHPdGUHIEZpfgjZj4n5ulO9cd";
const countryList = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "FR",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW",
};

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
