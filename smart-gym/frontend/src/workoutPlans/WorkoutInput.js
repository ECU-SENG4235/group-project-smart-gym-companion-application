import React, { useState } from 'react';
import axios from 'axios';
import './WorkoutInput.css';

const WorkoutInput = () => {
    const [workouts, setWorkouts] = useState([{ type: '', duration: '', repititions: '' }]); // Array of workout objects
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index] = { ...updatedWorkouts[index], [name]: value }; 
        setWorkouts(updatedWorkouts);
    };

    const handleAddWorkout = () => {
        setWorkouts([...workouts, { type: '', duration: '', repititions: '' }]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post('/api/workoutplans/personal-plan', workouts, 
                {headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setWorkouts([{ type: '', duration: '', repititions: '' }]); 
        } catch (err) {
            console.error('Error creating workout plan:', err);
            setError('Failed to create workout plan. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Your Workout Plan</h2>
            <form className="workout-form" onSubmit={handleSubmit}>
                {workouts.map((workout, index) => (
                    <div key={index}>
                        <div>
                            <label>Workout Type:</label>
                            <input
                                type="text"
                                name="type"
                                value={workout.type}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </div>
                        <div>
                            <label>Duration (minutes):</label>
                            <input
                                type="number"
                                name="duration"
                                value={workout.duration}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </div>
                        <div>
                            <label>Repetitions:</label>
                            <input
                                type="number"
                                name="repititions"
                                value={workout.repititions}
                                onChange={(e) => handleChange(index, e)}
                                required
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddWorkout}>Add Another Workout</button>
                <button type="submit">Create Plan</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WorkoutInput;