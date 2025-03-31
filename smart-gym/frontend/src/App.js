import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from './user/Login-Signup';
import MainPage from './landing/MainPage';
import WorkoutLog from './workout/WorkoutLog';
import CalorieLog from './workout/CalorieLog';
import DailyTip from './components/DailyTip'; 
import ProgressReport from "./progress/ProgressReport";
import ProfileEdit from "./user/ProfileEdit"; 
import ChallengeList from "./components/ChallengeList"
import ChallengeDetail from "./components/ChallengeDetail"
import UserChallenges from "./components/UserChallenges"
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          
          <Route path="/main" element={<>
            <Navbar />
            <MainPage />
          </>} />
          
          <Route path="/calorie-tracker" element={<>
            <Navbar />
            <CalorieLog />
            <DailyTip />
          </>} />
          <Route path="/workout-log" element={<>
            <Navbar />
            <WorkoutLog />
            <DailyTip /> 
          </>} />
          
          <Route path="/profile" element={<>
            <Navbar />
            <ProfileEdit />
          </>} />
          <Route path="/progress-report" element={<>
            <Navbar />
            <ProgressReport />
          </>} />
          
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenge/:id" element={<ChallengeDetail />} />
          <Route path="/my-challenges" element={<UserChallenges />} />
        </Routes>
      </Router>
  );
}

export default App;