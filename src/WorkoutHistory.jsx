import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { History, Download, Trash2, Calendar } from 'lucide-react';

export default function WorkoutHistory() {
  const logs = useLiveQuery(() => db.workoutLogs.reverse().toArray());
  const [filterDate, setFilterDate] = useState('');

  if (!logs) return null;

  const deleteLog = async (id) => {
    await db.workoutLogs.delete(id);
  };

  const clearAllHistory = async () => {
    if (window.confirm('Are you sure you want to delete all workout history?')) {
      await db.workoutLogs.clear();
    }
  };

  // Export logs to CSV file
  const exportCSV = () => {
    if (logs.length === 0) return alert('No workout data to export!');

    const headers = ['ID', 'Date', 'Exercise', 'Set Number', 'Weight (kg)', 'Reps'];
    const rows = logs.map(l => [
      l.id,
      new Date(l.date).toLocaleString(),
      `"${l.exerciseName}"`,
      l.setNumber,
      l.weight,
      l.reps
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workout_history_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = filterDate 
    ? logs.filter(l => l.date.startsWith(filterDate))
    : logs;

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Full Session History</h2>
        </div>
        <button
          onClick={exportCSV}
          className="text-[10px] font-bold font-mono text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/30 px-2.5 py-1 rounded-xl hover:bg-[#ccff00]/20 flex items-center gap-1 active:scale-95 transition-all"
        >
          <Download className="w-3 h-3" />
          Export CSV
        </button>
      </div>

      {/* Date Filter & Clear Option */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Calendar className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-[#23232e] rounded-xl py-1.5 pl-8 pr-2 text-xs font-mono text-white focus:outline-none focus:border-[#ccff00]"
          />
        </div>
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="text-[10px] font-mono text-gray-400 hover:text-white px-2 py-1 bg-[#0a0a0c] border border-[#23232e] rounded-xl"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Logged Rows */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[#0a0a0c] border border-[#23232e] p-3 rounded-2xl flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-xs text-white block">{log.exerciseName}</span>
                <span className="text-[9px] font-mono text-gray-500">
                  Set {log.setNumber} • {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#ccff00]">
                  {log.weight}kg × {log.reps}
                </span>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="text-gray-600 hover:text-red-400 p-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs font-mono text-gray-500">
            No session logs found.
          </div>
        )}
      </div>

      {logs.length > 0 && (
        <button
          onClick={clearAllHistory}
          className="w-full mt-4 text-[10px] font-mono text-red-400/80 hover:text-red-400 text-center block transition-all"
        >
          Clear Entire History Database
        </button>
      )}
    </div>
  );
}