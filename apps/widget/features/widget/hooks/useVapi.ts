import Vapi from "@vapi-ai/web";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { vapiSecretAtom, widgetSettingsAtom } from "../atoms/WidgetAtom";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export function useVapi() {
  const [vapi, setVapi] = useState<Vapi | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  const vapiSecrets = useAtomValue(vapiSecretAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);

  useEffect(() => {
    if (!vapiSecrets?.publicApiKey) {
      return;
    }

    const vapiInstance = new Vapi(vapiSecrets?.publicApiKey);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("error", (error) => {
      setIsConnecting(false);
      console.log("VAPI_ERROR", error);
    });

    vapiInstance.on("message", (message) => {
      if (
        message?.type === "transcript" &&
        message?.transcriptType === "final"
      ) {
        setTranscript((prev) => [
          ...prev,
          {
            role: message?.role === "user" ? "user" : "assistant",
            text: message?.transcript,
          },
        ]);
      }
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  function startCall() {
    if (
      !widgetSettings?.vapiSettings?.assistantId ||
      !vapiSecrets?.publicApiKey
    ) {
      return;
    }

    setIsConnecting(true);

    if (vapi) {
      vapi.start(widgetSettings?.vapiSettings?.assistantId);
    }
  }

  function endCall() {
    if (vapi) {
      vapi.stop();
    }
  }

  return {
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall,
  };
}
