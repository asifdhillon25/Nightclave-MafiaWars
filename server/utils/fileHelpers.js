// server/utils/fileHelpers.js
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'data');

export const readJsonFile = async (filename) => {
  try {
    const filePath = join(DATA_DIR, filename);
    const exists = await fs.pathExists(filePath);
    
    if (!exists) {
      return filename === 'current-game.json' ? null : [];
    }
    
    return await fs.readJson(filePath);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
};

export const writeJsonFile = async (filename, data) => {
  try {
    const filePath = join(DATA_DIR, filename);
    await fs.writeJson(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

// Helper for consistent ID generation
export const generateId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Helper for validating player data
export const validatePlayer = (player) => {
  if (!player.name || typeof player.name !== 'string') {
    throw new Error('Player name is required and must be a string');
  }
  if (player.name.trim().length < 1) {
    throw new Error('Player name cannot be empty');
  }
  return true;
};