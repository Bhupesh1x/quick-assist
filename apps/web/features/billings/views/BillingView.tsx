"use client";

import { PricingTable } from "../components/PricingTable";

export function BillingView() {
  return (
    <div className="bg-muted min-h-screen">
      <div className="max-w-screen-md mx-auto p-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Plans & Billing</h1>
          <p className="text-sm text-muted-foreground font-[550]">
            Choose the plan that's right for you
          </p>
        </header>

        <main className="mt-8">
          <PricingTable />
        </main>
      </div>
    </div>
  );
}
