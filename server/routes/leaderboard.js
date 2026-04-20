const express = require('express');
const Player = require('../models/Player');

const router = express.Router();

// GET /api/leaderboard — Top 50 players by best net worth
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({ bestNetWorth: { $gt: 0 } })
      .sort({ bestNetWorth: -1 })
      .limit(50)
      .select('username bestNetWorth highScore gamesPlayed wins -_id');

    const leaderboard = players.map((p, i) => ({
      rank: i + 1,
      playerName: p.username,
      netWorth: p.bestNetWorth,
      score: p.highScore,
      gamesPlayed: p.gamesPlayed,
      wins: p.wins,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leaderboard — Submit a score (unauthenticated, for guest mode)
router.post('/', async (req, res) => {
  try {
    const { playerName, netWorth, score } = req.body;
    if (!playerName || !netWorth) {
      return res.status(400).json({ error: 'playerName and netWorth required' });
    }
    // For guest submissions: find or upsert a guest player record
    await Player.findOneAndUpdate(
      { username: playerName, email: `${playerName.toLowerCase()}@guest.fedge2` },
      {
        $max: { bestNetWorth: netWorth, highScore: score || 0 },
        $inc: { gamesPlayed: 1, wins: 1 },
        $setOnInsert: { password: 'guest_hashed' },
      },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: 'Score submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
