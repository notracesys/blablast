"use client";

import { useEffect, useState } from 'react';

export function UrgencyTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 items-center justify-center font-bold text-xl md:text-3xl text-white">
      <div className="flex flex-col items-center">
        <span className="bg-white/20 px-3 py-2 rounded-lg">{format(timeLeft.hours)}</span>
        <span className="text-xs mt-1 uppercase opacity-80">Horas</span>
      </div>
      <span className="mb-6">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-white/20 px-3 py-2 rounded-lg">{format(timeLeft.minutes)}</span>
        <span className="text-xs mt-1 uppercase opacity-80">Mins</span>
      </div>
      <span className="mb-6">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-white/20 px-3 py-2 rounded-lg">{format(timeLeft.seconds)}</span>
        <span className="text-xs mt-1 uppercase opacity-80">Segs</span>
      </div>
    </div>
  );
}