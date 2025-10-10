import Image from "next/image";
import { UnplugIcon } from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

interface Props {
  onDisconnect: () => void;
}

export function VapiConnectedView({ onDisconnect }: Props) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/vapi.jpg"
              alt="Vapi"
              height={48}
              width={48}
              className="rounded-lg"
            />

            <div className="text-left">
              <h4 className="text-lg font-[580]">Vapi Integration</h4>
              <p className="text-sm text-muted-foreground">
                Manage your phone numbers and AI assistants
              </p>
            </div>
          </div>

          <Button size="sm" variant="destructive" onClick={onDisconnect}>
            <UnplugIcon />
            Disconnect
          </Button>
        </div>
      </Card>
    </div>
  );
}
