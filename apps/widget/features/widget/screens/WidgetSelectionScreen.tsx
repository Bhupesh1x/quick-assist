import { useState } from "react";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";

import {
  screenAtom,
  errorMessageAtom,
  conversationIdAtom,
  organizationIdAtom,
  contactSessionIdFamily,
} from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";
import { WidgetFooter } from "../components/WidgetFooter";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

export function WidgetSelectionScreen() {
  const [isPending, setIsPending] = useState(false);

  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const organizationId = useAtomValue(organizationIdAtom);
  const sessionId = useAtomValue(contactSessionIdFamily(organizationId || ""));

  const createConversation = useMutation(api.public.conversations.create);
  async function handleStartChat() {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization id");
      return;
    }

    if (!sessionId) {
      setScreen("auth");
      return;
    }

    setIsPending(true);
    try {
      const conversationId = await createConversation({
        organizationId,
        sessionId,
      });

      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <WidgetHeader>
        <div className="space-y-2 px-2 py-4">
          <p className="text-3xl tracking-wide">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex-1 flex flex-col p-4 gap-y-2">
        <Button
          variant="outline"
          className="h-16 flex items-center justify-between w-full"
          onClick={handleStartChat}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4" />
            <p>Start chat</p>
          </div>
          <ChevronRightIcon />
        </Button>
      </div>
      <WidgetFooter />
    </>
  );
}
