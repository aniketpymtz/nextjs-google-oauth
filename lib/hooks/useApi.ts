import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Example: Fetch data from a third-party API
export function useApiData<T>(endpoint: string, options?: { enabled?: boolean }) {
  return useQuery<T>({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: options?.enabled,
  });
}

// Example: Post data to a third-party API
export function useApiMutation<TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch related queries after mutation
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
}
