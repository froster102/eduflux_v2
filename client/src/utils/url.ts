export function buildQueryUrlParams(params: PaginationQueryParams): string {
  const urlSearchParams = new URLSearchParams();

  if (params.page !== undefined) {
    urlSearchParams.append("page", String(params.page));
  }
  if (params.limit !== undefined) {
    urlSearchParams.append("limit", String(params.limit));
  }
  if (params.searchQuery) {
    urlSearchParams.append("searchQuery", params.searchQuery);
  }
  if (params.searchFields && params.searchFields.length > 0) {
    urlSearchParams.append("searchFields", params.searchFields.join(","));
  }

  if (params.sortBy) {
    urlSearchParams.append("sortBy", params.sortBy);
  }
  if (params.sortOrder) {
    urlSearchParams.append("sortOrder", params.sortOrder);
  }

  if (params.filters) {
    try {
      const filtersString = JSON.stringify(params.filters);

      urlSearchParams.append("filters", filtersString);
    } catch (e) {
      console.error("Error serializing filters:", e);
    }
  }

  const queryString = urlSearchParams.toString();

  return queryString ? `?${queryString}` : "";
}
