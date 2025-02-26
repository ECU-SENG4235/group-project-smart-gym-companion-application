const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateUser = require('../middleware/authMiddleware'); // Changed to match workout.js

// Configure storage for profile images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, '../public/uploads/profiles');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        const userId = req.user.id;
        const extension = path.extname(file.originalname);
        cb(null, `user_${userId}_${Date.now()}${extension}`);
    }
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => { // Changed authenticate to authenticateUser
    try {
        const db = req.app.get('db');

        const user = await db.get(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get profile data
        const profile = await db.get(
            'SELECT * FROM profiles WHERE user_id = ?',
            [req.user.id]
        );

        // If no profile exists yet, return empty profile
        if (!profile) {
            return res.json({
                username: user.username || '',
                firstName: '',
                lastName: '',
                age: '',
                gender: '',
                height: '',
                weight: '',
                fitnessLevel: '',
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
                medicalConditions: '',
                profileImage: null
            });
        }

        // Parse JSON fields
        const goals = profile.goals ? JSON.parse(profile.goals) : {};
        const workoutDays = profile.workout_days ? JSON.parse(profile.workout_days) : {};

        // Return profile data
        res.json({
            username: user.username || '',
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            age: profile.age || '',
            gender: profile.gender || '',
            height: profile.height || '',
            weight: profile.weight || '',
            fitnessLevel: profile.fitness_level || '',
            goals: goals,
            workoutDays: workoutDays,
            medicalConditions: profile.medical_conditions || '',
            profileImage: profile.profile_image || null
        });

    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
router.put('/update', authenticateUser, upload.single('profileImage'), async (req, res) => { // Changed authenticate to authenticateUser
    try {
        const db = req.app.get('db');

        // Parse profile data from form
        const profileData = JSON.parse(req.body.profileData);

        // Check if username is already taken (if username is being changed)
        if (profileData.username) {
            const existingUser = await db.get(
                'SELECT id FROM users WHERE username = ? AND id != ?',
                [profileData.username, req.user.id]
            );

            if (existingUser) {
                return res.status(400).json({ error: 'Username is already taken' });
            }

            // Update username in users table
            await db.run(
                'UPDATE users SET username = ? WHERE id = ?',
                [profileData.username, req.user.id]
            );
        }

        // Prepare profile image path
        let profileImagePath = null;
        if (req.file) {
            profileImagePath = `/uploads/profiles/${req.file.filename}`;
        }

        // Check if profile already exists
        const existingProfile = await db.get(
            'SELECT id FROM profiles WHERE user_id = ?',
            [req.user.id]
        );

        // Convert goals and workout days to JSON strings
        const goalsJson = JSON.stringify(profileData.goals);
        const workoutDaysJson = JSON.stringify(profileData.workoutDays);

        if (existingProfile) {
            // Update existing profile
            const updateSql = `
                UPDATE profiles SET
                first_name = ?,
                last_name = ?,
                age = ?,
                gender = ?,
                height = ?,
                weight = ?,
                fitness_level = ?,
                goals = ?,
                workout_days = ?,
                medical_conditions = ?
                ${profileImagePath ? ', profile_image = ?' : ''}
                WHERE user_id = ?
            `;

            const params = [
                profileData.firstName,
                profileData.lastName,
                profileData.age,
                profileData.gender,
                profileData.height,
                profileData.weight,
                profileData.fitnessLevel,
                goalsJson,
                workoutDaysJson,
                profileData.medicalConditions
            ];

            if (profileImagePath) {
                params.push(profileImagePath);
            }

            params.push(req.user.id);

            await db.run(updateSql, params);
        } else {
            // Create new profile
            const insertSql = `
                INSERT INTO profiles (
                    user_id,
                    first_name,
                    last_name,
                    age,
                    gender,
                    height,
                    weight,
                    fitness_level,
                    goals,
                    workout_days,
                    medical_conditions,
                    profile_image
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await db.run(insertSql, [
                req.user.id,
                profileData.firstName,
                profileData.lastName,
                profileData.age,
                profileData.gender,
                profileData.height,
                profileData.weight,
                profileData.fitnessLevel,
                goalsJson,
                workoutDaysJson,
                profileData.medicalConditions,
                profileImagePath
            ]);
        }

        res.json({ message: 'Profile updated successfully' });

    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;