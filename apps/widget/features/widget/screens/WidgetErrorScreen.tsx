import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";

import { errorMessageAtom } from "../atoms/WidgetAtom";

import { WidgetHeader } from "../components/WidgetHeader";

export function WidgetErrorScreen() {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
      <WidgetHeader>
        <div className="space-y-2 px-2 py-4">
          <p className="text-3xl tracking-wide">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-y-2 text-muted-foreground">
        <AlertTriangleIcon />
        <p>{errorMessage || "Invalid configuration"}</p>
      </div>
    </>
  );
}
