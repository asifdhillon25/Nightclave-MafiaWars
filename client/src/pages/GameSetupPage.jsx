// src/pages/GameSetupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Users, Clock, Shield, Eye, Heart, User, Loader } from 'lucide-react';
import { loadPlayers } from '../utils/storage';
import { validateGameSetup, assignRoles } from '../utils/gameLogic';
import { useToast } from '../components/UI/Toast';
import { saveCurrentGame } from '../utils/storage';

export const GameSetupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [setup, setSetup] = useState({
    mafiaCount: 1,
    includeDoctor: false,
    includeDetective: false,
    includeGranny: false,
    votingTime: 60
  });
  const [validationErrors, setValidationErrors] = useState([]);

  // Load players from server
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const data = await loadPlayers();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching players:', error);
      showToast('Failed to load players', 'error');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (playerId) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const validateSetup = () => {
    const validation = validateGameSetup(
      selectedPlayers.length,
      setup.mafiaCount,
      {
        doctor: setup.includeDoctor,
        detective: setup.includeDetective,
        granny: setup.includeGranny
      }
    );
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleStartGame = async () => {
    if (selectedPlayers.length < 4) {
      showToast('Please select at least 4 players', 'error');
      return;
    }

    if (!validateSetup()) {
      showToast('Invalid game configuration', 'error');
      return;
    }

    try {
      // Get full player objects for selected players
      const selectedPlayerObjects = players.filter(p => selectedPlayers.includes(p.id));
      
      // Assign roles
      const gamePlayers = assignRoles(
        selectedPlayerObjects,
        setup.mafiaCount,
        setup.includeDoctor,
        setup.includeDetective,
        setup.includeGranny
      );

      // Create game state
      const gameState = {
        players: gamePlayers,
        phase: 'night',
        round: 1,
        votingTime: setup.votingTime,
        nightActions: {
          mafiaTarget: null,
          doctorTarget: null,
          detectiveTarget: null
        },
        logs: [],
        setup: {
          mafiaCount: setup.mafiaCount,
          includeDoctor: setup.includeDoctor,
          includeDetective: setup.includeDetective,
          includeGranny: setup.includeGranny,
          votingTime: setup.votingTime
        }
      };

      // Save to server
      await saveCurrentGame(gameState);
      
      showToast('Game started successfully!', 'success');
      navigate('/game');
    } catch (error) {
      console.error('Error starting game:', error);
      showToast('Failed to start game', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading players...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Game Setup</h1>
        <p className="text-muted-foreground mt-1">
          Configure your game before starting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Player Selection */}
        <div className="setup-card">
          <h2 className="setup-section-title flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Select Players ({selectedPlayers.length})</span>
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom pr-2">
            {players.length > 0 ? (
              players.map(player => (
                <div
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`player-list-item cursor-pointer transition-colors ${
                    selectedPlayers.includes(player.id)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="player-avatar">
                      {player.image ? (
                        <img src={player.image} alt={player.name} className="player-avatar-image" />
                      ) : (
                        <span>{player.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {player.gamesPlayed || 0} games • {player.wins || 0} wins
                      </p>
                    </div>
                  </div>
                  {selectedPlayers.includes(player.id) && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No players registered yet</p>
                <button
                  onClick={() => navigate('/players')}
                  className="btn-primary mt-2"
                >
                  Add players first
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Game Configuration */}
        <div className="setup-card">
          <h2 className="setup-section-title">Game Settings</h2>

          {/* Mafia Count */}
          <div className="setup-section">
            <label className="label-custom block mb-2">Number of Mafia</label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map(num => {
                const maxMafia = Math.floor(selectedPlayers.length / 2);
                const isDisabled = num > maxMafia || selectedPlayers.length < 4;
                
                return (
                  <button
                    key={num}
                    onClick={() => setSetup({ ...setup, mafiaCount: num })}
                    disabled={isDisabled}
                    className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                      setup.mafiaCount === num
                        ? 'bg-primary text-primary-foreground'
                        : isDisabled
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-secondary hover:bg-accent'
                    }`}
                    title={isDisabled ? `Max mafia for ${selectedPlayers.length} players is ${maxMafia}` : ''}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Max mafia: {Math.floor(selectedPlayers.length / 2)}
            </p>
          </div>

          {/* Special Roles */}
          <div className="setup-section">
            <label className="label-custom block mb-2">Special Roles</label>
            <div className="space-y-3">
              {/* Doctor */}
              <label className="flex items-center justify-between p-3 card-base cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-doctor" />
                  <div>
                    <span>Doctor</span>
                    <p className="text-xs text-muted-foreground">Can save one player each night</p>
                  </div>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={setup.includeDoctor}
                    onChange={(e) => setSetup({ ...setup, includeDoctor: e.target.checked })}
                    className="toggle-switch-input"
                    disabled={selectedPlayers.length < 4}
                  />
                  <div className="toggle-switch-track"></div>
                </div>
              </label>

              {/* Detective */}
              <label className="flex items-center justify-between p-3 card-base cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-detective" />
                  <div>
                    <span>Detective</span>
                    <p className="text-xs text-muted-foreground">Can investigate one player each night</p>
                  </div>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={setup.includeDetective}
                    onChange={(e) => setSetup({ ...setup, includeDetective: e.target.checked })}
                    className="toggle-switch-input"
                    disabled={selectedPlayers.length < 4}
                  />
                  <div className="toggle-switch-track"></div>
                </div>
              </label>

              {/* Granny */}
              <label className="flex items-center justify-between p-3 card-base cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-granny" />
                  <div>
                    <span>Granny</span>
                    <p className="text-xs text-muted-foreground">Kills a mafia if targeted (needs 5+ players)</p>
                  </div>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={setup.includeGranny}
                    onChange={(e) => setSetup({ ...setup, includeGranny: e.target.checked })}
                    className="toggle-switch-input"
                    disabled={selectedPlayers.length < 5}
                  />
                  <div className="toggle-switch-track"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Voting Timer */}
          <div className="setup-section">
            <label className="label-custom block mb-2">Voting Timer (seconds)</label>
            <div className="flex items-center space-x-4">
              {[30, 60, 90, 120].map(time => (
                <button
                  key={time}
                  onClick={() => setSetup({ ...setup, votingTime: time })}
                  className={`flex items-center justify-center space-x-2 flex-1 py-2 rounded-md font-medium transition-colors ${
                    setup.votingTime === time
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{time}s</span>
                </button>
              ))}
            </div>
          </div>

          {/* Game Summary */}
          {selectedPlayers.length >= 4 && (
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Game Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Players:</span>
                  <span className="font-medium">{selectedPlayers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mafia:</span>
                  <span className="font-medium text-mafia">{setup.mafiaCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Civilians:</span>
                  <span className="font-medium text-civilian">
                    {selectedPlayers.length - setup.mafiaCount - 
                     (setup.includeDoctor ? 1 : 0) - 
                     (setup.includeDetective ? 1 : 0) - 
                     (setup.includeGranny ? 1 : 0)}
                  </span>
                </div>
                {setup.includeDoctor && (
                  <div className="flex justify-between text-doctor">
                    <span>➕ Doctor:</span>
                    <span className="font-medium">1</span>
                  </div>
                )}
                {setup.includeDetective && (
                  <div className="flex justify-between text-detective">
                    <span>➕ Detective:</span>
                    <span className="font-medium">1</span>
                  </div>
                )}
                {setup.includeGranny && (
                  <div className="flex justify-between text-granny">
                    <span>➕ Granny:</span>
                    <span className="font-medium">1</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Setup Invalid:</p>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            disabled={selectedPlayers.length < 4 || validationErrors.length > 0}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Game
          </button>

          {/* Quick Navigation */}
          {players.length === 0 && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Need to add players first?
              </p>
              <button
                onClick={() => navigate('/players')}
                className="btn-outline w-full"
              >
                Go to Player Registry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};