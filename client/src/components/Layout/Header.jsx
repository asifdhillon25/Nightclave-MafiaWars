// src/components/Layout/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Users, Home, Settings, History, Play } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/players', icon: Users, label: 'Players' },
    { path: '/setup', icon: Settings, label: 'Setup' },
    { path: '/game', icon: Play, label: 'Game' },
    { path: '/history', icon: History, label: 'History' }
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Mafia MVP
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${location.pathname === path
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                  }`}
              >
                <span className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md hover:bg-accent">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};