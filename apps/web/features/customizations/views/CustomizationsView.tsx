"use client";

import { useQuery } from "convex/react";

import { api } from "@workspace/backend/_generated/api";

import {
  CustomizationForm,
  CustomizationFormSkeleton,
} from "../components/CustomizationForm";

export function CustomizationsView() {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);
  const plugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  });

  const isLoading = widgetSettings === undefined || plugin === undefined;

  if (isLoading) {
    return <CustomizationsViewSkeleton />;
  }

  return (
    <div className="bg-muted min-h-screen">
      <div className="max-w-screen-md mx-auto p-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
          <p className="text-sm text-muted-foreground font-[550]">
            Customize how your chat widget looks and behaves for your customers
          </p>
        </header>

        <main className="mt-8">
          <CustomizationForm
            hasVapiPlugin={!!plugin}
            initialData={widgetSettings}
          />
        </main>
      </div>
    </div>
  );
}

export function CustomizationsViewSkeleton() {
  return (
    <div className="bg-muted min-h-screen">
      <div className="max-w-screen-md mx-auto p-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
          <p className="text-sm text-muted-foreground font-[550]">
            Customize how your chat widget looks and behaves for your customers
          </p>
        </header>

        <main className="space-y-6 mt-8">
          <CustomizationFormSkeleton />
        </main>
      </div>
    </div>
  );
}
