import React from 'react';
import './Success.css';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className='success-page-container'>
      <div className="success-page-blue-bar">$25,000 GIVEAWAY</div>
      <p className = 'success-page-title'>Thank You!</p>
      <p className = 'success-page-subtitle'>You've successfully entered the daily sweepstakes!</p>
      <Link to="/">
        <button className="success-page-button">BACK TO HOME</button>
      </Link>
    </div>
  );
};

export default Success;