// src/pages/PlayerRegistryPage.jsx
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Camera, X, Loader } from 'lucide-react';
import { loadPlayers, addPlayer } from '../utils/storage';
import { PlayerCard } from '../components/Player/PlayerCard';
import { useToast } from '../components/UI/Toast';

export const PlayerRegistryPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', image: null });
  const { showToast } = useToast();

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
      setPlayers([]);
      showToast('Failed to load players', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayer.name.trim()) {
      showToast('Please enter a player name', 'error');
      return;
    }

    try {
      const added = await addPlayer(newPlayer);
      if (added) {
        await fetchPlayers(); // Refresh the list
        setShowAddModal(false);
        setNewPlayer({ name: '', image: null });
        showToast('Player added successfully!', 'success');
      }
    } catch (error) {
      if (error.message.includes('already exists')) {
        showToast('Player already exists!', 'error');
      } else {
        showToast('Error adding player', 'error');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlayer({ ...newPlayer, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading players...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Player Registry</h1>
          <p className="text-muted-foreground mt-1">
            {players.length} {players.length === 1 ? 'player' : 'players'} registered
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Player</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-custom pl-10 w-full"
        />
      </div>

      {/* Player Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="player-grid">
          {filteredPlayers.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card-base">
          <UserPlus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No players found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try a different search term' : 'Start by adding your first player'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Player
            </button>
          )}
        </div>
      )}

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-base w-full max-w-md p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Player</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {newPlayer.image ? (
                      <img src={newPlayer.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="label-custom block mb-2">Player Name *</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  placeholder="Enter player name"
                  className="input-custom w-full"
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddPlayer}
                  className="btn-primary flex-1"
                >
                  Add Player
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};