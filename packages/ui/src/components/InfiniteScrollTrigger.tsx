"use client";

interface Props {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function InfiniteScrollTrigger({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  className,
  loadMoreText = "Load more",
  noMoreText = "No more items",
  ref,
}: Props) {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = "Loading...";
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={`flex justify-center w-full py-2 ${className}`} ref={ref}>
      <button
        className="hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none"
        disabled={!canLoadMore || isLoadingMore}
        onClick={onLoadMore}
      >
        {text}
      </button>
    </div>
  );
}
