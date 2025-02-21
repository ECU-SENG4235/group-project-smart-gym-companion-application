import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login-Signup.css";

const LoginSignup = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({ login: false, signup: false });

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setErrors({});
    };

    const handleInputChange = (event, formType) => {
        const { name, value } = event.target;
        if (formType === "login") {
            setLoginData({ ...loginData, [name]: value });
        } else {
            setSignupData({ ...signupData, [name]: value });
        }
    };

    const togglePasswordVisibility = (type) => {
        setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }));
    };


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            alert("Login successful!");
        } catch (error) {
            setErrors({ email: "", password: error.message });
        }
        
        setTimeout(() => {
            navigate("/main");
        }, 1000);
    };

    // **Handle Signup**
    const handleSignup = async (event) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(signupData.password)) {
            setErrors({ password: "Password doesn't meet requirements" });
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert("Signup successful!");
        } catch (error) {
            setErrors({ email: error.message });
        }
    };

    return (
        <div className="container">
            <div className="tabs">
                <div className={`tab ${activeTab === "login" ? "active" : ""}`} onClick={() => handleTabSwitch("login")}>Login</div>
                <div className={`tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => handleTabSwitch("signup")}>Sign Up</div>
            </div>
            {activeTab === "login" ? (
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={loginData.email} onChange={(e) => handleInputChange(e, "login")} required />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type={showPassword.login ? "text" : "password"} name="password" value={loginData.password} onChange={(e) => handleInputChange(e, "login")} required />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <div className="form-group show-password">
                        <input type="checkbox" onChange={() => togglePasswordVisibility("login")} /> Show password
                    </div>
                    <button type="submit">Login</button>
                </form>
            ) : (
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={signupData.email} onChange={(e) => handleInputChange(e, "signup")} required />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type={showPassword.signup ? "text" : "password"} name="password" value={signupData.password} onChange={(e) => handleInputChange(e, "signup")} required />
                        <div className="password-requirements">
                          <ul>
                            Password must contain:
                            <li>At least 8 characters,</li>
                            <li>One uppercase letter</li> 
                            <li>One number,</li> 
                            <li>One special character (!@#$%^&*)</li>
                          </ul>
                        </div>
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <div className="form-group show-password">
                        <input type="checkbox" onChange={() => togglePasswordVisibility("signup")} /> Show password
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            )}
        </div>
    );
};

export default LoginSignup;
