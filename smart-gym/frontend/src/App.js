import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from './user/Login-Signup';
import MainPage from './landing/MainPage';
import WorkoutLog from './workout/WorkoutLog';
import DailyTip from './components/DailyTip'; //  Import DailyTip Component
import ProgressReport from "./progress/ProgressReport";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/main" element={<>
            <MainPage />
            <DailyTip /> {/*  Add Daily Tip Below Main Page */}
          </>} />
          <Route path="/workout-log" element={<>
            <WorkoutLog />
            <DailyTip /> {/*  Add Daily Tip Below Workout Log */}
          </>} />
          <Route path="/profile" element={<ProfileEdit />} />
        </Routes>
    </Router>
  );
}

export default App;
