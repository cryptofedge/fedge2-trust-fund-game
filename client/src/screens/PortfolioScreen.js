import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGame } from '../context/GameContext';
import { formatCurrency, calcChange, formatPercent, getValueColor } from '../utils/formatters';
import { getAllAssets } from '../game/assets';
import { INITIAL_TRUST_FUND, MAX_TURNS } from '../game/engine';

export default function PortfolioScreen() {
  const { gameState, netWorth } = useGame();

  if (!gameState) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Start a game to see your portfolio.</Text>
      </View>
    );
  }

  const { cash, portfolio, decisionHistory, turn, eventLog } = gameState;
  const totalChange = calcChange(INITIAL_TRUST_FUND, netWorth);
  const allAssets = getAllAssets();

  return (
    <ScrollView style={styles.container}>
      {/* Net Worth Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Net Worth</Text>
        <Text style={styles.summaryValue}>{formatCurrency(netWorth)}</Text>
        <Text style={[styles.summaryChange, { color: getValueColor(totalChange) }]}>
          {formatPercent(totalChange)} from starting fund
        </Text>
        <Text style={styles.summaryTurn}>Turn {turn} of {MAX_TURNS}</Text>
      </View>

      {/* Asset Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asset Breakdown</Text>

        <View style={styles.assetCard}>
          <View style={styles.assetRow}>
            <Text style={styles.assetIcon}>💵</Text>
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>Cash</Text>
              <Text style={styles.assetRisk}>Liquid</Text>
            </View>
            <Text style={styles.assetValue}>{formatCurrency(cash)}</Text>
          </View>
        </View>

        {allAssets.map(({ type, label, icon, color, riskLevel }) => {
          const value = portfolio[type] || 0;
          const alloc = netWorth > 0 ? value / netWorth : 0;
          return (
            <View key={type} style={styles.assetCard}>
              <View style={styles.assetRow}>
                <Text style={styles.assetIcon}>{icon}</Text>
                <View style={styles.assetInfo}>
                  <Text style={styles.assetName}>{label}</Text>
                  <Text style={styles.assetRisk}>{riskLevel} Risk</Text>
                </View>
                <View style={styles.assetValueContainer}>
                  <Text style={[styles.assetValue, { color }]}>{formatCurrency(value)}</Text>
                  <Text style={styles.assetAlloc}>{(alloc * 100).toFixed(1)}%</Text>
                </View>
              </View>
              {/* Allocation bar */}
              <View style={styles.allocBar}>
                <View style={[styles.allocFill, { width: `${alloc * 100}%`, backgroundColor: color }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Decision History */}
      {decisionHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decision History</Text>
          {decisionHistory.slice().reverse().map((entry, i) => (
            <View key={i} style={styles.historyRow}>
              <Text style={styles.historyTurn}>Turn {entry.turn}</Text>
              <Text style={styles.historyDecision}>{entry.decision.replace(/_/g, ' ')}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Event Log */}
      {eventLog.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Events</Text>
          {eventLog.slice().reverse().map((entry, i) => (
            <View key={i} style={styles.historyRow}>
              <Text style={styles.historyTurn}>Turn {entry.turn}</Text>
              <Text style={styles.historyDecision}>{entry.event.title}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  empty: { flex: 1, backgroundColor: '#0a0a1a', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#555', fontSize: 16 },
  summaryCard: {
    margin: 16,
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff8833',
  },
  summaryLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  summaryValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 6 },
  summaryChange: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  summaryTurn: { color: '#555', fontSize: 13, marginTop: 8 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  assetCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  assetRow: { flexDirection: 'row', alignItems: 'center' },
  assetIcon: { fontSize: 20, marginRight: 12 },
  assetInfo: { flex: 1 },
  assetName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  assetRisk: { color: '#555', fontSize: 12, marginTop: 2 },
  assetValueContainer: { alignItems: 'flex-end' },
  assetValue: { color: '#fff', fontSize: 15, fontWeight: '700' },
  assetAlloc: { color: '#555', fontSize: 12, marginTop: 2 },
  allocBar: {
    height: 3,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  allocFill: { height: 3, borderRadius: 2 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  historyTurn: { color: '#555', fontSize: 12, width: 55 },
  historyDecision: { color: '#ccc', fontSize: 13, flex: 1, textTransform: 'capitalize' },
});
