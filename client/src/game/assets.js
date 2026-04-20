/**
 * FEDGE 2.O — Asset Types & Growth Simulation
 */

export const ASSET_TYPES = {
  STOCKS: 'stocks',
  CRYPTO: 'crypto',
  REAL_ESTATE: 'real_estate',
  VENTURES: 'ventures',
};

// Base growth rates per turn (multiplier)
const BASE_GROWTH_RATES = {
  [ASSET_TYPES.STOCKS]: { min: 0.96, max: 1.08 },
  [ASSET_TYPES.CRYPTO]: { min: 0.80, max: 1.25 },       // High risk, high reward
  [ASSET_TYPES.REAL_ESTATE]: { min: 0.99, max: 1.04 },  // Stable, slow
  [ASSET_TYPES.VENTURES]: { min: 0.70, max: 1.40 },     // Highest risk
};

const ASSET_META = {
  [ASSET_TYPES.STOCKS]: {
    label: 'Stocks',
    icon: '📈',
    color: '#4ade80',
    description: 'Diversified stock portfolio. Moderate risk.',
    riskLevel: 'Medium',
  },
  [ASSET_TYPES.CRYPTO]: {
    label: 'Crypto',
    icon: '🪙',
    color: '#f59e0b',
    description: 'Volatile digital assets. High risk, high reward.',
    riskLevel: 'High',
  },
  [ASSET_TYPES.REAL_ESTATE]: {
    label: 'Real Estate',
    icon: '🏠',
    color: '#60a5fa',
    description: 'Property investments. Stable, long-term growth.',
    riskLevel: 'Low',
  },
  [ASSET_TYPES.VENTURES]: {
    label: 'Ventures',
    icon: '🚀',
    color: '#e879f9',
    description: 'Startup equity bets. Extreme risk & reward.',
    riskLevel: 'Very High',
  },
};

/**
 * Returns a random growth multiplier for the given asset type.
 */
export function calculateAssetGrowth(assetType) {
  const { min, max } = BASE_GROWTH_RATES[assetType];
  return min + Math.random() * (max - min);
}

/**
 * Get display metadata for an asset type.
 */
export function getAssetMeta(assetType) {
  return ASSET_META[assetType];
}

/**
 * Returns all asset types with their metadata.
 */
export function getAllAssets() {
  return Object.values(ASSET_TYPES).map((type) => ({
    type,
    ...ASSET_META[type],
  }));
}

/**
 * Apply a market multiplier to a specific asset (used by events).
 */
export function applyMarketMultiplier(portfolio, assetType, multiplier) {
  return {
    ...portfolio,
    [assetType]: Math.round((portfolio[assetType] || 0) * multiplier),
  };
}
