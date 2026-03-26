import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Coin.css';
import { CoinContext } from '../../context/CoinContextValue';
import LineChart from '../../components/Navbar/LineChart/LineChart';
import { fetchCoinDetails, fetchCoinHistory } from '../../services/coinGeckoApi';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { currency } = useContext(CoinContext);

  useEffect(() => {
    const controller = new AbortController();

    const loadCoin = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [coinDetails, coinHistory] = await Promise.all([
          fetchCoinDetails(coinId, controller.signal),
          fetchCoinHistory(coinId, currency.name, controller.signal),
        ]);

        setCoinData(coinDetails);
        setHistoricalData(Array.isArray(coinHistory?.prices) ? coinHistory.prices : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load coin details right now.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadCoin();

    return () => controller.abort();
  }, [coinId, currency]);

  if (isLoading) {
    return (
      <div className='spinner'>
        <div className='spin' />
      </div>
    );
  }

  if (error || !coinData) {
    return (
      <section className='coin coin-state'>
        <h2>We couldn&apos;t load this asset.</h2>
        <p>{error || 'Please try again in a moment.'}</p>
      </section>
    );
  }

  const marketData = coinData.market_data || {};
  const description = coinData.description?.en
    ?.replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <section className='coin'>
      <div className='coin-overview'>
        <div className='coin-name'>
          <img src={coinData.image?.large} alt={`${coinData.name} logo`} />
          <div>
            <p className='eyebrow'>Digital asset profile</p>
            <h1>
              {coinData.name} <span>({coinData.symbol?.toUpperCase()})</span>
            </h1>
          </div>
        </div>

        <div className='coin-summary'>
          <article>
            <span>Current price</span>
            <strong>
              {currency.symbol}
              {marketData.current_price?.[currency.name]?.toLocaleString() || 'N/A'}
            </strong>
          </article>
          <article>
            <span>Market cap</span>
            <strong>
              {currency.symbol}
              {marketData.market_cap?.[currency.name]?.toLocaleString() || 'N/A'}
            </strong>
          </article>
          <article>
            <span>24h change</span>
            <strong
              className={
                marketData.price_change_percentage_24h > 0 ? 'positive-text' : 'negative-text'
              }
            >
              {marketData.price_change_percentage_24h?.toFixed(2) || '0.00'}%
            </strong>
          </article>
          <article>
            <span>Market rank</span>
            <strong>#{coinData.market_cap_rank || 'N/A'}</strong>
          </article>
        </div>
      </div>

      <div className='coin-chart'>
        <LineChart historicalData={historicalData} currencySymbol={currency.symbol} />
      </div>

      <div className='coin-details'>
        <article>
          <h2>About {coinData.name}</h2>
          <p>{description ? `${description.slice(0, 260)}...` : 'No description available.'}</p>
        </article>
        <article>
          <h2>Market snapshot</h2>
          <ul>
            <li>
              <span>Total volume</span>
              <strong>
                {currency.symbol}
                {marketData.total_volume?.[currency.name]?.toLocaleString() || 'N/A'}
              </strong>
            </li>
            <li>
              <span>Circulating supply</span>
              <strong>{marketData.circulating_supply?.toLocaleString() || 'N/A'}</strong>
            </li>
            <li>
              <span>All time high</span>
              <strong>
                {currency.symbol}
                {marketData.ath?.[currency.name]?.toLocaleString() || 'N/A'}
              </strong>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default Coin;
