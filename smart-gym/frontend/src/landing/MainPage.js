import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainPage.css";

const MainPage = () => {
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [todayWorkouts, setTodayWorkouts] = useState("Loading workouts...");
    const [todayCalories, setTodayCalories] = useState("Loading calories...");
    const navigate = useNavigate();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
            const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            setCurrentDateTime(`${formattedDate} | ${formattedTime}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        updateTodaySummary();
    }, []);

    const updateTodaySummary = async () => {
        try {
            const today = new Date().toISOString().split("T")[0];
    
          
            const token = localStorage.getItem("token");
    
            
            const workoutResponse = await axios.get(`http://localhost:4000/api/workouts/today`, {
                headers: { Authorization: `Bearer ${token}` } // Include the token
            });
    
            
            setTodayWorkouts(workoutResponse.data.workouts.length > 0
                ? workoutResponse.data.workouts.map(w => `• ${w.type} (${w.duration} mins)`).join("\n")
                : "No workouts logged today"
            );
    
         
            const calorieResponse = await axios.get(`http://localhost:4000/api/calories/today`, {
                headers: { Authorization: `Bearer ${token}` } 
            });
    
            // Set today's calorie intake
            setTodayCalories(calorieResponse.data.totalCalories
                ? `Total Calories Today: ${calorieResponse.data.totalCalories}`
                : "No calories logged today"
            );
 
            
            } catch (error) {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
                setTodayWorkouts("Error loading workouts");
                setTodayCalories("Error loading calories");
            }
    };
    
    return (
        <div className="main-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1 className="logo">Smart Gym Companion</h1>
                <div className="nav-links">
                    <button onClick={() => navigate("/workout-log")}>Workout Log</button>
                    <button onClick={() => navigate("/calorie-tracker")}>Calorie Tracker</button>
                    <button onClick={() => navigate("/progress-report")}>Progress Report</button>
                    <button onClick={() => navigate("/profile")}>Profile</button>
                </div>
            </nav>

            {/* Page Content - Left Aligned */}
            <div className="content">
                <div className="left-section">
                    <h2>Welcome to Smart Gym Companion</h2>
                    <p className="date-time">{currentDateTime}</p>

                    <div className="summary-card">
                        <h3>Today's Summary</h3>
                        <p>{todayWorkouts}</p>
                        <p>{todayCalories}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;

