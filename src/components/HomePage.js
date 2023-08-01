import React from 'react';
import './HomePage.css';
import googleicon from './icons/google-icon.png';
import yahooicon from './icons/yahoo-icon.png';
import outlookicon from './icons/outlook-icon.png';
import cloudicon from './icons/cloud-icon.png';
import aolicon from './icons/aol-icon.png';

function HomePage() {
  const handleGoogleImap = async () => {
    try {
      window.location.href = '/google';
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      window.location.href = 'http://localhost:3000/google-auth';
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleOutlookAuth = async () => {
    try {
      window.location.href = 'http://localhost:3000/outlook-auth';
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

 return (
    <div className="home-page-container">
      <div className="banner">
      $25,000 GIVEAWAY
    </div>

    <div className='banner2'>
  <p className="banner-subtitle">100 WINNERS</p>
  <p className="banner-subtitle">$250 CASH PRIZES</p>
    </div>
      <p className="banner-entry">COMPLETE YOUR ENTRY BELOW!</p>
      <p className="home-page-h2">To enter: link the e-mail account used when shopping online to share your recent purchases and interests via online receipts.</p>
      <p className="home-page-h3">SELECT YOUR EMAIL PROVIDER</p>
      <div className='home-page-button-container'>
          <button className="home-page-button" onClick={handleGoogleImap}>
            <img src={googleicon} alt="Google2" />
          </button>
          <button className="home-page-button" onClick={handleGoogleAuth}>
            <img src={googleicon} alt="Google" />
          </button>
        <button className="home-page-button">
          <img src={yahooicon} alt="Yahoo" />
        </button>
        <button className="home-page-button" onClick={handleOutlookAuth}>
          <img src={outlookicon} alt="Outlook" />
        </button>
        <button className="home-page-button">
          <img src={cloudicon} alt="iCloud" />
        </button>
        <button className="home-page-button">
          <img src={aolicon} alt="AOL." />
        </button>
      </div>
      <div>
        <p className="home-page-text"><strong>Eligibility Requirement:</strong> Connect an e-mail inbox with at least 3 online receipts from the last 90 days.</p>
        <p className="home-page-text"> By connecting your e-mail account, EQ Rewards, is able to help understand you better through automated scanning to locate the merchant receipts in your inbox in order to deliver you better offers, deals and experiences from your favorite brands. Learn more</p>
        <p className="home-page-text">Legal Notice: By continuing, you agree to EQ Rewards Terms of Service and Privacy Policy, as well as the Official Sweepstakes Rules. The Privacy Policy describes how EQ Rewards as controller processes data gathered from or about you. We use information to enter you into sweepstakes, contests or promotions where requested, to provide, maintain, improve, and protect the Service, to analyze trends in consumer spending, to develop new services and to provide to our third-party partners to send promotional material. When you authorize us by consent to gather data from your e-mail inbox, EQ Rewards’ technology performs automated scanning to locate and analyze merchant receipts which are used both to create anonymized consumer profiles and audience segments for targeted marketing subject to legal restrictions.</p>
      </div>
    </div>
    
  );
}

export default HomePage;

