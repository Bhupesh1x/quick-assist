"use client";

import { WidgetFooter } from "../components/WidgetFooter";
import { WidgetHeader } from "../components/WidgetHeader";

interface Props {
  organizationId: string;
}

export function WidgetView({ organizationId }: Props) {
  return (
    <main className="min-h-screen w-full h-full border bg-muted rounded-xl flex flex-col overflow-hidden">
      <WidgetHeader>
        <div className="space-y-2 px-2 py-4">
          <p className="text-3xl tracking-wide">Hi there! 👋</p>
          <p className="text-lg">How can we help you today?</p>
        </div>
      </WidgetHeader>
      <section className="flex-1">Widget View: {organizationId}</section>
      <WidgetFooter />
    </main>
  );
}
