/**
 * FEDGE 2.O — Core Game Engine
 * Turn-based trust fund strategy game logic
 */

import { ASSET_TYPES, calculateAssetGrowth } from './assets';
import { getRandomEvent, applyEvent } from './events';
import { generateDecisions } from './decisions';

export const INITIAL_TRUST_FUND = 500_000;
export const MAX_TURNS = 20;

/**
 * Create a brand-new game state for a player.
 */
export function createInitialGameState(playerName) {
  return {
    playerName,
    turn: 1,
    netWorth: INITIAL_TRUST_FUND,
    cash: INITIAL_TRUST_FUND,
    portfolio: {
      [ASSET_TYPES.STOCKS]: 0,
      [ASSET_TYPES.CRYPTO]: 0,
      [ASSET_TYPES.REAL_ESTATE]: 0,
      [ASSET_TYPES.VENTURES]: 0,
    },
    decisions: generateDecisions(1, INITIAL_TRUST_FUND),
    currentEvent: null,
    eventLog: [],
    decisionHistory: [],
    gameStatus: 'active', // 'active' | 'won' | 'bankrupt'
    score: 0,
  };
}

/**
 * Apply a player's chosen decision and advance the game state.
 * Returns the new game state.
 */
export function applyDecision(state, decision) {
  let newState = { ...state };

  // Apply the chosen decision effects
  newState = applyDecisionEffects(newState, decision);

  // Record decision
  newState.decisionHistory = [
    ...newState.decisionHistory,
    { turn: state.turn, decision: decision.id, effect: decision.effect },
  ];

  // Simulate asset growth for this turn
  newState.portfolio = simulatePortfolioGrowth(newState.portfolio);

  // Fire a random market event
  const event = getRandomEvent(newState.turn);
  if (event) {
    newState = applyEvent(newState, event);
    newState.currentEvent = event;
    newState.eventLog = [...newState.eventLog, { turn: newState.turn, event }];
  } else {
    newState.currentEvent = null;
  }

  // Recalculate net worth
  newState.netWorth = calculateNetWorth(newState);

  // Check game-over conditions
  if (newState.netWorth <= 0) {
    newState.gameStatus = 'bankrupt';
  } else if (newState.turn >= MAX_TURNS) {
    newState.gameStatus = 'won';
    newState.score = calculateFinalScore(newState);
  }

  // Advance turn and generate next decisions
  if (newState.gameStatus === 'active') {
    newState.turn = newState.turn + 1;
    newState.decisions = generateDecisions(newState.turn, newState.netWorth);
  }

  return newState;
}

/**
 * Apply effects of a single decision on the state.
 */
function applyDecisionEffects(state, decision) {
  const { effect } = decision;
  const newPortfolio = { ...state.portfolio };
  let newCash = state.cash;

  if (effect.invest) {
    const { asset, amount } = effect.invest;
    const investAmount = Math.min(amount, newCash);
    newPortfolio[asset] = (newPortfolio[asset] || 0) + investAmount;
    newCash -= investAmount;
  }

  if (effect.withdraw) {
    const { asset, amount } = effect.withdraw;
    const withdrawAmount = Math.min(amount, newPortfolio[asset] || 0);
    newPortfolio[asset] = Math.max(0, (newPortfolio[asset] || 0) - withdrawAmount);
    newCash += withdrawAmount;
  }

  if (effect.cashBonus) {
    newCash += effect.cashBonus;
  }

  if (effect.cashPenalty) {
    newCash = Math.max(0, newCash - effect.cashPenalty);
  }

  return { ...state, portfolio: newPortfolio, cash: newCash };
}

/**
 * Simulate natural portfolio growth for one turn.
 */
function simulatePortfolioGrowth(portfolio) {
  const grown = {};
  for (const [asset, value] of Object.entries(portfolio)) {
    if (value > 0) {
      grown[asset] = value * calculateAssetGrowth(asset);
    } else {
      grown[asset] = 0;
    }
  }
  return grown;
}

/**
 * Calculate total net worth: cash + all portfolio assets.
 */
export function calculateNetWorth(state) {
  const portfolioValue = Object.values(state.portfolio).reduce(
    (sum, val) => sum + val,
    0
  );
  return Math.round(state.cash + portfolioValue);
}

/**
 * Final score = net worth multiplied by a turn-efficiency bonus.
 */
function calculateFinalScore(state) {
  const efficiency = state.decisionHistory.length > 0
    ? state.netWorth / state.decisionHistory.length
    : state.netWorth;
  return Math.round(efficiency);
}
