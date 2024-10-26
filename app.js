const BASE_URL = "https://open.er-api.com/v6/latest?apikey=f1af1d910943f4e9c642d9ed";


const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }
    select.appendChild(option);
  }
  select.addEventListener("change", (e) => updateFlag(e.target));
}

// Fetch and display exchange rate
const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".amount input");
  let amountValue = amountInput.value;
  if (!amountValue || amountValue < 1) {
    amountValue = 1;
    amountInput.value = 1;
  }

  const url = `${BASE_URL}/${fromCurr.value}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.rates) {
      const rate = data.rates[toCurr.value];
      if (rate) {
        const finalAmount = (amountValue * rate).toFixed(2);
        msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
      } else {
        msg.innerText = "Exchange rate unavailable for the selected currency.";
      }
    } else {
      msg.innerText = "Failed to fetch the exchange rate.";
    }
  } catch (error) {
    msg.innerText = "Failed to fetch the exchange rate.";
  }
};

// Update flag icon when currency changes
const updateFlag = (element) => {
  const countryCode = countryList[element.value];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Set up event listeners
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
