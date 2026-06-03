import React from 'react';

export function DecorativeFlags() {
  const colors = ['bg-junino-red', 'bg-junino-yellow', 'bg-junino-blue', 'bg-junino-orange'];
  
  return (
    <div className="relative w-full h-12 overflow-hidden bg-transparent">
      {/* Linha do varal */}
      <div className="absolute top-2 inset-x-0 h-[2px] bg-slate-300/30 -rotate-1" />
      
      <div className="flex justify-center gap-1 px-2 pt-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className={`
              w-5 h-7 flag-clip shrink-0
              ${colors[i % colors.length]} 
              transition-transform duration-500
              ${i % 2 === 0 ? 'rotate-3 -translate-y-1' : '-rotate-3 translate-y-0.5'}
              hover:scale-110 shadow-sm
            `}
          />
        ))}
      </div>
    </div>
  );
}
