import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Trophy, BarChart3, Dumbbell, Activity } from 'lucide-react';

export default function Analytics() {
  const logs = useLiveQuery(() => db.workoutLogs.toArray());

  if (!logs) return null;

  // Calculate total lifetime volume lifted
  const totalVolume = logs.reduce((sum, log) => sum + (log.weight * log.reps), 0);

  // Calculate personal records per exercise
  const prMap = logs.reduce((acc, log) => {
    if (!acc[log.exerciseName] || log.weight > acc[log.exerciseName].weight) {
      acc[log.exerciseName] = { weight: log.weight, reps: log.reps };
    }
    return acc;
  }, {});

  const prList = Object.entries(prMap);

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Performance Analytics</h2>
        </div>
        <span className="text-[10px] font-mono text-gray-400">{logs.length} Sets Completed</span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#0a0a0c] p-3.5 rounded-2xl border border-[#23232e]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
            <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
            Total Volume
          </div>
          <span className="font-mono font-black text-xl text-white">
            {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume} <span className="text-xs text-[#00f0ff] font-normal">kg</span>
          </span>
        </div>

        <div className="bg-[#0a0a0c] p-3.5 rounded-2xl border border-[#23232e]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
            <Trophy className="w-3.5 h-3.5 text-[#ccff00]" />
            Top PRs
          </div>
          <span className="font-mono font-black text-xl text-[#ccff00]">
            {prList.length} <span className="text-xs text-gray-400 font-normal">Tracked</span>
          </span>
        </div>
      </div>

      {/* Lifetime PR Highlights */}
      <div className="bg-[#0a0a0c] p-3.5 rounded-2xl border border-[#23232e]">
        <span className="block text-[10px] font-mono text-gray-400 uppercase mb-2.5">
          Personal Records (Best Weight)
        </span>

        {prList.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {prList.map(([exName, pr]) => (
              <div key={exName} className="flex items-center justify-between text-xs py-1 border-b border-[#23232e] last:border-0">
                <span className="font-bold text-gray-300 truncate max-w-[180px]">{exName}</span>
                <span className="font-mono font-bold text-[#ccff00]">
                  {pr.weight} kg × {pr.reps}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-xs font-mono text-gray-500">
            Log your first set to calculate PRs!
          </div>
        )}
      </div>
    </div>
  );
}