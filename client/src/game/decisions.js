/**
 * FEDGE 2.O — Decision Generator
 * Generates 3 contextual decisions per turn based on current game state
 */

import { ASSET_TYPES } from './assets';

const DECISION_POOL = [
  // Invest decisions
  {
    id: 'invest_stocks_10',
    label: 'Invest 10% in Stocks',
    description: 'Put 10% of your cash into the stock market.',
    category: 'invest',
    icon: '📈',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.STOCKS, amount: Math.round(netWorth * 0.1) },
    }),
  },
  {
    id: 'invest_stocks_25',
    label: 'Go Big on Stocks (25%)',
    description: 'Bet 25% of cash on diversified equities.',
    category: 'invest',
    icon: '📊',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.STOCKS, amount: Math.round(netWorth * 0.25) },
    }),
  },
  {
    id: 'invest_crypto_10',
    label: 'Dip into Crypto (10%)',
    description: 'Allocate 10% to volatile digital assets.',
    category: 'invest',
    icon: '🪙',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.CRYPTO, amount: Math.round(netWorth * 0.1) },
    }),
  },
  {
    id: 'invest_crypto_20',
    label: 'Ride the Crypto Wave (20%)',
    description: 'High risk play — 20% into crypto.',
    category: 'invest',
    icon: '🌊',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.CRYPTO, amount: Math.round(netWorth * 0.2) },
    }),
  },
  {
    id: 'invest_realestate',
    label: 'Buy Property (30%)',
    description: 'Invest 30% in stable real estate.',
    category: 'invest',
    icon: '🏠',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.REAL_ESTATE, amount: Math.round(netWorth * 0.3) },
    }),
  },
  {
    id: 'invest_venture',
    label: 'Fund a Startup (15%)',
    description: 'Moonshot bet — 15% on a risky venture.',
    category: 'invest',
    icon: '🚀',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.VENTURES, amount: Math.round(netWorth * 0.15) },
    }),
  },
  // Withdraw / De-risk decisions
  {
    id: 'sell_crypto',
    label: 'Cash Out Crypto',
    description: 'Liquidate all crypto holdings into cash.',
    category: 'withdraw',
    icon: '💵',
    makeEffect: (netWorth) => ({
      withdraw: { asset: ASSET_TYPES.CRYPTO, amount: Infinity },
    }),
  },
  {
    id: 'sell_stocks_half',
    label: 'Take Stock Profits',
    description: 'Sell half your stock holdings, lock in gains.',
    category: 'withdraw',
    icon: '🔒',
    makeEffect: (netWorth) => ({
      withdraw: { asset: ASSET_TYPES.STOCKS, amount: Math.round(netWorth * 0.125) },
    }),
  },
  // Hold / Strategic decisions
  {
    id: 'hold_cash',
    label: 'Hold Cash & Wait',
    description: 'Stay liquid. No moves this turn.',
    category: 'hold',
    icon: '🤚',
    makeEffect: () => ({}),
  },
  {
    id: 'diversify',
    label: 'Diversify Portfolio',
    description: 'Spread 20% equally across all 4 asset types.',
    category: 'invest',
    icon: '⚖️',
    makeEffect: (netWorth) => ({
      invest: { asset: ASSET_TYPES.STOCKS, amount: Math.round(netWorth * 0.05) },
    }),
  },
  {
    id: 'emergency_fund',
    label: 'Build Emergency Fund',
    description: 'Set aside $50k in a safe reserve.',
    category: 'hold',
    icon: '🛡️',
    makeEffect: () => ({ cashBonus: 0 }),
  },
];

/**
 * Generate 3 decisions for the current turn.
 * Mix of invest, withdraw, and strategic options.
 */
export function generateDecisions(turn, netWorth) {
  const shuffled = [...DECISION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((template) => ({
    id: template.id,
    label: template.label,
    description: template.description,
    category: template.category,
    icon: template.icon,
    effect: template.makeEffect(netWorth),
  }));
}
