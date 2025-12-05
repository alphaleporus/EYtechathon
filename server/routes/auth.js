const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const {getDatabase} = require('../database/init');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Register
router.post('/register', async (req, res) => {
    try {
        const {error, value} = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: {message: error.details[0].message, status: 400}});
        }

        const {email, password, name} = value;
        const db = getDatabase();

        // Check if user exists
        const existingUser = db.get('users').find({email}).value();
        if (existingUser) {
            return res.status(409).json({error: {message: 'Email already registered', status: 409}});
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const userId = uuidv4();
        const newUser = {
            id: userId,
            email,
            password_hash: passwordHash,
            name,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        db.get('users').push(newUser).write();

        // Generate token
        const token = jwt.sign(
            {id: userId, email, name, role: 'user'},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {id: userId, email, name, role: 'user'}
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({error: {message: 'Registration failed', status: 500}});
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const {error, value} = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: {message: error.details[0].message, status: 400}});
        }

        const {email, password} = value;
        const db = getDatabase();

        // Find user
        const user = db.get('users').find({email}).value();
        if (!user) {
            return res.status(401).json({error: {message: 'Invalid credentials', status: 401}});
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({error: {message: 'Invalid credentials', status: 401}});
        }

        // Generate token
        const token = jwt.sign(
            {id: user.id, email: user.email, name: user.name, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: {message: 'Login failed', status: 500}});
    }
});

// Get current user
router.get('/me', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: {message: 'Access token required', status: 401}});
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json({user});
    } catch (error) {
        res.status(403).json({error: {message: 'Invalid token', status: 403}});
    }
});

module.exports = router;
