import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "convex/react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VapiPluginRemoveForm({ open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const removePlugin = useMutation(api.private.plugins.remove);

  function onCancel() {
    onOpenChange(false);
  }

  async function onRemove() {
    try {
      setIsLoading(true);
      await removePlugin({
        service: "vapi",
      });
      toast.success("Vapi disconnected");
    } catch {
      toast.error("Failed to disconnect vapi. Please try again after sometime");
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect Vapi</DialogTitle>
          <DialogDescription>
            Are you sure you want to disconnect the vapi plugin?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={isLoading} onClick={onRemove}>
            {isLoading ? "Disconnecting..." : "Disconnect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
