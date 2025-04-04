import react, { useState } from 'react';
import axios from 'axios';
import './GoalSetting.css';
import { useNavigate } from 'react-router-dom';

const GoalSetting = () => {
    const navigate = useNavigate();
    const [goal, setGoal] = useState('');
    const [error, setError] = useState('');

    const HandleGoalChange = (event) => {
        setGoal(event.target.value);

    }
}

export default GoalSetting;