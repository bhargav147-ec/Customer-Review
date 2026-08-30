import { AiDraftTone } from '../types';

export interface SavedDraft {
  text: string;
  tone: AiDraftTone;
  updatedAt: number;
}

const STORAGE_PREFIX = 'crm_review_draft_';

/**
 * Retrieve saved draft from localStorage for a specific review
 */
export function getSavedDraft(reviewId: string): SavedDraft | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${reviewId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.text === 'string') {
      return parsed as SavedDraft;
    }
  } catch (err) {
    console.warn(`Failed to read autosaved draft for review ${reviewId}:`, err);
  }
  return null;
}

/**
 * Save draft text and tone to localStorage
 */
export function saveDraftToStorage(reviewId: string, text: string, tone: AiDraftTone): void {
  try {
    if (!reviewId) return;
    const payload: SavedDraft = {
      text,
      tone,
      updatedAt: Date.now(),
    };
    localStorage.setItem(`${STORAGE_PREFIX}${reviewId}`, JSON.stringify(payload));
  } catch (err) {
    console.warn(`Failed to auto-save draft for review ${reviewId}:`, err);
  }
}

/**
 * Remove saved draft from localStorage
 */
export function clearSavedDraft(reviewId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${reviewId}`);
  } catch (err) {
    console.warn(`Failed to clear autosaved draft for review ${reviewId}:`, err);
  }
}
