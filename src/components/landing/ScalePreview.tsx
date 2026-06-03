import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ScalePreview() {
  const preview = PlaceHolderImages.find(img => img.id === 'preview-comparison');
  
  return (
    <div className="relative bg-white rounded-2xl p-4 shadow-inner overflow-hidden border-4 border-junino-beige max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-6">
        {/* Person Reference - Scaled for Mobile */}
        <div className="flex flex-col items-center group">
          <div className="w-16 h-32 bg-slate-200 rounded-t-full relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-300" />
          </div>
          <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Referência Adulto (1.65m)</span>
        </div>

        {/* The Panel Reference */}
        <div className="relative w-full aspect-[3/2.5] bg-junino-red/5 border-2 border-dashed border-junino-red flex items-center justify-center overflow-hidden rounded-xl shadow-lg">
           <Image
            src={preview?.imageUrl || ''}
            alt={preview?.description || 'Comparativo de escala'}
            fill
            className="object-cover opacity-90"
            data-ai-hint={preview?.imageHint}
          />
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2">
            <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-junino-red text-center">
              <span className="text-junino-red font-black text-xs">3m x 2.5m de pura alegria!</span>
            </div>
          </div>
          
          {/* Dimensions info - Mobile friendly sizes */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white bg-black/60 px-2 py-0.5 rounded text-[8px] font-bold">
            LARGURA: 3 METROS
          </div>
          <div className="absolute left-1 top-1/2 -rotate-90 origin-left -translate-y-1/2 text-white bg-black/60 px-2 py-0.5 rounded text-[8px] font-bold whitespace-nowrap">
            ALTURA: 2.5 METROS
          </div>
        </div>
      </div>
    </div>
  );
}
