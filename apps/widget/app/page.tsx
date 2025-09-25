"use client";

import { useVapi } from "@/features/widget/hooks/useVapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-svh">
      <Button onClick={() => startCall()}>Start call</Button>
      <Button variant="destructive" onClick={() => endCall()}>
        End call
      </Button>

      <p>isConnected: {isConnected}</p>
      <p>isConnecting: {isConnecting}</p>
      <p>isSpeaking: {isSpeaking}</p>

      <p>Transcript: {JSON.stringify(transcript, null, 2)}</p>
    </div>
  );
}
