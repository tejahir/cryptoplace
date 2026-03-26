import React, { useContext, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import arrow_icon from '../../assets/arrow_icon.png';
import { CoinContext } from '../../context/CoinContextValue';
import { AuthContext } from '../../context/AuthContextValue';

const Navbar = () => {
  const { currency, setCurrency, supportedCurrencies } = useContext(CoinContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currencyHandler = (event) => {
    const nextCurrency = supportedCurrencies[event.target.value] || supportedCurrencies.usd;
    setCurrency(nextCurrency);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/signin');
  };

  React.useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className='navbar'>
      <Link to='/' className='brand' onClick={closeMenu}>
        <img src='/cryptomarket_transparent.png' alt='CryptoPlace logo' className='logo' />
        <div className='brand-copy'>
          <span>CryptoPlace</span>
          <small>Track the pulse of digital assets</small>
        </div>
      </Link>

      <button
        type='button'
        className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
        aria-label='Toggle navigation menu'
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-content ${isMenuOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li>
              <NavLink to='/' onClick={closeMenu}>
                Markets
              </NavLink>
            </li>
            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink to='/signup' onClick={closeMenu}>
                    Create account
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/signin' onClick={closeMenu}>
                    Sign in
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>
        </nav>

        <div className='nav-right'>
          <select value={currency.name} onChange={currencyHandler} aria-label='Choose display currency'>
            <option value='usd'>USD</option>
            <option value='eur'>EUR</option>
            <option value='inr'>INR</option>
          </select>

          {isAuthenticated ? (
            <>
              <div className='user-chip'>
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <button type='button' className='ghost-button logout-button' onClick={handleLogout}>
                Logout <img src={arrow_icon} alt='' />
              </button>
            </>
          ) : (
            <>
              <Link to='/signup' onClick={closeMenu}>
                <button type='button' className='ghost-button'>
                  Sign up <img src={arrow_icon} alt='' />
                </button>
              </Link>
              <Link to='/signin' onClick={closeMenu}>
                <button type='button' className='sign-in-button'>
                  Sign in <img src={arrow_icon} alt='' />
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
