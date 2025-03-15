import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserChallenges = () => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserChallenges = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/challenges/user');

        const active = [];
        const completed = [];
        
        res.data.forEach(userChallenge => {
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
        setError('Failed to load your challenges');
        setLoading(false);
      }
    };

    fetchUserChallenges();
  }, []);

  if (loading) return <div>Loading your challenges...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-challenges">
      <h2>My Challenges</h2>
      
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
                <p>{userChallenge.progress} / {userChallenge.target}</p>
              </div>
              <Link to={`/challenge/${userChallenge.challenge_id}`} className="btn btn-primary">
                Continue Challenge
              </Link>
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