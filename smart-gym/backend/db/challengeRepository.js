const db = require('../db');

const challengeRepository = {
  seedChallenges: () => {
    const challenges = [
      {
        title: 'Daily Login Streak',
        description: 'Log in to the app for 7 consecutive days',
        target: 7,
        duration: 7,
        reward_points: 100
      },
      {
        title: 'Complete Your Profile',
        description: 'Fill out all profile sections to earn points',
        target: 100, // Percentage completion
        duration: 30,
        reward_points: 50
      },
      {
        title: 'Weekly Activity Challenge',
        description: 'Complete 5 activities within a week',
        target: 5,
        duration: 7,
        reward_points: 75
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO challenges (title, description, target, duration, reward_points)
      VALUES (?, ?, ?, ?, ?)
    `);

    challenges.forEach(challenge => {
      stmt.run(
        challenge.title,
        challenge.description,
        challenge.target,
        challenge.duration,
        challenge.reward_points
      );
    });

    stmt.finalize();
    console.log('Challenges seeded successfully');
  },

  // Promise-based wrapper for db operations
  getAllChallenges: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM challenges`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getChallengeById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM challenges WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
};

module.exports = challengeRepository;