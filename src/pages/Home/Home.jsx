import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { CoinContext } from '../../context/CoinContextValue';
import { AuthContext } from '../../context/AuthContextValue';

const Home = () => {
  const { allCoin, currency, isLoading, error } = useContext(CoinContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const searchTerm = input.trim().toLowerCase();

    if (!searchTerm) {
      setDisplayCoin(allCoin);
      return;
    }

    const filteredCoins = allCoin.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.symbol.toLowerCase().includes(searchTerm),
    );

    setDisplayCoin(filteredCoins);
  }, [allCoin, input]);

  const featuredCoin = displayCoin[0] || allCoin[0];
  const searchSuggestions = input.trim() ? displayCoin.slice(0, 6) : [];

  return (
    <div className='home'>
      <section className='hero'>
        <div className='hero-badge'>Realtime market overview</div>
        <h1>Explore the global crypto market with clarity.</h1>
        <p>
          Search top-performing assets, review daily movement, and dive into price trends from a
          clean, responsive dashboard built for every screen.
        </p>

        <form onSubmit={(event) => event.preventDefault()} className='search-form'>
          <div className='search-box'>
            <input
              onChange={(event) => setInput(event.target.value)}
              value={input}
              type='text'
              placeholder='Search by coin name or symbol'
              aria-label='Search coins'
            />

            {searchSuggestions.length > 0 ? (
              <div className='search-suggestions'>
                {searchSuggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={isAuthenticated ? `/coin/${item.id}` : '/signin'}
                    className='search-suggestion'
                    onClick={() => setInput(item.name)}
                  >
                    <div className='search-suggestion-coin'>
                      <img src={item.image} alt={`${item.name} logo`} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                    <span className={item.price_change_percentage_24h > 0 ? 'green' : 'red'}>
                      {item.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <button type='submit'>Live search</button>
        </form>

        <div className='hero-stats'>
          <article>
            <strong>{allCoin.length || 0}+</strong>
            <span>Tracked assets</span>
          </article>
          <article>
            <strong>{currency.label}</strong>
            <span>Selected currency</span>
          </article>
          <article>
            <strong>{isAuthenticated ? 'Unlocked' : 'Login required'}</strong>
            <span>{isAuthenticated ? 'Protected details active' : 'Details stay protected'}</span>
          </article>
        </div>
      </section>

      {featuredCoin && !isLoading && !error ? (
        <section className='featured-coin'>
          <div>
            <p className='eyebrow'>Featured today</p>
            <h2>{featuredCoin.name}</h2>
            <p>
              Rank #{featuredCoin.market_cap_rank} with a current price of {currency.symbol}
              {featuredCoin.current_price.toLocaleString()} and a 24h change of{' '}
              {featuredCoin.price_change_percentage_24h?.toFixed(2)}%.
            </p>
          </div>
          <Link to={isAuthenticated ? `/coin/${featuredCoin.id}` : '/signin'}>
            {isAuthenticated ? 'Open details' : 'Sign in to view'}
          </Link>
        </section>
      ) : null}

      <section className='crypto-table'>
        <div className='table-layout table-head'>
          <p>#</p>
          <p>Coin</p>
          <p>Price</p>
          <p className='change-column'>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>

        {isLoading ? <div className='table-feedback'>Loading market data...</div> : null}
        {error ? <div className='table-feedback error'>{error}</div> : null}
        {!isLoading && !error && displayCoin.length === 0 ? (
          <div className='table-feedback'>No coins match your search.</div>
        ) : null}

        {!isLoading &&
          !error &&
          displayCoin.slice(0, 10).map((item) => (
            <Link to={`/coin/${item.id}`} className='table-layout table-row' key={item.id}>
              <p>{item.market_cap_rank}</p>
              <div className='coin-cell'>
                <img src={item.image} alt={`${item.name} logo`} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.symbol.toUpperCase()}</span>
                </div>
              </div>
              <p>
                {currency.symbol}
                {item.current_price.toLocaleString()}
              </p>
              <p
                className={`change-column ${
                  item.price_change_percentage_24h > 0 ? 'green' : 'red'
                }`}
              >
                {item.price_change_percentage_24h?.toFixed(2)}%
              </p>
              <p className='market-cap'>
                {currency.symbol}
                {item.market_cap.toLocaleString()}
              </p>
            </Link>
          ))}
      </section>
    </div>
  );
};

export default Home;
