import React, { useState, useEffect } from 'react';
import { Review, FilterState, AiDraftTone, IssueCategory, Platform, ReviewStatus, UrgencyLevel, ThemePalette } from './types';
import { INITIAL_REVIEWS } from './data/mockReviews';
import { Header } from './components/Header';
import { SummaryBar } from './components/SummaryBar';
import { ReviewList } from './components/ReviewList';
import { ReviewDetail } from './components/ReviewDetail';
import { TwoPanelAnalytics } from './components/TwoPanelAnalytics';
import { SimulateReviewModal } from './components/SimulateReviewModal';
import { SettingsModal } from './components/SettingsModal';
import { ReviewListSkeleton, DetailSkeleton } from './components/SkeletonLoader';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(INITIAL_REVIEWS[0].id);
  const [checkedReviewIds, setCheckedReviewIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme state with localStorage initialization
  const [theme, setTheme] = useState<ThemePalette>(() => {
    const saved = localStorage.getItem('app-workspace-theme');
    if (saved === 'deep-space' || saved === 'midnight-fog' || saved === 'obsidian') {
      return saved;
    }
    return 'deep-space';
  });

  // Sync theme to root element for global CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-workspace-theme', theme);
  }, [theme]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    platform: 'all',
    urgency: 'all',
    sentiment: 'all',
    category: 'all',
    status: 'all',
    rating: 'all',
    sortBy: 'newest',
  });

  // Brief initial skeleton loader for smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'urgent' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleSelectTheme = (newTheme: ThemePalette) => {
    setTheme(newTheme);
    const themeTitles: Record<ThemePalette, string> = {
      'deep-space': 'Deep Space',
      'midnight-fog': 'Midnight Fog',
      'obsidian': 'Obsidian',
    };
    showToast(`Workspace theme changed to ${themeTitles[newTheme]}`, 'info');
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      platform: 'all',
      urgency: 'all',
      sentiment: 'all',
      category: 'all',
      status: 'all',
      rating: 'all',
      sortBy: 'newest',
    });
    showToast('All filters cleared', 'info');
  };

  const handleCategoryFilterFromChart = (category: IssueCategory | 'all') => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
    if (category !== 'all') {
      showToast(`Filtered inbox by category: ${category.toUpperCase()}`, 'info');
    }
  };

  const handlePlatformFilterFromChart = (platform: Platform | 'all') => {
    setFilters((prev) => ({
      ...prev,
      platform,
    }));
    if (platform !== 'all') {
      showToast(`Filtered inbox by platform: ${platform.toUpperCase()}`, 'info');
    }
  };

  const handleRatingFilterFromChart = (rating: number | 'all') => {
    setFilters((prev) => ({
      ...prev,
      rating,
    }));
    if (rating !== 'all') {
      showToast(`Filtered inbox to ${rating}-star reviews`, 'info');
    }
  };

  const handleUrgencyFilterFromChart = (urgency: UrgencyLevel | 'all') => {
    setFilters((prev) => ({
      ...prev,
      urgency,
    }));
    if (urgency === 'high') {
      showToast('Filtered inbox to High-Urgency reviews', 'urgent');
    }
  };

  // Toggle resolved / pending status per review
  const handleToggleStatus = (reviewId: string, newStatus: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: newStatus,
          };
        }
        return r;
      })
    );
  };

  // Batch update status for multiple selected reviews
  const handleBatchUpdateStatus = (reviewIds: string[], newStatus: ReviewStatus) => {
    if (reviewIds.length === 0) return;
    setReviews((prev) =>
      prev.map((r) => {
        if (reviewIds.includes(r.id)) {
          return {
            ...r,
            status: newStatus,
            ...(newStatus === 'replied' && !r.reply
              ? {
                  reply: {
                    text: r.aiDraft.currentText,
                    postedAt: new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    toneUsed: r.aiDraft.selectedTone,
                  },
                }
              : {}),
          };
        }
        return r;
      })
    );

    const count = reviewIds.length;
    if (newStatus === 'replied') {
      showToast(`Batch marked ${count} review${count > 1 ? 's' : ''} as Replied`, 'success');
    } else {
      showToast(`Batch moved ${count} review${count > 1 ? 's' : ''} to Needs Reply`, 'info');
    }
  };

  // Post reply handler
  const handlePostReply = (reviewId: string, replyText: string, tone: AiDraftTone) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            status: 'replied',
            reply: {
              text: replyText,
              postedAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              toneUsed: tone,
            },
          };
        }
        return r;
      })
    );
  };

  // Regenerate draft with variations
  const handleRegenerateDraft = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const currentText = r.aiDraft.currentText;
          const updatedTones = { ...r.aiDraft.tones };
          const tone = r.aiDraft.selectedTone;
          const variations: Record<AiDraftTone, string[]> = {
            empathetic: [
              `Dear ${r.author.split(' ')[0]}, thank you for sharing your experience. We are truly sorry for the inconvenience and take your feedback to heart. Please reach out to our team directly so we can address this with you personally.`,
              `${r.author.split(' ')[0]}, we deeply regret falling short during your visit. Your satisfaction is our highest priority, and we are working with our staff to ensure this is corrected. Please contact us directly so we can assist you.`,
            ],
            professional: [
              `Dear ${r.author.split(' ')[0]}, we appreciate you bringing this matter to our attention. Our team is conducting an immediate review of our operations to maintain our quality standards. Please reach out if we can provide further assistance.`,
              `Dear ${r.author.split(' ')[0]}, thank you for your feedback regarding our ${r.category}. We take all customer observations seriously and have informed our shift supervisor.`,
            ],
            conciliatory: [
              `${r.author.split(' ')[0]}, please accept our sincere apologies for your experience. We would love the opportunity to make amends and provide the exceptional service you deserve. Please connect with us directly so we can make things right.`,
              `${r.author.split(' ')[0]}, we are very sorry that your visit did not meet expectations. We value your patronage and would appreciate speaking with you to make things right.`,
            ],
            appreciative: [
              `${r.author.split(' ')[0]}, thank you so much for the wonderful review! We are delighted you enjoyed your time with us and look forward to welcoming you back soon!`,
              `${r.author.split(' ')[0]}, our team is thrilled by your feedback! Thank you for supporting our business, and we can’t wait to host you again!`,
            ],
          };

          const options = variations[tone] || [currentText];
          const newPhrase = options[Math.floor(Math.random() * options.length)];
          updatedTones[tone] = newPhrase;

          return {
            ...r,
            aiDraft: {
              ...r.aiDraft,
              tones: updatedTones,
              currentText: newPhrase,
            },
          };
        }
        return r;
      })
    );
    showToast('Regenerated AI response variation', 'info');
  };

  // Add newly simulated review
  const handleAddSimulatedReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    setSelectedReviewId(newReview.id);

    if (newReview.urgency === 'high') {
      showToast('New High-Urgency Review received! Escalated to priority.', 'urgent');
    } else {
      showToast(`New review from ${newReview.author} triaged and added to inbox.`, 'success');
    }
  };

  const handleToggleCheckReview = (id: string, e?: React.MouseEvent) => {
    setCheckedReviewIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length === 2) {
        showToast('2 reviews selected: Side-by-Side Comparison activated!', 'info');
      }
      return next;
    });
  };

  const handleClearCheckedReviews = () => {
    setCheckedReviewIds([]);
  };

  const handleSelectCompareReview = (idA: string, idB: string) => {
    setCheckedReviewIds([idA, idB]);
    showToast('Comparing 2 selected reviews side-by-side', 'info');
  };

  const handleFocusSingleReview = (id: string) => {
    setSelectedReviewId(id);
    setCheckedReviewIds([]);
  };

  const selectedReview = reviews.find((r) => r.id === selectedReviewId) || null;

  // Comparison reviews active when exactly 2 are checked
  const compareReviews = checkedReviewIds.length === 2
    ? checkedReviewIds
        .map((id) => reviews.find((r) => r.id === id))
        .filter((r): r is Review => Boolean(r))
    : null;

  return (
    <div 
      className="min-h-screen flex flex-col antialiased transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-main)',
      }}
    >
      
      {/* Generic Unbranded Header */}
      <Header
        reviews={reviews}
        onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        currentTheme={theme}
        filterUrgency={filters.urgency}
        onFilterUrgencySelect={handleUrgencyFilterFromChart}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-5 sm:gap-6">
        
        {/* Top Summary Bar with Animated Counters on Load */}
        <SummaryBar
          reviews={reviews}
          onSelectUrgencyFilter={handleUrgencyFilterFromChart}
          onSelectSentimentFilter={(sentiment) => setFilters((f) => ({ ...f, sentiment }))}
          onSelectStatusFilter={(status) => setFilters((f) => ({ ...f, status }))}
          activeUrgencyFilter={filters.urgency}
          activeSentimentFilter={filters.sentiment}
          activeStatusFilter={filters.status}
        />

        {/* Top Split Workspace: Left Review Inbox, Right Active Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column: Inbox List */}
          <div className="lg:col-span-5 xl:col-span-5 h-[620px] flex flex-col">
            {isLoading ? (
              <ReviewListSkeleton />
            ) : (
              <ReviewList
                reviews={reviews}
                selectedReviewId={selectedReviewId}
                onSelectReview={(id) => setSelectedReviewId(id)}
                checkedReviewIds={checkedReviewIds}
                onToggleCheck={handleToggleCheckReview}
                onClearChecked={handleClearCheckedReviews}
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                onBatchUpdateStatus={handleBatchUpdateStatus}
              />
            )}
          </div>

          {/* Right Column: Selected Review Detail & AI Assisted Action Editor */}
          <div className="lg:col-span-7 xl:col-span-7 h-[620px] flex flex-col">
            {isLoading ? (
              <DetailSkeleton />
            ) : (
              <ReviewDetail
                review={selectedReview}
                compareReviews={compareReviews && compareReviews.length === 2 ? compareReviews : null}
                allReviews={reviews}
                onCloseComparison={handleClearCheckedReviews}
                onFocusSingleReview={handleFocusSingleReview}
                onSelectCompareReview={handleSelectCompareReview}
                onPostReply={handlePostReply}
                onToggleStatus={handleToggleStatus}
                onRegenerateDraft={handleRegenerateDraft}
                onShowToast={showToast}
              />
            )}
          </div>

        </div>

        {/* Bottom Two-Panel Analytics: Recurring Issues Bar Chart & 30D Sentiment Trajectory Mini-Chart */}
        <div className="w-full">
          <TwoPanelAnalytics
            reviews={reviews}
            activeCategoryFilter={filters.category}
            activePlatformFilter={filters.platform}
            activeRatingFilter={filters.rating}
            activeUrgencyFilter={filters.urgency}
            onSelectCategoryFilter={handleCategoryFilterFromChart}
            onSelectPlatformFilter={handlePlatformFilterFromChart}
            onSelectRatingFilter={handleRatingFilterFromChart}
            onSelectUrgencyFilter={handleUrgencyFilterFromChart}
            onClearAllFilters={handleResetFilters}
          />
        </div>

      </main>

      {/* Interactive Simulate Review Modal for Testing */}
      <SimulateReviewModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onAddReview={handleAddSimulatedReview}
      />

      {/* Workspace Settings & Theme Selector Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
