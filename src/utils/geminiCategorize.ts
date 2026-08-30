import { Review, IssueCategory, StandardIssueCategory } from '../types';

export interface CategorizedResult {
  id: string;
  category: IssueCategory;
  confidence: number;
  reasoning: string;
}

export interface AutoCategorizeResponse {
  success: boolean;
  results: CategorizedResult[];
  usedGemini: boolean;
  message?: string;
}

/**
 * Intelligent client-side rule-based fallback categorization if backend / Gemini is unreachable
 */
export function categorizeReviewOfflineFallback(review: { text: string; rating?: number }): {
  category: StandardIssueCategory;
  confidence: number;
  reasoning: string;
} {
  const lower = review.text.toLowerCase();

  // Cleanliness heuristics
  if (
    lower.includes('clean') ||
    lower.includes('dirty') ||
    lower.includes('restroom') ||
    lower.includes('bathroom') ||
    lower.includes('toilet') ||
    lower.includes('trash') ||
    lower.includes('smell') ||
    lower.includes('odor') ||
    lower.includes('soap') ||
    lower.includes('sanit') ||
    lower.includes('hair in') ||
    lower.includes('bug') ||
    lower.includes('fly') ||
    lower.includes('cockroach')
  ) {
    return {
      category: 'cleanliness',
      confidence: 0.92,
      reasoning: 'Mentions hygiene, cleanliness, sanitation, or facility upkeep.',
    };
  }

  // Pricing heuristics
  if (
    lower.includes('price') ||
    lower.includes('pricing') ||
    lower.includes('charge') ||
    lower.includes('charged') ||
    lower.includes('bill') ||
    lower.includes('cost') ||
    lower.includes('expensive') ||
    lower.includes('overpriced') ||
    lower.includes('receipt') ||
    lower.includes('refund') ||
    lower.includes('fee') ||
    lower.includes('dollar') ||
    lower.includes('tip')
  ) {
    return {
      category: 'pricing',
      confidence: 0.94,
      reasoning: 'Discusses charges, billing amounts, overpricing, or receipt discrepancies.',
    };
  }

  // Staff heuristics
  if (
    lower.includes('staff') ||
    lower.includes('server') ||
    lower.includes('waiter') ||
    lower.includes('waitress') ||
    lower.includes('host') ||
    lower.includes('hostess') ||
    lower.includes('bartender') ||
    lower.includes('manager') ||
    lower.includes('rude') ||
    lower.includes('attitude') ||
    lower.includes('impolite') ||
    lower.includes('disrespect') ||
    lower.includes('friendly') ||
    lower.includes('attentive')
  ) {
    return {
      category: 'staff',
      confidence: 0.95,
      reasoning: 'Refers to employee conduct, communication, attentiveness, or hospitality.',
    };
  }

  // Quality heuristics
  if (
    lower.includes('food') ||
    lower.includes('dish') ||
    lower.includes('taste') ||
    lower.includes('cold') ||
    lower.includes('raw') ||
    lower.includes('undercooked') ||
    lower.includes('overcooked') ||
    lower.includes('burnt') ||
    lower.includes('flavor') ||
    lower.includes('salty') ||
    lower.includes('bland') ||
    lower.includes('portion') ||
    lower.includes('steak') ||
    lower.includes('pasta') ||
    lower.includes('pizza') ||
    lower.includes('drink') ||
    lower.includes('cocktail') ||
    lower.includes('stale') ||
    lower.includes('delicious') ||
    lower.includes('yummy')
  ) {
    return {
      category: 'quality',
      confidence: 0.93,
      reasoning: 'Focuses on food preparation, temperature, freshness, taste, or recipe execution.',
    };
  }

  // Service heuristics (default)
  return {
    category: 'service',
    confidence: 0.88,
    reasoning: 'Related to overall speed, table turnaround, reservation fulfillment, or general operations.',
  };
}

/**
 * Auto-categorizes an array of reviews using Gemini API, falling back gracefully to heuristic classification
 */
export async function autoCategorizeReviews(reviewsToCategorize: Review[]): Promise<AutoCategorizeResponse> {
  if (reviewsToCategorize.length === 0) {
    return {
      success: true,
      results: [],
      usedGemini: false,
      message: 'No reviews were specified for categorization.',
    };
  }

  try {
    const payload = reviewsToCategorize.map((r) => ({
      id: r.id,
      text: r.text,
      rating: r.rating,
      platform: r.platform,
      author: r.author,
    }));

    const response = await fetch('/api/gemini/categorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews: payload }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.results) && data.results.length > 0) {
        return {
          success: true,
          results: data.results,
          usedGemini: true,
          message: `Successfully auto-categorized ${data.results.length} reviews using Gemini.`,
        };
      }
    }

    console.warn('Backend categorization call returned non-ok status, utilizing smart fallback...');
  } catch (err) {
    console.warn('Network error reaching Gemini categorization endpoint, utilizing smart fallback...', err);
  }

  // Client-side fallback if Gemini API call fails or is unavailable
  const fallbackResults: CategorizedResult[] = reviewsToCategorize.map((review) => {
    const res = categorizeReviewOfflineFallback(review);
    return {
      id: review.id,
      category: res.category,
      confidence: res.confidence,
      reasoning: res.reasoning,
    };
  });

  return {
    success: true,
    results: fallbackResults,
    usedGemini: false,
    message: `Auto-categorized ${fallbackResults.length} reviews using categorization rules.`,
  };
}
