import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProgressReport.css'; 

const ProgressReport = () => {
    const [loggedWorkouts, setLoggedWorkouts] = useState([]);

    useEffect(() => {
        fetchLoggedWorkouts();
    }, []);

    const fetchLoggedWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:4000/api/workouts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoggedWorkouts(response.data.workouts); 
        } catch (error) {
            console.error("Error fetching workouts:", error);
            alert("Error fetching workouts");
        }
    };

    return (
        <div className="progress-report-container">
            <h2>Progress Report</h2>
            {loggedWorkouts.length === 0 ? (
                <p>No workouts logged yet.</p>
            ) : (
                <ul>
                    {loggedWorkouts.map((workout, index) => (
                        <li key={index}>
                            {workout.type} - {workout.duration} minutes
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProgressReport;