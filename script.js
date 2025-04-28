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
          <img src="toman.png" class="toman-icon" alt="تومان">
        </div>
      </div>
    </div>
  `;
}

function createCryptoCard(crypto) {
  return `
    <div class="card crypto-card">
      <div class="card-header">
        <img class="crypto-icon" src="${crypto.icon || 'default.png'}" alt="${crypto.name}">
        <div class="card-title-group">
          <div class="name">${crypto.name}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">$${formatNumber(Number(crypto.price).toFixed(2))}</div>
      </div>
    </div>
  `;
}

function createGoldCard(gold) {
  const formattedPrice = formatNumber(gold.price_toman);

  return `
    <div class="card gold-card">
      <div class="card-header">
        <img class="crypto-icon" src="gold.png" alt="${gold.title}">
        <div class="card-title-group">
          <div class="name">${gold.title}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">
          ${formattedPrice}
          <img src="toman.png" class="toman-icon" alt="تومان">
        </div>
      </div>
    </div>
  `;
}

async function loadCurrencyData() {
  try {
    const res = await fetch(CURRENCY_API);
    const data = await res.json();

    const currencyGrid = document.getElementById('currency-grid');
    currencyGrid.innerHTML = data.currency_rates.map(createCurrencyCard).join('');

    const goldGrid = document.getElementById('gold-grid');
    goldGrid.innerHTML = data.gold_prices.map(createGoldCard).join('');

    const cryptoGrid = document.getElementById('crypto-grid');
    cryptoGrid.innerHTML = data.cryptos.map(createCryptoCard).join('');

    const date = new Date(data.checked_at);
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
      <div style="font-family:"Kalameh"; 3color: gray; text-align: center; grid-column: 1/-1">
        خطا در دریافت داده‌ها
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadCurrencyData();
  
  setInterval(() => {
    loadCurrencyData();
  }, 60000);
});