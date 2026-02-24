// src/utils/gameLogic.js
export const ROLES = {
  MAFIA: 'mafia',
  CIVILIAN: 'civilian',
  DOCTOR: 'doctor',
  DETECTIVE: 'detective',
  GRANNY: 'granny'
};

export const PHASES = {
  NIGHT: 'night',
  DAY: 'day',
  VOTING: 'voting',
  ENDED: 'ended'
};

export const validateGameSetup = (playerCount, mafiaCount, specialRoles) => {
  const errors = [];
  
  // Basic validation
  if (playerCount < 4) {
    errors.push('Need at least 4 players to start');
  }
  
  if (mafiaCount < 1) {
    errors.push('Need at least 1 mafia');
  }
  
  if (mafiaCount > Math.floor(playerCount / 2)) {
    errors.push('Too many mafia for player count');
  }
  
  // Special roles validation
  const specialRolesCount = Object.values(specialRoles).filter(Boolean).length;
  const civilianCount = playerCount - mafiaCount - specialRolesCount;
  
  if (civilianCount < 1) {
    errors.push('Need at least 1 civilian');
  }
  
  // Granny specific validation
  if (specialRoles.granny && playerCount < 5) {
    errors.push('Granny requires at least 5 players');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const assignRoles = (players, mafiaCount, includeDoctor, includeDetective, includeGranny) => {
  const roles = [];
  const playerIds = [...players];
  
  // Add special roles first
  if (includeDoctor) roles.push(ROLES.DOCTOR);
  if (includeDetective) roles.push(ROLES.DETECTIVE);
  if (includeGranny) roles.push(ROLES.GRANNY);
  
  // Add mafia roles
  for (let i = 0; i < mafiaCount; i++) {
    roles.push(ROLES.MAFIA);
  }
  
  // Fill remaining with civilians
  while (roles.length < playerIds.length) {
    roles.push(ROLES.CIVILIAN);
  }
  
  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }
  
  // Assign roles to players
  return playerIds.map((player, index) => ({
    ...player,
    role: roles[index],
    alive: true,
    protected: false,
    investigated: false,
    visitedBy: null
  }));
};

export const checkWinCondition = (players) => {
  const alivePlayers = players.filter(p => p.alive);
  const mafiaAlive = alivePlayers.filter(p => p.role === ROLES.MAFIA).length;
  const civiliansAlive = alivePlayers.length - mafiaAlive;
  
  if (mafiaAlive === 0) {
    return { winner: 'civilians', gameOver: true };
  }
  
  if (mafiaAlive >= civiliansAlive) {
    return { winner: 'mafia', gameOver: true };
  }
  
  return { winner: null, gameOver: false };
};

export const resolveNightActions = (players, mafiaTarget, doctorTarget, detectiveTarget) => {
  let updatedPlayers = [...players];
  let deathAnnouncement = null;
  let investigationResult = null;
  
  // Reset night protections
  updatedPlayers = updatedPlayers.map(p => ({
    ...p,
    protected: false,
    visitedBy: null
  }));
  
  // Doctor save
  if (doctorTarget) {
    updatedPlayers = updatedPlayers.map(p =>
      p.id === doctorTarget ? { ...p, protected: true } : p
    );
  }
  
  // Mafia kill
  if (mafiaTarget) {
    const targetPlayer = updatedPlayers.find(p => p.id === mafiaTarget);
    if (targetPlayer && !targetPlayer.protected) {
      // Granny kills mafia if targeted
      if (targetPlayer.role === ROLES.GRANNY && targetPlayer.alive) {
        // Find and kill a random mafia
        const mafiaPlayers = updatedPlayers.filter(p => p.role === ROLES.MAFIA && p.alive);
        if (mafiaPlayers.length > 0) {
          const randomMafia = mafiaPlayers[Math.floor(Math.random() * mafiaPlayers.length)];
          updatedPlayers = updatedPlayers.map(p =>
            p.id === randomMafia.id ? { ...p, alive: false } : p
          );
          deathAnnouncement = `A mafia was killed by Granny!`;
        }
      } else {
        // Normal kill
        updatedPlayers = updatedPlayers.map(p =>
          p.id === mafiaTarget ? { ...p, alive: false } : p
        );
        deathAnnouncement = `${targetPlayer.name} was killed by the mafia`;
      }
    }
  }
  
  // Detective investigate
  if (detectiveTarget) {
    const targetPlayer = updatedPlayers.find(p => p.id === detectiveTarget);
    if (targetPlayer) {
      investigationResult = {
        playerId: targetPlayer.id,
        playerName: targetPlayer.name,
        isMafia: targetPlayer.role === ROLES.MAFIA
      };
    }
  }
  
  return {
    players: updatedPlayers,
    deathAnnouncement,
    investigationResult
  };
};