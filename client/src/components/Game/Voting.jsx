// src/components/Game/Voting.jsx
import React, { useState, useEffect } from 'react';
import { Vote, Clock, AlertCircle, Skull, CheckCircle } from 'lucide-react';
import { Timer } from './Timer';

export const Voting = ({ players, timer = 60, onVoteComplete }) => {
  const [votes, setVotes] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [votingActive, setVotingActive] = useState(true);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Initialize votes
  useEffect(() => {
    const initialVotes = {};
    players.forEach(player => {
      initialVotes[player.id] = 0;
    });
    setVotes(initialVotes);
  }, [players]);

  const handleTimerExpire = () => {
    setTimerExpired(true);
    setVotingActive(false);
    setShowResults(true);
  };

  const handlePlayerSelect = (playerId) => {
    if (!votingActive) return;
    setSelectedPlayer(playerId);
  };

  const handleCastVote = () => {
    if (!selectedPlayer) {
      alert('Please select a player to vote out');
      return;
    }

    // Add one vote to the selected player
    setVotes(prev => ({
      ...prev,
      [selectedPlayer]: (prev[selectedPlayer] || 0) + 1
    }));

    // Reset selection for next vote
    setSelectedPlayer(null);
  };

  const handleEndVoting = () => {
    setVotingActive(false);
    setShowResults(true);
  };

  const calculateResults = () => {
    let maxVotes = 0;
    let votedOutId = null;
    let tie = false;
    let totalVotesCast = 0;

    Object.entries(votes).forEach(([playerId, voteCount]) => {
      totalVotesCast += voteCount;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        votedOutId = playerId;
        tie = false;
      } else if (voteCount === maxVotes && maxVotes > 0) {
        tie = true;
      }
    });

    // If no votes were cast, it's a tie (nobody voted)
    if (totalVotesCast === 0) {
      tie = true;
      votedOutId = null;
    }

    return { votedOutId, tie, maxVotes, totalVotesCast };
  };

  const handleComplete = () => {
    const { votedOutId, tie } = calculateResults();
    
    if (tie) {
      alert("It's a tie! No one is voted out.");
      onVoteComplete(null);
    } else {
      const votedOutPlayer = players.find(p => p.id === votedOutId);
      if (window.confirm(`${votedOutPlayer.name} has been voted out. Continue?`)) {
        onVoteComplete(votedOutId);
      }
    }
  };

  const { votedOutId, tie, maxVotes, totalVotesCast } = calculateResults();
  const remainingVoters = players.length - totalVotesCast;

  // Voting Phase UI
  if (!showResults) {
    return (
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Vote className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Voting Phase</h2>
              <p className="text-muted-foreground">
                {remainingVoters} vote{remainingVoters !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
          <Timer 
            seconds={timer} 
            isActive={votingActive} 
            onTimeout={handleTimerExpire}
            size="lg"
          />
        </div>

        {/* Voting Instructions */}
        <div className="bg-secondary/30 p-4 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click on a player to select them for elimination</li>
            <li>Click "Cast Vote" to record a vote for the selected player</li>
            <li>Each click adds one vote - vote as many times as there are players</li>
            <li>Click "End Voting" when all votes are cast or timer expires</li>
          </ul>
        </div>

        {/* Selected Player Indicator */}
        {selectedPlayer && (
          <div className="bg-primary/10 p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Selected: <strong>{players.find(p => p.id === selectedPlayer)?.name}</strong></span>
            </div>
            <button
              onClick={() => setSelectedPlayer(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}

        {/* Voting Grid */}
        <div className="voting-grid mb-6">
          {players.map(player => {
            const voteCount = votes[player.id] || 0;
            const isSelected = player.id === selectedPlayer;
            
            return (
              <button
                key={player.id}
                onClick={() => handlePlayerSelect(player.id)}
                disabled={!votingActive}
                className={`voting-card relative ${
                  isSelected ? 'voting-card-selected ring-2 ring-primary' : ''
                } ${!votingActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative">
                  <div className="player-avatar w-16 h-16 mx-auto mb-2">
                    {player.image ? (
                      <img src={player.image} alt={player.name} className="player-avatar-image" />
                    ) : (
                      <span className="text-xl">{player.name.charAt(0)}</span>
                    )}
                  </div>
                  <p className="font-medium text-sm truncate">{player.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.role?.charAt(0).toUpperCase() + player.role?.slice(1) || 'Player'}
                  </p>
                  
                  {/* Vote Count Badge */}
                  {voteCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground 
                                  rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold
                                  animate-pulse">
                      {voteCount}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Vote Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleCastVote}
            disabled={!selectedPlayer || !votingActive}
            className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cast Vote for Selected Player
          </button>
          
          <button
            onClick={handleEndVoting}
            disabled={!votingActive}
            className="btn-outline px-6 py-3 disabled:opacity-50"
          >
            End Voting
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Votes Cast: {totalVotesCast} / {players.length}</span>
            <span>{Math.round((totalVotesCast / players.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(totalVotesCast / players.length) * 100}%` }}
            />
          </div>
        </div>

        {timerExpired && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Time expired! Click "End Voting" to see results.</span>
          </div>
        )}
      </div>
    );
  }

  // Results UI
  return (
    <div className="card-base p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Voting Results</h2>

      {tie ? (
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">It's a Tie!</h3>
          <p className="text-muted-foreground mb-6">
            {totalVotesCast === 0 
              ? "No votes were cast." 
              : "Multiple players received the same number of votes."}
            <br />No one is voted out tonight.
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="relative inline-block">
            <div className="player-avatar w-24 h-24 mx-auto mb-4 ring-4 ring-destructive">
              {players.find(p => p.id === votedOutId)?.image ? (
                <img 
                  src={players.find(p => p.id === votedOutId)?.image} 
                  alt="Voted out" 
                  className="player-avatar-image"
                />
              ) : (
                <span className="text-3xl">
                  {players.find(p => p.id === votedOutId)?.name?.charAt(0)}
                </span>
              )}
            </div>
            <Skull className="absolute -top-2 -right-2 w-8 h-8 text-destructive" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">
            {players.find(p => p.id === votedOutId)?.name}
          </h3>
          <p className="text-muted-foreground mb-4">
            was voted out with {maxVotes} vote{maxVotes !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Vote Breakdown */}
      <div className="bg-secondary/30 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-3">Vote Breakdown</h4>
        <div className="space-y-2">
          {players.map(player => {
            const voteCount = votes[player.id] || 0;
            const percentage = totalVotesCast > 0 ? (voteCount / totalVotesCast) * 100 : 0;
            
            return (
              <div key={player.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{player.name}</span>
                  <span className="font-medium">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      player.id === votedOutId ? 'bg-destructive' : 'bg-primary'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleComplete}
          className="btn-primary flex-1 py-3"
        >
          {tie ? 'Continue to Night Phase' : 'Confirm Elimination'}
        </button>
        
        <button
          onClick={() => {
            setShowResults(false);
            setVotingActive(true);
            setTimerExpired(false);
          }}
          className="btn-outline px-6 py-3"
        >
          Revote
        </button>
      </div>
    </div>
  );
};