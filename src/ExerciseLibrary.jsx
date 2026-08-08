import React, { useState } from 'react';
import { db } from './db';
import { BookOpen, Search, Check, Dumbbell } from 'lucide-react';

const COMPREHENSIVE_EXERCISES = [
  // Chest
  { name: 'Barbell Bench Press', targetMuscle: 'Chest', category: 'Barbell' },
  { name: 'Incline Dumbbell Press', targetMuscle: 'Chest', category: 'Dumbbell' },
  { name: 'Flat Dumbbell Flyes', targetMuscle: 'Chest', category: 'Dumbbell' },
  { name: 'Cable Crossover', targetMuscle: 'Chest', category: 'Cable' },
  { name: 'Chest Dip', targetMuscle: 'Chest', category: 'Bodyweight' },
  { name: 'Pec Deck Fly', targetMuscle: 'Chest', category: 'Machine' },

  // Back
  { name: 'Deadlift', targetMuscle: 'Back', category: 'Barbell' },
  { name: 'Lat Pulldown', targetMuscle: 'Back', category: 'Cable' },
  { name: 'Bent-Over Barbell Row', targetMuscle: 'Back', category: 'Barbell' },
  { name: 'Seated Cable Row', targetMuscle: 'Back', category: 'Cable' },
  { name: 'Single-Arm Dumbbell Row', targetMuscle: 'Back', category: 'Dumbbell' },
  { name: 'Pull-Ups', targetMuscle: 'Back', category: 'Bodyweight' },
  { name: 'T-Bar Row', targetMuscle: 'Back', category: 'Barbell' },

  // Legs
  { name: 'Barbell Back Squat', targetMuscle: 'Legs', category: 'Barbell' },
  { name: 'Leg Press', targetMuscle: 'Legs', category: 'Machine' },
  { name: 'Romanian Deadlift', targetMuscle: 'Legs', category: 'Barbell' },
  { name: 'Leg Extension', targetMuscle: 'Legs', category: 'Machine' },
  { name: 'Seated Leg Curl', targetMuscle: 'Legs', category: 'Machine' },
  { name: 'Bulgarian Split Squat', targetMuscle: 'Legs', category: 'Dumbbell' },
  { name: 'Standing Calf Raise', targetMuscle: 'Legs', category: 'Machine' },

  // Shoulders
  { name: 'Overhead Barbell Press', targetMuscle: 'Shoulders', category: 'Barbell' },
  { name: 'Seated Dumbbell Shoulder Press', targetMuscle: 'Shoulders', category: 'Dumbbell' },
  { name: 'Dumbbell Lateral Raise', targetMuscle: 'Shoulders', category: 'Dumbbell' },
  { name: 'Cable Lateral Raise', targetMuscle: 'Shoulders', category: 'Cable' },
  { name: 'Face Pulls', targetMuscle: 'Shoulders', category: 'Cable' },
  { name: 'Reverse Pec Deck Fly', targetMuscle: 'Shoulders', category: 'Machine' },

  // Biceps
  { name: 'Barbell Curl', targetMuscle: 'Biceps', category: 'Barbell' },
  { name: 'Incline Dumbbell Curl', targetMuscle: 'Biceps', category: 'Dumbbell' },
  { name: 'Dumbbell Hammer Curl', targetMuscle: 'Biceps', category: 'Dumbbell' },
  { name: 'Preacher Curl', targetMuscle: 'Biceps', category: 'Barbell' },
  { name: 'Cable Rope Curl', targetMuscle: 'Biceps', category: 'Cable' },

  // Triceps
  { name: 'Tricep Cable Pushdown', targetMuscle: 'Triceps', category: 'Cable' },
  { name: 'Skull Crushers (EZ Bar)', targetMuscle: 'Triceps', category: 'Barbell' },
  { name: 'Overhead Dumbbell Extension', targetMuscle: 'Triceps', category: 'Dumbbell' },
  { name: 'Close-Grip Bench Press', targetMuscle: 'Triceps', category: 'Barbell' },
  { name: 'Tricep Dips', targetMuscle: 'Triceps', category: 'Bodyweight' },

  // Core & Abs
  { name: 'Hanging Leg Raise', targetMuscle: 'Core', category: 'Bodyweight' },
  { name: 'Cable Ab Crunch', targetMuscle: 'Core', category: 'Cable' },
  { name: 'Ab Wheel Rollout', targetMuscle: 'Core', category: 'Bodyweight' },
  { name: 'Plank Hold', targetMuscle: 'Core', category: 'Bodyweight' }
];

export default function ExerciseLibrary({ onSelectExercise }) {
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const muscles = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core'];

  // Seed full library into local database
  const seedFullLibrary = async () => {
    setIsSeeding(true);
    for (const ex of COMPREHENSIVE_EXERCISES) {
      const existing = await db.exercises.where('name').equalsIgnoreCase(ex.name).first();
      if (!existing) {
        await db.exercises.add(ex);
      }
    }
    setIsSeeding(false);
  };

  const filteredExercises = COMPREHENSIVE_EXERCISES.filter((ex) => {
    const matchesMuscle = selectedMuscle === 'All' || ex.targetMuscle === selectedMuscle;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesSearch;
  });

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Full Movement Library</h2>
        </div>
        <button
          onClick={seedFullLibrary}
          disabled={isSeeding}
          className="text-[10px] font-bold font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2.5 py-1 rounded-xl hover:bg-[#00f0ff]/20 active:scale-95 transition-all"
        >
          {isSeeding ? 'Syncing...' : 'Load All 40+ to Database'}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search any exercise or muscle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-2xl py-2.5 pl-9 pr-3 text-xs font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00]"
        />
      </div>

      {/* Muscle Group Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
        {muscles.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMuscle(m)}
            className={`py-1.5 px-3 rounded-xl font-mono text-[11px] font-bold shrink-0 transition-all ${
              selectedMuscle === m
                ? 'bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.25)]'
                : 'bg-[#0a0a0c] text-gray-400 border border-[#23232e] hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
        {filteredExercises.map((ex, idx) => (
          <div
            key={idx}
            onClick={() => onSelectExercise(ex.name)}
            className="bg-[#0a0a0c] border border-[#23232e] hover:border-[#ccff00]/50 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-98"
          >
            <div>
              <span className="font-bold text-xs text-white block">{ex.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-mono font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-md">
                  {ex.targetMuscle}
                </span>
                <span className="text-[9px] font-mono text-gray-400">{ex.category}</span>
              </div>
            </div>
            <div className="text-[10px] font-bold font-mono text-[#00f0ff] flex items-center gap-1">
              Select
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}