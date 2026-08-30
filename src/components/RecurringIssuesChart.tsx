import React, { useState, useEffect } from 'react';
import { IssueCategoryStat, IssueCategory } from '../types';
import { CategoryBarTooltip } from './CategoryBarTooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface RecurringIssuesChartProps {
  stats: IssueCategoryStat[];
  activeCategoryFilter: IssueCategory | 'all';
  onSelectCategoryFilter: (category: IssueCategory | 'all') => void;
}

export const RecurringIssuesChart: React.FC<RecurringIssuesChartProps> = ({
  stats,
  activeCategoryFilter,
  onSelectCategoryFilter,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<IssueCategory | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<'total' | 'positive' | 'neutral' | 'negative'>('total');

  // Micro-animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const totalMentions = stats.reduce((acc, s) => acc + s.count, 0);

  return (
    <div id="recurring-issues-panel" className="bg-[#0d131f] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 id="chart-title" className="text-sm font-semibold text-zinc-100">
              Recurring Issues & Sentiment Distribution (Last 30 Days)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hover over any bar to inspect exact counts & percentages • Click to filter inbox
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">
            Total Analyzed Mentions: <strong className="text-zinc-100">{totalMentions}</strong>
          </span>
          {activeCategoryFilter !== 'all' && (
            <button
              onClick={() => onSelectCategoryFilter('all')}
              className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Horizontal Bar Chart */}
      <div className="space-y-3.5">
        {stats.map((stat) => {
          const isSelected = activeCategoryFilter === stat.category;
          const isHovered = hoveredCategory === stat.category;
          const positivePct = stat.count > 0 ? Math.round((stat.positiveCount / stat.count) * 100) : 0;
          const negativePct = stat.count > 0 ? Math.round((stat.negativeCount / stat.count) * 100) : 0;
          const neutralPct = stat.count > 0 ? Math.max(0, 100 - positivePct - negativePct) : 0;

          return (
            <div
              key={stat.category}
              id={`chart-bar-row-${stat.category}`}
              onClick={() => onSelectCategoryFilter(isSelected ? 'all' : stat.category)}
              onMouseEnter={() => {
                setHoveredCategory(stat.category);
                setHoveredSegment('total');
              }}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative p-2.5 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-zinc-850 border-cyan-500/60 shadow-sm ring-1 ring-cyan-500/20'
                  : isHovered
                  ? 'bg-zinc-850/80 border-cyan-500/40 shadow-md'
                  : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-850/60 hover:border-zinc-700'
              }`}
            >
              {/* Interactive Tooltip Overlay */}
              {isHovered && (
                <CategoryBarTooltip
                  stat={stat}
                  hoveredSegment={hoveredSegment}
                  totalAllMentions={totalMentions}
                />
              )}

              {/* Category label row */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-200 group-hover:text-cyan-300 transition-colors">
                    {stat.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      Filtering Inbox
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-zinc-400">
                    <strong className="text-zinc-200">{stat.count}</strong> mentions ({stat.percentage}%)
                  </span>

                  {/* 30-day Trend */}
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      stat.trendPercentage > 0
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {stat.trendPercentage > 0 ? (
                      <>
                        <TrendingUp className="w-2.5 h-2.5 text-rose-400" />
                        +{stat.trendPercentage}%
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-2.5 h-2.5 text-emerald-400" />
                        {stat.trendPercentage}%
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container with animated width and SVG titles */}
              <div 
                className="w-full bg-zinc-950 h-3.5 rounded-full overflow-hidden flex border border-zinc-800/80 p-0.5 group-hover:border-zinc-700 transition-colors"
                title={`${stat.label}: ${stat.count} total mentions (${stat.percentage}%) • Positive: ${stat.positiveCount} (${positivePct}%) | Neutral: ${stat.neutralCount} (${neutralPct}%) | Negative: ${stat.negativeCount} (${negativePct}%)`}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out flex overflow-hidden w-full"
                  style={{
                    width: isLoaded ? (stat.count > 0 ? `${Math.min(100, Math.max(8, stat.percentage))}%` : '0%') : '0%',
                    maxWidth: '100%',
                  }}
                >
                  {/* Segmented breakdown: Green for positive, Slate for neutral, Rose for negative */}
                  <div
                    style={{ width: `${positivePct}%` }}
                    className="h-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors cursor-pointer"
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredCategory(stat.category);
                      setHoveredSegment('positive');
                    }}
                    title={`Positive Sentiment: ${stat.positiveCount} mentions (${positivePct}% of ${stat.label})`}
                  />
                  <div
                    style={{ width: `${neutralPct}%` }}
                    className="h-full bg-slate-500/70 hover:bg-slate-400 transition-colors cursor-pointer"
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredCategory(stat.category);
                      setHoveredSegment('neutral');
                    }}
                    title={`Neutral Sentiment: ${stat.neutralCount} mentions (${neutralPct}% of ${stat.label})`}
                  />
                  <div
                    style={{ width: `${negativePct}%` }}
                    className="h-full bg-rose-500/80 hover:bg-rose-400 transition-colors cursor-pointer"
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredCategory(stat.category);
                      setHoveredSegment('negative');
                    }}
                    title={`Negative Sentiment: ${stat.negativeCount} mentions (${negativePct}% of ${stat.label})`}
                  />
                </div>
              </div>

              {/* Mini sentiment legend per category */}
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1 px-1">
                <span>Sentiment breakdown:</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 hover:underline">{positivePct}% Pos ({stat.positiveCount})</span>
                  <span className="text-zinc-400 hover:underline">{neutralPct}% Neu ({stat.neutralCount})</span>
                  <span className="text-rose-400 hover:underline">{negativePct}% Neg ({stat.negativeCount})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic AI Insights Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-zinc-200">Attention Driver</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Service & Wait Times increased <strong className="text-zinc-200">+14%</strong> this month, concentrated around Friday-Saturday evening shifts.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-zinc-200">Leading Quality Asset</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Cleanliness and Staff Attentiveness reflect a <strong className="text-emerald-300">65%+ positive</strong> sentiment index with declining complaint rates.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
