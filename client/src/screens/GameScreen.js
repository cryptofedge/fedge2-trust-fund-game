import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useGame } from '../context/GameContext';
import { formatCurrency, getValueColor, calcChange, formatPercent } from '../utils/formatters';
import { INITIAL_TRUST_FUND, MAX_TURNS } from '../game/engine';
import { getAssetMeta } from '../game/assets';

export default function GameScreen({ onNavigate }) {
  const { gameState, makeDecision } = useGame();
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [animating, setAnimating] = useState(false);

  if (!gameState) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active game.</Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => onNavigate('Home')}
        >
          <Text style={styles.startBtnText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameState.gameStatus === 'won') {
    return <GameOverScreen state={gameState} onHome={() => onNavigate('Home')} won />;
  }

  if (gameState.gameStatus === 'bankrupt') {
    return <GameOverScreen state={gameState} onHome={() => onNavigate('Home')} won={false} />;
  }

  const { turn, cash, portfolio, decisions, currentEvent, netWorth: stateNetWorth } = gameState;
  const netWorth = stateNetWorth;
  const change = calcChange(INITIAL_TRUST_FUND, netWorth);

  function handleDecision(decision) {
    if (animating) return;
    setAnimating(true);
    setSelectedDecision(decision.id);
    setTimeout(() => {
      makeDecision(decision);
      setSelectedDecision(null);
      setAnimating(false);
    }, 400);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.turnLabel}>TURN {turn} / {MAX_TURNS}</Text>
          <Text style={styles.netWorth}>{formatCurrency(netWorth, true)}</Text>
          <Text style={[styles.change, { color: getValueColor(change) }]}>
            {formatPercent(change)} from start
          </Text>
        </View>
        <View style={styles.turnBar}>
          <View style={[styles.turnFill, { width: `${(turn / MAX_TURNS) * 100}%` }]} />
        </View>
      </View>

      {/* Cash */}
      <View style={styles.cashRow}>
        <Text style={styles.cashLabel}>💵 Cash on Hand</Text>
        <Text style={styles.cashValue}>{formatCurrency(cash)}</Text>
      </View>

      {/* Portfolio breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio</Text>
        {Object.entries(portfolio).map(([asset, value]) => {
          const meta = getAssetMeta(asset);
          return value > 0 ? (
            <View key={asset} style={styles.assetRow}>
              <Text style={styles.assetIcon}>{meta.icon}</Text>
              <Text style={styles.assetLabel}>{meta.label}</Text>
              <Text style={[styles.assetValue, { color: meta.color }]}>
                {formatCurrency(value, true)}
              </Text>
            </View>
          ) : null;
        })}
        {Object.values(portfolio).every((v) => v === 0) && (
          <Text style={styles.emptyPortfolio}>No assets yet. Make a move!</Text>
        )}
      </View>

      {/* Current Event */}
      {currentEvent && (
        <View
          style={[
            styles.eventCard,
            {
              borderColor:
                currentEvent.type === 'positive'
                  ? '#00ff8866'
                  : currentEvent.type === 'negative'
                  ? '#ff444466'
                  : '#f59e0b66',
            },
          ]}
        >
          <Text style={styles.eventTitle}>{currentEvent.title}</Text>
          <Text style={styles.eventDesc}>{currentEvent.description}</Text>
        </View>
      )}

      {/* Decisions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Move</Text>
        {decisions.map((decision) => (
          <TouchableOpacity
            key={decision.id}
            style={[
              styles.decisionCard,
              selectedDecision === decision.id && styles.decisionSelected,
            ]}
            onPress={() => handleDecision(decision)}
            disabled={animating}
          >
            <Text style={styles.decisionIcon}>{decision.icon}</Text>
            <View style={styles.decisionText}>
              <Text style={styles.decisionLabel}>{decision.label}</Text>
              <Text style={styles.decisionDesc}>{decision.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function GameOverScreen({ state, onHome, won }) {
  return (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverEmoji}>{won ? '🏆' : '💸'}</Text>
      <Text style={styles.gameOverTitle}>{won ? 'Game Over!' : 'Bankrupt!'}</Text>
      <Text style={styles.gameOverWorth}>
        Final Net Worth: {formatCurrency(state.netWorth, true)}
      </Text>
      {won && <Text style={styles.gameOverScore}>Score: {state.score?.toLocaleString()}</Text>}
      <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    backgroundColor: '#0d1b2a',
    padding: 24,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  turnLabel: { color: '#888', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },
  netWorth: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 2 },
  change: { fontSize: 14, marginTop: 2 },
  turnBar: {
    height: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  turnFill: { height: 4, backgroundColor: '#00ff88', borderRadius: 2 },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#111',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  cashLabel: { color: '#888', fontSize: 14 },
  cashValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionTitle: { color: '#888', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  assetIcon: { fontSize: 18, marginRight: 10 },
  assetLabel: { color: '#ccc', flex: 1, fontSize: 14 },
  assetValue: { fontSize: 15, fontWeight: '700' },
  emptyPortfolio: { color: '#444', fontStyle: 'italic', fontSize: 14, padding: 8 },
  eventCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  eventTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  eventDesc: { color: '#aaa', fontSize: 13, marginTop: 4 },
  decisionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  decisionSelected: { borderColor: '#00ff88', backgroundColor: '#002211' },
  decisionIcon: { fontSize: 24, marginRight: 14 },
  decisionText: { flex: 1 },
  decisionLabel: { color: '#fff', fontSize: 15, fontWeight: '700' },
  decisionDesc: { color: '#888', fontSize: 13, marginTop: 2 },
  emptyContainer: { flex: 1, backgroundColor: '#0a0a1a', alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#888', fontSize: 16, marginBottom: 20 },
  startBtn: { backgroundColor: '#00ff88', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  startBtnText: { color: '#000', fontWeight: '800' },
  gameOverContainer: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  gameOverEmoji: { fontSize: 72 },
  gameOverTitle: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 16 },
  gameOverWorth: { color: '#00ff88', fontSize: 22, fontWeight: '700', marginTop: 12 },
  gameOverScore: { color: '#f59e0b', fontSize: 18, marginTop: 8 },
  homeBtn: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 32,
  },
  homeBtnText: { color: '#000', fontWeight: '800', fontSize: 16 },
});
