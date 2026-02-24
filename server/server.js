// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import playerRoutes from './routes/players.js';
import gameRoutes from './routes/games.js';
import currentGameRoutes from './routes/current-game.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' })); // For image data
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/current-game', currentGameRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Create data directory if it doesn't exist
import fs from 'fs-extra';
const dataDir = join(__dirname, 'data');
fs.ensureDirSync(dataDir);

// Initialize JSON files if they don't exist
const initJsonFiles = async () => {
  const files = ['players.json', 'games.json', 'current-game.json'];
  
  for (const file of files) {
    const filePath = join(dataDir, file);
    const exists = await fs.pathExists(filePath);
    
    if (!exists) {
      const initialData = file === 'current-game.json' ? null : [];
      await fs.writeJson(filePath, initialData, { spaces: 2 });
      console.log(`Created ${file}`);
    }
  }
};

await initJsonFiles();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${dataDir}`);
});