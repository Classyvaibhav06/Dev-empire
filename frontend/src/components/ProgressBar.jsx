import React from 'react';

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-textDim">Path Progress</span>
        <span className="text-xl font-black tracking-tighter text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-surfaceHover rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out rounded-full glow-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
