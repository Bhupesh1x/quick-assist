"use client";

import { useOrganization } from "@clerk/nextjs";

import { AuthLayout } from "../layouts/AuthLayout";

import { OrgSelectView } from "../views/OrgSelectView";

interface Props {
  children: React.ReactNode;
}

export function OrgGuard({ children }: Props) {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectView />
      </AuthLayout>
    );
  }

  return <>{children}</>;
}
