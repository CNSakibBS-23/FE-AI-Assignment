export type SearchSuggestion = {
  id: string;
  email: string;
  name: string;
};

type SearchSuggestionsResponse = {
  data: SearchSuggestion[];
};

export async function getSearchSuggestions(
  query: string,
): Promise<SearchSuggestion[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/search-suggestions?query=${encodeURIComponent(normalizedQuery)}`,
    );

    if (!response.ok) {
      throw new Error("Search suggestions request failed");
    }

    const payload = (await response.json()) as SearchSuggestionsResponse;
    return payload.data;
  } catch {
    throw new Error("Failed to fetch search suggestions");
  }
}
