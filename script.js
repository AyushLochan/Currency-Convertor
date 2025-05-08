// DOM elements
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const fromAmountInput = document.getElementById('from-amount');
const toAmountInput = document.getElementById('to-amount');
const rateInfoElement = document.getElementById('rate-info');
const swapButton = document.getElementById('swap-btn');
const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('error-message');
const currencyChips = document.querySelectorAll('.currency-chip');

const API_KEY = 'fca_live_sSQUVl4UF3KyAvpqkBERbKioVz8pWQIvJuT1FDAK';
const API_URL = 'https://api.freecurrencyapi.com/v1/latest';


let exchangeRates = {};
let currencies = {};

async function initialize() {
    try {
        showLoading(true);
        await fetchCurrencies();
        await fetchExchangeRates();
        populateCurrencyDropdowns();
        setDefaultCurrencies();
        calculate();
        setupEventListeners();
        showLoading(false);
    } catch (error) {
        showError(true);
        showLoading(false);
        console.error('Initialization error:', error);
    }
}

async function fetchCurrencies() {
    try {
        currencies = {
            USD: "United States Dollar",
            EUR: "Euro",
            GBP: "British Pound",
            JPY: "Japanese Yen",
            AUD: "Australian Dollar",
            CAD: "Canadian Dollar",
            CHF: "Swiss Franc",
            CNY: "Chinese Yuan",
            INR: "Indian Rupee",
            MXN: "Mexican Peso",
            BRL: "Brazilian Real",
            RUB: "Russian Ruble",
            KRW: "South Korean Won",
            SGD: "Singapore Dollar",
            NZD: "New Zealand Dollar",
            HKD: "Hong Kong Dollar",
            SEK: "Swedish Krona",
            ZAR: "South African Rand"
        };
    } catch (error) {
        throw new Error('Failed to fetch currencies');
    }
}

// Fetch exchange rates from the API
async function fetchExchangeRates() {
    try {
        exchangeRates = {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 154.32,
            AUD: 1.51,
            CAD: 1.36,
            CHF: 0.90,
            CNY: 7.23,
            INR: 85.73,
            MXN: 19.65,
            BRL: 5.12,
            RUB: 92.45,
            KRW: 1344.26,
            SGD: 1.34,
            NZD: 1.62,
            HKD: 7.82,
            SEK: 10.42,
            ZAR: 18.35
        };
    } catch (error) {
        throw new Error('Failed to fetch exchange rates');
    }
}

function populateCurrencyDropdowns() {
    for (const [code, name] of Object.entries(currencies)) {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.text = `${code} - ${name}`;

        const option2 = document.createElement('option');
        option2.value = code;
        option2.text = `${code} - ${name}`;

        fromCurrencySelect.appendChild(option1);
        toCurrencySelect.appendChild(option2);
    }
}

function setDefaultCurrencies() {
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
}

function calculate() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const fromAmount = parseFloat(fromAmountInput.value) || 0;

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        showError(true);
        return;
    }

    const toAmount = (fromAmount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];
    toAmountInput.value = toAmount.toFixed(4);

    const rate = (1 / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];
    rateInfoElement.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

function setupEventListeners() {
    fromCurrencySelect.addEventListener('change', calculate);
    toCurrencySelect.addEventListener('change', calculate);
    fromAmountInput.addEventListener('input', calculate);

    swapButton.addEventListener('click', () => {
        const tempCurrency = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = tempCurrency;
        calculate();
    });

    currencyChips.forEach(chip => {
        chip.addEventListener('click', () => {
            fromCurrencySelect.value = chip.dataset.currency;
            calculate();
        });
    });
}

function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

function showError(show) {
    errorMessageElement.style.display = show ? 'block' : 'none';
}

initialize();