/**
 * Generic API fetching utility with error handling
 */
export async function fetchApi<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      } catch (e) {
        // If can't parse JSON, use status text
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
} 