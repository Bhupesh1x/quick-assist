import { useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";

import {
  screenAtom,
  conversationIdAtom,
  organizationIdAtom,
  contactSessionIdFamily,
} from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

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

  function onBack() {
    setConversationId(null);
    setScreen("selection");
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
      <div className="flex-1 flex flex-col p-4">
        <p>{JSON.stringify(conversation, null, 2)}</p>
      </div>
    </>
  );
}
