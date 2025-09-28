"use client";

import { useCallback, useEffect, useRef } from "react";

interface Props {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  loadSize?: number;
  observerEnabled?: boolean;
}

export function useInfiniteScroll({
  status,
  loadMore,
  loadSize = 10,
  observerEnabled = true,
}: Props) {
  const topElementRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(loadSize);
    }
  }, [status, loadMore, loadSize]);

  useEffect(() => {
    if (!(topElementRef?.current && observerEnabled)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(topElementRef?.current);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, observerEnabled]);

  return {
    topElementRef,
    handleLoadMore,
    canLoadMore: status === "CanLoadMore",
    isLoadingMore: status === "LoadingMore",
    isLoadingFirstPage: status === "LoadingFirstPage",
    isExhausted: status === "Exhausted",
  };
}
