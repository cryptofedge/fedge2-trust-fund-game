import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useGame } from '../context/GameContext';
import { formatCurrency, ordinal } from '../utils/formatters';

const API_BASE = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5000';

// Mock leaderboard data for offline/dev use
const MOCK_LEADERBOARD = [
  { rank: 1, playerName: 'CryptoKing', netWorth: 4_820_000, score: 241000 },
  { rank: 2, playerName: 'WallStWolf', netWorth: 3_340_000, score: 167000 },
  { rank: 3, playerName: 'RealEstateBoss', netWorth: 2_900_000, score: 145000 },
  { rank: 4, playerName: 'VentureViper', netWorth: 2_150_000, score: 107500 },
  { rank: 5, playerName: 'DiverseDave', netWorth: 1_870_000, score: 93500 },
  { rank: 6, playerName: 'BullMarketBetty', netWorth: 1_640_000, score: 82000 },
  { rank: 7, playerName: 'HODLHerb', netWorth: 1_200_000, score: 60000 },
  { rank: 8, playerName: 'SafePortSally', netWorth: 980_000, score: 49000 },
];

export default function LeaderboardScreen() {
  const { gameState } = useGame();
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leaderboard`, { timeout: 5000 });
      setLeaderboard(res.data);
    } catch {
      // Server not available — use mock data
      setLeaderboard(MOCK_LEADERBOARD);
    } finally {
      setLoading(false);
    }
  }

  async function submitScore() {
    if (!gameState || gameState.gameStatus !== 'won' || submitted) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/leaderboard`, {
        playerName: gameState.playerName,
        netWorth: gameState.netWorth,
        score: gameState.score,
      });
      setSubmitted(true);
      fetchLeaderboard();
      Alert.alert('Score Submitted!', 'Your score has been added to the leaderboard. 🏆');
    } catch {
      Alert.alert('Offline Mode', 'Could not connect to the server. Run locally to submit scores!');
    } finally {
      setSubmitting(false);
    }
  }

  function renderRow({ item, index }) {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
    return (
      <View style={[styles.row, index < 3 && styles.topRow]}>
        <Text style={styles.rank}>{medal}</Text>
        <Text style={styles.playerName}>{item.playerName}</Text>
        <Text style={styles.netWorth}>{formatCurrency(item.netWorth, true)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏆 Global Leaderboard</Text>

      {gameState?.gameStatus === 'won' && !submitted && (
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={submitScore}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Submit Your Score: {formatCurrency(gameState.netWorth, true)}</Text>
          )}
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator color="#00ff88" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderRow}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <TouchableOpacity style={styles.refreshBtn} onPress={fetchLeaderboard}>
        <Text style={styles.refreshText}>↻ Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  submitBtn: {
    margin: 16,
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: { color: '#000', fontWeight: '800', fontSize: 15 },
  list: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1a1a2e',
  },
  topRow: { borderColor: '#f59e0b44', backgroundColor: '#12100a' },
  rank: { width: 40, color: '#f59e0b', fontSize: 16, fontWeight: '700' },
  playerName: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '600' },
  netWorth: { color: '#00ff88', fontSize: 15, fontWeight: '700' },
  separator: { height: 8 },
  refreshBtn: { alignItems: 'center', paddingVertical: 16 },
  refreshText: { color: '#555', fontSize: 14 },
});
