export type Platform = 'google' | 'yelp' | 'facebook' | 'appstore' | 'googleplay' | 'trustpilot' | 'tripadvisor';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type ThemePalette = 'deep-space' | 'midnight-fog' | 'obsidian';

export type IssueCategory = 'service' | 'quality' | 'pricing' | 'cleanliness' | 'staff' | 'uncategorized';

export type StandardIssueCategory = 'service' | 'quality' | 'pricing' | 'cleanliness' | 'staff';

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type ReviewStatus = 'pending' | 'replied' | 'flagged';

export type AiDraftTone = 'empathetic' | 'professional' | 'conciliatory' | 'appreciative';

export interface AiDraft {
  tones: Record<AiDraftTone, string>;
  selectedTone: AiDraftTone;
  currentText: string;
  rationale: string;
  confidenceScore: number;
}

export interface ReviewReply {
  text: string;
  postedAt: string;
  toneUsed: AiDraftTone;
}

export interface Review {
  id: string;
  author: string;
  platform: Platform;
  rating: number; // 1 to 5
  date: string;
  relativeTime: string;
  text: string;
  sentiment: Sentiment;
  category: IssueCategory;
  urgency: UrgencyLevel;
  urgencyReason?: string;
  status: ReviewStatus;
  aiInsight?: string;
  aiDraft: AiDraft;
  reply?: ReviewReply;
  verifiedCustomer?: boolean;
  orderReference?: string;
  categoryConfidence?: number;
  categoryReasoning?: string;
  isAutoCategorized?: boolean;
}

export interface IssueCategoryStat {
  category: IssueCategory;
  label: string;
  count: number;
  percentage: number;
  trendPercentage: number; // e.g. +14 or -8
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

export type SortOption = 'newest' | 'urgent' | 'lowest-rating' | 'highest-rating' | 'response-time';

export interface FilterState {
  searchQuery: string;
  platform: Platform | 'all';
  urgency: UrgencyLevel | 'all';
  sentiment: Sentiment | 'all';
  category: IssueCategory | 'all';
  status: ReviewStatus | 'all';
  rating: number | 'all';
  sortBy: SortOption;
}

export type TimeRange = '7d' | '30d' | '90d' | 'all';

export interface DailyTrendPoint {
  date: string;
  dayLabel: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  avgRating: number;
}

export interface PlatformStat {
  platform: Platform;
  name: string;
  count: number;
  percentage: number;
  avgRating: number;
  responseRate: number;
}
