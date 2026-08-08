import React, { useState } from 'react';
import { Target, Zap } from 'lucide-react';

export default function OneRepMax() {
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(5);

  // Epley Formula: 1RM = Weight * (1 + Reps / 30)
  const epleyOneRepMax = Math.round(weight * (1 + reps / 30));

  // Percentage table for programming
  const percentages = [
    { pct: 95, label: '1-2 Reps (Max Strength)', weight: Math.round(epleyOneRepMax * 0.95) },
    { pct: 90, label: '3-4 Reps (Heavy Strength)', weight: Math.round(epleyOneRepMax * 0.90) },
    { pct: 85, label: '5-6 Reps (Strength)', weight: Math.round(epleyOneRepMax * 0.85) },
    { pct: 80, label: '7-8 Reps (Hypertrophy)', weight: Math.round(epleyOneRepMax * 0.80) },
    { pct: 75, label: '9-10 Reps (Hypertrophy)', weight: Math.round(epleyOneRepMax * 0.75) },
    { pct: 70, label: '11-12 Reps (Endurance)', weight: Math.round(epleyOneRepMax * 0.70) },
  ];

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">1RM Calculator</h2>
        </div>
        <span className="text-[10px] font-mono text-[#00f0ff] font-bold">EPLEY FORMULA</span>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Weight Lifted (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-xl p-2.5 font-mono text-sm font-bold text-white focus:outline-none focus:border-[#ccff00]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Reps Completed</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value) || 1)}
            className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-xl p-2.5 font-mono text-sm font-bold text-white focus:outline-none focus:border-[#ccff00]"
          />
        </div>
      </div>

      {/* Result Display */}
      <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-[#23232e] mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Estimated 1RM</span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono font-black text-3xl text-[#ccff00]">{epleyOneRepMax}</span>
            <span className="text-xs font-mono text-gray-400">kg</span>
          </div>
        </div>
        <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 p-2 rounded-xl flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#ccff00]" />
          <span className="text-[10px] font-bold text-[#ccff00] uppercase font-mono">Theoretical Max</span>
        </div>
      </div>

      {/* Target Percentages Breakdown */}
      <div className="space-y-1.5">
        <span className="block text-[10px] font-mono text-gray-400 uppercase mb-2">Training Target Zones</span>
        {percentages.map((p) => (
          <div key={p.pct} className="bg-[#0a0a0c] border border-[#23232e] p-2.5 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#00f0ff] w-8">{p.pct}%</span>
              <span className="text-gray-300 font-medium">{p.label}</span>
            </div>
            <span className="font-mono font-bold text-white">{p.weight} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}