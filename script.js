if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Activated', reg))
      .catch(err => console.log('Error:', err));
  });
}

const CURRENCY_API = 'https://anbeh.github.io/Riyal-api/data.json';
const CRYPTO_API = 'https://api.cryptorank.io/v0/coins/prices?keys=bitcoin,ethereum,tether,ripple,bnb,solana,usdcoin,dogecoin,cardano,tron&currency=USD';

const currencyMap = {
  'USD': { name: 'دلار آمریکا', key: 'usd' },
  'EUR': { name: 'یورو', key: 'eur' },
  'GBP': { name: 'پوند انگلیس', key: 'gbp' },
  'AED': { name: 'درهم امارات', key: 'aed' },
  'TRY': { name: 'لیر ترکیه', key: 'try' },
  'CNY': { name: 'یوان چین', key: 'cny' },
  'CAD': { name: 'دلار کانادا', key: 'cad' },
  'CHF': { name: 'فرانک سوئیس', key: 'chf' },
  'RUB': { name: 'روبل روسیه', key: 'rub' },
  'IQD': { name: 'دینار عراق', key: 'iqd' },
  'JPY': { name: 'ین ژاپن', key: 'jpy' }
};

const icons = {
  'USD': '🇺🇸',
  'EUR': '🇪🇺',
  'GBP': '🇬🇧',
  'AED': '🇦🇪',
  'TRY': '🇹🇷',
  'CNY': '🇨🇳',
  'CAD': '🇨🇦',
  'CHF': '🇨🇭',
  'RUB': '🇷🇺',
  'IQD': '🇮🇶',
  'JPY': '🇯🇵'
};

function formatNumber(num) {
  if (!num || isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(Number(num));
}

function createCurrencyCard(code, price) {
  const currency = currencyMap[code];
  const icon = icons[code] || '💱';

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title-group">
          <div class="name">${currency.name}</div>
          <div class="nickname">${code}</div>
        </div>
        <div class="icon">${icon}</div>
      </div>
      <div class="card-footer">
        <div class="price">${formatNumber(price)}</div>
      </div>
    </div>
  `;
}

async function loadCurrencyData() {
  try {
    const res = await fetch(CURRENCY_API);
    const data = await res.json();
    const grid = document.getElementById('currency-grid');
    
    const currencyCards = data.selected_rates
      .map(currency => {
        if (!currencyMap[currency.code]) return '';
        return createCurrencyCard(currency.code, currency.price);
      })
      .join('');
    
    grid.innerHTML = currencyCards;
    
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
      `Last update: ${new Intl.DateTimeFormat('en-US', options).format(date)}`;
    
  } catch (err) {
    document.getElementById('currency-grid').innerHTML = `
      <div style="color: gray; text-align: center; grid-column: 1/-1">
        خطا در دریافت داده‌ها
      </div>`;
  }
}

async function loadCryptoData() {
  try {
    const res = await fetch(CRYPTO_API);
    const data = await res.json();
    const grid = document.getElementById('crypto-grid');
    grid.innerHTML = data.data.map(createCryptoCard).join('');
  } catch (err) {
    console.error('Error loading crypto data:', err);
  }
}

const cryptoAbbreviations = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  tether: 'USDT',
  ripple: 'XRP',
  bnb: 'BNB',
  solana: 'SOL',
  usdcoin: 'USDC',
  dogecoin: 'DOGE',
  cardano: 'ADA',
  tron: 'TRX'
};

const cryptoIcons = {
  bitcoin: 'https://img.cryptorank.io/coins/60x60.bitcoin1524754012028.png',
  ethereum: 'https://img.cryptorank.io/coins/60x60.ethereum1524754015525.png',
  tether: 'https://img.cryptorank.io/coins/60x60.tether1645007690922.png',
  ripple: 'https://img.cryptorank.io/coins/60x60.xrp1634717634479.png',
  bnb: 'https://img.cryptorank.io/coins/60x60.bnb1732530324407.png',
  solana: 'https://img.cryptorank.io/coins/60x60.solana1606979093056.png',
  usdcoin: 'https://img.cryptorank.io/coins/60x60.usd coin1634317395959.png',
  dogecoin: 'https://img.cryptorank.io/coins/60x60.dogecoin1524754995294.png',
  cardano: 'https://img.cryptorank.io/coins/60x60.cardano1524754132195.png',
  tron: 'https://img.cryptorank.io/coins/60x60.tron1608810047161.png'
};

function createCryptoCard(crypto) {
  const symbol = cryptoAbbreviations[crypto.key] || crypto.key.toUpperCase();
  const roundedPrice = Number(crypto.price).toFixed(2); // دو رقم اعشار
  return `
    <div class="card crypto-card">
      <div class="card-header">
        <img class="crypto-icon" src="${cryptoIcons[crypto.key]}" alt="${symbol}">
        <div class="card-title-group">
          <div class="name">${crypto.key.toUpperCase()}</div>
          <div class="nickname">${symbol}</div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">$${formatNumber(roundedPrice)}</div>
      </div>
    </div>
  `;
}

loadCurrencyData();
loadCryptoData();

setInterval(() => {
  loadCurrencyData();
  loadCryptoData();
}, 60000);
