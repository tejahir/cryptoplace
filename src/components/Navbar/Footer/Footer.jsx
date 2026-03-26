import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <p>Copyright {new Date().getFullYear()} CryptoPlace. All rights reserved.</p>
    </div>
  );
};

export default Footer;
