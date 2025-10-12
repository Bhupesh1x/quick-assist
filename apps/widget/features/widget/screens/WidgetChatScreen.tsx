"use client";

import z from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAtomValue, useSetAtom } from "jotai";
import { useAction, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";

import {
  screenAtom,
  conversationIdAtom,
  organizationIdAtom,
  widgetSettingsAtom,
  contactSessionIdFamily,
} from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";

import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui/components/ai/suggestion";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useInfiniteScroll } from "@workspace/ui/hooks/useInfiniteScroll";
import { DicebarAvatar } from "@workspace/ui/components/ai/dicebar-avatar";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";

const formSchema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

export function WidgetChatScreen() {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const sessionId = useAtomValue(contactSessionIdFamily(organizationId || ""));
  const widgetSettings = useAtomValue(widgetSettingsAtom);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && sessionId
      ? {
          conversationId,
          sessionId,
        }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && sessionId
      ? {
          threadId: conversation?.threadId,
          sessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  function onBack() {
    setConversationId(null);
    setScreen("selection");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!sessionId || !conversation?.threadId) return;

    form.reset();

    await createMessage({
      sessionId,
      prompt: values.message,
      threadId: conversation.threadId,
    });
  }

  const { canLoadMore, topElementRef, isLoadingMore, handleLoadMore } =
    useInfiniteScroll({
      loadMore: messages.loadMore,
      status: messages.status,
      loadSize: 10,
    });

  const suggestions = useMemo(() => {
    if (!widgetSettings?.defaultSuggestions) return [];

    return Object.keys(widgetSettings.defaultSuggestions)?.map((key) => {
      return widgetSettings?.defaultSuggestions[
        key as keyof typeof widgetSettings.defaultSuggestions
      ];
    });
  }, [widgetSettings?._id]);

  function onSuggestion(suggestion: string) {
    form.setValue("message", suggestion, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    form.handleSubmit(onSubmit)();
  }

  return (
    <>
      <WidgetHeader className="w-full flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-x-2">
          <Button onClick={onBack} variant="transparent" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
          <p>Chat</p>
        </div>
        <Button variant="transparent" size="icon">
          <MenuIcon className="size-5" />
        </Button>
      </WidgetHeader>
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
              from={message?.role === "user" ? "user" : "assistant"}
            >
              <AIMessageContent>
                <AIResponse>{message?.content || ""}</AIResponse>
              </AIMessageContent>
              {message?.role === "assistant" ? (
                <DicebarAvatar
                  imageUrl="/logo.svg"
                  seed="assistant"
                  size={32}
                />
              ) : null}
            </AIMessage>
          ))}
        </AIConversationContent>
      </AIConversation>

      {toUIMessages(messages?.results ?? [])?.length === 1 && (
        <AISuggestions className="flex flex-col items-end w-full p-2">
          {suggestions?.map((suggestion) => {
            if (!suggestion) return null;

            return (
              <AISuggestion
                disabled={form.formState.isSubmitting}
                key={suggestion}
                onClick={() => onSuggestion(suggestion)}
                suggestion={suggestion}
              />
            );
          })}
        </AISuggestions>
      )}

      <Form {...form}>
        <AIInput onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            disabled={conversation?.status === "resolved"}
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation has been resolved"
                    : "Type your message..."
                }
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              type="submit"
              disabled={
                conversation?.status === "resolved" ||
                !form.formState.isValid ||
                form?.formState?.isSubmitting
              }
              status="ready"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
}
