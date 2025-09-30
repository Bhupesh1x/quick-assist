"use client";

import { ArrowLeftIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { usePaginatedQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";

import {
  screenAtom,
  conversationIdAtom,
  organizationIdAtom,
  contactSessionIdFamily,
} from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";
import { WidgetFooter } from "../components/WidgetFooter";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Id } from "@workspace/backend/_generated/dataModel";
import { useInfiniteScroll } from "@workspace/ui/hooks/useInfiniteScroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";

export function WidgetInboxScreen() {
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || "")
  );

  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  function onBack() {
    setScreen("selection");
  }

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId ? { contactSessionId } : "skip",
    { initialNumItems: 10 }
  );

  function onConversationClick(conversationId: Id<"conversations">) {
    setConversationId(conversationId);
    setScreen("chat");
  }

  const { canLoadMore, topElementRef, isLoadingMore, handleLoadMore } =
    useInfiniteScroll({
      loadMore: conversations.loadMore,
      status: conversations.status,
      loadSize: 10,
    });

  return (
    <>
      <WidgetHeader className="w-full px-2 py-4">
        <div className="flex items-center gap-x-2">
          <Button onClick={onBack} variant="transparent" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
          <p>Inbox</p>
        </div>
      </WidgetHeader>
      <div className="flex-1 flex flex-col p-4 gap-y-2">
        {conversations?.results?.map((conversation) => (
          <Button
            key={conversation?._id}
            className="h-20 w-full"
            variant="outline"
            onClick={() => onConversationClick(conversation?._id)}
          >
            <div className="space-y-2 w-full text-start">
              <div className="w-full flex items-center justify-between font-[550]">
                <p className="text-xs text-muted-foreground">Chat</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation?._creationTime))}
                </p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="truncate text-sm">
                  {conversation?.lastMessage?.text}
                </p>
                <ConversationStatusIcon status={conversation?.status} />
              </div>
            </div>
          </Button>
        ))}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />
      </div>
      <WidgetFooter />
    </>
  );
}
