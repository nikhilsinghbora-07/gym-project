import React, { useState } from 'react';
import { Disc, Check } from 'lucide-react';

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState(62.5);
  const [barWeight, setBarWeight] = useState(20);
  const [availablePlates, setAvailablePlates] = useState([20, 15, 10, 5, 2.5, 1.25]);

  // Calculate plates per side
  const calculatePlates = () => {
    let weightPerSide = (targetWeight - barWeight) / 2;
    if (weightPerSide <= 0) return [];

    const result = [];
    const sortedPlates = [...availablePlates].sort((a, b) => b - a);

    for (let plate of sortedPlates) {
      while (weightPerSide >= plate) {
        result.push(plate);
        weightPerSide -= plate;
      }
    }
    return result;
  };

  const platesPerSide = calculatePlates();
  const remainder = (targetWeight - barWeight) / 2 - platesPerSide.reduce((a, b) => a + b, 0);

  // Color mapping for aesthetic plate visuals
  const getPlateColor = (weight) => {
    switch (weight) {
      case 20: return 'bg-red-500 text-white border-red-400 h-24';
      case 15: return 'bg-blue-500 text-white border-blue-400 h-20';
      case 10: return 'bg-green-500 text-white border-green-400 h-16';
      case 5: return 'bg-white text-black border-gray-300 h-12';
      case 2.5: return 'bg-black text-white border-gray-600 h-10';
      case 1.25: return 'bg-gray-500 text-white border-gray-400 h-8';
      default: return 'bg-neon-lime text-black h-12';
    }
  };

  return (
    <div className="bg-[#141419] p-5 rounded-3xl border border-[#23232e] mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#ccff00]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">Barbell Plate Calculator</h2>
        </div>
        <span className="text-[10px] font-mono text-gray-400">Bar: {barWeight}kg</span>
      </div>

      {/* Target Weight Input */}
      <div className="mb-5">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
          Target Total Weight (kg)
        </span>
        <div className="flex items-center bg-[#0a0a0c] border border-[#23232e] rounded-2xl p-1">
          <button 
            onClick={() => setTargetWeight(prev => Math.max(barWeight, +(prev - 2.5).toFixed(1)))}
            className="w-10 h-10 rounded-xl bg-[#141419] text-white font-bold hover:bg-[#23232e]"
          >
            -
          </button>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(parseFloat(e.target.value) || barWeight)}
            className="w-full text-center bg-transparent font-mono font-bold text-xl text-[#ccff00] focus:outline-none"
          />
          <button 
            onClick={() => setTargetWeight(prev => +(prev + 2.5).toFixed(1))}
            className="w-10 h-10 rounded-xl bg-[#141419] text-white font-bold hover:bg-[#23232e]"
          >
            +
          </button>
        </div>
      </div>

      {/* Visual Barbell Display */}
      <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-[#23232e] mb-4 overflow-x-auto">
        <span className="block text-[10px] font-mono text-gray-500 text-center mb-3">LOAD EACH SIDE WITH:</span>
        
        {platesPerSide.length > 0 ? (
          <div className="flex items-center justify-center gap-1.5 min-h-[100px]">
            {/* Bar Sleeve */}
            <div className="w-6 h-3 bg-gray-600 rounded-l-sm shrink-0" />
            
            {/* Collar */}
            <div className="w-3 h-14 bg-gray-400 rounded-sm shrink-0" />

            {/* Plates */}
            {platesPerSide.map((plate, index) => (
              <div
                key={index}
                className={`w-7 rounded-lg border flex items-center justify-center font-mono font-black text-[10px] shadow-lg transition-all ${getPlateColor(plate)}`}
              >
                {plate}
              </div>
            ))}

            {/* Bar Extension */}
            <div className="w-12 h-2 bg-gray-500 rounded-r-sm shrink-0" />
          </div>
        ) : (
          <div className="text-center py-4 text-xs font-mono text-gray-500">
            {targetWeight === barWeight ? 'Just the empty bar!' : 'Weight is below bar weight.'}
          </div>
        )}
      </div>

      {/* Remainder Warning */}
      {remainder > 0 && (
        <div className="text-[11px] font-mono text-yellow-400 bg-yellow-400/10 p-2.5 rounded-xl border border-yellow-400/20 text-center">
          ⚠️ Cannot make exact weight with current plates. Unmatched: {remainder * 2}kg total.
        </div>
      )}
    </div>
  );
}