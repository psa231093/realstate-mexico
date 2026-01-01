const STORAGE_KEY = "recently-viewed-properties";
const MAX_ITEMS = 50;

export interface RecentlyViewedItem {
  propertyId: string;
  viewedAt: string;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(propertyId: string): void {
  if (typeof window === "undefined") return;

  try {
    const items = getRecentlyViewed();
    const filtered = items.filter((item) => item.propertyId !== propertyId);
    const updated = [
      { propertyId, viewedAt: new Date().toISOString() },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving recently viewed:", error);
  }
}

export function removeRecentlyViewed(propertyId: string): void {
  if (typeof window === "undefined") return;

  try {
    const items = getRecentlyViewed();
    const filtered = items.filter((item) => item.propertyId !== propertyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing recently viewed:", error);
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
  }
}
