// src/pages/GamePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Skull, AlertCircle, Loader } from 'lucide-react';
import { NightPhase } from '../components/Game/NightPhase';
import { DayPhase } from '../components/Game/DayPhase';
import { Voting } from '../components/Game/Voting';
import { Timer } from '../components/Game/Timer';
import { checkWinCondition, PHASES } from '../utils/gameLogic';
import { 
  saveGameRecord, 
  updatePlayerStats, 
  clearCurrentGame,
  loadCurrentGame,
  saveCurrentGame 
} from '../utils/storage';
import { useToast } from '../components/UI/Toast';

export const GamePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load current game from server
  useEffect(() => {
    fetchCurrentGame();
  }, []);

  const fetchCurrentGame = async () => {
    setLoading(true);
    try {
      const savedGame = await loadCurrentGame();
      if (savedGame) {
        setGameState(savedGame);
      } else {
        showToast('No active game found', 'info');
        navigate('/setup');
      }
    } catch (error) {
      console.error('Error loading game:', error);
      showToast('Failed to load game', 'error');
      navigate('/setup');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save game state whenever it changes
  useEffect(() => {
    const autoSaveGame = async () => {
      if (gameState && !saving) {
        setSaving(true);
        try {
          await saveCurrentGame(gameState);
        } catch (error) {
          console.error('Error auto-saving game:', error);
        } finally {
          setSaving(false);
        }
      }
    };

    autoSaveGame();
  }, [gameState]);

  // Check win condition
  useEffect(() => {
    if (gameState) {
      const { winner, gameOver } = checkWinCondition(gameState.players);
      if (gameOver && !showWinnerModal) {
        setWinner(winner);
        setShowWinnerModal(true);
        handleGameEnd(winner);
      }
    }
  }, [gameState]);

  const handleGameEnd = async (winner) => {
    try {
      // Save game record
      const gameRecord = {
        players: gameState.players.map(p => ({
          id: p.id,
          name: p.name,
          role: p.role,
          alive: p.alive,
          image: p.image
        })),
        winner,
        rounds: gameState.round,
        date: new Date().toISOString(),
        setup: {
          mafiaCount: gameState.players.filter(p => p.role === 'mafia').length,
          specialRoles: {
            doctor: gameState.players.some(p => p.role === 'doctor'),
            detective: gameState.players.some(p => p.role === 'detective'),
            granny: gameState.players.some(p => p.role === 'granny')
          }
        }
      };

      await saveGameRecord(gameRecord);

      // Update player stats
      const statsPromises = gameState.players.map(player => {
        const won = winner === 'civilians' 
          ? player.role !== 'mafia' && player.alive
          : player.role === 'mafia' && player.alive;
        return updatePlayerStats(player.id, won);
      });

      await Promise.all(statsPromises);
      await clearCurrentGame();

      showToast('Game saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving game record:', error);
      showToast('Failed to save game record', 'error');
    }
  };

  const handlePhaseChange = async (newPhase) => {
    setGameState(prev => ({
      ...prev,
      phase: newPhase
    }));
  };

  const handleNightActions = async (actions) => {
    setGameState(prev => ({
      ...prev,
      nightActions: actions
    }));
  };

  const handleVote = async (votedOutId) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(p =>
        p.id === votedOutId ? { ...p, alive: false } : p
      );

      return {
        ...prev,
        players: updatedPlayers,
        phase: PHASES.NIGHT,
        round: prev.round + 1,
        nightActions: {
          mafiaTarget: null,
          doctorTarget: null,
          detectiveTarget: null
        }
      };
    });

    if (votedOutId) {
      const votedOutPlayer = gameState.players.find(p => p.id === votedOutId);
      showToast(`${votedOutPlayer?.name} was voted out`, 'info');
    } else {
      showToast('No one was voted out (tie)', 'info');
    }
  };

  const handleNewGame = () => {
    navigate('/setup');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading game...</span>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Active Game</h2>
        <p className="text-muted-foreground">Start a new game from the setup page</p>
        <button onClick={handleNewGame} className="btn-primary">
          Go to Setup
        </button>
      </div>
    );
  }

  const alivePlayers = gameState.players.filter(p => p.alive);
  const deadPlayers = gameState.players.filter(p => !p.alive);

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Loader className="w-3 h-3 animate-spin" />
          Saving...
        </div>
      )}

      {/* Game Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">
              {gameState.phase === PHASES.NIGHT ? '🌙 Night Phase' : 
               gameState.phase === PHASES.DAY ? '☀️ Day Phase' : 
               '🗳️ Voting Phase'}
            </h1>
            <span className={`phase-indicator-${gameState.phase === PHASES.NIGHT ? 'night' : 'day'}`}>
              Round {gameState.round}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {alivePlayers.length} alive • {deadPlayers.length} dead
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Timer
            seconds={gameState.votingTime}
            isActive={gameState.phase === PHASES.VOTING}
            onTimeout={() => handlePhaseChange(PHASES.NIGHT)}
          />
          
          {/* Manual Save Button */}
          <button
            onClick={() => saveCurrentGame(gameState)}
            disabled={saving}
            className="btn-outline px-3 py-2 text-sm"
            title="Save game manually"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-3 space-y-6">
          {gameState.phase === PHASES.NIGHT && (
            <NightPhase
              players={alivePlayers}
              nightActions={gameState.nightActions}
              onActionsComplete={handleNightActions}
              onPhaseComplete={() => handlePhaseChange(PHASES.DAY)}
            />
          )}

          {gameState.phase === PHASES.DAY && (
            <DayPhase
              players={gameState.players}
              nightActions={gameState.nightActions}
              onPhaseComplete={() => handlePhaseChange(PHASES.VOTING)}
            />
          )}

          {gameState.phase === PHASES.VOTING && (
            <Voting
              players={alivePlayers}
              timer={gameState.votingTime}
              onVoteComplete={handleVote}
            />
          )}
        </div>

        {/* Player Status Sidebar */}
        <div className="space-y-4">
          <div className="card-base p-4">
            <h3 className="font-semibold mb-3 flex items-center justify-between">
              <span>Alive Players ({alivePlayers.length})</span>
              <span className="text-xs text-muted-foreground">
                Round {gameState.round}
              </span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom pr-2">
              {alivePlayers.map(player => (
                <div key={player.id} className="player-card-alive p-3">
                  <div className="flex items-center space-x-3">
                    <div className="player-avatar w-8 h-8 text-sm">
                      {player.image ? (
                        <img src={player.image} alt={player.name} className="player-avatar-image" />
                      ) : (
                        <span>{player.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.role === 'mafia' ? '🔪 Mafia' : 
                         player.role === 'doctor' ? '💊 Doctor' :
                         player.role === 'detective' ? '🔍 Detective' :
                         player.role === 'granny' ? '👵 Granny' : '👤 Civilian'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {alivePlayers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No alive players
                </p>
              )}
            </div>
          </div>

          <div className="card-base p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Skull className="w-4 h-4" />
              <span>Dead Players ({deadPlayers.length})</span>
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-custom">
              {deadPlayers.map(player => (
                <div key={player.id} className="player-card-dead p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {player.name.charAt(0)}
                    </div>
                    <span className="text-sm line-through">{player.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {player.role}
                    </span>
                  </div>
                </div>
              ))}
              {deadPlayers.length === 0 && (
                <p className="text-center text-muted-foreground py-2">
                  No deaths yet
                </p>
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="card-base p-4 text-sm">
            <h3 className="font-semibold mb-2">Game Info</h3>
            <div className="space-y-1 text-muted-foreground">
              <p>Total Players: {gameState.players.length}</p>
              <p>Mafia: {gameState.players.filter(p => p.role === 'mafia' && p.alive).length} alive</p>
              <p>Civilians: {gameState.players.filter(p => 
                p.role !== 'mafia' && p.alive
              ).length} alive</p>
              <p>Voting Time: {gameState.votingTime}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && (
        <div className="winner-announcement">
          <div className="winner-card">
            <h2 className={`winner-title-${winner}`}>
              {winner === 'mafia' ? '🔪 Mafia Wins!' : '👥 Civilians Win!'}
            </h2>
            <p className="text-muted-foreground">
              {winner === 'mafia' 
                ? 'The mafia has taken over the town!' 
                : 'The civilians have eliminated all threats!'}
            </p>
            
            {/* Game Summary */}
            <div className="bg-secondary/30 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">Game Summary</h3>
              <div className="space-y-1 text-sm">
                <p>Rounds played: {gameState.round}</p>
                <p>Players: {gameState.players.length}</p>
                <p>Survivors: {gameState.players.filter(p => p.alive).length}</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleNewGame}
                className="btn-primary flex-1"
              >
                New Game
              </button>
              <button
                onClick={handleViewHistory}
                className="btn-outline flex-1"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};