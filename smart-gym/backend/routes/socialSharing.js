// backend/routes/socialSharing.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

// Generate shareable workout summary
router.get("/workout-summary", authenticateUser, (req, res) => {
    const userId = req.user.id;
    const timeframe = req.query.timeframe || "week"; // Options: day, week, month
    
    let startDate;
    const today = new Date();
    
    if (timeframe === "day") {
        startDate = new Date().toISOString().split("T")[0]; // Today
    } else if (timeframe === "week") {
        // Get date from 7 days ago
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = weekAgo.toISOString().split("T")[0];
    } else if (timeframe === "month") {
        // Get date from 30 days ago
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        startDate = monthAgo.toISOString().split("T")[0];
    }
    
    const todayDate = today.toISOString().split("T")[0];
    
    // Get workout data from the specified timeframe
    db.all(
        `SELECT type, SUM(duration) as totalDuration, COUNT(*) as workoutCount 
         FROM workouts 
         WHERE user_id = ? AND date BETWEEN ? AND ?
         GROUP BY type`,
        [userId, startDate, todayDate],
        (err, workouts) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve workout data" });
            }
            
            // Get total calories burned in the same timeframe (if you track this)
            db.get(
                `SELECT SUM(amount) as totalCalories
                 FROM calories
                 WHERE user_id = ? AND date BETWEEN ? AND ?`,
                [userId, startDate, todayDate],
                (err, calorieData) => {
                    if (err) {
                        return res.status(500).json({ error: "Failed to retrieve calorie data" });
                    }
                    
                    // Get completed challenges in the timeframe
                    db.all(
                        `SELECT c.title
                         FROM user_challenges uc
                         JOIN challenges c ON uc.challenge_id = c.id
                         WHERE uc.user_id = ? AND uc.completed = 1
                         AND uc.completed_at BETWEEN datetime(?) AND datetime(?)`,
                        [userId, startDate, todayDate],
                        (err, challenges) => {
                            if (err) {
                                return res.status(500).json({ error: "Failed to retrieve challenge data" });
                            }
                            
                            // Get user name for personalization
                            db.get(
                                `SELECT u.username, p.first_name, p.last_name
                                 FROM users u
                                 LEFT JOIN profiles p ON u.id = p.user_id
                                 WHERE u.id = ?`,
                                [userId],
                                (err, userData) => {
                                    if (err) {
                                        return res.status(500).json({ error: "Failed to retrieve user data" });
                                    }
                                    
                                    // Generate share text
                                    const userName = userData?.first_name || userData?.username || "I";
                                    let shareText = `${userName} crushed it with `;
                                    
                                    if (workouts.length > 0) {
                                        const workoutSummary = workouts.map(w => 
                                            `${w.workoutCount} ${w.type} workouts (${w.totalDuration} mins)`
                                        ).join(", ");
                                        shareText += workoutSummary;
                                    } else {
                                        shareText += "my fitness journey";
                                    }
                                    
                                    if (calorieData && calorieData.totalCalories) {
                                        shareText += ` and burned ${calorieData.totalCalories} calories`;
                                    }
                                    
                                    if (challenges && challenges.length > 0) {
                                        shareText += `. Completed ${challenges.length} challenges: `;
                                        shareText += challenges.map(c => c.title).join(", ");
                                    }
                                    
                                    shareText += ` in the past ${timeframe}! 💪 #SmartGym #FitnessJourney`;
                                    
                                    // Generate share URLs for different platforms
                                    const encodedText = encodeURIComponent(shareText);
                                    
                                    const shareLinks = {
                                        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
                                        facebook: `https://www.facebook.com/sharer/sharer.php?u=YOUR_APP_URL&quote=${encodedText}`,
                                        // Instagram doesn't support direct sharing via URL, but we can provide the text to copy
                                        instagram: {
                                            copyText: shareText
                                        }
                                    };
                                    
                                    res.json({
                                        success: true,
                                        shareText,
                                        shareLinks,
                                        stats: {
                                            workouts,
                                            calories: calorieData?.totalCalories || 0,
                                            completedChallenges: challenges || []
                                        }
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Share a specific challenge completion
router.get("/challenge/:challengeId", authenticateUser, (req, res) => {
    const userId = req.user.id;
    const { challengeId } = req.params;
    
    // Get challenge and user data
    db.get(
        `SELECT c.title, c.description, uc.completed_at, c.reward_points
         FROM challenges c
         JOIN user_challenges uc ON c.id = uc.challenge_id
         WHERE c.id = ? AND uc.user_id = ? AND uc.completed = 1`,
        [challengeId, userId],
        (err, challenge) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            
            if (!challenge) {
                return res.status(404).json({ error: "Challenge not found or not completed" });
            }
            
            db.get(
                `SELECT u.username, p.first_name
                 FROM users u
                 LEFT JOIN profiles p ON u.id = p.user_id
                 WHERE u.id = ?`,
                [userId],
                (err, userData) => {
                    if (err) {
                        return res.status(500).json({ error: "Failed to retrieve user data" });
                    }
                    
                    const userName = userData?.first_name || userData?.username || "I";
                    
                    // Generate share text
                    const shareText = `${userName} just completed the "${challenge.title}" challenge on SmartGym and earned ${challenge.reward_points} points! 🏆 #FitnessGoals #SmartGym`;
                    
                    // Generate share URLs
                    const encodedText = encodeURIComponent(shareText);
                    
                    const shareLinks = {
                        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
                        facebook: `https://www.facebook.com/sharer/sharer.php?u=YOUR_APP_URL&quote=${encodedText}`,
                        instagram: {
                            copyText: shareText
                        }
                    };
                    
                    res.json({
                        success: true,
                        shareText,
                        shareLinks,
                        challenge
                    });
                }
            );
        }
    );
});

module.exports = router;