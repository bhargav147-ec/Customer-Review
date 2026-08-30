import React, { useState, useEffect, useId } from 'react';
import { Review, IssueCategory, Platform, TimeRange } from '../types';
import { CategoryBarTooltip } from './CategoryBarTooltip';
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
  Layers, 
  Star, 
  Activity, 
  PieChart, 
  Sparkles,
  RotateCcw,
  Zap,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface TwoPanelAnalyticsProps {
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

export const TwoPanelAnalytics: React.FC<TwoPanelAnalyticsProps> = ({
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
  const [hoveredCategory, setHoveredCategory] = useState<IssueCategory | null>(null);
  const [hoveredCategorySegment, setHoveredCategorySegment] = useState<'total' | 'positive' | 'neutral' | 'negative'>('total');
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState<number | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<Platform | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const gradientId = useId();

  useEffect(() => {
    setIsAnimated(false);
    const timer = setTimeout(() => setIsAnimated(true), 60);
    return () => clearTimeout(timer);
  }, [timeRange, reviews.length]);

  const issueStats = getIssueStats(reviews, timeRange);
  const dailyTrends = getDailyTrend(reviews, timeRange);
  const platformStats = getPlatformStats(reviews);
  const totalReviews = reviews.length;
  const maxTrendTotal = Math.max(...dailyTrends.map((d) => d.total), 8);

  const hasAnyActiveFilter = 
    activeCategoryFilter !== 'all' || 
    activePlatformFilter !== 'all' || 
    activeRatingFilter !== 'all' || 
    activeUrgencyFilter === 'high';

  // Donut chart circle math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const platformColors: Record<Platform, { stroke: string; bg: string; text: string }> = {
    appstore: { stroke: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', text: 'text-sky-400' },
    googleplay: { stroke: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', text: 'text-emerald-400' },
    trustpilot: { stroke: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400' },
    google: { stroke: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', text: 'text-blue-400' },
    yelp: { stroke: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', text: 'text-rose-400' },
    facebook: { stroke: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)', text: 'text-indigo-400' },
    tripadvisor: { stroke: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)', text: 'text-teal-400' },
  };

  let accumulatedOffset = 0;

  return (
    <div id="analytics-two-panel-hub" className="space-y-5">
      
      {/* Header bar with Time Horizon and Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d131f] border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 id="analytics-section-heading" className="text-sm sm:text-base font-semibold text-zinc-100 font-display flex items-center gap-2">
              Operational Intelligence & Feedback Analytics
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Live Data
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Recurring issue tracking, sentiment trajectory & multi-channel volume distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
            {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                id={`time-range-btn-${range}`}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-zinc-800 text-cyan-300 font-semibold shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {hasAnyActiveFilter && (
            <button
              id="clear-analytics-filters-btn"
              onClick={onClearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs hover:bg-cyan-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Two-Panel Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* PANEL 1: Recurring Issues Bar Chart (7 Cols) */}
        <div 
          id="recurring-issues-panel" 
          className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-zinc-100 font-display">
                Recurring Operational Issues & Sentiment Mix
              </h4>
            </div>
            {activeCategoryFilter !== 'all' && (
              <button
                onClick={() => onSelectCategoryFilter('all')}
                className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                Reset Category Filter
              </button>
            )}
          </div>

          <p className="text-xs text-zinc-400">
            Categorized breakdown of customer friction points. Click any bar to isolate corresponding reviews in the inbox.
          </p>

          <div className="space-y-3 pt-1">
            {issueStats.map((stat) => {
              const isSelected = activeCategoryFilter === stat.category;
              const isHovered = hoveredCategory === stat.category;
              const positivePct = stat.count > 0 ? Math.round((stat.positiveCount / stat.count) * 100) : 0;
              const negativePct = stat.count > 0 ? Math.round((stat.negativeCount / stat.count) * 100) : 0;
              const neutralPct = Math.max(0, 100 - positivePct - negativePct);

              return (
                <div
                  key={stat.category}
                  id={`issue-bar-card-${stat.category}`}
                  onClick={() => onSelectCategoryFilter(isSelected ? 'all' : stat.category)}
                  onMouseEnter={() => {
                    setHoveredCategory(stat.category);
                    setHoveredCategorySegment('total');
                  }}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-zinc-850 border-cyan-500 shadow-sm ring-1 ring-cyan-500/30'
                      : isHovered
                      ? 'bg-zinc-850/80 border-cyan-500/40 shadow-md'
                      : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  {/* Interactive Tooltip Overlay */}
                  {isHovered && (
                    <CategoryBarTooltip
                      stat={stat}
                      hoveredSegment={hoveredCategorySegment}
                      totalAllMentions={totalReviews}
                    />
                  )}

                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-200 group-hover:text-cyan-300 flex items-center gap-2">
                      {stat.label}
                      {isSelected && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          Active Filter
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-2.5 font-mono text-[11px]">
                      <span className="text-zinc-400">
                        <strong className="text-zinc-200">{stat.count}</strong> ({stat.percentage}%)
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

                  {/* Horizontal Segmented Bar Animated */}
                  <div 
                    className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden flex border border-zinc-800/80 p-0.5 group-hover:border-zinc-700 transition-colors"
                    title={`${stat.label}: ${stat.count} total mentions (${stat.percentage}%) • Positive: ${stat.positiveCount} (${positivePct}%) | Neutral: ${stat.neutralCount} (${neutralPct}%) | Negative: ${stat.negativeCount} (${negativePct}%)`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out flex overflow-hidden"
                      style={{
                        width: isAnimated ? (stat.count > 0 ? `${Math.min(100, Math.max(12, stat.percentage))}%` : '0%') : '0%',
                      }}
                    >
                      <div
                        style={{ width: `${positivePct}%` }}
                        className="h-full bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-pointer"
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredCategory(stat.category);
                          setHoveredCategorySegment('positive');
                        }}
                        title={`Positive Sentiment: ${stat.positiveCount} mentions (${positivePct}% of ${stat.label})`}
                      />
                      <div
                        style={{ width: `${neutralPct}%` }}
                        className="h-full bg-slate-500 hover:bg-slate-400 transition-colors cursor-pointer"
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredCategory(stat.category);
                          setHoveredCategorySegment('neutral');
                        }}
                        title={`Neutral Sentiment: ${stat.neutralCount} mentions (${neutralPct}% of ${stat.label})`}
                      />
                      <div
                        style={{ width: `${negativePct}%` }}
                        className="h-full bg-rose-500 hover:bg-rose-400 transition-colors cursor-pointer"
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          setHoveredCategory(stat.category);
                          setHoveredCategorySegment('negative');
                        }}
                        title={`Negative Sentiment: ${stat.negativeCount} mentions (${negativePct}% of ${stat.label})`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1 px-0.5">
                    <span className="text-zinc-500">Sentiment distribution:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-medium hover:underline">{positivePct}% Pos ({stat.positiveCount})</span>
                      <span className="text-slate-400 hover:underline">{neutralPct}% Neu ({stat.neutralCount})</span>
                      <span className="text-rose-400 font-medium hover:underline">{negativePct}% Neg ({stat.negativeCount})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: Sentiment Trend Mini-Chart (Line / Area, last 30 days) (5 Cols) */}
        <div 
          id="sentiment-trend-panel"
          className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-zinc-100 font-display">
                  Sentiment Trend (30 Days)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Rolling 30D
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive timeline trajectory: volume stacked by positive/neutral/negative sentiment.
            </p>
          </div>

          {/* SVG Trend Mini-Chart */}
          <div className="relative h-44 w-full select-none pt-2">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 400 140" 
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              {[0, 35, 70, 105].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="400"
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Stacked Bars */}
              {dailyTrends.map((d, index) => {
                const barWidth = 400 / dailyTrends.length;
                const x = index * barWidth + barWidth * 0.15;
                const w = barWidth * 0.7;

                const totalHeight = isAnimated ? Math.min(105, (d.total / maxTrendTotal) * 105) : 0;
                const posH = (d.positive / (d.total || 1)) * totalHeight;
                const neuH = (d.neutral / (d.total || 1)) * totalHeight;
                const negH = (d.negative / (d.total || 1)) * totalHeight;

                const isHovered = hoveredTrendPoint === index;

                return (
                  <g 
                    key={d.date}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredTrendPoint(index)}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  >
                    {isHovered && (
                      <rect
                        x={index * barWidth}
                        y="0"
                        width={barWidth}
                        height="120"
                        fill="rgba(34, 211, 238, 0.08)"
                        rx="3"
                      />
                    )}
                    {/* Negative */}
                    <rect
                      x={x}
                      y={110 - negH}
                      width={w}
                      height={negH}
                      fill="#f43f5e"
                      rx="1"
                      className="transition-all duration-700"
                    />
                    {/* Neutral */}
                    <rect
                      x={x}
                      y={110 - negH - neuH}
                      width={w}
                      height={neuH}
                      fill="#64748b"
                      rx="1"
                      className="transition-all duration-700"
                    />
                    {/* Positive */}
                    <rect
                      x={x}
                      y={110 - negH - neuH - posH}
                      width={w}
                      height={posH}
                      fill="#10b981"
                      rx="2"
                      className="transition-all duration-700"
                    />
                  </g>
                );
              })}

              {/* Smoothed Rating Line */}
              {(() => {
                if (dailyTrends.length === 0) return null;
                const barWidth = 400 / dailyTrends.length;
                const points = dailyTrends.map((d, index) => {
                  const x = index * barWidth + barWidth / 2;
                  const y = 110 - ((d.avgRating - 1) / 4) * 85;
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
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="drop-shadow-[0_2px_6px_rgba(56,189,248,0.4)]"
                    />
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredTrendPoint === idx ? '4.5' : '2.5'}
                        fill="#0d131f"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="transition-all"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Hover Tooltip */}
            {hoveredTrendPoint !== null && dailyTrends[hoveredTrendPoint] && (
              <div 
                className="absolute z-20 top-0 pointer-events-none p-2 rounded-xl bg-zinc-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur text-xs font-mono space-y-0.5 transform -translate-x-1/2"
                style={{
                  left: `${((hoveredTrendPoint + 0.5) / dailyTrends.length) * 100}%`,
                }}
              >
                <div className="text-[11px] font-semibold text-zinc-100 flex items-center justify-between gap-2">
                  <span>{dailyTrends[hoveredTrendPoint].dayLabel}</span>
                  <span className="text-amber-300 font-bold">★ {dailyTrends[hoveredTrendPoint].avgRating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span className="text-emerald-400">{dailyTrends[hoveredTrendPoint].positive} pos</span>
                  <span>•</span>
                  <span className="text-rose-400">{dailyTrends[hoveredTrendPoint].negative} neg</span>
                </div>
              </div>
            )}
          </div>

          {/* Mini-Chart Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pos
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span> Neu
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Neg
              </span>
            </div>
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-3 h-0.5 bg-sky-400"></span> Rating
            </span>
          </div>
        </div>

      </div>

      {/* PLATFORM BREAKDOWN DONUT / RING CHART */}
      <div 
        id="platform-donut-breakdown" 
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-zinc-100 font-display">
              Platform Channel Share & Resolution Compliance
            </h4>
          </div>
          {activePlatformFilter !== 'all' && (
            <button
              onClick={() => onSelectPlatformFilter('all')}
              className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              Reset Channel Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Donut Chart SVG */}
          <div className="md:col-span-5 flex items-center justify-center p-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#18181b"
                  strokeWidth="12"
                />

                {/* Segment Rings */}
                {platformStats.filter((p) => p.count > 0).map((p) => {
                  const share = p.percentage / 100;
                  const strokeDasharray = `${share * circumference} ${circumference}`;
                  const strokeDashoffset = -accumulatedOffset * circumference;
                  accumulatedOffset += share;

                  const isHovered = hoveredPlatform === p.platform;
                  const isSelected = activePlatformFilter === p.platform;
                  const col = platformColors[p.platform];

                  return (
                    <circle
                      key={p.platform}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={col.stroke}
                      strokeWidth={isSelected ? "14" : isHovered ? "13" : "11"}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 cursor-pointer"
                      onMouseEnter={() => setHoveredPlatform(p.platform)}
                      onMouseLeave={() => setHoveredPlatform(null)}
                      onClick={() => onSelectPlatformFilter(isSelected ? 'all' : p.platform)}
                    />
                  );
                })}
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-bold font-display text-zinc-100">
                  {totalReviews}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Reviews</span>
              </div>
            </div>
          </div>

          {/* Platform Stat Cards (Interactive click-to-filter) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {platformStats.filter((p) => p.count > 0).map((p) => {
              const isSelected = activePlatformFilter === p.platform;
              const isHovered = hoveredPlatform === p.platform;
              const col = platformColors[p.platform];

              return (
                <div
                  key={p.platform}
                  id={`platform-stat-card-${p.platform}`}
                  onClick={() => onSelectPlatformFilter(isSelected ? 'all' : p.platform)}
                  onMouseEnter={() => setHoveredPlatform(p.platform)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-zinc-800/90 border-cyan-500 ring-1 ring-cyan-500/20'
                      : isHovered
                      ? 'bg-zinc-850/80 border-zinc-700'
                      : 'bg-zinc-900/50 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-200 group-hover:text-cyan-300">
                      {p.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: col.stroke }} />
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold font-display text-zinc-100">
                      {p.percentage}%
                    </span>
                    <span className="text-xs font-mono text-amber-300 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {p.avgRating}
                    </span>
                  </div>

                  {/* Response dispatch progress */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>SLA Compliance</span>
                      <span className="text-emerald-400 font-bold">{p.responseRate}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: isAnimated ? `${p.responseRate}%` : '0%',
                          backgroundColor: col.stroke,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
