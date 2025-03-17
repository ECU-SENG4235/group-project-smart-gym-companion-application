import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkoutList.css';

const WorkoutList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const workoutCategories = [
        {
            id: 1,
            title: 'Running',
            image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            path: '/workout-running'
        },
        {
            id: 2,
            title: 'Outdoor',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            path: '/workout-outdoor'
        },
        {
            id: 3,
            title: 'Strength',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            path: '/workout-strength'
        },
        {
            id: 4,
            title: 'Cycling',
            image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            path: '/workout-cycling'
        }
    ];

    const handleWorkoutClick = (path, title) => {
        // For now, we'll navigate to the workout log with the selected workout type
        localStorage.setItem('selectedWorkoutType', title);
        navigate('/workout-log');
        
        // In a real implementation with specific workout pages:
        // navigate(path);
    };

    return (
        <div className="workout-list-container">
            {/* Tab Navigation */}
            <div className="workout-tabs">
                <div 
                    className={`workout-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    <span className="tab-icon">🏋️</span>
                    <span className="tab-label">All</span>
                </div>
                <div 
                    className={`workout-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <span className="tab-icon">⭐</span>
                    <span className="tab-label">Favorites</span>
                </div>
                <div 
                    className={`workout-tab ${activeTab === 'recent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recent')}
                >
                    <span className="tab-icon">🕒</span>
                    <span className="tab-label">Recent</span>
                </div>
            </div>

            {/* Workout Categories */}
            <div className="workout-categories-grid">
                {workoutCategories.map(category => (
                    <div 
                        key={category.id} 
                        className="workout-category-card"
                        onClick={() => handleWorkoutClick(category.path, category.title)}
                    >
                        <img 
                            src={category.image} 
                            alt={category.title} 
                            className="category-image"
                        />
                        <div className="category-title-overlay">
                            <h2 className="category-title">{category.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Bottom Navigation */}
            <div className="bottom-navigation">
                <button className="nav-button" onClick={() => navigate('/main')}>
                    <span className="nav-icon">📊</span>
                    <span>Activity</span>
                </button>
                <button className="nav-button" onClick={() => navigate('/coaching')}>
                    <span className="nav-icon">🎬</span>
                    <span>Coaching</span>
                </button>
                <button className="nav-button active">
                    <span className="nav-icon">💪</span>
                    <span>Workout</span>
                </button>
                <button className="nav-button" onClick={() => navigate('/profile')}>
                    <span className="nav-icon">👤</span>
                    <span>Profile</span>
                </button>
                <button className="nav-button">
                    <span className="nav-icon">👨‍🏫</span>
                    <span>Trainer</span>
                </button>
            </div>
        </div>
    );
};

export default WorkoutList; 