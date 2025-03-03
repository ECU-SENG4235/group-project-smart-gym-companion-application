import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileEdit.css";

const ProfileEdit = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        fitnessLevel: "",
        goals: {
            weightLoss: false,
            muscleGain: false,
            endurance: false,
            strength: false,
            flexibility: false,
            generalFitness: false
        },
        workoutDays: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
        },
        medicalConditions: ""
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState("");
    const [imageFile, setImageFile] = useState(null);

    // This would fetch user profile data when component mounts
    useEffect(() => {
        // Fetch user profile data from backend
        // For now using placeholder data
        /*
        const fetchProfileData = async () => {
            try {
                const response = await fetch("http://localhost:4000/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfileData(data);
                if (data.profileImage) {
                    setPreviewImage(data.profileImage);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfileData();
        */
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleCheckboxChange = (category, name) => {
        setProfileData({
            ...profileData,
            [category]: {
                ...profileData[category],
                [name]: !profileData[category][name]
            }
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!profileData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^[a-zA-Z0-9_]{3,15}$/.test(profileData.username)) {
            newErrors.username = "Username must be 3-15 characters and contain only letters, numbers, and underscores";
        }

        if (!profileData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!profileData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!profileData.age || profileData.age < 16 || profileData.age > 100) {
            newErrors.age = "Age must be between 16-100";
        }

        if (!profileData.height || profileData.height < 100 || profileData.height > 250) {
            newErrors.height = "Height must be between 100-250 cm";
        }

        if (!profileData.weight || profileData.weight < 30 || profileData.weight > 300) {
            newErrors.weight = "Weight must be between 30-300 kg";
        }

        if (!profileData.fitnessLevel) {
            newErrors.fitnessLevel = "Please select your fitness level";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Prepare form data for API submission
        const formData = new FormData();

        // Append profile image if exists
        if (imageFile) {
            formData.append("profileImage", imageFile);
        }

        // Append other profile data
        formData.append("profileData", JSON.stringify(profileData));

        try {
            // This would be the actual API call
            /*
            const response = await fetch("http://localhost:3000/profile/update", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update profile");
            }

            alert("Profile updated successfully!");
            */

            // For now, just log the data and show success message
            console.log("Profile data to submit:", profileData);
            console.log("Image file:", imageFile);
            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Error updating profile:", error);
            setErrors({ submit: error.message });
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">Complete Your Fitness Profile</h1>

            <form onSubmit={handleSubmit}>
                <div className="profile-image-container">
                    <div className="profile-image-preview">
                        <img src={previewImage} alt=""/>
                    </div>
                    <div className="file-input-container">
                        <label className="file-input-button" htmlFor="profileImage">
                            Upload Photo
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.firstName && <div className="error">{errors.firstName}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.lastName && <div className="error">{errors.lastName}</div>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={profileData.age}
                            onChange={handleInputChange}
                            min="16"
                            max="100"
                            required
                        />
                        {errors.age && <div className="error">{errors.age}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={profileData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not">Prefer not to say</option>
                        </select>
                        {errors.gender && <div className="error">{errors.gender}</div>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="height">Height (cm)</label>
                        <input
                            type="number"
                            id="height"
                            name="height"
                            value={profileData.height}
                            onChange={handleInputChange}
                            min="100"
                            max="250"
                            required
                        />
                        {errors.height && <div className="error">{errors.height}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight (kg)</label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={profileData.weight}
                            onChange={handleInputChange}
                            min="30"
                            max="300"
                            required
                        />
                        {errors.weight && <div className="error">{errors.weight}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="fitnessLevel">Fitness Level</label>
                    <select
                        id="fitnessLevel"
                        name="fitnessLevel"
                        value={profileData.fitnessLevel}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select your level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                    {errors.fitnessLevel && <div className="error">{errors.fitnessLevel}</div>}
                </div>

                <div className="form-group">
                    <label>Fitness Goals</label>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="weightLoss"
                                checked={profileData.goals.weightLoss}
                                onChange={() => handleCheckboxChange("goals", "weightLoss")}
                            />
                            <label htmlFor="weightLoss">Weight Loss</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="muscleGain"
                                checked={profileData.goals.muscleGain}
                                onChange={() => handleCheckboxChange("goals", "muscleGain")}
                            />
                            <label htmlFor="muscleGain">Muscle Gain</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="endurance"
                                checked={profileData.goals.endurance}
                                onChange={() => handleCheckboxChange("goals", "endurance")}
                            />
                            <label htmlFor="endurance">Endurance</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="strength"
                                checked={profileData.goals.strength}
                                onChange={() => handleCheckboxChange("goals", "strength")}
                            />
                            <label htmlFor="strength">Strength</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="flexibility"
                                checked={profileData.goals.flexibility}
                                onChange={() => handleCheckboxChange("goals", "flexibility")}
                            />
                            <label htmlFor="flexibility">Flexibility</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="generalFitness"
                                checked={profileData.goals.generalFitness}
                                onChange={() => handleCheckboxChange("goals", "generalFitness")}
                            />
                            <label htmlFor="generalFitness">General Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Preferred Workout Days</label>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="monday"
                                checked={profileData.workoutDays.monday}
                                onChange={() => handleCheckboxChange("workoutDays", "monday")}
                            />
                            <label htmlFor="monday">Monday</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="tuesday"
                                checked={profileData.workoutDays.tuesday}
                                onChange={() => handleCheckboxChange("workoutDays", "tuesday")}
                            />
                            <label htmlFor="tuesday">Tuesday</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="wednesday"
                                checked={profileData.workoutDays.wednesday}
                                onChange={() => handleCheckboxChange("workoutDays", "wednesday")}
                            />
                            <label htmlFor="wednesday">Wednesday</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="thursday"
                                checked={profileData.workoutDays.thursday}
                                onChange={() => handleCheckboxChange("workoutDays", "thursday")}
                            />
                            <label htmlFor="thursday">Thursday</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="friday"
                                checked={profileData.workoutDays.friday}
                                onChange={() => handleCheckboxChange("workoutDays", "friday")}
                            />
                            <label htmlFor="friday">Friday</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="saturday"
                                checked={profileData.workoutDays.saturday}
                                onChange={() => handleCheckboxChange("workoutDays", "saturday")}
                            />
                            <label htmlFor="saturday">Saturday</label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="sunday"
                                checked={profileData.workoutDays.sunday}
                                onChange={() => handleCheckboxChange("workoutDays", "sunday")}
                            />
                            <label htmlFor="sunday">Sunday</label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="medicalConditions">Medical Conditions or Injuries</label>
                    <textarea
                        id="medicalConditions"
                        name="medicalConditions"
                        value={profileData.medicalConditions}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Please list any medical conditions or injuries that might affect your workout (optional)"
                    ></textarea>
                </div>

                {errors.submit && <div className="error">{errors.submit}</div>}
                <button type="submit">Save Profile</button>
            </form>
            <button onCLick={() => navigate("/main")}>Back to Home</button>
        </div>
    );
};

export default ProfileEdit;