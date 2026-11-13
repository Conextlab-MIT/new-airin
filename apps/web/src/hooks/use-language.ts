import type { AppLanguage } from "@airin/core/contract";
import {
  type QueryClient,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/context/use-auth";
import { client } from "@/lib/client";
import { needsMfaEnrollment } from "@/lib/mfa";
import { queryKeys } from "@/lib/query-keys";

const languageQueryOptions = queryOptions({
  queryFn: () => client.getLanguage(),
  queryKey: queryKeys.language.settings,
  staleTime: 1000 * 60 * 5,
});

export function prefetchLanguage(queryClient: QueryClient): void {
  void queryClient.prefetchQuery(languageQueryOptions);
}

export function useUserLanguage() {
  const { user } = useAuth();

  return useQuery({
    ...languageQueryOptions,
    enabled: !needsMfaEnrollment(user),
  });
}

export function useSaveUserLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (language: AppLanguage) => client.setLanguage(language),
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.language.settings, saved);
    },
  });
}
