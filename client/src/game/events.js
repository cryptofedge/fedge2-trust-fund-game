/**
 * FEDGE 2.O — Market Events
 * Random events that shake up the player's portfolio each turn
 */

import { ASSET_TYPES, applyMarketMultiplier } from './assets';

const EVENTS = [
  {
    id: 'bull_run',
    title: '🚀 Crypto Bull Run',
    description: 'Bitcoin surges 40%. All crypto holdings moon.',
    type: 'positive',
    apply: (state) => ({
      ...state,
      portfolio: applyMarketMultiplier(state.portfolio, ASSET_TYPES.CRYPTO, 1.4),
    }),
  },
  {
    id: 'crypto_crash',
    title: '📉 Crypto Market Crash',
    description: 'Crypto markets collapse. Your digital assets take a hit.',
    type: 'negative',
    apply: (state) => ({
      ...state,
      portfolio: applyMarketMultiplier(state.portfolio, ASSET_TYPES.CRYPTO, 0.55),
    }),
  },
  {
    id: 'fed_rate_hike',
    title: '🏦 Fed Rate Hike',
    description: 'Interest rates rise. Stocks dip, real estate cools.',
    type: 'negative',
    apply: (state) => ({
      ...state,
      portfolio: {
        ...applyMarketMultiplier(state.portfolio, ASSET_TYPES.STOCKS, 0.88),
        ...applyMarketMultiplier(state.portfolio, ASSET_TYPES.REAL_ESTATE, 0.95),
      },
    }),
  },
  {
    id: 'tech_ipo',
    title: '💻 Massive Tech IPO',
    description: 'A unicorn goes public. Stock market rallies hard.',
    type: 'positive',
    apply: (state) => ({
      ...state,
      portfolio: applyMarketMultiplier(state.portfolio, ASSET_TYPES.STOCKS, 1.18),
    }),
  },
  {
    id: 'real_estate_boom',
    title: '🏠 Real Estate Boom',
    description: 'Housing demand skyrockets. Property values surge.',
    type: 'positive',
    apply: (state) => ({
      ...state,
      portfolio: applyMarketMultiplier(state.portfolio, ASSET_TYPES.REAL_ESTATE, 1.25),
    }),
  },
  {
    id: 'startup_unicorn',
    title: '🦄 Venture Goes Unicorn',
    description: 'One of your ventures hits $1B valuation. Jackpot.',
    type: 'positive',
    apply: (state) => ({
      ...state,
      portfolio: applyMarketMultiplier(state.portfolio, ASSET_TYPES.VENTURES, 1.60),
    }),
  },
  {
    id: 'recession',
    title: '📊 Recession Warning',
    description: 'Markets contract across the board. Broad portfolio decline.',
    type: 'negative',
    apply: (state) => ({
      ...state,
      portfolio: {
        [ASSET_TYPES.STOCKS]: Math.round((state.portfolio[ASSET_TYPES.STOCKS] || 0) * 0.82),
        [ASSET_TYPES.CRYPTO]: Math.round((state.portfolio[ASSET_TYPES.CRYPTO] || 0) * 0.75),
        [ASSET_TYPES.REAL_ESTATE]: Math.round((state.portfolio[ASSET_TYPES.REAL_ESTATE] || 0) * 0.90),
        [ASSET_TYPES.VENTURES]: Math.round((state.portfolio[ASSET_TYPES.VENTURES] || 0) * 0.65),
      },
    }),
  },
  {
    id: 'inheritance',
    title: '💰 Surprise Inheritance',
    description: 'A distant relative leaves you $75,000. Free cash.',
    type: 'positive',
    apply: (state) => ({
      ...state,
      cash: state.cash + 75_000,
    }),
  },
  {
    id: 'lawsuit',
    title: '⚖️ Legal Dispute',
    description: 'A lawsuit settlement costs you $50,000.',
    type: 'negative',
    apply: (state) => ({
      ...state,
      cash: Math.max(0, state.cash - 50_000),
    }),
  },
  {
    id: 'airdrop',
    title: '🪂 Crypto Airdrop',
    description: 'You receive a surprise token airdrop worth $30,000.',
    type: 'positive',
    apply: (state) => ({
      ...state,
      cash: state.cash + 30_000,
    }),
  },
  {
    id: 'market_volatility',
    title: '⚡ Market Volatility Spike',
    description: 'VIX spikes. Stocks and crypto swing wildly — could go either way.',
    type: 'neutral',
    apply: (state) => {
      const multiplier = Math.random() > 0.5 ? 1.15 : 0.85;
      return {
        ...state,
        portfolio: {
          ...applyMarketMultiplier(state.portfolio, ASSET_TYPES.STOCKS, multiplier),
          ...applyMarketMultiplier(state.portfolio, ASSET_TYPES.CRYPTO, multiplier * (Math.random() > 0.5 ? 1.1 : 0.9)),
        },
      };
    },
  },
];

/**
 * Returns a random event. Events fire ~60% of the time.
 */
export function getRandomEvent(turn) {
  if (Math.random() > 0.6) return null;
  const index = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[index];
}

/**
 * Applies an event's effects to the game state.
 */
export function applyEvent(state, event) {
  return event.apply(state);
}

export { EVENTS };
