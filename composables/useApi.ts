/**
 * Provides a function to fetch data from the API and a function to clear
 * the cached data for a specific API endpoint. The `fetchData` function
 * caches responses in memory and returns the cached response if it already
 * exists.
 *
 * @returns An object with `fetchData` and `clearCache` functions.
 */
export const useApi = () => {
  const config = useRuntimeConfig();
  
  const apiUrl = config.public.apiUrl;
  const apiKey = config.public.apiKey;

  const cache = new Map<string, any>();  // Simple cache in memory

  /**
   * Fetches data from the API. If the data is already in the cache, it's
   * returned from the cache. Otherwise, it makes a request to the API and caches
   * the response.
   *
   * @param endpoint The API endpoint to fetch from.
   * @param options The options to pass to the `fetch` function.
   * @returns The data from the API.
   */
  const fetchData = async (endpoint: string, options: RequestInit = {}) => {
    if (cache.has(endpoint)) {
      return cache.get(endpoint);
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-key': apiKey,
      ...options.headers,
    };

    const response = await fetch(`${apiUrl}/${endpoint}`, { ...options, headers });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    cache.set(endpoint, data);
    return data;
  };

/**
 * Removes the cached data for the specified API endpoint.
 *
 * @param endpoint The API endpoint whose cached data should be cleared.
 */
  const clearCache = (endpoint: string) => {
    cache.delete(endpoint);
  };

  return { fetchData, clearCache };
};
