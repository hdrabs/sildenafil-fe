import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// One QueryClient per server request. React's `cache` dedupes the call within a
// single request so multiple prefetches share the same client, while each request
// gets a fresh one. staleTime mirrors QueryProvider so hydrated data isn't
// immediately considered stale and refetched on the client.
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
        },
      },
    }),
);
