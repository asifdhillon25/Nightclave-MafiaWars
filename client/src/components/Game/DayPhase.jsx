// src/components/Game/DayPhase.jsx
import React, { useState } from 'react';
import { Sun, Skull, Heart, Eye } from 'lucide-react';

export const DayPhase = ({ players, nightActions, onPhaseComplete }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [investigationResult, setInvestigationResult] = useState(null);

  // Resolve night actions when component mounts
  React.useEffect(() => {
    resolveNightActions();
  }, []);

  const resolveNightActions = () => {
    const { mafiaTarget, doctorTarget, detectiveTarget } = nightActions;
    let deathMessage = null;
    let investigation = null;

    // Check if mafia target was saved by doctor
    const wasSaved = doctorTarget && doctorTarget === mafiaTarget;
    
    if (mafiaTarget && !wasSaved) {
      const targetPlayer = players.find(p => p.id === mafiaTarget);
      if (targetPlayer) {
        // Check if target is Granny
        if (targetPlayer.role === 'granny') {
          deathMessage = `🔪 Last night, the mafia targeted ${targetPlayer.name}, but they found Granny! A mafia member was killed in the struggle!`;
        } else {
          deathMessage = `☠️ Last night, ${targetPlayer.name} was killed by the mafia.`;
        }
      }
    } else if (mafiaTarget && wasSaved) {
      const targetPlayer = players.find(p => p.id === mafiaTarget);
      deathMessage = `💊 Last night, the mafia tried to kill ${targetPlayer.name}, but the doctor saved them!`;
    } else {
      deathMessage = `🌙 Last night was peaceful. No one died.`;
    }

    // Detective investigation
    if (detectiveTarget) {
      const investigatedPlayer = players.find(p => p.id === detectiveTarget);
      if (investigatedPlayer) {
        investigation = {
          player: investigatedPlayer.name,
          isMafia: investigatedPlayer.role === 'mafia'
        };
      }
    }

    setAnnouncement(deathMessage);
    setInvestigationResult(investigation);
  };

  return (
    <div className="card-base p-6 space-y-6">
      {/* Day Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-500/20 rounded-full">
          <Sun className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Day Phase</h2>
          <p className="text-muted-foreground">Discuss what happened last night</p>
        </div>
      </div>

      {/* Night Results */}
      <div className="space-y-4">
        {/* Death Announcement */}
        <div className={`p-4 rounded-lg ${
          announcement?.includes('killed') 
            ? 'bg-destructive/10 border border-destructive/20' 
            : 'bg-secondary/30'
        }`}>
          <div className="flex items-start gap-3">
            {announcement?.includes('killed') ? (
              <Skull className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            ) : (
              <Heart className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            )}
            <p className="text-lg">{announcement}</p>
          </div>
        </div>

        {/* Detective Investigation Result */}
        {investigationResult && (
          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-detective flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Detective's Investigation:</p>
                <p className="text-lg">
                  {investigationResult.player} is{' '}
                  <span className={investigationResult.isMafia ? 'text-mafia font-bold' : 'text-success font-bold'}>
                    {investigationResult.isMafia ? 'MAFIA!' : 'NOT mafia'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day Instructions */}
      <div className="bg-secondary/30 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Discussion Time</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Players discuss what happened and who might be mafia</li>
          <li>The detective can share their findings (or stay silent)</li>
          <li>Prepare for the voting phase</li>
        </ul>
      </div>

      {/* Proceed to Voting Button */}
      <button
        onClick={onPhaseComplete}
        className="btn-primary w-full py-3 text-lg"
      >
        Start Voting Phase
      </button>
    </div>
  );
};