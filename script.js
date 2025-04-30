if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Activated', reg))
      .catch(err => console.log('Error:', err));
  });
}

const CURRENCY_API = 'https://raw.githubusercontent.com/Anbeh/Riyal-api/refs/heads/main/data2.json';

function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return null;
  return new Intl.NumberFormat('en-US').format(Number(num));
}

function createCurrencyCard(currency) {
  return `
    <div class="card">
      <div class="card-header">
        <img class="crypto-icon" src="${currency.icon || 'default.png'}" alt="${currency.code}">
        <div class="card-title-group">
          <div class="name">${currency.name}</div>
          <div class="nickname">${currency.code}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">
          ${formatNumber(currency.price)}
          <img src="icons/toman.png" class="toman-icon" alt="تومان">
        </div>
      </div>
    </div>
  `;
}

const cryptoIconMap = {
  "Bitcoin": "btc.png",
  "Ethereum": "eth.png",
  "Tether": "usdt.png",
  "Ripple": "xrp.png",
  "Binance Coin": "bnb.png",
  "Solana": "sol.png",
  "USD Coin": "usdc.png",
  "Dogecoin": "doge.png",
  "Cardano": "ada.png",
  "TRON": "trx.png"
};

function createCryptoCard(crypto) {
  const iconPath = `icons/${crypto.name.toLowerCase().replace(/\s/g, '-')}.png`;

  return `
    <div class="card crypto-card">
      <div class="card-header">
        <img class="crypto-icon" src="${iconPath}" alt="${crypto.name}">
        <div class="card-title-group">
          <div class="name">${crypto.fullname}</div>
          <div class="nickname">${crypto.name}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">$${formatNumber(Number(crypto.price).toFixed(2))}</div>
      </div>
    </div>
  `;
}

function createGoldCard(gold) {
  const formattedPrice = formatNumber(gold.price_toman || gold.price);
  return `
    <div class="card gold-card">
      <div class="card-header">
        <img class="crypto-icon" src="icons/gold-bar.png" alt="${gold.title}">
        <div class="card-title-group">
          <div class="name">${gold.title}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">
          ${formattedPrice}
          <img src="icons/toman.png" class="toman-icon" alt="تومان">
        </div>
      </div>
    </div>
  `;
}

function createGoldCoinCard(coin) {
  const formattedPrice = formatNumber(coin.price_toman || coin.price);
  const isGram = coin.title === "سکه گرمی";
  const hideClass = isGram ? "hide-gheymat" : "";

  return `
    <div class="card gold-card ${hideClass}">
      <div class="card-header">
        <img class="crypto-icon" src="icons/gold-coin.png" alt="${coin.title}">
        <div class="card-title-group">
          <div class="name">${coin.title}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">
          ${formattedPrice}
          <img src="icons/toman.png" class="toman-icon" alt="تومان">
        </div>
      </div>
    </div>
  `;
}

async function loadCurrencyData() {
  try {
    const res = await fetch(CURRENCY_API);
    const data = await res.json();

    // ارزها
    const currencyGrid = document.getElementById('currency-grid');
    currencyGrid.innerHTML = data.currency_rates.map(createCurrencyCard).join('');

    // طلا
    const goldArray = Object.entries(data.gold_prices).map(([title, price]) => ({
      title,
      price_toman: price
    }));
    const goldGrid = document.getElementById('gold-grid');
    goldGrid.innerHTML = goldArray.map(createGoldCard).join('');

    // سکه‌ها
    const goldCoinGrid = document.getElementById('gold-coin-grid');
    if (goldCoinGrid) {
      goldCoinGrid.innerHTML = data.gold_coins.map(createGoldCoinCard).join('');
    }

    // رمزارزها
    const cryptoGrid = document.getElementById('crypto-grid');
    cryptoGrid.innerHTML = data.cryptos.map(createCryptoCard).join('');

    // زمان آخرین به‌روزرسانی
    const checkedAtString = data.checked_at.replace(' ', 'T');
    const date = new Date(checkedAtString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    document.getElementById('modified-time').textContent =
      `${new Intl.DateTimeFormat('en-US', options).format(date)}`;

  } catch (err) {
    console.error('Error loading data:', err);
    document.getElementById('currency-grid').innerHTML = `
      <div style="font-family:'Kalameh'; color: gray; text-align: center; grid-column: 1/-1">
        خطا در دریافت داده‌ها
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadCurrencyData();
  setInterval(() => {
    loadCurrencyData();
  }, 60000);
});