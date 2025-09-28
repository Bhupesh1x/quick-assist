"use client";

import z from "zod";
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
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { AIResponse } from "@workspace/ui/components/ai/response";

const formSchema = z.object({
  message: z.string().trim().min(3, "Message is required"),
});

export function WidgetChatScreen() {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const sessionId = useAtomValue(contactSessionIdFamily(organizationId || ""));

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
          {toUIMessages(messages?.results ?? [])?.map((message) => (
            <AIMessage
              key={message?.id}
              from={message?.role === "user" ? "user" : "assistant"}
            >
              <AIMessageContent>
                <AIResponse>{message?.content || ""}</AIResponse>
              </AIMessageContent>
            </AIMessage>
          ))}
        </AIConversationContent>
      </AIConversation>
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
                conversation?.status === "resolved" || !form.formState.isValid
              }
              status="ready"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
}
