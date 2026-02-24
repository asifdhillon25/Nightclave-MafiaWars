// client/src/utils/storage.js
const API_BASE = 'http://localhost:5000/api';

// Helper for handling responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Player storage
export const loadPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE}/players`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
};

export const savePlayers = async (players) => {
  try {
    const response = await fetch(`${API_BASE}/players/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error saving players:', error);
    return false;
  }
};

export const addPlayer = async (player) => {
  try {
    const response = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (response.status === 400 && error.player) {
        // Player already exists, return the existing player
        return error.player;
      }
      throw new Error(error.error);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const updatePlayerStats = async (playerId, won) => {
  try {
    const response = await fetch(`${API_BASE}/players/${playerId}/stats`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ won })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating player stats:', error);
    return false;
  }
};

export const deletePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_BASE}/players/${playerId}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
};

export const getPlayerById = async (playerId) => {
  try {
    const response = await fetch(`${API_BASE}/players/${playerId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error getting player:', error);
    return null;
  }
};

// Game history storage
export const saveGameRecord = async (gameData) => {
  try {
    const response = await fetch(`${API_BASE}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error saving game record:', error);
    return null;
  }
};

export const loadGameHistory = async () => {
  try {
    const response = await fetch(`${API_BASE}/games`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error loading game history:', error);
    return [];
  }
};

export const deleteGameRecord = async (gameId) => {
  try {
    const response = await fetch(`${API_BASE}/games/${gameId}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting game record:', error);
    return false;
  }
};

// Current game state
export const saveCurrentGame = async (gameState) => {
  try {
    const response = await fetch(`${API_BASE}/current-game`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameState)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error saving current game:', error);
    return false;
  }
};

export const loadCurrentGame = async () => {
  try {
    const response = await fetch(`${API_BASE}/current-game`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Error loading current game:', error);
    return null;
  }
};

export const clearCurrentGame = async () => {
  try {
    const response = await fetch(`${API_BASE}/current-game`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error clearing current game:', error);
    return false;
  }
};