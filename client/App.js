import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import TabBar from './src/components/TabBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen onNavigate={setActiveTab} />;
      case 'Game': return <GameScreen onNavigate={setActiveTab} />;
      case 'Portfolio': return <PortfolioScreen />;
      case 'Leaderboard': return <LeaderboardScreen />;
      default: return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" backgroundColor="#0a0a1a" />
        <View style={styles.container}>
          <View style={styles.screen}>{renderScreen()}</View>
          <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
        </View>
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  screen: { flex: 1 },
});
