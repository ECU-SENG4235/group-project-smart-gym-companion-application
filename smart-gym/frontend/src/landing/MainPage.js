import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DailyTip from '../components/DailyTip'; // Import DailyTip
import "./MainPage.css";

const MainPage = () => {
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [todayWorkouts, setTodayWorkouts] = useState("Loading workouts...");
    const [todayCalories, setTodayCalories] = useState("Loading calories...");
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const toggleNav = () => setIsNavOpen(!isNavOpen);

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
        fetchActiveChallenges();
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
    
    const fetchActiveChallenges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:4000/api/challenges/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("response from API", response.data);
            
            const active = response.data.userChallenges.filter(challenge => challenge.completed !== 1);
            setActiveChallenges(active);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching challenges:", error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    const handleContinueChallenge = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    const handleBrowseChallenges = () => {
        navigate("/challenges");
    };
    
    return (
        <div className="main-container">
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
                    
                    {/* Challenges Section */}
                    <div className="challenge-section">
                        <div className="section-header">
                            <h3>Active Challenges</h3>
                            <button onClick={handleBrowseChallenges} className="browse-btn">Browse All</button>
                        </div>
                        
                        {loading ? (
                            <p>Loading challenges...</p>
                        ) : activeChallenges.length > 0 ? (
                            <div className="challenge-cards">
                                {activeChallenges.slice(0, 3).map(challenge => (
                                    <div key={challenge.id} className="challenge-card">
                                        <h4>{challenge.title}</h4>
                                        <div className="progress-container">
                                            <div className="progress-bar-wrapper">
                                                <div 
                                                    className="progress-bar" 
                                                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p>{Math.round((challenge.progress / challenge.target) * 100)}%</p>
                                        </div>
                                        <button 
                                            onClick={() => handleContinueChallenge(challenge.challenge_id)}
                                            className="continue-btn"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                ))}
                                
                                {activeChallenges.length > 3 && (
                                    <div className="more-challenges">
                                        <p>+ {activeChallenges.length - 3} more</p>
                                        <button onClick={handleBrowseChallenges}>View All</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-challenges">
                                <p>You haven't joined any challenges yet.</p>
                                <button onClick={handleBrowseChallenges}>Browse Challenges</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <button className="nav-button active">
                    <span className="nav-icon">📊</span>
                    <span>Activity</span>
                </button>
                <button className="nav-button" onClick={() => navigate('/coaching')}>
                    <span className="nav-icon">🎬</span>
                    <span>Coaching</span>
                </button>
                <button className="nav-button" onClick={() => navigate('/workout')}>
                    <span className="nav-icon">💪</span>
                    <span>Workout</span>
                </button>
                <button className="nav-button" onClick={() => navigate('/profile')}>
                    <span className="nav-icon">👤</span>
                    <span>Profile</span>
                </button>
                <button className="nav-button">
                    <span className="nav-icon">👨‍🏫</span>
                    <span>Trainer</span>
                </button>
            </div>

            {/* Daily Tip at the Bottom */}
            <DailyTip />
        </div>
    );
};

export default MainPage;