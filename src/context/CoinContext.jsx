import { useEffect, useState } from 'react';
import { fetchCoinsMarkets } from '../services/coinGeckoApi';
import { CoinContext } from './CoinContextValue';

const supportedCurrencies = {
  usd: { name: 'usd', symbol: '$', label: 'USD' },
  eur: { name: 'eur', symbol: 'EUR', label: 'EUR' },
  inr: { name: 'inr', symbol: 'Rs', label: 'INR' },
};

const CoinContextProvider = ({ children }) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState(supportedCurrencies.usd);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadCoins = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetchCoinsMarkets(currency.name, controller.signal);
        setAllCoin(Array.isArray(response) ? response : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load market data right now.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadCoins();

    return () => controller.abort();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
    supportedCurrencies,
    isLoading,
    error,
  };

  return <CoinContext.Provider value={contextValue}>{children}</CoinContext.Provider>;
};

export default CoinContextProvider;
