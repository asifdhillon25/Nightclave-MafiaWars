# 🎲 Mafia Game MVP

<p align="center">
  <img src="https://github.com/asifdhillon25/Nightclave-MafiaWars/blob/main/client/src/assets/1.png" width="100%" />
</p>

<p align="center">
  Interactive desktop application that digitizes the classic Mafia/Werewolf social deduction game with automated game flow, role management, and intelligent tracking systems.
</p>

---

# 🚀 Overview

Mafia Game MVP is a full-stack desktop application designed to act as a digital game master for the classic social deduction game Mafia (Werewolf).

The system automates role assignments, game phase management, voting workflows, player tracking, and win condition detection — eliminating the need for a human moderator during gameplay.

Built with a modern responsive interface and persistent local storage, the application provides a complete offline-first multiplayer experience for game nights and social gatherings.

---

# ✨ Key Features

## 🎮 Complete Game Management

* Automated game flow management
* Dynamic role assignment system
* Night → Day → Voting phase transitions
* Automatic win condition detection
* Configurable voting timers

## 👥 Intelligent Role System

* 🔪 Mafia
* 💊 Doctor
* 🔍 Detective
* 👵 Granny
* 👤 Civilian

Each role contains unique gameplay mechanics and interactive workflows.

## 📊 Player & Match Tracking

* Real-time alive/dead player tracking
* Game history and statistics
* MVP detection and winner analytics
* Persistent player profiles

## 💾 Local Data Persistence

* JSON-based local storage system
* Export and backup support
* Game recovery workflows
* Offline-first architecture

## 🎨 Modern UI/UX

* Dark & light mode support
* Responsive multi-device interface
* Interactive animations and feedback
* Clean and intuitive game controls

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Tailwind CSS
* Vite
* Lucide React

## Backend

* Node.js
* Express.js
* fs-extra
* UUID

## Storage

* JSON File Storage

---

# 🧠 System Architecture

```text
Player Registry
       ↓
Game Setup Engine
       ↓
Role Assignment System
       ↓
Phase Management
       ↓
Voting & Elimination
       ↓
Win Detection & Analytics
```

---

# ⚡ Core Functionalities

* ✅ Automated role distribution
* ✅ Voting timer system
* ✅ Phase transition workflows
* ✅ Persistent player statistics
* ✅ Game history tracking
* ✅ Offline-first local gameplay
* ✅ Export & backup support

---

# 📁 Project Structure

```text
mafia-game/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
│
├── server/
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   └── utils/
│
└── README.md
```

---

# ⚙️ Installation

```bash
# Clone repository
git clone https://github.com/asifdhillon25/Nightclave-MafiaWars

# Navigate into project
cd Nightclave-MafiaWars

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root
cd ..

# Run development servers
npm run dev
```

---

# 🌐 Development Servers

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

# 📊 API Endpoints

## Players

* GET `/api/players`
* POST `/api/players`
* PATCH `/api/players/:id/stats`
* DELETE `/api/players/:id`

## Games

* GET `/api/games`
* POST `/api/games`
* DELETE `/api/games/:id`

## Current Game

* GET `/api/current-game`
* POST `/api/current-game`
* DELETE `/api/current-game`

---

# 🎯 Gameplay Features

## 🌙 Night Phase

* Mafia selects target
* Doctor selects protection
* Detective investigates players

## ☀️ Day Phase

* Night results announcement
* Group discussion workflows
* Voting preparation

## 🗳️ Voting Phase

* Real-time vote tracking
* Timer-based elimination system
* Automatic result calculation

---

# 🔥 Highlights

* Built a complete digital game master system for Mafia/Werewolf gameplay
* Engineered automated game-state management workflows
* Designed scalable local persistence architecture using JSON storage
* Created responsive multi-device UI with modern dark/light themes
* Implemented intelligent gameplay tracking and statistics systems

---

# 🌍 Future Improvements

* Multiplayer online support
* WebSocket real-time synchronization
* Voice chat integration
* AI-powered moderator assistant
* Mobile application support
* Tournament mode system

---

# 👨‍💻 Author

## Muhammad Asif Dhillon

Full-Stack AI Developer focused on Computer Vision, Intelligent Systems, and scalable software engineering.

* 🌐 Portfolio: https://my-portfolio25-web25.vercel.app/
* 💼 LinkedIn: https://www.linkedin.com/in/muhammad-asif-484860372/
* 🐙 GitHub: https://github.com/asifdhillon25

---

<h3 align="center">
✨ Built for Game Nights & Intelligent Interactive Experiences ✨
</h3>
