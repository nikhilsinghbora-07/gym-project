import React, { useState } from 'react';
import { db } from './db';
import { Plus, Dumbbell } from 'lucide-react';

export default function AddExercise() {
  const [name, setName] = useState('');
  const [targetMuscle, setTargetMuscle] = useState('Chest');
  const [category, setCategory] = useState('Dumbbell');
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await db.exercises.add({
      name: name.trim(),
      targetMuscle,
      category
    });

    setName('');
    setIsOpen(false);
  };

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Custom Exercises</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-[#ccff00] bg-[#ccff00]/10 hover:bg-[#ccff00]/20 px-3 py-1.5 rounded-xl border border-[#ccff00]/30 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          {isOpen ? 'Close' : 'Add New'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-[#23232e] space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Exercise Name</label>
            <input
              type="text"
              placeholder="e.g. Cable Flyes, Leg Press..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-xl p-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Target Muscle</label>
              <select
                value={targetMuscle}
                onChange={(e) => setTargetMuscle(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none"
              >
                {['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Cardio'].map((muscle) => (
                  <option key={muscle} value={muscle}>{muscle}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Equipment</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none"
              >
                {['Dumbbell', 'Barbell', 'Machine', 'Cable', 'Bodyweight'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#ccff00] text-black font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all hover:opacity-90"
          >
            Save Exercise
          </button>
        </form>
      )}
    </div>
  );
}