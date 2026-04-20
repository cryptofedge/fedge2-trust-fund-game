const express = require('express');
const auth = require('../middleware/auth');
const GameState = require('../models/GameState');
const Player = require('../models/Player');

const router = express.Router();

// GET /api/game — Load current game state for authenticated player
router.get('/', auth, async (req, res) => {
  try {
    const game = await GameState.findOne({ player: req.user.id, gameStatus: 'active' });
    if (!game) return res.status(404).json({ error: 'No active game found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/game/new — Start a new game
router.post('/new', auth, async (req, res) => {
  try {
    // Abandon any existing active game
    await GameState.updateMany(
      { player: req.user.id, gameStatus: 'active' },
      { gameStatus: 'abandoned' }
    );

    const game = await GameState.create({
      player: req.user.id,
      playerName: req.user.username,
    });

    await Player.findByIdAndUpdate(req.user.id, { $inc: { gamesPlayed: 1 } });
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/game/:id — Save updated game state
router.put('/:id', auth, async (req, res) => {
  try {
    const game = await GameState.findOneAndUpdate(
      { _id: req.params.id, player: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Update player stats if game is complete
    if (game.gameStatus === 'won') {
      await Player.findByIdAndUpdate(req.user.id, {
        $inc: { wins: 1 },
        $max: { highScore: game.score, bestNetWorth: game.netWorth },
      });
    }

    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
