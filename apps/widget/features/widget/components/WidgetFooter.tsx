import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react";

import { WidgetScreen } from "../types";
import { screenAtom } from "../atoms/WidgetAtom";

import { Button } from "@workspace/ui/components/button";

export function WidgetFooter() {
  const screen = useAtomValue(screenAtom);

  const setScreen = useSetAtom(screenAtom);

  function handleClick(screen: WidgetScreen) {
    setScreen(screen);
  }

  return (
    <footer className="border-t flex items-center justify-between bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="h-14 flex-1 rounded-none"
        onClick={() => handleClick("selection")}
      >
        <HomeIcon
          className={`size-5 ${screen === "selection" ? "text-primary" : ""}`}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-14 flex-1 rounded-none"
        onClick={() => handleClick("inbox")}
      >
        <InboxIcon
          className={`size-5 ${screen === "inbox" ? "text-primary" : ""}`}
        />
      </Button>
    </footer>
  );
}
