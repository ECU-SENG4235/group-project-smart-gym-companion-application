import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./user-challenges.css"
import BackButton from "../img/back-button.png";
import axios from 'axios';

const UserChallenges = () => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserChallenges = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('http://localhost:4000/api/challenges/user',
        { headers: { Authorization: `Bearer ${token}` } }
        )

        const challenges = res.data.userChallenges

        console.log("API Response:", res.data)

        const active = [];
        const completed = [];
        
        challenges.forEach(userChallenge => {
          if (userChallenge.completed === 1) {
            completed.push(userChallenge);
          } else {
            active.push(userChallenge);
          }
        });
        
        setActiveChallenges(active);
        setCompletedChallenges(completed);
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError('Failed to load your challenges');
        setLoading(false);
      }
    };

    fetchUserChallenges();
  }, []);

  const handleContinue = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  if (loading) return <div>Loading your challenges...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-challenges">
      <div className="header-container">
        <img src={BackButton} alt="Back" className="back-button" onClick={() => navigate(-1)} />
        <h2>My Challenges</h2>
      </div>
      
      <h3>Active Challenges</h3>
      {activeChallenges.length === 0 ? (
        <p>You haven't joined any challenges yet. 
          <Link to="/challenges"> Browse available challenges</Link>
        </p>
      ) : (
        <div className="challenge-list">
          {activeChallenges.map(userChallenge => (
            <div key={userChallenge.id} className="challenge-card">
              <h4>{userChallenge.title}</h4>
              <div className="progress-container">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(userChallenge.progress / userChallenge.target) * 100}%` }}
                  ></div>
                </div>
                <p>{Math.round((userChallenge.progress / userChallenge.target) * 100)}%</p>
              </div>
              <button
                className="btn-primary" 
                onClick ={() => handleContinue(userChallenge.challenge_id)} >
                Continue Challenge
              </button>
            </div>
          ))}
        </div>
      )}
      
      <h3>Completed Challenges</h3>
      {completedChallenges.length === 0 ? (
        <p>You haven't completed any challenges yet.</p>
      ) : (
        <div className="challenge-list completed">
          {completedChallenges.map(userChallenge => (
            <div key={userChallenge.id} className="challenge-card completed">
              <h4>{userChallenge.title}</h4>
              <p>Completed on: {new Date(userChallenge.completed_at).toLocaleDateString()}</p>
              <p>Reward: {userChallenge.reward_points} points</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserChallenges;