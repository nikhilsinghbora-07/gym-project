import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export default function RestTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(90); // Default 90 seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Trigger haptic vibration on mobile devices if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = (seconds) => {
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setIsActive(true);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(initialTime);
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Rest Timer</h2>
        </div>
        {timeLeft > 0 && (
          <span className="text-[10px] font-mono text-[#ccff00] animate-pulse">
            RESTING...
          </span>
        )}
      </div>

      {/* Preset Time Selector Chips */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[30, 60, 90, 120].map((sec) => (
          <button
            key={sec}
            onClick={() => startTimer(sec)}
            className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
              initialTime === sec && timeLeft > 0
                ? 'bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'bg-[#0a0a0c] text-gray-400 hover:text-white border border-[#23232e]'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>

      {/* Countdown Timer Display */}
      <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-[#23232e] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Time Remaining</span>
          <span className="font-mono font-black text-3xl text-white tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className="w-11 h-11 rounded-2xl bg-[#ccff00] text-black font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            {isActive ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
          </button>

          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-2xl bg-[#141419] border border-[#23232e] text-gray-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {timeLeft > 0 && (
        <div className="w-full bg-[#0a0a0c] h-1.5 rounded-full mt-3 overflow-hidden border border-[#23232e]">
          <div
            className="bg-[#ccff00] h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}