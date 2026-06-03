import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ScalePreview() {
  const preview = PlaceHolderImages.find(img => img.id === 'preview-comparison');
  
  return (
    <div className="relative bg-white rounded-3xl p-8 shadow-inner overflow-hidden border-8 border-junino-beige">
      <div className="flex flex-col md:flex-row items-end justify-center gap-12 min-h-[400px]">
        {/* Person Reference */}
        <div className="flex flex-col items-center group">
          <div className="w-24 h-48 bg-slate-200 rounded-t-full relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300" />
          </div>
          <span className="mt-2 text-sm font-medium text-slate-500">Mãe / Professora (1.65m)</span>
        </div>

        {/* The Panel Reference */}
        <div className="relative w-full max-w-[500px] aspect-[3/2.5] bg-junino-red/10 border-4 border-dashed border-junino-red flex items-center justify-center overflow-hidden rounded-lg shadow-2xl">
           <Image
            src={preview?.imageUrl || ''}
            alt={preview?.description || 'Scale comparison'}
            fill
            className="object-cover opacity-90"
            data-ai-hint={preview?.imageHint}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-junino-red animate-pulse">
              <span className="text-junino-red font-bold text-lg">3m x 2.5m de pura alegria!</span>
            </div>
          </div>
          
          {/* Dimensions info */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded text-xs">
            LARGURA: 3 METROS
          </div>
          <div className="absolute left-2 top-1/2 -rotate-90 origin-left -translate-y-1/2 text-white bg-black/50 px-3 py-1 rounded text-xs whitespace-nowrap">
            ALTURA: 2.5 METROS
          </div>
        </div>
      </div>
    </div>
  );
}