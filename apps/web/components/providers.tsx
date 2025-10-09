"use client";

import { Toaster } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Toaster />
      {children}
    </ConvexProviderWithClerk>
  );
}
