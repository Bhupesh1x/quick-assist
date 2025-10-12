import {
  CopyIcon,
  PhoneIcon,
  ArrowLeftIcon,
  CopyCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { Button } from "@workspace/ui/components/button";

import { WidgetHeader } from "../components/WidgetHeader";
import { screenAtom, widgetSettingsAtom } from "../atoms/WidgetAtom";

export function WidgetContactScreen() {
  const [copied, setCopied] = useState(false);

  const setScreen = useSetAtom(screenAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  function onBack() {
    setScreen("selection");
  }

  async function onCopy() {
    if (!phoneNumber) return;

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <WidgetHeader className="w-full flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-x-2">
          <Button onClick={onBack} variant="transparent" size="icon">
            <ArrowLeftIcon className="size-5" />
          </Button>
          <p>Contact Us</p>
        </div>
      </WidgetHeader>
      <div className="flex-1 flex flex-col items-center justify-center gap-y-4">
        <PhoneIcon className="text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Available 24/7</p>

        <h4 className="text-2xl font-bold">{phoneNumber}</h4>
      </div>

      <div className="flex flex-col w-full gap-y-3 px-2 py-4 border-t bg-background">
        <Button
          variant="outline"
          disabled={copied}
          size="lg"
          onClick={onCopy}
          className="w-full"
        >
          {copied ? <CopyCheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy Number"}
        </Button>

        <Button size="lg" asChild className="w-full">
          <Link href={`tel:${phoneNumber}`}>
            <PhoneIcon />
            Call now
          </Link>
        </Button>
      </div>
    </>
  );
}
