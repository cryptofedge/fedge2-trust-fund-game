import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '../context/GameContext';
import { formatCurrency } from '../utils/formatters';
import { MAX_TURNS, INITIAL_TRUST_FUND } from '../game/engine';

export default function HomeScreen({ onNavigate }) {
  const { gameState, playerName, netWorth, startNewGame, resetGame } = useGame();
  const [nameInput, setNameInput] = useState('');

  function handleStart() {
    const name = nameInput.trim() || 'Player';
    startNewGame(name);
    onNavigate('Game');
  }

  function handleResume() {
    onNavigate('Game');
  }

  function handleReset() {
    Alert.alert(
      'Reset Game',
      'Are you sure? Your current progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetGame },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={['#0a0a1a', '#0d1b2a']} style={styles.hero}>
        <Text style={styles.title}>FEDGE 2.O</Text>
        <Text style={styles.subtitle}>Trust Fund Game</Text>
        <Text style={styles.tagline}>Grow your empire. Survive the market.</Text>
      </LinearGradient>

      {gameState && gameState.gameStatus === 'active' ? (
        <View style={styles.resumeCard}>
          <Text style={styles.resumeTitle}>Game in Progress</Text>
          <Text style={styles.resumePlayer}>{playerName}</Text>
          <Text style={styles.resumeWorth}>{formatCurrency(netWorth, true)}</Text>
          <Text style={styles.resumeTurn}>
            Turn {gameState.turn} of {MAX_TURNS}
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleResume}>
            <Text style={styles.btnText}>Resume Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={handleReset}>
            <Text style={styles.ghostBtnText}>New Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.newGameCard}>
          <Text style={styles.cardTitle}>Start a New Game</Text>
          <Text style={styles.cardSub}>
            You start with {formatCurrency(INITIAL_TRUST_FUND, true)} in your trust fund.
            Make it grow over {MAX_TURNS} turns.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#444"
            value={nameInput}
            onChangeText={setNameInput}
            maxLength={20}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
            <Text style={styles.btnText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.rulesCard}>
        <Text style={styles.cardTitle}>How to Play</Text>
        <Text style={styles.rule}>💼 Start with $500K in your trust fund</Text>
        <Text style={styles.rule}>🎯 Choose 1 of 3 decisions each turn</Text>
        <Text style={styles.rule}>⚡ Market events shake things up randomly</Text>
        <Text style={styles.rule}>📈 Grow assets across stocks, crypto, real estate & ventures</Text>
        <Text style={styles.rule}>🏆 Highest net worth after 20 turns wins</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { paddingBottom: 40 },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  resumeCard: {
    margin: 20,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#00ff8844',
    alignItems: 'center',
  },
  resumeTitle: { color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  resumePlayer: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 },
  resumeWorth: { color: '#00ff88', fontSize: 32, fontWeight: '900', marginTop: 8 },
  resumeTurn: { color: '#888', fontSize: 14, marginTop: 4, marginBottom: 20 },
  newGameCard: {
    margin: 20,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardSub: { color: '#888', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  primaryBtn: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: { color: '#000', fontWeight: '800', fontSize: 16 },
  ghostBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  ghostBtnText: { color: '#888', fontSize: 15 },
  rulesCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  rule: { color: '#ccc', fontSize: 14, marginBottom: 10, lineHeight: 20 },
});
