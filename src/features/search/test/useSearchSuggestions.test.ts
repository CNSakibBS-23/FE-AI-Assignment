import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSearchSuggestions } from "@/features/search/logic/useSearchSuggestions";
import * as searchApi from "@/features/search/data/getSearchSuggestions";

describe("useSearchSuggestions", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("debounces search calls before firing request", async () => {
    vi.useFakeTimers();
    const apiSpy = vi
      .spyOn(searchApi, "getSearchSuggestions")
      .mockResolvedValue([]);

    renderHook(() =>
      useSearchSuggestions("alex", {
        debounceMs: 300,
      }),
    );

    await act(async () => {
      vi.advanceTimersByTime(299);
    });
    expect(apiSpy).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  it("calls API with the normalized query", async () => {
    vi.useFakeTimers();
    const apiSpy = vi
      .spyOn(searchApi, "getSearchSuggestions")
      .mockResolvedValue([]);

    renderHook(() =>
      useSearchSuggestions("  alex  ", {
        debounceMs: 100,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(apiSpy).toHaveBeenCalledWith("alex");
  });

  it("sets loading state while request is in-flight", async () => {
    vi.useFakeTimers();
    let resolveRequest: (value: searchApi.SearchSuggestion[]) => void = () => {};

    vi.spyOn(searchApi, "getSearchSuggestions").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const { result } = renderHook(() =>
      useSearchSuggestions("alex", {
        debounceMs: 100,
      }),
    );

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      resolveRequest([]);
    });

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error state when request fails", async () => {
    vi.useFakeTimers();
    vi.spyOn(searchApi, "getSearchSuggestions").mockRejectedValue(
      new Error("Network down"),
    );

    const { result } = renderHook(() =>
      useSearchSuggestions("alex", {
        debounceMs: 100,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(result.current.error).toBe("Network down");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.suggestions).toEqual([]);
  });
});
