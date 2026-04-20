/**
 * FEDGE 2.O — Global Game Context
 * Manages game state across all screens
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createInitialGameState,
  applyDecision,
  calculateNetWorth,
} from '../game/engine';

const GameContext = createContext(null);

const STORAGE_KEY = '@fedge2_game_state';

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState = {
  gameState: null,
  isLoading: true,
  playerName: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOAD_GAME':
      return {
        ...state,
        gameState: action.payload,
        playerName: action.payload?.playerName || null,
        isLoading: false,
      };

    case 'NEW_GAME':
      const newGame = createInitialGameState(action.payload);
      return { ...state, gameState: newGame, playerName: action.payload };

    case 'APPLY_DECISION':
      const updated = applyDecision(state.gameState, action.payload);
      return { ...state, gameState: updated };

    case 'RESET_GAME':
      return { ...state, gameState: null, playerName: null };

    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved game on mount
  useEffect(() => {
    async function loadSavedGame() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          dispatch({ type: 'LOAD_GAME', payload: JSON.parse(saved) });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (e) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    loadSavedGame();
  }, []);

  // Auto-save whenever gameState changes
  useEffect(() => {
    if (state.gameState) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.gameState)).catch(
        () => {}
      );
    }
  }, [state.gameState]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  function startNewGame(playerName) {
    dispatch({ type: 'NEW_GAME', payload: playerName });
  }

  function makeDecision(decision) {
    if (!state.gameState || state.gameState.gameStatus !== 'active') return;
    dispatch({ type: 'APPLY_DECISION', payload: decision });
  }

  async function resetGame() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_GAME' });
  }

  // ─── Derived Values ──────────────────────────────────────────────────────────

  const netWorth = state.gameState
    ? calculateNetWorth(state.gameState)
    : 0;

  const turnProgress = state.gameState
    ? state.gameState.turn / 20
    : 0;

  return (
    <GameContext.Provider
      value={{
        gameState: state.gameState,
        isLoading: state.isLoading,
        playerName: state.playerName,
        netWorth,
        turnProgress,
        startNewGame,
        makeDecision,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
