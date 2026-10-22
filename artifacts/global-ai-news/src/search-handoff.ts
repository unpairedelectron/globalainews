let pendingSearchQuery: string | null = null;
const listeners = new Set<(query: string) => void>();

export function handoffSearchQuery(query: string): void {
  pendingSearchQuery = query;
  listeners.forEach((listener) => listener(query));
}

export function readSearchQueryHandoff(): string | null {
  return pendingSearchQuery;
}

export function clearSearchQueryHandoff(): void {
  pendingSearchQuery = null;
}

export function subscribeToSearchQueryHandoff(listener: (query: string) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
