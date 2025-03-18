const express = require("express");
const router = express.Router();
const db = require("../db"); 
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, (req, res) => {
  db.all(`SELECT * FROM challenges`, [], (err, challenges) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ challenges });
  });
});

router.get("/user", authenticateUser, (req, res) => {
  const userId = req.user.id;
  
  db.all(
    `SELECT uc.*, c.title, c.description, c.target, c.reward_points, c.duration
     FROM user_challenges uc
     JOIN challenges c ON uc.challenge_id = c.id
     WHERE uc.user_id = ?`,
    [userId],
    (err, userChallenges) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("User  challenges found:", userChallenges);
      res.json({ userChallenges });
    }
  );
});

router.get("/:challengeId", authenticateUser, (req, res) => {
    const { challengeId } = req.params;
    
    db.get(
      `SELECT * FROM challenges WHERE id = ?`,
      [challengeId],
      (err, challenge) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        if (!challenge) {
          return res.status(404).json({ error: "Challenge not found" });
        }
        
        res.json(challenge);
      }
    );
  });

router.post("/:challengeId/join", authenticateUser, (req, res) => {
  const { challengeId } = req.params;
  const userId = req.user.id;

  db.get(
    `SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ?`,
    [userId, challengeId],
    (err, existingEntry) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (existingEntry) {
        return res.status(400).json({ error: "Already joined this challenge" });
      }

      db.run(
        `INSERT INTO user_challenges (user_id, challenge_id, progress, joined_at) 
         VALUES (?, ?, ?, datetime('now'))`,
        [userId, challengeId, 0],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.get(
            `SELECT * FROM user_challenges WHERE id = ?`,
            [this.lastID],
            (err, userChallenge) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              
              res.status(201).json({ 
                message: "Successfully joined challenge",
                userChallenge
              });
            }
          );
        }
      );
    }
  );
});

router.put("/:challengeId/progress", authenticateUser, (req, res) => {
  const { challengeId } = req.params;
  const userId = req.user.id;
  const { progress } = req.body;
  
  db.get(
    `SELECT * FROM challenges WHERE id = ?`,
    [challengeId],
    (err, challenge) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      let completedNow = false;
      let completedDate = null;

      if (progress >= challenge.target) {
        completedNow = true;
        completedDate = `datetime('now')`;
      }
      
      db.run(
        `UPDATE user_challenges 
         SET progress = ?, 
             completed = ?, 
             completed_at = ${completedNow ? completedDate : 'completed_at'}
         WHERE user_id = ? AND challenge_id = ?`,
        [progress, completedNow ? 1 : 0, userId, challengeId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({ error: "User is not participating in this challenge" });
          }

          db.get(
            `SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ?`,
            [userId, challengeId],
            (err, userChallenge) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              if (completedNow) {
                db.run(
                  `UPDATE users SET points = COALESCE(points, 0) + ? WHERE id = ?`,
                  [challenge.reward_points, userId],
                  (err) => {
                    if (err) {
                      console.error("Error awarding points:", err);
                    }
                    
                    return res.json({
                      message: "Challenge completed!",
                      reward: challenge.reward_points,
                      userChallenge
                    });
                  }
                );
              } else {
                return res.json({ userChallenge });
              }
            }
          );
        }
      );
    }
  );
});

router.post("/seed", (req, res) => {
  const challenges = [
    {
      title: "7-Day Exercise Streak",
      description: "Complete a workout every day for 7 consecutive days",
      target: 7,
      duration: 7,
      reward_points: 100
    },
    {
      title: "Calorie Tracking Master",
      description: "Log your calories for 5 consecutive days",
      target: 5,
      duration: 5,
      reward_points: 50
    },
    {
      title: "Weight Lifting Challenge",
      description: "Complete 10 weight lifting workouts",
      target: 10,
      duration: 30,
      reward_points: 150
    }
  ];

  let completed = 0;
  
  challenges.forEach(challenge => {
    db.run(
      `INSERT INTO challenges (title, description, target, duration, reward_points)
       VALUES (?, ?, ?, ?, ?)`,
      [challenge.title, challenge.description, challenge.target, challenge.duration, challenge.reward_points],
      function(err) {
        if (err) {
          console.error(err);
        } else {
          completed++;
          if (completed === challenges.length) {
            res.json({ message: "Challenges seeded successfully" });
          }
        }
      }
    );
  });
});

module.exports = router;