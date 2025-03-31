import React, { useState, useEffect } from "react";

const DailyTip = () => {
    const [tip, setTip] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:4000/api/DailyNotifications/daily-tip")
            .then(response => response.json())
            .then(data => {
                setTip(data.tip);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching daily tip:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="dailytips">
            <div style={styles.container}> 
                {loading ? (
                    <p style={styles.loading}>Loading...</p> 
                ) : (
                    <p style={styles.tip}><strong>Daily Tip:</strong> {tip}</p>
                )}
            </div>  
        </div>
    );
};

const styles = {
    container: {
        padding: "15px",
        backgroundColor: "#f3f3f3",
        textAlign: "center",
        marginTop: "20px",
        width: "80%",
        margin: "auto"
    },
    tip: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#333"
    },
    loading: {
        fontSize: "16px",
        color: "#666"
    }
};

export default DailyTip;