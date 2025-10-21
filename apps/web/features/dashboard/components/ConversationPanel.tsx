"use client";

import {
  ListIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  CornerUpLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { usePaginatedQuery } from "convex/react";

import { statusFilterAtom } from "../atom";

import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@workspace/ui/components/select";
import { api } from "@workspace/backend/_generated/api";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { useInfiniteScroll } from "@workspace/ui/hooks/useInfiniteScroll";
import { DicebarAvatar } from "@workspace/ui/components/ai/dicebar-avatar";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";

export function ConversationPanel() {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);

  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    {
      initialNumItems: 10,
    }
  );

  function onStatusChange(value: Doc<"conversations">["status"] | "all") {
    setStatusFilter(value);
  }

  const { canLoadMore, topElementRef, isLoadingMore, handleLoadMore } =
    useInfiniteScroll({
      loadMore: conversations.loadMore,
      status: conversations.status,
      loadSize: 10,
    });

  return (
    <div>
      <div className="border-b p-2 space-y-2 md:space-y-0">
        <SidebarTrigger className="md:hidden" />
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            onStatusChange(value as Doc<"conversations">["status"] | "all")
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none shadow-none px-1.5 ring-0 hover:bg-accent bg-accent/50 hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-x-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-x-2">
                <ArrowRightIcon className="size-4" />
                <span>Unresolved</span>
              </div>
            </SelectItem>
            <SelectItem value="escalated">
              <div className="flex items-center gap-x-2">
                <ArrowUpIcon className="size-4" />
                <span>Escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-x-2">
                <CheckIcon className="size-4" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col h-[calc(100vh-53px)] overflow-y-auto scroll-container">
        {conversations?.isLoading
          ? Array.from({ length: 5 })?.map((_, index) => (
              <ConversationPanelLoading key={index} />
            ))
          : null}
        {conversations?.results?.map((conversation) => {
          if (!conversation) return;

          const isLastMessageFromOperator =
            conversation?.lastMessage?.message?.role !== "user";
          const href = `/conversations/${conversation?._id}`;

          const country = getCountryFromTimezone(
            conversation?.contactSession?.metadata?.timezone
          );

          const countryFlagUrl = country?.code
            ? getCountryFlagUrl(country?.code)
            : undefined;

          return (
            <Link
              key={conversation?._id}
              href={href}
              className={`relative p-4 py-5 border-b hover:bg-accent hover:text-sidebar-foreground ${pathname === href ? "bg-accent text-sidebar-foreground" : ""}`}
            >
              <div
                className={`absolute top-1/2 -translate-1/2 left-0 h-[64%] w-1 bg-neutral-300 rounded-r-full opacity-0 transition-opacity ${pathname === href ? "opacity-100" : ""}`}
              />
              <div className="flex items-start gap-2">
                <DicebarAvatar
                  seed={conversation?.contactSessionId || ""}
                  size={40}
                  className="!hidden md:!inline-block"
                  badgeImageUrl={countryFlagUrl}
                />

                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <p className="font-semibold text-sm">
                      {conversation?.contactSession?.name}
                    </p>
                    <p className="text-muted-foreground text-sm hidden md:block">
                      {formatDistanceToNow(conversation?._creationTime)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-1 w-full">
                    <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
                      {isLastMessageFromOperator ? (
                        <CornerUpLeftIcon className="size-4 shrink-0" />
                      ) : null}
                      <p
                        className={`line-clamp-1 ${!isLastMessageFromOperator ? "text-black font-bold" : ""}`}
                      >
                        {conversation?.lastMessage?.text}
                      </p>
                    </div>
                    <ConversationStatusIcon
                      status={conversation?.status}
                      className="hidden md:block"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />
      </div>
    </div>
  );
}

export function ConversationPanelLoading() {
  return (
    <div className="relative p-4 py-5 border-b hover:bg-accent hover:text-sidebar-foreground">
      <div className="flex items-start gap-2">
        <DicebarAvatar
          seed={"user-avatar"}
          size={40}
          className="!hidden md:!inline-block"
        />

        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <Skeleton className="h-[20px] w-[48px]" />

            <Skeleton className="h-[20px] w-[48px]" />
          </div>

          <div className="flex items-center justify-between gap-1 w-full">
            <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
              <Skeleton className="h-[16px] w-[118px]" />
            </div>
            <ConversationStatusIcon
              status="unresolved"
              className="hidden md:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
