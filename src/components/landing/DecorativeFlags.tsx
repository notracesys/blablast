import React from 'react';

export function DecorativeFlags() {
  const colors = ['bg-junino-red', 'bg-junino-yellow', 'bg-junino-blue', 'bg-junino-orange'];
  
  return (
    <div className="flex justify-center gap-1 py-4 overflow-hidden w-full">
      {Array.from({ length: 40 }).map((_, i) => (
        <div 
          key={i} 
          className={`w-6 h-8 flag-clip ${colors[i % colors.length]} transform -rotate-2 hover:rotate-3 transition-transform duration-300`}
        />
      ))}
    </div>
  );
}