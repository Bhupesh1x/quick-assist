import { HomeIcon, InboxIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

export function WidgetFooter() {
  const screen = "selection";

  return (
    <footer className="border-t flex items-center justify-between bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
      >
        <HomeIcon
          className={`size-5 ${screen === "selection" ? "text-primary" : ""} `}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
      >
        <InboxIcon
          className={`size-5 ${screen === "inbox" ? "text-primary" : ""} `}
        />
      </Button>
    </footer>
  );
}
