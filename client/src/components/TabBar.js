import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'Home',        icon: 'home',           iconOff: 'home-outline' },
  { name: 'Game',        icon: 'game-controller', iconOff: 'game-controller-outline' },
  { name: 'Portfolio',   icon: 'briefcase',       iconOff: 'briefcase-outline' },
  { name: 'Leaderboard', icon: 'trophy',          iconOff: 'trophy-outline' },
];

export default function TabBar({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
          >
            <Ionicons
              name={active ? tab.icon : tab.iconOff}
              size={24}
              color={active ? '#00ff88' : '#555'}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0a0a1a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#555', fontSize: 10, marginTop: 3 },
  labelActive: { color: '#00ff88' },
});
