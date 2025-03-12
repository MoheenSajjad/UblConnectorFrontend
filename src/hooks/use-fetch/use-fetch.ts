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

  // Main fetch implementation
  const executeFetch = useCallback(
    async (options: FetchOptions<TBody>) => {
      // Abort any existing request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const { retries = 1, retryDelay = 1000, signal } = options;

      // Create new abort controller if none provided
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Combine signals if external signal is provided
      const combinedSignal = signal
        ? { signal: new AbortSignal() } // Create a composite signal
        : { signal: controller.signal };

      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        let attempt = 0;
        while (attempt < retries) {
          try {
            const apiResponse = await apiFn({
              ...options,
              ...combinedSignal,
            });

            if (!apiResponse) {
              throw new FetchError("No response received from API");
            }

            if (apiResponse.status === false) {
              throw new FetchError(
                apiResponse.message || "API request failed",
                apiResponse.responseCode
              );
            }

            // Check if component is still mounted and request wasn't aborted
            if (!isMountedRef.current || controller.signal.aborted) {
              return null;
            }

            const responseData = apiResponse.data;

            setState({
              data: responseData,
              error: null,
              isLoading: false,
              isSuccess: true,
              isError: false,
            });

            return responseData;
          } catch (error) {
            // If the request was aborted, don't retry
            if (error instanceof Error && error.name === "AbortError") {
              throw error;
            }

            if (attempt === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            attempt++;
          }
        }

        throw new Error("Max retries reached");
      } catch (error) {
        // Don't update state if component unmounted or request was aborted
        if (
          !isMountedRef.current ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return null;
        }

        const fetchError =
          error instanceof FetchError
            ? error
            : new FetchError(
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred"
              );

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
    [apiFn]
  );

  // Public fetch method with option overrides
  const fetch = useCallback(
    (options: Partial<FetchOptions<TBody>> = {}) => {
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
      abort(); // Abort any pending request on unmount
    };
  }, [abort]);

  // Handle autoFetch
  useEffect(() => {
    if (initialOptions.autoFetch && !autoFetchedRef.current) {
      autoFetchedRef.current = true;
      fetch();
    }
  }, []); // Empty dependency array to run only once on mount

  return {
    ...state,
    fetch,
    abort,
    reset,
  };
}

// Types
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
