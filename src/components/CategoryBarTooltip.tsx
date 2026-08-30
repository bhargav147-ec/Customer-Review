import React from 'react';
import { IssueCategoryStat, Sentiment } from '../types';
import { Sparkles, ThumbsUp, ThumbsDown, Minus, TrendingUp, TrendingDown } from 'lucide-react';

interface CategoryBarTooltipProps {
  stat: IssueCategoryStat;
  hoveredSegment?: 'total' | 'positive' | 'neutral' | 'negative';
  totalAllMentions?: number;
}

export const CategoryBarTooltip: React.FC<CategoryBarTooltipProps> = ({
  stat,
  hoveredSegment = 'total',
  totalAllMentions,
}) => {
  const positivePct = stat.count > 0 ? Math.round((stat.positiveCount / stat.count) * 100) : 0;
  const negativePct = stat.count > 0 ? Math.round((stat.negativeCount / stat.count) * 100) : 0;
  const neutralPct = Math.max(0, 100 - positivePct - negativePct);
  const shareOfAll = totalAllMentions && totalAllMentions > 0 
    ? ((stat.count / totalAllMentions) * 100).toFixed(1) 
    : stat.percentage.toString();

  return (
    <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl z-50 text-xs pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95"
      role="tooltip"
    >
      {/* Tooltip Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-cyan-500/40" />
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent border-t-zinc-900" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-100">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{stat.label}</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
            stat.trendPercentage > 0 
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' 
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
          }`}>
            {stat.trendPercentage > 0 ? (
              <>
                <TrendingUp className="w-2.5 h-2.5" />
                +{stat.trendPercentage}%
              </>
            ) : (
              <>
                <TrendingDown className="w-2.5 h-2.5" />
                {stat.trendPercentage}%
              </>
            )}
          </span>
        </div>
      </div>

      {/* Primary Metrics Highlight */}
      <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-2 rounded-lg border border-zinc-800/80 font-mono mb-2.5">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Total Volume</div>
          <div className="text-sm font-bold text-zinc-100">
            {stat.count} <span className="text-[10px] font-normal text-zinc-400">mentions</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Share of Issues</div>
          <div className="text-sm font-bold text-cyan-300">
            {shareOfAll}%
          </div>
        </div>
      </div>

      {/* Detailed Sentiment Breakdown with exact counts and percentages */}
      <div className="space-y-1.5 font-mono text-[11px]">
        {/* Positive */}
        <div className={`flex items-center justify-between p-1 rounded transition-colors ${
          hoveredSegment === 'positive' ? 'bg-emerald-950/60 border border-emerald-500/30' : ''
        }`}>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ThumbsUp className="w-3 h-3" />
            <span>Positive</span>
          </span>
          <span className="font-semibold text-zinc-200">
            {stat.positiveCount} <span className="text-zinc-400 text-[10px]">({positivePct}%)</span>
          </span>
        </div>

        {/* Neutral */}
        <div className={`flex items-center justify-between p-1 rounded transition-colors ${
          hoveredSegment === 'neutral' ? 'bg-slate-800/60 border border-slate-500/30' : ''
        }`}>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Minus className="w-3 h-3" />
            <span>Neutral</span>
          </span>
          <span className="font-semibold text-zinc-200">
            {stat.neutralCount} <span className="text-zinc-400 text-[10px]">({neutralPct}%)</span>
          </span>
        </div>

        {/* Negative */}
        <div className={`flex items-center justify-between p-1 rounded transition-colors ${
          hoveredSegment === 'negative' ? 'bg-rose-950/60 border border-rose-500/30' : ''
        }`}>
          <span className="flex items-center gap-1.5 text-rose-400">
            <ThumbsDown className="w-3 h-3" />
            <span>Negative</span>
          </span>
          <span className="font-semibold text-zinc-200">
            {stat.negativeCount} <span className="text-zinc-400 text-[10px]">({negativePct}%)</span>
          </span>
        </div>
      </div>

      {/* Actionable Prompt */}
      <div className="mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Click to filter inbox to {stat.label}</span>
      </div>
    </div>
  );
};
