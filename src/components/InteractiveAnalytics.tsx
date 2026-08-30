import React, { useState, useEffect, useId } from 'react';
import { Review, IssueCategory, Platform, TimeRange } from '../types';
import { 
  getIssueStats, 
  getDailyTrend, 
  getPlatformStats, 
  getRatingDistribution, 
  getUrgencyStats 
} from '../data/mockReviews';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Star, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface InteractiveAnalyticsProps {
  reviews: Review[];
  activeCategoryFilter: IssueCategory | 'all';
  activePlatformFilter: Platform | 'all';
  activeRatingFilter: number | 'all';
  activeUrgencyFilter: string;
  onSelectCategoryFilter: (category: IssueCategory | 'all') => void;
  onSelectPlatformFilter: (platform: Platform | 'all') => void;
  onSelectRatingFilter: (rating: number | 'all') => void;
  onSelectUrgencyFilter: (urgency: 'high' | 'all') => void;
  onClearAllFilters: () => void;
}

export const InteractiveAnalytics: React.FC<InteractiveAnalyticsProps> = ({
  reviews,
  activeCategoryFilter,
  activePlatformFilter,
  activeRatingFilter,
  activeUrgencyFilter,
  onSelectCategoryFilter,
  onSelectPlatformFilter,
  onSelectRatingFilter,
  onSelectUrgencyFilter,
  onClearAllFilters,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'trends' | 'channels'>('overview');
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const gradientId = useId();

  useEffect(() => {
    setIsAnimated(false);
    const timer = setTimeout(() => setIsAnimated(true), 80);
    return () => clearTimeout(timer);
  }, [timeRange, reviews.length]);

  // Calculated dynamic statistics
  const issueStats = getIssueStats(reviews, timeRange);
  const dailyTrends = getDailyTrend(reviews, timeRange);
  const platformStats = getPlatformStats(reviews);
  const ratingDistribution = getRatingDistribution(reviews);
  const urgencyStats = getUrgencyStats(reviews);

  const totalReviews = reviews.length;
  const maxTrendTotal = Math.max(...dailyTrends.map((d) => d.total), 8);
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const hasAnyFilterActive = 
    activeCategoryFilter !== 'all' || 
    activePlatformFilter !== 'all' || 
    activeRatingFilter !== 'all' || 
    activeUrgencyFilter === 'high';

  return (
    <div id="interactive-analytics-suite" className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      
      {/* Top Bar: Title, Time Horizon Switcher & Tab Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 id="analytics-title" className="text-sm sm:text-base font-semibold text-slate-100 font-display flex items-center gap-2">
                Operational Intelligence & Sentiment Analytics
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-medium">
                  Live Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive metrics, category issue frequencies, and multi-channel response tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time range switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                id={`time-range-${range}`}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Clear Active Filters Pill if any */}
          {hasAnyFilterActive && (
            <button
              id="clear-analytics-filters-btn"
              onClick={onClearAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs hover:bg-cyan-900/60 transition-colors cursor-pointer"
            >
              <Filter className="w-3 h-3" />
              Reset Active Filters
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Ribbon with interactive drilldowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* KPI 1: Total Volume */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Inbox Volume</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-display text-slate-100">{totalReviews}</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Cross-platform aggregate</span>
        </div>

        {/* KPI 2: Average Rating */}
        <div 
          onClick={() => onSelectRatingFilter('all')}
          className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/40 transition-colors cursor-pointer group"
        >
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Satisfaction Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-display text-amber-300 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {avgRating}
            </span>
            <span className="text-[11px] font-mono text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono mt-1 block group-hover:underline">
            {ratingDistribution[0].percentage}% 5-Star Ratio
          </span>
        </div>

        {/* KPI 3: Urgent PR / Safety Risks */}
        <div 
          onClick={() => onSelectUrgencyFilter(activeUrgencyFilter === 'high' ? 'all' : 'high')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
            activeUrgencyFilter === 'high'
              ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/30'
              : 'bg-slate-900/50 border-slate-800/80 hover:border-rose-500/40'
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Urgent Safety / PR Risk</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold font-display ${urgencyStats.high.count > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
              {urgencyStats.high.count}
            </span>
            <span className="text-[11px] font-mono text-rose-300/80">({urgencyStats.high.percentage}%)</span>
          </div>
          <span className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            {activeUrgencyFilter === 'high' ? 'Filtering High Risk' : 'Click to isolate risks'}
          </span>
        </div>

        {/* KPI 4: AI Response Resolution */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Dispatch Response Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-display text-emerald-400">
              {Math.round((reviews.filter((r) => r.status === 'replied').length / (totalReviews || 1)) * 100)}%
            </span>
            <span className="text-[11px] font-mono text-slate-400">SLA 15m</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">AI Draft Assisted</span>
        </div>
      </div>

      {/* Main Grid: Interactive Trends Graph + Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Interactive SVG Time Series Graph with Scrubbing Tooltip */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200 font-display">
                Daily Feedback Volume & Sentiment Trajectory
              </h4>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Positive
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span> Neutral
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Negative
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="w-3 h-0.5 bg-cyan-400"></span> Rating
              </span>
            </div>
          </div>

          {/* Interactive Chart Canvas Area */}
          <div className="relative h-48 w-full select-none pt-2">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 500 160" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`${gradientId}-rating-glow`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 40, 80, 120].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Stacked Vertical Volume Bars */}
              {dailyTrends.map((d, index) => {
                const barWidth = 500 / dailyTrends.length;
                const x = index * barWidth + barWidth * 0.15;
                const w = barWidth * 0.7;

                // Scale bar heights relative to 130px canvas height
                const totalHeight = isAnimated ? Math.min(120, (d.total / maxTrendTotal) * 120) : 0;
                const posH = (d.positive / (d.total || 1)) * totalHeight;
                const neuH = (d.neutral / (d.total || 1)) * totalHeight;
                const negH = (d.negative / (d.total || 1)) * totalHeight;

                const isHovered = hoveredTrendPoint === index;

                return (
                  <g 
                    key={d.date} 
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={() => setHoveredTrendPoint(index)}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  >
                    {/* Hover highlight background column */}
                    {isHovered && (
                      <rect
                        x={index * barWidth}
                        y="0"
                        width={barWidth}
                        height="140"
                        fill="rgba(56, 189, 248, 0.08)"
                        rx="4"
                      />
                    )}

                    {/* Negative segment (bottom) */}
                    <rect
                      x={x}
                      y={130 - negH}
                      width={w}
                      height={negH}
                      fill="#f43f5e"
                      rx="1"
                      className="transition-all duration-700"
                    />

                    {/* Neutral segment (middle) */}
                    <rect
                      x={x}
                      y={130 - negH - neuH}
                      width={w}
                      height={neuH}
                      fill="#64748b"
                      rx="1"
                      className="transition-all duration-700"
                    />

                    {/* Positive segment (top) */}
                    <rect
                      x={x}
                      y={130 - negH - neuH - posH}
                      width={w}
                      height={posH}
                      fill="#10b981"
                      rx="2"
                      className="transition-all duration-700"
                    />
                  </g>
                );
              })}

              {/* Rating Smoothed Trend Path */}
              {(() => {
                if (dailyTrends.length === 0) return null;
                const barWidth = 500 / dailyTrends.length;
                const points = dailyTrends.map((d, index) => {
                  const x = index * barWidth + barWidth / 2;
                  // Map rating 1-5 to y 120 -> 20
                  const y = 130 - ((d.avgRating - 1) / 4) * 105;
                  return { x, y };
                });

                const dPath = points.reduce((acc, curr, idx) => {
                  if (idx === 0) return `M ${curr.x} ${curr.y}`;
                  const prev = points[idx - 1];
                  const midX = (prev.x + curr.x) / 2;
                  return `${acc} C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
                }, '');

                return (
                  <>
                    <path
                      d={dPath}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
                    />
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredTrendPoint === idx ? '5' : '3'}
                        fill="#0b101b"
                        stroke="#22d3ee"
                        strokeWidth="2"
                        className="transition-all"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Interactive Floating Hover Card Tooltip */}
            {hoveredTrendPoint !== null && dailyTrends[hoveredTrendPoint] && (
              <div 
                className="absolute z-20 top-2 pointer-events-none p-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur text-xs font-mono space-y-1 transform -translate-x-1/2 transition-all"
                style={{
                  left: `${((hoveredTrendPoint + 0.5) / dailyTrends.length) * 100}%`,
                }}
              >
                <div className="text-[11px] font-semibold text-slate-100 flex items-center justify-between gap-3">
                  <span>{dailyTrends[hoveredTrendPoint].dayLabel}</span>
                  <span className="text-cyan-300 font-bold">★ {dailyTrends[hoveredTrendPoint].avgRating}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] pt-0.5 border-t border-slate-800">
                  <span className="text-emerald-400 font-semibold">{dailyTrends[hoveredTrendPoint].positive} pos</span>
                  <span className="text-slate-400">{dailyTrends[hoveredTrendPoint].neutral} neu</span>
                  <span className="text-rose-400 font-semibold">{dailyTrends[hoveredTrendPoint].negative} neg</span>
                  <span className="text-slate-300 font-bold">({dailyTrends[hoveredTrendPoint].total} total)</span>
                </div>
              </div>
            )}
          </div>

          {/* X-axis time labels */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1 border-t border-slate-800/80 pt-2">
            <span>{dailyTrends[0]?.dayLabel || 'Start'}</span>
            <span className="hidden sm:inline text-slate-400">Interactive Volume Bar scrub enabled</span>
            <span>{dailyTrends[dailyTrends.length - 1]?.dayLabel || 'Today'}</span>
          </div>
        </div>

        {/* Right 1 Col: Rating Distribution Histogram (Interactive Click-to-filter) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 flex flex-col justify-between space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h4 className="text-xs font-semibold text-slate-200 font-display">
                Rating Distribution
              </h4>
            </div>
            {activeRatingFilter !== 'all' && (
              <button
                onClick={() => onSelectRatingFilter('all')}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {ratingDistribution.map((r) => {
              const isSelected = activeRatingFilter === r.stars;
              return (
                <div
                  key={r.stars}
                  id={`rating-filter-bar-${r.stars}`}
                  onClick={() => onSelectRatingFilter(isSelected ? 'all' : r.stars)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="flex items-center gap-1 font-medium text-slate-200 group-hover:text-amber-300">
                      {r.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <span className="text-[11px] text-slate-400">
                      <strong className="text-slate-200">{r.count}</strong> ({r.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        r.stars >= 4 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : r.stars === 3 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                          : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                      style={{
                        width: isAnimated ? `${r.percentage}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 font-mono text-center">
            Click any star rating bar to filter inbox reviews
          </p>
        </div>

      </div>

      {/* Bottom Grid: Recurring Issue Frequency Bars + Channel Platform Share Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        
        {/* Left: Recurring Issue Frequency Horizontal Bars */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200 font-display">
                Recurring Operational Issues & Sentiment Mix
              </h4>
            </div>
            {activeCategoryFilter !== 'all' && (
              <button
                onClick={() => onSelectCategoryFilter('all')}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Clear Issue Filter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {issueStats.map((stat) => {
              const isSelected = activeCategoryFilter === stat.category;
              const positivePct = stat.count > 0 ? Math.round((stat.positiveCount / stat.count) * 100) : 0;
              const negativePct = stat.count > 0 ? Math.round((stat.negativeCount / stat.count) * 100) : 0;
              const neutralPct = 100 - positivePct - negativePct;

              return (
                <div
                  key={stat.category}
                  id={`issue-bar-row-${stat.category}`}
                  onClick={() => onSelectCategoryFilter(isSelected ? 'all' : stat.category)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/70 shadow-sm ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-200 group-hover:text-cyan-300 flex items-center gap-1.5">
                      {stat.label}
                      {isSelected && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          Active
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2.5 font-mono text-[11px]">
                      <span className="text-slate-400">
                        <strong className="text-slate-200">{stat.count}</strong> ({stat.percentage}%)
                      </span>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        stat.trendPercentage > 0
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      }`}>
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

                  {/* Segmented Horizontal Bar */}
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800/80 p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out flex overflow-hidden"
                      style={{
                        width: isAnimated ? `${Math.min(100, stat.percentage * 2.8)}%` : '0%',
                      }}
                    >
                      <div
                        style={{ width: `${positivePct}%` }}
                        className="h-full bg-emerald-500 hover:bg-emerald-400 transition-colors"
                        title={`Positive: ${stat.positiveCount}`}
                      />
                      <div
                        style={{ width: `${neutralPct}%` }}
                        className="h-full bg-slate-500 hover:bg-slate-400 transition-colors"
                        title={`Neutral: ${stat.neutralCount}`}
                      />
                      <div
                        style={{ width: `${negativePct}%` }}
                        className="h-full bg-rose-500 hover:bg-rose-400 transition-colors"
                        title={`Negative: ${stat.negativeCount}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 px-0.5">
                    <span className="text-slate-400">Sentiment distribution:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{positivePct}% Pos</span>
                      <span className="text-slate-400">{neutralPct}% Neu</span>
                      <span className="text-rose-400">{negativePct}% Neg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Multi-Channel Platform Share & Resolution Rate Bars */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200 font-display">
                Channel Performance & SLA Response Compliance
              </h4>
            </div>
            {activePlatformFilter !== 'all' && (
              <button
                onClick={() => onSelectPlatformFilter('all')}
                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Clear Channel
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {platformStats.map((p) => {
              const isSelected = activePlatformFilter === p.platform;
              return (
                <div
                  key={p.platform}
                  id={`platform-metric-bar-${p.platform}`}
                  onClick={() => onSelectPlatformFilter(isSelected ? 'all' : p.platform)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/70 shadow-sm ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-amber-300 font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {p.avgRating}
                      </span>
                      <span className="text-slate-400">
                        {p.count} reviews ({p.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Channel response compliance rate bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Assisted Response Dispatch Rate</span>
                      <span className="text-emerald-400 font-bold">{p.responseRate}% SLA</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: isAnimated ? `${p.responseRate}%` : '0%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic Action Highlight */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs mt-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">Continuous AI Synthesis</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Response drafting latency reduced to <strong className="text-slate-200">&lt; 2 minutes</strong>. Urgent safety risk flags trigger proactive management alerts automatically.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
