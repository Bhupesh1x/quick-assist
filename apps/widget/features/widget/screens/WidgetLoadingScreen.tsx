import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useAction, useMutation } from "convex/react";

import {
  screenAtom,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  contactSessionIdFamily,
} from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";

import { api } from "@workspace/backend/_generated/api";

interface Props {
  organizationId: string | null;
}

type InitStep = "org" | "session" | "settings" | "done";

export function WidgetLoadingScreen({ organizationId }: Props) {
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);

  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || "")
  );

  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const verifyOrganization = useAction(api.public.organizations.validate);
  useEffect(() => {
    async function validateOrg() {
      if (step !== "org") return;

      setLoadingMessage("Verifying organization...");

      if (!organizationId) {
        setErrorMessage("Organization id is required");
        setScreen("error");
        return;
      }

      try {
        const result = await verifyOrganization({ organizationId });

        if (!result?.valid) {
          setErrorMessage(result?.reason || "Invalid organization");
          setScreen("error");
          return;
        }

        setStep("session");
        setOrganizationId(organizationId);
      } catch {
        setErrorMessage("Unable to validate organization");
        setScreen("error");
      }
    }

    validateOrg();
  }, [step, organizationId]);

  const verifySession = useMutation(api.public.contactSessions.validate);
  useEffect(() => {
    async function validateSession() {
      if (step !== "session") return;

      setLoadingMessage("Finding session id...");

      if (!contactSessionId) {
        setSessionValid(false);
        setStep("done");
        return;
      }

      setLoadingMessage("Verifying session...");

      try {
        const result = await verifySession({ contactSessionId });
        setSessionValid(result?.valid);
        setStep("done");
      } catch {
        setSessionValid(false);
        setStep("done");
      }
    }

    validateSession();
  }, [step, contactSessionId]);

  useEffect(() => {
    if (step !== "done") return;

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step]);

  return (
    <>
      <WidgetHeader>
        <div className="space-y-2 px-2 py-4">
          <p className="text-3xl tracking-wide">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-y-2 text-muted-foreground">
        <Loader2Icon className="animate-spin " />
        <p>{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
}
