// server/routes/current-game.js
import express from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileHelpers.js';

const router = express.Router();
const CURRENT_GAME_FILE = 'current-game.json';

// GET current game
router.get('/', async (req, res, next) => {
  try {
    const currentGame = await readJsonFile(CURRENT_GAME_FILE);
    res.json(currentGame);
  } catch (error) {
    next(error);
  }
});

// POST save current game
router.post('/', async (req, res, next) => {
  try {
    await writeJsonFile(CURRENT_GAME_FILE, req.body);
    res.json({ message: 'Game state saved successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE clear current game
router.delete('/', async (req, res, next) => {
  try {
    await writeJsonFile(CURRENT_GAME_FILE, null);
    res.json({ message: 'Current game cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;