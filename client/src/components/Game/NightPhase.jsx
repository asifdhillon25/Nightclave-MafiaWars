// src/components/Game/NightPhase.jsx
import React, { useState } from 'react';
import { Moon, Skull, Heart, Eye, Shield, User, Check } from 'lucide-react';

export const NightPhase = ({ players, nightActions, onActionsComplete, onPhaseComplete }) => {
  const [actions, setActions] = useState(nightActions || {
    mafiaTarget: null,
    doctorTarget: null,
    detectiveTarget: null
  });
  const [currentAction, setCurrentAction] = useState('mafia');

  const mafiaPlayers = players.filter(p => p.role === 'mafia');
  const doctorPlayer = players.find(p => p.role === 'doctor');
  const detectivePlayer = players.find(p => p.role === 'detective');
  const grannyPlayer = players.find(p => p.role === 'granny');

  const handleTargetSelect = (playerId) => {
    setActions(prev => ({
      ...prev,
      [currentAction === 'mafia' ? 'mafiaTarget' : 
       currentAction === 'doctor' ? 'doctorTarget' : 'detectiveTarget']: playerId
    }));

    // Move to next action
    if (currentAction === 'mafia' && doctorPlayer) {
      setCurrentAction('doctor');
    } else if (currentAction === 'doctor' && detectivePlayer) {
      setCurrentAction('detective');
    } else if (currentAction === 'detective') {
      setCurrentAction('review');
    } else if (currentAction === 'mafia' && !doctorPlayer && detectivePlayer) {
      setCurrentAction('detective');
    } else if (currentAction === 'mafia' && !doctorPlayer && !detectivePlayer) {
      setCurrentAction('review');
    } else {
      setCurrentAction('review');
    }
  };

  const handleComplete = () => {
    onActionsComplete(actions);
    onPhaseComplete();
  };

  const getActionIcon = () => {
    switch(currentAction) {
      case 'mafia': return <Skull className="w-8 h-8 text-mafia" />;
      case 'doctor': return <Heart className="w-8 h-8 text-doctor" />;
      case 'detective': return <Eye className="w-8 h-8 text-detective" />;
      default: return <Moon className="w-8 h-8 text-indigo-500" />;
    }
  };

  const getActionTitle = () => {
    switch(currentAction) {
      case 'mafia': return 'Mafia, choose your victim';
      case 'doctor': return 'Doctor, choose who to save';
      case 'detective': return 'Detective, choose who to investigate';
      default: return 'Review night actions';
    }
  };

  const getActionDescription = () => {
    switch(currentAction) {
      case 'mafia': return `Mafia members: ${mafiaPlayers.map(p => p.name).join(', ')}`;
      case 'doctor': return `Doctor: ${doctorPlayer?.name}`;
      case 'detective': return `Detective: ${detectivePlayer?.name}`;
      default: return 'All actions have been recorded';
    }
  };

  const isActionComplete = () => {
    if (currentAction === 'review') return true;
    if (currentAction === 'mafia' && actions.mafiaTarget) return true;
    if (currentAction === 'doctor' && actions.doctorTarget) return true;
    if (currentAction === 'detective' && actions.detectiveTarget) return true;
    return false;
  };

  return (
    <div className="card-base p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-900/20 rounded-full">
          {getActionIcon()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{getActionTitle()}</h2>
          <p className="text-muted-foreground">{getActionDescription()}</p>
        </div>
      </div>

      {/* Target Selection */}
      {currentAction !== 'review' && (
        <div className="space-y-4">
          <p className="font-medium">Select a player:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {players
              .filter(p => {
                // Filter based on current action and role restrictions
                if (currentAction === 'mafia') {
                  // Mafia can't target themselves
                  return p.role !== 'mafia' && p.alive;
                }
                if (currentAction === 'doctor') {
                  // Doctor can target anyone alive
                  return p.alive;
                }
                if (currentAction === 'detective') {
                  // Detective can target anyone alive
                  return p.alive;
                }
                return false;
              })
              .map(player => {
                const isSelected = 
                  (currentAction === 'mafia' && actions.mafiaTarget === player.id) ||
                  (currentAction === 'doctor' && actions.doctorTarget === player.id) ||
                  (currentAction === 'detective' && actions.detectiveTarget === player.id);

                return (
                  <button
                    key={player.id}
                    onClick={() => handleTargetSelect(player.id)}
                    className={`voting-card ${isSelected ? 'voting-card-selected' : ''}`}
                    disabled={isSelected}
                  >
                    <div className="relative">
                      <div className="player-avatar w-12 h-12 mx-auto mb-2">
                        {player.image ? (
                          <img src={player.image} alt={player.name} className="player-avatar-image" />
                        ) : (
                          <span>{player.name.charAt(0)}</span>
                        )}
                      </div>
                      <p className="font-medium text-sm truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.role === 'civilian' ? '👤 Civilian' : ''}
                        {player.role === 'doctor' ? '💊 Doctor' : ''}
                        {player.role === 'detective' ? '🔍 Detective' : ''}
                        {player.role === 'granny' ? '👵 Granny' : ''}
                      </p>
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-primary rounded-full p-1">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Review Section */}
      {currentAction === 'review' && (
        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Recorded Actions:</h3>
            <div className="space-y-2">
              {actions.mafiaTarget && (
                <div className="flex items-center gap-2 text-sm">
                  <Skull className="w-4 h-4 text-mafia" />
                  <span>Mafia target: {players.find(p => p.id === actions.mafiaTarget)?.name}</span>
                </div>
              )}
              {actions.doctorTarget && (
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-doctor" />
                  <span>Doctor save: {players.find(p => p.id === actions.doctorTarget)?.name}</span>
                </div>
              )}
              {actions.detectiveTarget && (
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-detective" />
                  <span>Detective investigate: {players.find(p => p.id === actions.detectiveTarget)?.name}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="btn-primary w-full py-3"
          >
            End Night Phase
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2">
        {['mafia', 'doctor', 'detective', 'review']
          .filter(step => {
            if (step === 'doctor' && !doctorPlayer) return false;
            if (step === 'detective' && !detectivePlayer) return false;
            return true;
          })
          .map((step, index) => {
            const isActive = step === currentAction;
            const isComplete = 
              (step === 'mafia' && actions.mafiaTarget) ||
              (step === 'doctor' && actions.doctorTarget) ||
              (step === 'detective' && actions.detectiveTarget) ||
              step === 'review';

            return (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? 'w-8 bg-primary' : 
                  isComplete ? 'bg-success' : 'bg-muted'
                }`}
              />
            );
          })}
      </div>
    </div>
  );
};