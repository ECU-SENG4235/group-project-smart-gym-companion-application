import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import "./challenge-detail.css"
import BackButton from "../img/back-button.png";
import axios from 'axios';

const ChallengeList = () => {
  const { id } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const challengesRes = await axios.get('http://localhost:4000/api/challenges', { 
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Challenges Response:", challengesRes.data);
        
        // Log the response to check its structure
        console.log("Challenges Response:", challengesRes.data);
  
        // Ensure challengesRes.data is an array
        const challengesData = Array.isArray(challengesRes.data.challenges) ? challengesRes.data.challenges : [];
        
        const userChallengesRes = await axios.get('http://localhost:4000/api/challenges/user', 
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Log the user challenges response
        console.log("User  Challenges Response:", userChallengesRes.data);
  
        // Ensure userChallengesRes.data is an array
        const userChallengesData = Array.isArray(userChallengesRes.data.userChallenges) ? userChallengesRes.data.userChallenges : [];
        
        // Create a set of challenge IDs the user has joined
        const joinedChallengeIds = new Set(
          userChallengesData.map(uc => uc.challenge_id)
        );
        
        // Mark challenges as joined if user has participated
        const mappedChallenges = challengesData.map(challenge => ({
          ...challenge,
          joined: joinedChallengeIds.has(challenge.id)
        }));
        
        setChallenges(mappedChallenges);
        console.log("Mapped Challenges:", mappedChallenges);
        setUserChallenges(userChallengesData);
        setLoading(false);
      } catch (err) {
        console.log(err.response ? err.response.data : err.message);
        setError('Failed to load challenges');
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

const handleJoinChallenge = async (challengeId) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found in localStorage.");
      setError('No token found. Please log in again.');
      return;
    }
    
    console.log("Joining challenge with ID:", challengeId);
    
    const res = await axios.post(
      `http://localhost:4000/api/challenges/${challengeId}/join`, // Use the passed parameter here
      {},
      { 
        headers: { 
          Authorization: `Bearer ${token}`
        } 
      }
    );
    
    console.log("Response:", res.data);
    
    // Update the challenges list to reflect the joined status
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, joined: true } 
          : challenge
      )
    );
    
  } catch (err) {
    console.error("Full error:", err);
    setError('Failed to join challenge');
  }
};
  if (loading) return <div>Loading challenges...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="challenges-container">
      <div className="header-container">
        <img 
          src={BackButton} 
          title="Back" 
          className="back-button" 
          onClick={() => window.history.back()} 
          alt="Back" 
        />
        <h2>Available Challenges</h2>
      </div>
      <div className="challenge-list">
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <div className="challenge-details">
              <span>Duration: {challenge.duration} days</span>
              <span>Reward: {challenge.reward_points} points</span>
            </div>
            <div className="challenge-actions">
              {!challenge.joined && (
                <button 
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="btn btn-primary"
                >
                  Join Challenge
                </button>
              )}
              {challenge.joined && (
                <span className="badge badge-success">Joined</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;