"use client";

import {
  PhoneIcon,
  GlobeIcon,
  WorkflowIcon,
  PhoneCallIcon,
} from "lucide-react";

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
  return (
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
          />
        </main>
      </div>
    </div>
  );
}
