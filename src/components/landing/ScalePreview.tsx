
import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ScalePreview() {
  const preview = PlaceHolderImages.find(img => img.id === 'preview-comparison');
  
  return (
    <div className="relative bg-white rounded-3xl p-5 shadow-inner overflow-hidden border-4 border-junino-beige max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-8">
        {/* Person Reference */}
        <div className="flex flex-col items-center group">
          <div className="w-14 h-32 bg-slate-200 rounded-t-full relative shadow-sm border border-slate-300">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-300 border border-slate-400" />
          </div>
          <span className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Humano (1.70m)</span>
        </div>

        {/* The Panel Reference */}
        <div className="relative w-full aspect-[3/2.5] bg-slate-50 border-2 border-dashed border-junino-red flex items-center justify-center overflow-hidden rounded-2xl shadow-xl">
           <Image
            src={preview?.imageUrl || '/painel.png'}
            alt={preview?.description || 'Comparativo de escala'}
            fill
            className="object-cover opacity-100"
          />
          
          {/* Overlay Info */}
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border-2 border-junino-red text-center">
              <span className="text-junino-red font-black text-sm block">3m x 2.5m</span>
              <span className="text-slate-600 font-bold text-[9px] uppercase tracking-widest mt-1 block">Tamanho Real</span>
            </div>
          </div>
          
          {/* Dimensions Labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white bg-black/70 px-3 py-1 rounded-full text-[9px] font-black tracking-widest">
            3 METROS
          </div>
          <div className="absolute left-2 top-1/2 -rotate-90 origin-left -translate-y-1/2 text-white bg-black/70 px-3 py-1 rounded-full text-[9px] font-black tracking-widest whitespace-nowrap">
            2.5 METROS
          </div>
        </div>
      </div>
    </div>
  );
}
