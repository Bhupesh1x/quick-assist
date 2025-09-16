"use client";

import { Loader2 } from "lucide-react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import { SignInView } from "../views/SignInView";

import { AuthLayout } from "../layouts/AuthLayout";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
}
