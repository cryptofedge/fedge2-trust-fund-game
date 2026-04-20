const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema(
  {
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    playerName: { type: String, required: true },
    turn: { type: Number, default: 1 },
    netWorth: { type: Number, default: 500000 },
    cash: { type: Number, default: 500000 },
    portfolio: {
      stocks: { type: Number, default: 0 },
      crypto: { type: Number, default: 0 },
      real_estate: { type: Number, default: 0 },
      ventures: { type: Number, default: 0 },
    },
    gameStatus: {
      type: String,
      enum: ['active', 'won', 'bankrupt'],
      default: 'active',
    },
    score: { type: Number, default: 0 },
    decisionHistory: [
      {
        turn: Number,
        decision: String,
        effect: mongoose.Schema.Types.Mixed,
      },
    ],
    eventLog: [
      {
        turn: Number,
        event: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('GameState', GameStateSchema);
