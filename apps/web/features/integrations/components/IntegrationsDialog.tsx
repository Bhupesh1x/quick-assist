import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: string;
}

export function IntegrationsDialog({ open, snippet, onOpenChange }: Props) {
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Snipped copied");
    } catch {
      toast.error("Failed to copy snippet. Please try again after sometime");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add the chatbox to your website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-7">
          <div className="space-y-3">
            <div className="bg-accent p-2 rounded-md text-sm">
              1. Copy the following code
            </div>

            <div className="group relative">
              <pre className="bg-foreground px-2 py-3 font-mono rounded-md text-xs overflow-auto max-h-[300px] whitespace-pre-wrap break-all text-secondary">
                {snippet}
              </pre>

              <Button
                variant="secondary"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 size-8"
                onClick={onCopy}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-accent p-2 rounded-md text-sm">
              2. Add the code in your page
            </div>

            <p className="text-sm text-muted-foreground">
              Paste the chatbox code in your page. You can add it in the html
              head section
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
