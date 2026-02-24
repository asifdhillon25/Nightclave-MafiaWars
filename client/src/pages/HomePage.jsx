// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings, Play, History, Moon, Sun, Sword, Shield, Heart, Eye } from 'lucide-react';

export const HomePage = () => {
  const features = [
    {
      icon: Users,
      title: 'Player Registry',
      description: 'Save your players with photos for quick selection every game',
      color: 'text-blue-500',
      link: '/players'
    },
    {
      icon: Settings,
      title: 'Game Setup',
      description: 'Configure mafia count, special roles, and voting timer',
      color: 'text-purple-500',
      link: '/setup'
    },
    {
      icon: Play,
      title: 'Live Game',
      description: 'Track night/day phases, voting, and game progression',
      color: 'text-green-500',
      link: '/game'
    },
    {
      icon: History,
      title: 'Game History',
      description: 'Review past games, winners, and player statistics',
      color: 'text-orange-500',
      link: '/history'
    }
  ];

  const roles = [
    { icon: Sword, name: 'Mafia', description: 'Kill one player each night', color: 'text-mafia' },
    { icon: Shield, name: 'Doctor', description: 'Save one player each night', color: 'text-doctor' },
    { icon: Eye, name: 'Detective', description: 'Investigate players at night', color: 'text-detective' },
    { icon: Heart, name: 'Granny', description: 'Takes a mafia down if targeted', color: 'text-granny' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Mafia Game MVP
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          The perfect companion for your in-person Mafia parties. 
          No phones needed for players—just one handler screen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/setup" className="btn-primary px-8 py-3 text-lg">
            Start New Game
          </Link>
          <Link to="/players" className="btn-outline px-8 py-3 text-lg">
            Manage Players
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="card-base p-6 text-center">
          <div className="text-3xl font-bold text-primary">4+</div>
          <div className="text-sm text-muted-foreground">Min Players</div>
        </div>
        <div className="card-base p-6 text-center">
          <div className="text-3xl font-bold text-primary">5</div>
          <div className="text-sm text-muted-foreground">Roles</div>
        </div>
        <div className="card-base p-6 text-center">
          <div className="text-3xl font-bold text-primary">2</div>
          <div className="text-sm text-muted-foreground">Phases</div>
        </div>
        <div className="card-base p-6 text-center">
          <div className="text-3xl font-bold text-primary">∞</div>
          <div className="text-sm text-muted-foreground">Game Nights</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="group">
              <div className="card-base p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-12 bg-secondary/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-4">Classic Roles</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Toggle special roles on/off based on your group size and preference
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <div key={index} className="card-base p-6 text-center">
              <div className={`inline-block p-3 rounded-full bg-secondary mb-4`}>
                <role.icon className={`w-8 h-8 ${role.color}`} />
              </div>
              <h3 className="font-semibold mb-2">{role.name}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Simple 3-Step Process</h2>
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 max-w-4xl mx-auto">
          <div className="flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Players</h3>
            <p className="text-muted-foreground">
              Register your players once. They'll be saved for future games.
            </p>
          </div>
          <div className="flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Configure Game</h3>
            <p className="text-muted-foreground">
              Select players, set mafia count, and choose special roles.
            </p>
          </div>
          <div className="flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Play & Track</h3>
            <p className="text-muted-foreground">
              Run the game with night/day phases, voting, and win detection.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Set up your first game in seconds. No accounts, no cloud, just pure Mafia fun.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/setup" className="btn-primary px-8 py-3">
            Start New Game
          </Link>
          <Link to="/players" className="btn-outline px-8 py-3">
            Add Players First
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="text-center text-sm text-muted-foreground py-8">
        <p>🎮 Made for in-person game nights • One handler screen only • No player phones needed</p>
      </footer>
    </div>
  );
};