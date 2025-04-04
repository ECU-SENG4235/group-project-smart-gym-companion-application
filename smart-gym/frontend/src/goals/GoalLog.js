import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GoalLog.css'; 

const GoalLog = () => {
    const [goals, setGoals] = useState([]); // Ensure initial state is an empty array
    const [error, setError] = useState('');

    useEffect(() => {
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

        fetchGoals();
    }, []);

    const handleDelete = async (goalId) => {
        try {
            await axios.delete(`http://localhost:4000/api/goals/${goalId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setGoals(goals.filter(goal => goal.id !== goalId)); // Update the state to remove the deleted goal
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while deleting the goal');
        }
    };

    const handleComplete = async (goalId) => {
        try {
            await axios.put(`http://localhost:4000/api/goals/${goalId}/complete`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Remove the completed goal from the state
            setGoals(goals.filter(goal => goal.id !== goalId));
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while completing the goal');
        }
    };

    const activeGoals = goals.filter(goal => !goal.completed); // Filter out completed goals
    const completedGoals = goals.filter(goal => goal.completed); // Filter out active goals

    return (
        <div className="goal-log-container">
            <div className="header-container">
                <h2>Your Goals</h2>
            </div>
            {error && <p className="error">{error}</p>}
            <ul className="goal-list">
                {goals.map(goal => (
                    <li key={goal.id} className="goal-card">
                        <h3>{goal.title}</h3>
                        <p>{goal.description}</p>
                        <p>Duration: {goal.duration}</p>
                        <button className="btn btn-success"onClick={() => handleComplete(goal.id)}>Mark as Completed</button>
                        <button className="btn btn-primary"onClick={() => handleDelete(goal.id)}>Delete Goal</button>
                    </li>
                ))}
            </ul>
            <div className="header-container">
                <h3>Completed Goals</h3>
            </div>
            <ul className="goal-list">
                {completedGoals.map(goal => (
                    <li key={goal.id} className="goal-completed">
                        <h4>{goal.title}</h4>
                        <p>{goal.description}</p>
                        <p>Duration: {goal.duration}</p>
                        <button className="btn btn-primary"onClick={() => handleDelete(goal.id)}>Delete Goal</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalLog;