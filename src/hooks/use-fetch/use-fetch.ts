import { useState, useCallback, useEffect, useRef } from "react";
import { FetchError } from "@/lib/fetch-error";

/**
 * A custom hook for making HTTP requests using a provided API function
 * with features like retries, cancellation, and state management.
 */
export function useFetch<TData = unknown, TError = Error, TBody = unknown>(
  apiFn: ApiFunction<TData, TBody>,
  initialOptions: FetchOptions<TBody> = {}
): UseFetchReturn<TData, TError, TBody> {
  // Initialize state
  const [state, setState] = useState<FetchState<TData, TError>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  // Refs for cleanup and state management
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const autoFetchedRef = useRef(false);
  const apiFnRef = useRef(apiFn);

  // Update apiFn ref when it changes
  useEffect(() => {
    apiFnRef.current = apiFn;
  }, [apiFn]);

  // Retry logic implementation
  const handleRetry = useCallback(
    async (
      fetchFn: () => Promise<TData>,
      { retries = 1, retryDelay, attempt = 3 }: RetryConfig
    ): Promise<TData> => {
      try {
        console.log("retry is called", fetchFn);

        return await fetchFn();
      } catch (error) {
        console.log(error, attempt, retries);

        if (attempt >= retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return handleRetry(fetchFn, {
          retries,
          retryDelay,
          attempt: attempt + 1,
        });
      }
    },
    []
  );

  // Main fetch implementation
  const executeFetch = useCallback(
    async (options: FetchOptions<TBody>) => {
      if (!apiFnRef.current) {
        console.error(
          "API function is not defined before calling executeFetch."
        );
        return null;
      }
      const { retries = 1, retryDelay = 1000, signal } = options;
      console.log("executeFetch is called");

      // Create new abort controller if none provided
      const controller = signal ? undefined : new AbortController();
      abortControllerRef.current = controller || null;

      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        // Execute fetch with retry logic
        const response = await handleRetry(
          async () => {
            const apiResponse = await apiFnRef.current({
              ...options,
              signal: controller?.signal || signal,
            });

            if (!apiResponse?.status) {
              throw new FetchError(
                apiResponse?.message,
                apiResponse?.responseCode
              );
            }

            return apiResponse.data;
          },
          { retries, retryDelay, attempt: 0 }
        );

        if (!isMountedRef.current) return null;

        setState({
          data: response,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        return response;
      } catch (error) {
        console.log(error);

        if (!isMountedRef.current) return null;

        let fetchError: FetchError;
        if (error instanceof FetchError) {
          fetchError = error;
        } else if (error instanceof Error) {
          fetchError = new FetchError(error.message);
        } else {
          fetchError = new FetchError("An unknown error occurred");
        }

        setState({
          data: null,
          error: fetchError as TError,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        return null;
      }
    },
    [handleRetry]
  );

  // Public fetch method with option overrides
  const fetch = useCallback(
    async (options: Partial<FetchOptions<TBody>> = {}) => {
      console.log("fetch is called");

      return executeFetch({
        ...initialOptions,
        ...options,
      });
    },
    [executeFetch, initialOptions]
  );

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  // Abort current request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Setup and cleanup effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abort();
    };
  }, [abort]);

  // Handle autoFetch in a separate effect
  useEffect(() => {
    if (initialOptions.autoFetch) {
      console.log("Auto-fetch triggered.");
      fetch();
    }
  }, []); // Run only once on mount
  // Empty dependency array since we only want this to run once on mount

  return {
    ...state,
    fetch,
    abort,
    reset,
  };
}
export interface ApiResponse<T = any> {
  responseCode: number;
  message: string;
  data: T;
  status: boolean;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiFunction<TData = any, TBody = any> = (
  options?: FetchOptions<TBody>
) => Promise<ApiResponse<TData>>;

export interface FetchOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  queryParams?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
  cache?: RequestCache;
  signal?: AbortSignal;
  token?: string;
  autoFetch?: boolean;
}

export interface FetchState<TData, TError = Error> {
  data: TData | null;
  error: TError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseFetchReturn<TData, TError = Error, TBody = unknown>
  extends FetchState<TData, TError> {
  fetch: (options?: Partial<FetchOptions<TBody>>) => Promise<TData | null>;
  abort: () => void;
  reset: () => void;
}

export interface RetryConfig {
  retries: number;
  retryDelay: number;
  attempt: number;
}
