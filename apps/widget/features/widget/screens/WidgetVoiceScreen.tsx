import { useSetAtom } from "jotai";
import { ArrowLeftIcon, MicIcon, MicOffIcon } from "lucide-react";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import { Button } from "@workspace/ui/components/button";

import { useVapi } from "../hooks/useVapi";
import { screenAtom } from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";

export function WidgetVoiceScreen() {
  const {
    isSpeaking,
    transcript,
    isConnected,
    isConnecting,
    endCall,
    startCall,
  } = useVapi();

  const setScreen = useSetAtom(screenAtom);

  function onBack() {
    setScreen("selection");
  }

  function onStartCall() {
    startCall?.();
  }

  function onEndCall() {
    endCall?.();
  }

  return (
    <>
      <WidgetHeader className="w-full flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-x-2">
          <Button onClick={onBack} variant="transparent" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
          <p>Voice chat</p>
        </div>
      </WidgetHeader>
      {transcript?.length ? (
        <AIConversation
          className={`h-full flex-1 overflow-y-auto ${isConnected ? "max-h-[calc(100vh-180px)]" : "max-h-[calc(100vh-148px)]"}`}
        >
          <AIConversationContent>
            {transcript?.map((message, index) => (
              <AIMessage
                key={`${message?.role}-${index}=${message?.text}`}
                from={message?.role}
              >
                <AIMessageContent>{message?.text || " "}</AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      ) : (
        <div className="flex flex-1 flex-col h-full w-full items-center justify-center">
          <MicIcon className="text-muted-foreground" />
          <p className="text-muted-foreground mt-6">
            Transcript will appear here
          </p>
        </div>
      )}

      <div className="border-t bg-background p-4 space-y-4">
        {isConnected && (
          <div className="flex justify-center items-center w-full gap-3">
            <div
              className={`size-4 rounded-full ${isSpeaking ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
            />
            <span className="text-muted-foreground text-sm">
              {isSpeaking ? "Assistant speaking..." : "Listening..."}
            </span>
          </div>
        )}
        <div className="flex w-full justify-center">
          {isConnected ? (
            <Button
              className="w-full"
              size="lg"
              variant="destructive"
              onClick={onEndCall}
            >
              <MicOffIcon />
              End call
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              disabled={isConnecting}
              onClick={onStartCall}
            >
              <MicIcon />
              Start call
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
