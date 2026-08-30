import React from 'react';

export const ReviewListSkeleton: React.FC = () => {
  return (
    <div id="review-list-skeleton" className="space-y-3 p-1">
      {[1, 2, 3, 4].map((item) => (
        <div 
          key={item} 
          className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-16 h-5 rounded bg-zinc-800"></div>
              <div className="w-24 h-4 rounded bg-zinc-800"></div>
            </div>
            <div className="w-14 h-4 rounded bg-zinc-800"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-4 rounded bg-zinc-800"></div>
            <div className="w-16 h-4 rounded bg-zinc-800"></div>
          </div>
          <div className="space-y-1.5">
            <div className="w-full h-3.5 rounded bg-zinc-800"></div>
            <div className="w-4/5 h-3.5 rounded bg-zinc-800"></div>
          </div>
          <div className="flex gap-2 pt-1">
            <div className="w-16 h-5 rounded-full bg-zinc-800"></div>
            <div className="w-16 h-5 rounded bg-zinc-800"></div>
            <div className="w-20 h-5 rounded-full bg-zinc-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div id="detail-skeleton" className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-40 h-6 rounded bg-zinc-800"></div>
          <div className="w-28 h-4 rounded bg-zinc-800"></div>
        </div>
        <div className="w-24 h-8 rounded-lg bg-zinc-800"></div>
      </div>
      <div className="space-y-3 py-4 border-y border-zinc-800">
        <div className="w-full h-4 rounded bg-zinc-800"></div>
        <div className="w-full h-4 rounded bg-zinc-800"></div>
        <div className="w-3/4 h-4 rounded bg-zinc-800"></div>
      </div>
      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
        <div className="w-32 h-5 rounded bg-zinc-800"></div>
        <div className="w-full h-24 rounded-lg bg-zinc-800"></div>
        <div className="flex justify-end gap-2">
          <div className="w-24 h-8 rounded-lg bg-zinc-800"></div>
          <div className="w-28 h-8 rounded-lg bg-zinc-800"></div>
        </div>
      </div>
    </div>
  );
};
