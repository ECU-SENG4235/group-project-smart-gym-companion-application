import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import "./challenge-detail.css";
import axios from 'axios';

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [userChallenge, setUserChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const challengeRes = await axios.get(`http:/localhost:4000/api/challenges/${id}`, 
           { headers: { Authorization: `Bearer ${token}` } }
        );
        setChallenge(challengeRes.data);
        
        // Check if user is participating
        try {
          const token = localStorage.getItem("token");
          const userChallengeRes = await axios.get(`/api/challenges/${id}/user`, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserChallenge(userChallengeRes.data);
          setProgress(userChallengeRes.data.progress);
        } catch (err) {
  
          setUserChallenge(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError('Failed to load challenge');
        setLoading(false);
      }
    };

    console.log("Raw token:", localStorage.getItem("token"));

    fetchChallengeData();
  }, [id]);

  const handleJoinChallenge = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found in localStorage.");
        setError('No token found. Please log in again.');
        return;
      }
      
      // Log the raw token and auth header
      console.log("Raw token:", token);
      console.log("Auth header:", `Bearer ${token}`);
      
      const res = await axios.post(
        `http://localhost:4000/api/challenges/${id}/join`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}` // Remove .trim() if it was still there
          } 
        }
      );
      
      console.log("Response:", res.data);
      setUserChallenge(res.data.userChallenge);
      setProgress(0);
      
    } catch (err) {
      console.error("Full error:", err);
      setError('Failed to join challenge');
    }
  };

  const handleUpdateProgress = async () => {
    try {
      const res = await axios.put(`http://localhost:4000/api/challenges/${id}/progress`, { progress });
      setUserChallenge(res.data.userChallenge);
      
      // Show reward notification if challenge completed
      if (res.data.message === 'Challenge completed!') {
        alert(`Congratulations! You earned ${res.data.reward} points!`);
      }
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  if (loading) return <div>Loading challenge details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!challenge) return <div>Challenge not found</div>;

  return (
    <div className="challenge-detail">
      <h2>{challenge.title}</h2>
      <div className="challenge-info">
        <p>{challenge.description}</p>
        <div className="challenge-meta">
          <p>Duration: {challenge.duration} days</p>
          <p>Target: {challenge.target}</p>
          <p>Reward: {challenge.reward_points} points</p>
        </div>
        
        {!userChallenge ? (
          <button 
            onClick={handleJoinChallenge}
            className="btn btn-lg btn-primary"
          >
            Join This Challenge
          </button>
        ) : (
          <div className="challenge-progress">
            <h3>Your Progress</h3>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${(progress / challenge.target) * 100}%` }}
              ></div>
            </div>
            <p>{progress} / {challenge.target} ({Math.round((progress / challenge.target) * 100)}%)</p>
            
            {!userChallenge.completed && (
              <div className="update-progress">
                <input
                  type="number"
                  min="0"
                  max={challenge.target}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                />

                <button 
                  onClick={handleUpdateProgress}
                  className="btn btn-success"
                >
                  Update Progress
                </button>
              </div>
            )}
            
            {userChallenge.completed === 1 && (
              <div className="challenge-completed">
                <h4>Challenge Completed! 🎉</h4>
                <p>You earned {challenge.reward_points} points!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;