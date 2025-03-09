import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CalorieLog = () => {
    const Navigate = useNavigate();
   
    const [calorieAmount, setCalorieAmount] = useState("");

    const saveCalorieLog = async () => {
        if(!calorieAmount.trim()) {
            alert("Please enter calorie(s) amount");
            return;
        };

        try {
            const token = localStorage.getItem("token");
            console.log(token);

            const response = await axios.post("http://localhost:4000/api/calories", {
                amount: calorieAmount
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                alert("Calorie(s) logged successfully!");
                setCalorieAmount("");
            } else {
                alert("Failed to log calorie(s)");
            }


        } catch (error) {
            console.error("Error logging calorie(s):", error.response ? error.response.data : error.message);
            alert("Error logging calorie(s)");
        }
    };


    return (
        <div className="calorie-log-container">
            <h2>Log Calorie Intake</h2>
            <input
                type="number"
                placeholder="Calorie Amount"
                value={calorieAmount}
                onChange={(e) => setCalorieAmount(e.target.value)}
            />
            <button onClick={saveCalorieLog}>Log Calories</button>
            <button onClick={() => Navigate('/main')}>Back to Home</button>
        </div>
    )
}

export default CalorieLog;