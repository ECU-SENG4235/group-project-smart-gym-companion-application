import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from './user/Login-Signup';
import MainPage from './landing/MainPage';
import WorkoutLog from './workout/WorkoutLog';
import DailyTip from './components/DailyTip'; 
import ProgressReport from "./progress/ProgressReport";
import ProfileEdit from "./user/ProfileEdit"; 
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/main" element={<>
            <MainPage />
            <DailyTip /> 
          </>} />
          <Route path="/workout-log" element={<>
            <WorkoutLog />
            <DailyTip /> 
          </>} />
          <Route path="/profile" element={<ProfileEdit />} />
          <Route path="/progress-report" element={<ProgressReport />} />
        </Routes>
      </Router>
  );
}

export default App;