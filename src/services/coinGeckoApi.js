const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_HEADERS = {
  accept: 'application/json',
  'x-cg-demo-api-key': 'CG-91Na3gF37jLkMimFB9B4FtwP',
};

const buildRequestOptions = (signal) => ({
  method: 'GET',
  headers: API_HEADERS,
  signal,
});

const fetchJson = async (path, signal) => {
  const response = await fetch(`${API_BASE_URL}${path}`, buildRequestOptions(signal));

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data && typeof data === 'object' && 'status' in data && data.status?.error_message) {
    throw new Error(data.status.error_message);
  }

  return data;
};

export const fetchCoinsMarkets = (currencyName, signal) =>
  fetchJson(
    `/coins/markets?vs_currency=${encodeURIComponent(
      currencyName,
    )}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`,
    signal,
  );

export const fetchCoinDetails = (coinId, signal) =>
  fetchJson(
    `/coins/${encodeURIComponent(
      coinId,
    )}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    signal,
  );

export const fetchCoinHistory = (coinId, currencyName, signal) =>
  fetchJson(
    `/coins/${encodeURIComponent(
      coinId,
    )}/market_chart?vs_currency=${encodeURIComponent(currencyName)}&days=10&interval=daily`,
    signal,
  );
