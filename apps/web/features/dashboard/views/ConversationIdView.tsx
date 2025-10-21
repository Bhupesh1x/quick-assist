"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAction, useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";

import {
  AIInput,
  AIInputTools,
  AIInputButton,
  AIInputSubmit,
  AIInputToolbar,
  AIInputTextarea,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Form, FormField } from "@workspace/ui/components/form";
import { useInfiniteScroll } from "@workspace/ui/hooks/useInfiniteScroll";
import { DicebarAvatar } from "@workspace/ui/components/ai/dicebar-avatar";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";

import { getNewConversationStatus } from "../lib";
import { ContactPanel } from "../components/ContactPanel";
import { ConversationStatusButton } from "../components/ConversationStatusButton";

interface Props {
  conversationId: Id<"conversations">;
}

const formSchema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

export function ConversationIdView({ conversationId }: Props) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const conversation = useQuery(
    api.private.conversations.getOne,
    conversationId ? { conversationId } : "skip"
  );

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation?.threadId } : "skip",
    {
      initialNumItems: 10,
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const create = useMutation(api.private.messages.create);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await create({
        conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch {
      toast.error("Failed to add message. Please try again after sometime");
    }
  }

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );

  async function onUpdate() {
    if (!conversation) return;

    const newStatus = getNewConversationStatus(conversation?.status);

    if (!newStatus) return;

    setIsUpdatingStatus(true);
    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
      toast.success("Status updated");
    } catch {
      toast.error(
        "Failed to update conversation status. Please try again after sometime"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const { canLoadMore, topElementRef, isLoadingMore, handleLoadMore } =
    useInfiniteScroll({
      loadMore: messages.loadMore,
      status: messages.status,
      loadSize: 10,
      observerEnabled: false,
    });

  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhancePrompt = useAction(api.private.messages.enhance);

  async function onEnhance() {
    const message = form.getValues("message");

    setIsEnhancing(true);
    try {
      const response = await enhancePrompt({ prompt: message });

      form.setValue("message", response);
    } catch {
      toast.error(
        "Failed to enhance your message. Please try again after sometime"
      );
    } finally {
      setIsEnhancing(false);
    }
  }

  if (conversation === undefined || messages?.status === "LoadingFirstPage") {
    return <ConversationIdViewSkeleton />;
  }

  return (
    <div>
      <header className="bg-background p-2 border-b flex items-center justify-between w-full">
        <ContactPanel conversationId={conversation?._id}>
          <Button variant="outline">
            <MoreHorizontalIcon />
          </Button>
        </ContactPanel>
        {!!conversation && (
          <ConversationStatusButton
            onClick={onUpdate}
            status={conversation?.status}
            disabled={isUpdatingStatus}
          />
        )}
      </header>

      <main className="h-[calc(100vh-164px)] overflow-auto">
        <AIConversation>
          <AIConversationContent>
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
            {toUIMessages(messages?.results ?? [])?.map((message) => (
              <AIMessage
                key={message?.id}
                // Reverse here because we are looking from "operator" perspective here
                from={message?.role === "user" ? "assistant" : "user"}
              >
                <AIMessageContent>{message?.content || ""}</AIMessageContent>
                {message?.role === "user" ? (
                  <DicebarAvatar
                    seed={conversation?.contactSession?._id || "user"}
                    size={32}
                  />
                ) : null}
              </AIMessage>
            ))}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      </main>
      <Form {...form}>
        <AIInput onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                value={field.value}
                onChange={field.onChange}
                disabled={
                  conversation?.status === "resolved" ||
                  form.formState.isSubmitting ||
                  isEnhancing
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation has been resolved"
                    : "Type your response as a operator..."
                }
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputButton
                disabled={
                  conversation?.status === "resolved" ||
                  form.formState.isSubmitting ||
                  !form.formState.isValid ||
                  isEnhancing
                }
                onClick={onEnhance}
              >
                <Wand2Icon />
                {isEnhancing ? "Enhancing..." : "Enhance"}
              </AIInputButton>
            </AIInputTools>
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" ||
                form.formState?.isSubmitting ||
                !form.formState?.isValid ||
                isEnhancing
              }
              status="ready"
              type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </div>
  );
}

export function ConversationIdViewSkeleton() {
  return (
    <div>
      <header className="bg-background p-2 border-b flex items-center justify-between w-full">
        <Button variant="outline" disabled>
          <MoreHorizontalIcon />
        </Button>
      </header>

      <main className="h-[calc(100vh-160px)] overflow-auto">
        <AIConversation>
          <AIConversationContent>
            {Array.from({ length: 8 })?.map((_, index) => {
              const isUser = index % 2 === 0;
              const widths = ["w-[115px]", "w-[152px]", "w-[70px]"];
              const width = widths[index % widths?.length];
              return (
                <AIMessage
                  key={index}
                  // Reverse here because we are looking from "operator" perspective here
                  from={isUser ? "assistant" : "user"}
                >
                  <AIMessageContent className="animate-pulse">
                    <div className={`h-4 ${width}`} />
                  </AIMessageContent>
                  {isUser ? <DicebarAvatar seed={"user"} size={32} /> : null}
                </AIMessage>
              );
            })}
          </AIConversationContent>
        </AIConversation>
      </main>
      <div>
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder={"Type your response as a operator..."}
          />

          <AIInputToolbar>
            <AIInputTools>
              <AIInputButton disabled>
                <Wand2Icon />
                Enhance
              </AIInputButton>
            </AIInputTools>
            <AIInputSubmit disabled status="ready" type="submit" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
}
