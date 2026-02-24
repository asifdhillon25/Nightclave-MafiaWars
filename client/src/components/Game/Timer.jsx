// src/components/Game/Timer.jsx
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const Timer = ({ seconds, isActive, onTimeout, size = 'md' }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onTimeout?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const sizeClasses = {
    sm: 'text-xl w-8 h-8',
    md: 'text-2xl w-10 h-10',
    lg: 'text-4xl w-16 h-16'
  };

  const isUrgent = timeLeft <= 10;

  return (
    <div className="flex items-center gap-2">
      <Clock className={`${sizeClasses[size]} ${isUrgent ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
      <span className={`font-mono font-bold ${sizeClasses[size]} ${isUrgent ? 'timer-urgent' : ''}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};
