// src/components/Player/PlayerCard.jsx
import React from 'react';
import { User, Trophy, Gamepad2 } from 'lucide-react';

export const PlayerCard = ({ player }) => {
  return (
    <div className="card-base p-4 hover:shadow-lg transition-all group">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative">
          <div className="player-avatar w-16 h-16">
            {player.image ? (
              <img 
                src={player.image} 
                alt={player.name} 
                className="player-avatar-image group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <span className="text-2xl">{player.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs">✓</span>
          </div>
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{player.name}</h3>
          <p className="text-sm text-muted-foreground">
            Added {new Date(player.createdAt).toLocaleDateString()}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <Gamepad2 className="w-4 h-4 text-muted-foreground" />
              <span>{player.gamesPlayed || 0} games</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>{player.wins || 0} wins</span>
            </div>
          </div>

          {/* Win Rate Bar */}
          {player.gamesPlayed > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-medium">
                  {Math.round((player.wins / player.gamesPlayed) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-300"
                  style={{ width: `${(player.wins / player.gamesPlayed) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};