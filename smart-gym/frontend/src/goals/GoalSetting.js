import react, { useState } from 'react';
import axios from 'axios';
import './GoalSetting.css';
import { useNavigate } from 'react-router-dom';

const GoalSetting = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [duration, setDuration] = useState('');
    const [error, setError] = useState('');

    const HandleGoalChange = (event) => {
        const { name, value } = event.target;
        if (name === 'title') { 
            setTitle(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'duration') { 
            setDuration(value);
        }

    }

    const HandleSubmit = async (event) => {
        event.preventDefault();
        setError('')

        try {
            const response = await axios.post("http://localhost:4000/api/goals", {
                title,
                description,
                duration
            }
            , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status !== 201) {
                throw new Error('Failed to create goal');
            }
            console.log('Goal created:', response.data);
            navigate('/goals'); // Redirect to the goals page after successful creation
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            console.error('Error creating goal:', err);
        }
    }
    return (
        <div className="goal-setting">
            <h2>Set Your Goal</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={HandleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Goal Title"
                    value={title}
                    onChange={HandleGoalChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Goal Description"
                    value={description}
                    onChange={HandleGoalChange}
                    required
                />
                <input
                    type="text"
                    name="duration"
                    placeholder="Goal Duration"
                    value={duration}
                    onChange={HandleGoalChange}
                    required
                />
                <button type="submit">Save Goal</button>
            </form>
        </div>
    );
};

export default GoalSetting;