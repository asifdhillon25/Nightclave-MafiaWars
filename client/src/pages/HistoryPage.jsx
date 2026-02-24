// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, ChevronRight, Search, Loader, Trash2, Download } from 'lucide-react';
import { loadGameHistory, deleteGameRecord } from '../utils/storage';
import { useToast } from '../components/UI/Toast';

export const HistoryPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const data = await loadGameHistory();
      // Sort by date descending (most recent first)
      const sortedGames = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
      setGames(sortedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
      showToast('Failed to load game history', 'error');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (gameId, event) => {
    event.stopPropagation(); // Prevent opening the game details
    
    if (!window.confirm('Are you sure you want to delete this game record?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteGameRecord(gameId);
      await fetchGames(); // Refresh the list
      showToast('Game record deleted successfully', 'success');
      
      // Close modal if the deleted game was selected
      if (selectedGame?.id === gameId) {
        setSelectedGame(null);
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      showToast('Failed to delete game record', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportGame = (game, event) => {
    event.stopPropagation(); // Prevent opening the game details
    
    try {
      const gameData = JSON.stringify(game, null, 2);
      const blob = new Blob([gameData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mafia-game-${game.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('Game exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting game:', error);
      showToast('Failed to export game', 'error');
    }
  };

  const handleExportAll = async () => {
    try {
      const allGames = await loadGameHistory();
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalGames: allGames.length,
        games: allGames
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mafia-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('All games exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting all games:', error);
      showToast('Failed to export games', 'error');
    }
  };

  const filteredGames = games.filter(game => {
    const searchLower = searchTerm.toLowerCase();
    return (
      game.players?.some(p => p.name?.toLowerCase().includes(searchLower)) ||
      game.winner?.toLowerCase().includes(searchLower) ||
      new Date(game.date).toLocaleDateString().toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWinRate = (player, game) => {
    if (game.winner === 'mafia') {
      return player.role === 'mafia' && player.alive ? 'Winner' : 'Loser';
    } else {
      return player.role !== 'mafia' && player.alive ? 'Winner' : 'Loser';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading game history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Game History</h1>
          <p className="text-muted-foreground mt-1">
            {games.length} {games.length === 1 ? 'game' : 'games'} recorded
          </p>
        </div>
        
        {games.length > 0 && (
          <button
            onClick={handleExportAll}
            className="btn-outline flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search games by player, winner, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-custom pl-10 w-full"
        />
      </div>

      {/* Games List */}
      {filteredGames.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="card-interactive p-6 relative group"
              onClick={() => setSelectedGame(game)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  game.winner === 'mafia' 
                    ? 'bg-mafia/20 text-mafia' 
                    : 'bg-civilian/20 text-civilian'
                }`}>
                  {game.winner === 'mafia' ? '🔪 Mafia Win' : '👥 Civilian Win'}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => handleExportGame(game, e)}
                    className="p-1 hover:bg-accent rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Export game"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteGame(game.id, e)}
                    disabled={deleting}
                    className="p-1 hover:bg-destructive/10 text-destructive rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete game"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(game.date)}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{game.players?.length || 0} players • {game.rounds || 1} rounds</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Trophy className="w-4 h-4" />
                  <span className="truncate">
                    MVP:{' '}
                    {game.players?.find(p => {
                      if (game.winner === 'mafia') {
                        return p.role === 'mafia' && p.alive;
                      } else {
                        return p.role !== 'mafia' && p.alive;
                      }
                    })?.name || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Player Avatars */}
              <div className="flex -space-x-2 mt-4">
                {game.players?.slice(0, 5).map(player => (
                  <div
                    key={player.id}
                    className={`w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium
                      ${!player.alive ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: player.alive ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--muted))' }}
                    title={`${player.name} (${player.role}) - ${player.alive ? 'Alive' : 'Dead'}`}
                  >
                    {player.image ? (
                      <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      player.name?.charAt(0) || '?'
                    )}
                  </div>
                ))}
                {game.players?.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs">
                    +{game.players.length - 5}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card-base">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No game history</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'No games match your search' : 'Play your first game to see history here'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-link text-primary mt-4"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-base w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Game Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(selectedGame.date)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleExportGame(selectedGame, e)}
                  className="p-2 hover:bg-accent rounded"
                  title="Export game"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-accent rounded"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Game Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 card-base">
                <div className="text-2xl font-bold">{selectedGame.players?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Players</div>
              </div>
              <div className="text-center p-4 card-base">
                <div className="text-2xl font-bold">{selectedGame.rounds || 1}</div>
                <div className="text-sm text-muted-foreground">Rounds</div>
              </div>
              <div className="text-center p-4 card-base">
                <div className={`text-2xl font-bold ${
                  selectedGame.winner === 'mafia' ? 'text-mafia' : 'text-civilian'
                }`}>
                  {selectedGame.winner === 'mafia' ? '🔪' : '👥'}
                </div>
                <div className="text-sm text-muted-foreground">Winner</div>
              </div>
            </div>

            {/* Setup Info */}
            {selectedGame.setup && (
              <div className="bg-secondary/30 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Game Setup</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Mafia: {selectedGame.setup.mafiaCount}</div>
                  {selectedGame.setup.specialRoles?.doctor && (
                    <div className="text-doctor">✓ Doctor</div>
                  )}
                  {selectedGame.setup.specialRoles?.detective && (
                    <div className="text-detective">✓ Detective</div>
                  )}
                  {selectedGame.setup.specialRoles?.granny && (
                    <div className="text-granny">✓ Granny</div>
                  )}
                </div>
              </div>
            )}

            {/* Players List */}
            <h3 className="font-semibold mb-3">Players</h3>
            <div className="space-y-2 mb-6">
              {selectedGame.players?.map(player => {
                const winStatus = getWinRate(player, selectedGame);
                return (
                  <div key={player.id} className="flex items-center justify-between p-3 card-base">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                        {player.image ? (
                          <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          player.name?.charAt(0) || '?'
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {player.role?.charAt(0).toUpperCase() + player.role?.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!player.alive && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                          Dead
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        winStatus === 'Winner'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {winStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Game Log */}
            {selectedGame.logs && selectedGame.logs.length > 0 && (
              <>
                <h3 className="font-semibold mb-3">Game Log</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-custom">
                  {selectedGame.logs.map((log, index) => (
                    <div key={index} className="text-sm p-2 card-base">
                      {log}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Delete Button */}
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={(e) => handleDeleteGame(selectedGame.id, e)}
                disabled={deleting}
                className="btn-destructive w-full flex items-center justify-center space-x-2"
              >
                {deleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Game Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};