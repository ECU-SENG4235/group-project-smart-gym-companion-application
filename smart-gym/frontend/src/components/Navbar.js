import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./navbar.css";

const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsNavOpen(false); // Close the mobile menu after navigation
    };
    
    const handleLogoClick = () => {
        navigate('/main'); // Navigate to the main page
        setIsNavOpen(false); // Close mobile menu
    };

    return (
        <nav className="navbar">
            <h1 
                className="logo" 
                onClick={handleLogoClick} 
                style={{ cursor: 'pointer' }}
            >
                Smart Gym Companion
            </h1>
            
            <div className="hamburger" onClick={toggleNav}>
                <div className={`line ${isNavOpen ? 'open' : ''}`}></div>
                <div className={`line ${isNavOpen ? 'open' : ''}`}></div>
                <div className={`line ${isNavOpen ? 'open' : ''}`}></div>
            </div>
            
            <div className={`nav-links ${isNavOpen ? 'open' : ''}`}>
                <button onClick={() => handleNavigation("/workout-log")}>Workout Log</button>
                <button onClick={() => handleNavigation("/calorie-tracker")}>Calorie Tracker</button>
                <button onClick={() => handleNavigation("/progress-report")}>Progress Report</button>
                <button onClick={() => handleNavigation("/my-challenges")}>Challenges</button>
                <button onClick={() => handleNavigation("/coaching")}>Coaching</button>
                <button onClick={() => handleNavigation("/profile")}>Profile</button>
            </div>
        </nav>
    );

    
};



export default Navbar;