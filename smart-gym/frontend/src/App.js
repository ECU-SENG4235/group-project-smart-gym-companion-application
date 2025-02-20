import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from './user/Login-Signup';
import MainPage from './landing/MainPage';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
    </Router>
  );
}

export default App;
