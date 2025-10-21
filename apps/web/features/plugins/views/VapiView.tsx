"use client";

import {
  PhoneIcon,
  GlobeIcon,
  WorkflowIcon,
  PhoneCallIcon,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@workspace/backend/_generated/api";

import { VapiPluginForm } from "../components/VapiPluginForm";
import { VapiConnectedView } from "../components/VapiConnectedView";
import { VapiPluginRemoveForm } from "../components/VapiPluginRemoveForm";
import { IntegrationFeature, PluginCard } from "../components/PluginCard";

export const VAPI_FEATURES: IntegrationFeature[] = [
  {
    name: "Web voice calls",
    description: "Voice chats directly in your app",
    icon: GlobeIcon,
  },
  {
    name: "Phone numbers",
    description: "Get dedicated business lines",
    icon: PhoneIcon,
  },
  {
    name: "Outbound calls",
    description: "Automated customer outreach",
    icon: PhoneCallIcon,
  },
  {
    name: "Workflows",
    description: "Custom conversation flows",
    icon: WorkflowIcon,
  },
];

export function VapiView() {
  const [isVapiPluginDialogOpen, setIsVapiPluginDialogOpen] = useState(false);
  const [isVapiPluginRemoveDialogOpen, setIsVapiPluginRemoveDialogOpen] =
    useState(false);

  const plugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  });

  function onToggleDialog() {
    if (plugin) {
      setIsVapiPluginRemoveDialogOpen(true);
    } else {
      setIsVapiPluginDialogOpen(true);
    }
  }

  return (
    <>
      <VapiPluginForm
        open={isVapiPluginDialogOpen}
        onOpenChange={setIsVapiPluginDialogOpen}
      />
      <VapiPluginRemoveForm
        open={isVapiPluginRemoveDialogOpen}
        onOpenChange={setIsVapiPluginRemoveDialogOpen}
      />
      <div className="min-h-screen bg-muted p-8 w-full">
        <div className="max-w-screen-md mx-auto">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to enable AI voice calls and phone support
            </p>
          </header>

          <main className="mt-8">
            {!plugin ? (
              <PluginCard
                serviceName="Vapi"
                serviceImageUrl="/vapi.jpg"
                features={VAPI_FEATURES}
                onSubmit={onToggleDialog}
                disabled={plugin === undefined}
              />
            ) : (
              <VapiConnectedView onDisconnect={onToggleDialog} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export function VapiViewSkeleton() {
  return (
    <>
      <div className="min-h-screen bg-muted p-8 w-full">
        <div className="max-w-screen-md mx-auto">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to enable AI voice calls and phone support
            </p>
          </header>

          <main className="mt-8">
            <PluginCard
              serviceName="Vapi"
              serviceImageUrl="/vapi.jpg"
              features={VAPI_FEATURES}
              onSubmit={() => {}}
              disabled
            />
          </main>
        </div>
      </div>
    </>
  );
}
