// server/routes/players.js
import express from 'express';
import { readJsonFile, writeJsonFile, generateId, validatePlayer } from '../utils/fileHelpers.js';

const router = express.Router();
const PLAYERS_FILE = 'players.json';

// GET all players
router.get('/', async (req, res, next) => {
  try {
    const players = await readJsonFile(PLAYERS_FILE);
    res.json(players);
  } catch (error) {
    next(error);
  }
});

// GET player by ID
router.get('/:id', async (req, res, next) => {
  try {
    const players = await readJsonFile(PLAYERS_FILE);
    const player = players.find(p => p.id === req.params.id);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    next(error);
  }
});

// POST new player
router.post('/', async (req, res, next) => {
  try {
    const { name, image } = req.body;
    
    // Validate player data
    validatePlayer({ name });
    
    const players = await readJsonFile(PLAYERS_FILE);
    
    // Check if player already exists (case insensitive)
    const exists = players.some(p => 
      p.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    
    if (exists) {
      return res.status(400).json({ 
        error: 'Player already exists',
        player: players.find(p => p.name.toLowerCase().trim() === name.toLowerCase().trim())
      });
    }
    
    const newPlayer = {
      id: generateId(),
      name: name.trim(),
      image: image || null,
      createdAt: new Date().toISOString(),
      gamesPlayed: 0,
      wins: 0
    };
    
    players.push(newPlayer);
    await writeJsonFile(PLAYERS_FILE, players);
    
    res.status(201).json(newPlayer);
  } catch (error) {
    next(error);
  }
});

// PUT update player
router.put('/:id', async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const players = await readJsonFile(PLAYERS_FILE);
    const index = players.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // Check if new name conflicts with existing player
    if (name && name !== players[index].name) {
      const nameExists = players.some(p => 
        p.id !== req.params.id && 
        p.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      
      if (nameExists) {
        return res.status(400).json({ error: 'Player name already exists' });
      }
    }
    
    players[index] = {
      ...players[index],
      name: name ? name.trim() : players[index].name,
      image: image !== undefined ? image : players[index].image
    };
    
    await writeJsonFile(PLAYERS_FILE, players);
    res.json(players[index]);
  } catch (error) {
    next(error);
  }
});

// DELETE player
router.delete('/:id', async (req, res, next) => {
  try {
    const players = await readJsonFile(PLAYERS_FILE);
    const filteredPlayers = players.filter(p => p.id !== req.params.id);
    
    if (filteredPlayers.length === players.length) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    await writeJsonFile(PLAYERS_FILE, filteredPlayers);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// PATCH update player stats
router.patch('/:id/stats', async (req, res, next) => {
  try {
    const { won } = req.body;
    const players = await readJsonFile(PLAYERS_FILE);
    const index = players.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    players[index].gamesPlayed = (players[index].gamesPlayed || 0) + 1;
    if (won) {
      players[index].wins = (players[index].wins || 0) + 1;
    }
    
    await writeJsonFile(PLAYERS_FILE, players);
    res.json(players[index]);
  } catch (error) {
    next(error);
  }
});

export default router;