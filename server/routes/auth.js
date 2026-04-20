const express = require('express');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');

const router = express.Router();

const signToken = (player) =>
  jwt.sign(
    { id: player._id, username: player.username },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const existing = await Player.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'Username or email already taken' });

    const player = await Player.create({ username, email, password });
    const token = signToken(player);
    res.status(201).json({ token, username: player.username, id: player._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const player = await Player.findOne({ email });
    if (!player || !(await player.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(player);
    res.json({ token, username: player.username, id: player._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
