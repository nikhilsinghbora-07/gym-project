import React, { useState } from 'react';
import { Layers, Calendar, ChevronRight } from 'lucide-react';

const SPLITS = [
  {
    id: 'push',
    name: 'Push Day',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    tag: 'Chest / Delts / Arms'
  },
  {
    id: 'pull',
    name: 'Pull Day',
    muscles: ['Back', 'Biceps', 'Core'],
    tag: 'Lats / Biceps / Abs'
  },
  {
    id: 'legs',
    name: 'Leg Day',
    muscles: ['Legs', 'Core'],
    tag: 'Quads / Hamstrings / Calves'
  },
  {
    id: 'upper',
    name: 'Upper Body',
    muscles: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
    tag: 'Full Upper Body'
  },
  {
    id: 'full',
    name: 'All Movements',
    muscles: ['All'],
    tag: 'Show Everything'
  }
];

export default function WorkoutSplits({ activeSplit, onSelectSplit }) {
  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Today's Routine Split</h2>
        </div>
        <span className="text-[10px] font-mono text-[#ccff00] font-bold uppercase">
          {SPLITS.find(s => s.id === activeSplit)?.name || 'Push Day'}
        </span>
      </div>

      {/* Split Selector Cards */}
      <div className="grid grid-cols-2 gap-2">
        {SPLITS.map((split) => {
          const isActive = activeSplit === split.id;
          return (
            <button
              key={split.id}
              onClick={() => onSelectSplit(split.id, split.muscles)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden active:scale-98 ${
                isActive
                  ? 'bg-[#ccff00]/10 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                  : 'bg-[#0a0a0c] border-[#23232e] hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isActive ? 'text-[#ccff00]' : 'text-white'}`}>
                  {split.name}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#ccff00]' : 'text-gray-600'}`} />
              </div>
              <span className="text-[9px] font-mono text-gray-400 block truncate">
                {split.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}