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

    const handleRemoveWorkout = (index) => {
        // Don't remove if it's the last workout
        if (workouts.length <= 1) return;
        
        const updatedWorkouts = [...workouts];
        updatedWorkouts.splice(index, 1);
        setWorkouts(updatedWorkouts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:4000/api/workout-plans/personal-plan", workouts, 
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
        <div className="workout-input-container">
            <h2 className='work-hdr'>Create Your Workout Plan</h2>
            <div className="workout-card">
                <form className="workout-form" onSubmit={handleSubmit}>
                    {workouts.map((workout, index) => (
                        <div key={index} className='workout-map'>
                            <div style={{ position: 'relative' }}>
                                <label>Workout Type:</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={workout.type}
                                    onChange={(e) => handleChange(index, e)}
                                    required
                                />
                                <button 
                                    type="button"
                                    title='Remove Workout' 
                                    className='remove-wrkout'
                                    onClick={() => handleRemoveWorkout(index)}
                                >
                                    -
                                </button>
                            </div>
                            <div>
                                <label> Duration (minutes):</label>
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
            </div>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WorkoutInput;