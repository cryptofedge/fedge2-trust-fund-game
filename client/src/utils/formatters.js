/**
 * FEDGE 2.O — Utility Formatters
 */

/**
 * Format a number as USD currency.
 * e.g. 1234567 → "$1,234,567"
 */
export function formatCurrency(value, compact = false) {
  if (typeof value !== 'number' || isNaN(value)) return '$0';

  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage.
 * e.g. 0.15 → "+15.0%"
 */
export function formatPercent(value, showSign = true) {
  const pct = (value * 100).toFixed(1);
  if (showSign && value > 0) return `+${pct}%`;
  return `${pct}%`;
}

/**
 * Calculate percentage change from original to current.
 */
export function calcChange(original, current) {
  if (!original || original === 0) return 0;
  return (current - original) / original;
}

/**
 * Get a color based on whether a value is positive, negative, or neutral.
 */
export function getValueColor(value) {
  if (value > 0) return '#00ff88';
  if (value < 0) return '#ff4444';
  return '#888';
}

/**
 * Ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
