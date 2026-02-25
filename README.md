🎲 Mafia Game MVP
A complete desktop application for playing the classic social deduction game Mafia (also known as Werewolf) with friends in-person. The app serves as a digital game master that manages the entire game flow, role assignments, and tracking - eliminating the need for a human moderator.

[Nightclave-MafiaWars/](https://github.com/asifdhillon25/Nightclave-MafiaWars)

✨ Features
🎮 Complete Game Management
Player Registry - Add players with names and optional photos

Game Setup - Configure mafia count, special roles, and voting timer

Role Assignment - Automatic random role distribution

Phase Management - Night → Day → Voting phases with full control

Win Detection - Automatic win condition checking
👥 Role System
Role	Icon	Ability
Mafia	🔪	Kill one player each night
Doctor	💊	Save one player each night
Detective	🔍	Investigate one player each night
Granny	👵	Kills a mafia if targeted
Civilian	👤	Find and vote out the mafia

📊 Game Features
Voting Timer - Configurable countdown (30s, 60s, 90s, 120s)

Player Tracking - Real-time status of alive/dead players

Game History - Complete record of past games with statistics

MVP Detection - Automatically identifies winning players

💾 Data Persistence
JSON File Storage - All data saved in human-readable JSON files

Player Statistics - Track games played, wins, and win rates

Export/Import - Backup and restore game history

Local Only - No cloud, no accounts, complete privacy

🎨 User Interface
Dual Themes - Light and dark mode support

Responsive Design - Works on desktop, tablet, and mobile

Visual Feedback - Animations, badges, and progress indicators

Intuitive Controls - Clear buttons and guided workflows

🛠 Technology Stack
Frontend
React 18 - UI library

React Router 6 - Navigation

Tailwind CSS - Styling

Lucide React - Icons

Vite - Build tool

Backend
Express - Web server

Node.js - Runtime

fs-extra - File operations

UUID - ID generation

📋 Prerequisites
Node.js (v18 or higher)

npm (v9 or higher)
1. Clone the Repository
bash
git clone https://github.com/asifdhillon25/Nightclave-MafiaWars
cd mafia-game
2. Install Dependencies
bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
3. Start the Application
bash
# Start both client and server
npm run dev
This will start:

React client on http://localhost:5173

Express server on http://localhost:5000

Open your browser and navigate to http://localhost:5173 to start playing!

📖 How to Play
First-Time Setup
1. Add Players
Navigate to Player Registry

Click "Add Player"

Enter player name (optionally add a photo)

Repeat for all players in your group

2. Start a Game
Go to Game Setup

Select players from the list (minimum 4)

Choose number of mafia

Toggle special roles as desired

Set voting timer duration

Click "Start Game"

During the Game
🌙 Night Phase
Mafia chooses a victim

Doctor chooses who to save

Detective chooses who to investigate

Review actions and end night phase

☀️ Day Phase
Read the night results announcement

Detective can share findings

Players discuss

Click "Start Voting Phase"

🗳️ Voting Phase
Handler selects players to vote for

Click "Cast Vote" to record each vote

Watch the vote counter and timer

View results when complete

Confirmed player is eliminated

Game End
Winner is automatically detected

View game summary and statistics

Start a new game or browse history

📁 Project Structure
text
mafia-game/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/             # Server utilities
│   ├── data/              # JSON data files
│   └── package.json
│
├── package.json            # Root package.json
└── README.md              # This file
🔌 API Endpoints
Players
Method	Endpoint	Description
GET	/api/players	Get all players
POST	/api/players	Add new player
PATCH	/api/players/:id/stats	Update player stats
DELETE	/api/players/:id	Delete player
Games
Method	Endpoint	Description
GET	/api/games	Get game history
POST	/api/games	Save game record
DELETE	/api/games/:id	Delete game
Current Game
Method	Endpoint	Description
GET	/api/current-game	Load current game
POST	/api/current-game	Save current game
DELETE	/api/current-game	Clear current game
💾 Data Storage
All game data is stored as JSON files in the server/data/ directory:

players.json - Registered players and statistics

games.json - Complete game history

current-game.json - Active game state

🎯 Game Rules
Win Conditions
Mafia Wins: When number of mafia equals or exceeds civilians

Civilians Win: When all mafia are eliminated

Role Abilities
Mafia: Kills one player each night

Doctor: Can save one player each night (cannot save self)

Detective: Learns if a player is mafia when investigating

Granny: If targeted by mafia, kills one random mafia instead

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Inspired by the classic party game Mafia/Werewolf

Icons provided by Lucide

Built with React and Express

📧 Contact
Muhammad Asif Dhillon asifdhillon25@gmail.com

Project Link:[ https://github.com/asifdhillon25/Nightclave-MafiaWars](https://github.com/asifdhillon25/Nightclave-MafiaWars/)

🚦 Quick Commands Reference
bash
# Install all dependencies
cd client && npm install
cd ../server && npm install

# Run development servers
npm run dev

# Build for production
cd client && npm run build

# Run client only
cd client && npm run dev

# Run server only
cd server && npm run dev
⚠️ Troubleshooting
Port Already in Use
If port 5000 is already in use:

bash
# Kill the process on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
CORS Issues
Ensure the server is running on port 5000 and the client on port 5173. The CORS configuration allows requests from http://localhost:5173.

Images Not Loading
The app supports base64 encoded images. Keep images under 1MB for optimal performance.

Made with ❤️ for game nights


Git (optional)

🚀 Quick Start
