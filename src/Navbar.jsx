import React from 'react';
import { Dumbbell, BookOpen, BarChart3, Wrench } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'logger', label: 'Log', icon: Dumbbell },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'tools', label: 'Tools', icon: Wrench },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#141419]/95 backdrop-blur-md border-t border-[#23232e] z-50 max-w-md mx-auto">
      <div className="flex items-center justify-around py-2.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#ccff00]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}