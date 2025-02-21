import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WorkoutLog.css";

const WorkoutLog = () => {

    const [workoutDuration, setWorkoutDuration] = useState("");
    const [workoutType, setWorkoutType] = useState("");
    const [workoutTypes, setWorkoutTypes] = useState([]);

    useEffect(() => {
        setWorkoutTypes(["Running", "Cycling", "Strength Training", "Yoga", "Swimming"]);
        setWorkoutType("Running"); 
    }, []);

    const saveWorkoutLog = async () => {
        if (!workoutDuration.trim()) {
            alert("Please enter workout duration");
            return;
        }
    
        try {
            const duration = parseInt(workoutDuration, 10);
            if (isNaN(duration) || duration <= 0) {
                alert("Please enter a valid duration");
                return;
            }

            const token = localStorage.getItem("token");
    
            const response = await axios.post(
                "http://localhost:4000/api/workouts", 
                {
                    type: workoutType,
                    duration: duration
                },
                {
                headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            if (response.status === 201) {
                alert("Workout logged successfully!");
                setWorkoutDuration("");
                setWorkoutType("Running");
            } else {
                alert("Failed to log workout");
            }
        } catch (error) {
            console.error("Error logging workout:", error);
            alert("Error logging workout");
        }
    };
    

    return (
        <div className="workout-log-container">
            <h2>Log Your Workout</h2>

            {/* Workout Type Selection */}
            <label>Workout Type:</label>
            <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
                {workoutTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>

            {/* Workout Duration Input */}
            <label>Duration (minutes):</label>
            <input
                type="number"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value)}
                placeholder="Enter duration in minutes"
            />

            {/* Save Button */}
            <button onClick={saveWorkoutLog}>Save Workout</button>
        </div>
    );
};

export default WorkoutLog;
