import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import GooglePage from './components/GooglePage.js';
import FinalPage from './components/FinalPage.js';
import SuccessPage from './components/Success.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage/>} />
        <Route path="/google" element={<GooglePage/>} />
        <Route path="/final" element={<FinalPage/>} />
        <Route path="/success" element={<SuccessPage/>} />
      </Routes>
    </Router>
  );
}

export default App;