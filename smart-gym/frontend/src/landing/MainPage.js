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
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState("");
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
        fetchGoals();
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

    const handleSetGoal =() =>{
        navigate("/set-goal");
    }

    const fetchGoals = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/goals/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Log the entire response object for debugging
            console.log('API Response:', response); // Log the full response object
            console.log('Response Data:', response.data); // Log the data part of the response

            // Since the response is an array, set the goals directly
            if (Array.isArray(response.data)) {
                setGoals(response.data);
            } else {
                throw new Error('Expected response to be an array');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while fetching goals');
            console.error('Error fetching goals:', err); // Log the error for debugging
        }
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
                    
                    <div className="challenges-goals-container">
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


                        {/* Goals Section */}
                        <div className="goal-section">
                            <div className="section-header">
                                <h3>Active Goals</h3>
                                <button onClick={handleSetGoal} className="set-goal-btn">Set New Goal</button>
                            </div>
                            
                            {loading ? (
                                <p>Loading goals...</p>
                            ) : goals.length > 0 ? (
                                <div className="goal-cards">
                                    {goals.map(goal => (
                                        <div key={goal.id} className="goal-card">
                                            <h4>{goal.title}</h4>
                                            <p>{goal.description}</p>
                                            <p>Duration: {goal.duration}</p>
                                        </div>
                                    ))}
                                </div>
                                ) : (
                                <div className="no-goals">
                                    <p>You haven't set any goals yet.</p>
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
        </div>
    );
};

export default MainPage;