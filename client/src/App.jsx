// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { PlayerRegistryPage } from './pages/PlayerRegistryPage';
import { GameSetupPage } from './pages/GameSetupPage';
import { GamePage } from './pages/GamePage';
import { HistoryPage } from './pages/HistoryPage';
import { ToastProvider } from './components/UI/Toast';

function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="container-custom py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/players" element={<PlayerRegistryPage />} />
              <Route path="/setup" element={<GameSetupPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;