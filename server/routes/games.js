// server/routes/games.js
import express from 'express';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileHelpers.js';

const router = express.Router();
const GAMES_FILE = 'games.json';

// GET all games
router.get('/', async (req, res, next) => {
  try {
    const games = await readJsonFile(GAMES_FILE);
    // Sort by date descending (most recent first)
    games.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(games);
  } catch (error) {
    next(error);
  }
});

// GET game by ID
router.get('/:id', async (req, res, next) => {
  try {
    const games = await readJsonFile(GAMES_FILE);
    const game = games.find(g => g.id === req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    next(error);
  }
});

// POST new game record
router.post('/', async (req, res, next) => {
  try {
    const games = await readJsonFile(GAMES_FILE);
    
    const newGame = {
      id: generateId(),
      date: new Date().toISOString(),
      ...req.body
    };
    
    games.push(newGame);
    await writeJsonFile(GAMES_FILE, games);
    
    res.status(201).json(newGame);
  } catch (error) {
    next(error);
  }
});

// DELETE game record
router.delete('/:id', async (req, res, next) => {
  try {
    const games = await readJsonFile(GAMES_FILE);
    const filteredGames = games.filter(g => g.id !== req.params.id);
    
    if (filteredGames.length === games.length) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    await writeJsonFile(GAMES_FILE, filteredGames);
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE all games (for testing)
router.delete('/', async (req, res, next) => {
  try {
    await writeJsonFile(GAMES_FILE, []);
    res.json({ message: 'All games deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;